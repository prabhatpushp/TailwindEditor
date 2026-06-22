import { useState, useRef, useEffect } from "react";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import { Code, Save, Sparkles, Moon, Sun, Map, Copy, Maximize2, Minimize2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TAILWIND_CLASSES } from "@/lib/constants";

import { useEditorStore } from "@/lib/store";
import { removeBuilderIds } from "@/lib/html-utils";
import { useEditorContext } from "@/lib/editor-context";

interface CodeEditorPanelProps {
    onToggleMaximize: () => void;
    onToggleMinimize: () => void;
    isMaximized: boolean;
    isMinimized: boolean;
}

export function CodeEditorPanel({ onToggleMaximize, onToggleMinimize, isMaximized, isMinimized }: CodeEditorPanelProps) {
    const { code, setCode, selectedElement, getCleanCode } = useEditorStore();
    const { setEditor } = useEditorContext();

    // Get clean code without builder IDs for display in the editor
    const displayCode = getCleanCode();
    const [settings, setSettings] = useState({
        minimap: false,
        theme: "vs-dark",
        language: "html",
    });

    const monaco = useMonaco();
    const editorRef = useRef<any>(null);

    // Handle editor mount - register with context for undo/redo
    const handleEditorMount = (editor: any) => {
        editorRef.current = editor;
        setEditor(editor);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setEditor(null);
        };
    }, [setEditor]);

    // Initialize Monaco Enhancements
    useEffect(() => {
        let isMounted = true;
        let dispose: (() => void) | undefined;
        
        if (monaco) {
            import("emmet-monaco-es")
                .then(({ emmetHTML }) => {
                    // Prevent InstantiationService disposed error if Monaco unmounted during the dynamic import
                    if (isMounted) {
                        dispose = emmetHTML(monaco);
                    }
                })
                .catch((err) => console.error("Failed to load emmet-monaco-es", err));
        }
        
        return () => {
            isMounted = false;
            if (dispose) dispose();
        };
    }, [monaco]);

    useEffect(() => {
        if (monaco) {
            // 2. JSX/TSX Support Configuration
            const tsDefaults = (monaco.languages.typescript as any).typescriptDefaults;
            tsDefaults.setCompilerOptions({
                target: (monaco.languages.typescript as any).ScriptTarget.ES2016,
                allowNonTsExtensions: true,
                moduleResolution: (monaco.languages.typescript as any).ModuleResolutionKind.NodeJs,
                module: (monaco.languages.typescript as any).ModuleKind.CommonJS,
                noEmit: true,
                jsx: (monaco.languages.typescript as any).JsxEmit.React,
                jsxFactory: "React.createElement",
                reactNamespace: "React",
                allowJs: true,
                typeRoots: ["node_modules/@types"],
            });

            // 3. Tailwind Intellisense (Simple Provider)
            const disposeCompletion = monaco.languages.registerCompletionItemProvider(["html", "javascript", "typescript"], {
                provideCompletionItems: (model: any, position: any) => {
                    const word = model.getWordUntilPosition(position);
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn,
                    };
                    return {
                        suggestions: TAILWIND_CLASSES.map((cls) => ({
                            label: cls,
                            kind: monaco.languages.CompletionItemKind.Color,
                            insertText: cls,
                            detail: "Tailwind CSS",
                            range: range,
                        })),
                    };
                },
            });

            return () => {
                disposeCompletion.dispose();
            };
        }
    }, [monaco]);

    // Track if selection was triggered by user clicking in iframe (not by code changes)
    const lastSelectionRef = useRef<string | null>(null);

    // Sync editor selection with iframe element selection
    useEffect(() => {
        if (!selectedElement || !editorRef.current || !monaco) return;

        const editor = editorRef.current;

        // Skip if editor has focus - user is actively editing
        if (editor.hasTextFocus()) {
            return;
        }

        // Skip if this is the same element we already selected (to prevent re-selecting on property updates)
        const elementKey = selectedElement.builderId || selectedElement.xpath;
        if (lastSelectionRef.current === elementKey) {
            return;
        }
        lastSelectionRef.current = elementKey;

        const model = editor.getModel();
        if (!model) return;

        // Get elementPositions from store
        const { elementPositions } = useEditorStore.getState();

        // Try to find position using builderId first (most accurate)
        if (selectedElement.builderId && elementPositions.has(selectedElement.builderId)) {
            const position = elementPositions.get(selectedElement.builderId)!;

            // Create selection for the full element (start to end)
            const selection = {
                startLineNumber: position.startLine,
                startColumn: position.startColumn,
                endLineNumber: position.endLine,
                endColumn: position.endColumn + 1,
            };

            // Set the selection
            editor.setSelection(selection);

            // Reveal the line near the top with offset (not centered)
            editor.revealLineNearTop(position.startLine + 5, monaco.editor.ScrollType.Smooth);

            // Add a highlight decoration
            const decorations = editor.deltaDecorations(
                [],
                [
                    {
                        range: selection,
                        options: {
                            isWholeLine: false,
                            className: "selected-element-highlight",
                            glyphMarginClassName: "selected-element-glyph",
                            overviewRuler: {
                                color: "#f97316",
                                position: monaco.editor.OverviewRulerLane.Full,
                            },
                        },
                    },
                ]
            );

            // Remove decoration after 2 seconds
            setTimeout(() => {
                editor.deltaDecorations(decorations, []);
            }, 2000);

            return;
        }

        // Fallback: Try to find the element using opening tag or attributes
        let searchText = "";

        // If we have an ID, search with that for more precision
        if (selectedElement.id) {
            searchText = `id="${selectedElement.id}"`;
        } else if (selectedElement.className && typeof selectedElement.className === "string" && selectedElement.className.trim()) {
            // Try to find by class (first few classes)
            const classes = selectedElement.className.split(" ").filter(Boolean).slice(0, 2).join(" ");
            if (classes) {
                searchText = `class="${classes}`;
            }
        } else if (selectedElement.openingTag) {
            searchText = selectedElement.openingTag;
        }

        if (!searchText) return;

        // Find the match in code
        const matches = model.findMatches(searchText, true, false, true, null, true);

        if (matches.length > 0) {
            const match = matches[0];
            const startLineNumber = match.range.startLineNumber;

            // Find the closing tag to select the full element
            const tagName = selectedElement.tagName.toLowerCase();
            const selfClosingTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];

            let endLineNumber = startLineNumber;
            let endColumn = model.getLineContent(startLineNumber).length + 1;

            if (!selfClosingTags.includes(tagName)) {
                // Search for closing tag
                const closingTag = `</${tagName}>`;
                const closingMatches = model.findMatches(closingTag, true, false, false, null, true);

                // Find the matching closing tag (simple approach - find first one after start)
                for (const closeMatch of closingMatches) {
                    if (closeMatch.range.startLineNumber >= startLineNumber) {
                        endLineNumber = closeMatch.range.endLineNumber;
                        endColumn = closeMatch.range.endColumn;
                        break;
                    }
                }
            }

            const selection = {
                startLineNumber: startLineNumber,
                startColumn: 1,
                endLineNumber: endLineNumber,
                endColumn: endColumn,
            };

            editor.setSelection(selection);
            // Reveal the line near the top with offset (not centered)
            editor.revealLineNearTop(startLineNumber, monaco.editor.ScrollType.Smooth);

            const decorations = editor.deltaDecorations(
                [],
                [
                    {
                        range: selection,
                        options: {
                            isWholeLine: false,
                            className: "selected-element-highlight",
                            glyphMarginClassName: "selected-element-glyph",
                            overviewRuler: {
                                color: "#f97316",
                                position: monaco.editor.OverviewRulerLane.Full,
                            },
                        },
                    },
                ]
            );

            setTimeout(() => {
                editor.deltaDecorations(decorations, []);
            }, 2000);
        }
    }, [selectedElement?.builderId, selectedElement?.xpath, monaco]);

    // Reset selection ref when element is deselected
    useEffect(() => {
        if (!selectedElement) {
            lastSelectionRef.current = null;
        }
    }, [selectedElement]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
    };

    const handleFormat = async () => {
        try {
            const [prettier, htmlPlugin, estreePlugin, babelPlugin] = await Promise.all([
                import("prettier/standalone"),
                import("prettier/plugins/html"),
                import("prettier/plugins/estree"),
                import("prettier/plugins/babel")
            ]);

            const formatted = await prettier.format(code, {
                parser: settings.language === "html" ? "html" : "babel",
                plugins: [htmlPlugin as any, estreePlugin as any, babelPlugin as any],
                printWidth: 100,
                tabWidth: 4,
            });
            setCode(formatted);
        } catch (e) {
            console.error("Formatting failed:", e);
        }
    };

    const isVsDark = settings.theme === "vs-dark";
    const separatorClass = isVsDark ? "bg-[#333333]" : "bg-border";

    // Helper for Button Classes
    const btnClass = (isActive: boolean) =>
        cn(
            "p-1.5 rounded transition-colors flex items-center justify-center h-7 w-7 cursor-pointer",
            isVsDark
                ? isActive
                    ? "bg-[#3e3e3e] text-white"
                    : "text-[#cccccc] hover:bg-[#2d2d2d] hover:text-white"
                : isActive
                  ? "bg-orange-500/10 text-orange-500"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        );

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Toolbar */}
            <div
                className={cn(
                    "flex items-center justify-between px-3 py-2 border-b h-10 shrink-0 select-none transition-colors",
                    isVsDark ? "bg-[#1e1e1e] border-[#1e1e1e] text-[#cccccc]" : "bg-white border-gray-200 text-gray-900"
                )}
            >
                <div className="flex items-center gap-2">
                    <span className={cn("text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5", isVsDark ? "text-[#999999]" : "text-gray-500")}>
                        <Code className="w-3.5 h-3.5" />
                        Editor
                    </span>
                    <div className={cn("h-4 w-px mx-1", separatorClass)}></div>

                    {/* Language Switcher */}
                    {["html", "javascript", "typescript"].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setSettings((s) => ({ ...s, language: lang }))}
                            className={cn(
                                "text-[10px] uppercase font-medium px-2 py-0.5 rounded transition-colors cursor-pointer",
                                settings.language === lang
                                    ? isVsDark
                                        ? "bg-[#3e3e3e] text-white border border-[#444]"
                                        : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                    : isVsDark
                                      ? "text-[#999999] hover:bg-[#2d2d2d]"
                                      : "text-gray-500 hover:bg-gray-100"
                            )}
                        >
                            {lang === "javascript" ? "JSX" : lang === "typescript" ? "TSX" : lang}
                        </button>
                    ))}
                </div>

                <div className={cn("flex items-center gap-1 p-0.5 ", isVsDark ? "bg-[#1e1e1e]" : "bg-white")}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={handleFormat} className={btnClass(false)} aria-label="Format Code">
                                    <Sparkles className="w-3.5 h-3.5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Format Code</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={() => setSettings((p) => ({ ...p, theme: p.theme === "light" ? "vs-dark" : "light" }))} className={btnClass(false)} aria-label="Toggle Theme">
                                    {isVsDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Toggle Theme</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={() => setSettings((p) => ({ ...p, minimap: !p.minimap }))} className={btnClass(settings.minimap)} aria-label="Toggle Minimap">
                                    <Map className="w-3.5 h-3.5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Toggle Minimap</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={handleCopy} className={btnClass(false)} aria-label="Copy Code">
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Copy Code</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className={cn("w-px h-3 my-auto", separatorClass)}></div>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={onToggleMinimize} className={btnClass(isMinimized)} aria-label={isMinimized ? "Expand Panel" : "Minimize Panel"}>
                                    {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>{isMinimized ? "Expand Panel" : "Minimize Panel"}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={onToggleMaximize} className={btnClass(isMaximized)} aria-label={isMaximized ? "Restore View" : "Maximize Editor"}>
                                    {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>{isMaximized ? "Restore View" : "Maximize Editor"}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <div className={cn("flex-1 min-h-0", isMinimized && "hidden")}>
                <MonacoEditor
                    height="100%"
                    language={settings.language}
                    theme={settings.theme}
                    value={displayCode}
                    onChange={(value) => {
                        // Remove any existing builder IDs before setting (in case of paste)
                        const cleanValue = removeBuilderIds(value || "");
                        setCode(cleanValue);
                    }}
                    onMount={handleEditorMount}
                    options={{
                        minimap: { enabled: settings.minimap },
                        fontSize: 12,
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 10, bottom: 10 },
                        fontFamily: "Geist Mono, Droid Sans Mono, monospace",
                    }}
                />
            </div>
        </div>
    );
}
