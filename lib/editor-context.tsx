"use client";

import { createContext, useContext, useRef, useCallback, useState, useEffect, type ReactNode } from "react";
import type { editor, IDisposable } from "monaco-editor";

interface EditorContextType {
    editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
    setEditor: (editor: editor.IStandaloneCodeEditor | null) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const disposablesRef = useRef<IDisposable[]>([]);

    const undoStackRef = useRef<number>(0);
    const redoStackRef = useRef<number>(0);

    // State for UI updates
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const updateUndoRedoState = useCallback(() => {
        setCanUndo(undoStackRef.current > 0);
        setCanRedo(redoStackRef.current > 0);
    }, []);

    const setEditor = useCallback(
        (editor: editor.IStandaloneCodeEditor | null) => {
            // Dispose previous listeners
            disposablesRef.current.forEach((d) => d.dispose());
            disposablesRef.current = [];

            editorRef.current = editor;

            if (editor) {
                // Reset stacks on new editor
                undoStackRef.current = 0;
                redoStackRef.current = 0;

                // Listen for content changes to update undo/redo state
                const contentDisposable = editor.onDidChangeModelContent((e) => {
                    if (e.isUndoing) {
                        undoStackRef.current = Math.max(0, undoStackRef.current - 1);
                        redoStackRef.current++;
                    } else if (e.isRedoing) {
                        redoStackRef.current = Math.max(0, redoStackRef.current - 1);
                        undoStackRef.current++;
                    } else {
                        // Normal edit clears redo stack and adds to undo stack
                        redoStackRef.current = 0;
                        undoStackRef.current++;
                    }
                    updateUndoRedoState();
                });

                disposablesRef.current.push(contentDisposable);

                // Initial state check
                updateUndoRedoState();
            } else {
                setCanUndo(false);
                setCanRedo(false);
            }
        },
        [updateUndoRedoState]
    );

    const undo = useCallback(() => {
        if (editorRef.current) {
            // Focus the editor first to ensure undo works properly
            editorRef.current.focus();
            // Trigger Monaco's built-in undo action
            editorRef.current.trigger("keyboard", "undo", null);
            // Update state after undo
            setTimeout(updateUndoRedoState, 0);
        }
    }, [updateUndoRedoState]);

    const redo = useCallback(() => {
        if (editorRef.current) {
            // Focus the editor first to ensure redo works properly
            editorRef.current.focus();
            // Trigger Monaco's built-in redo action
            editorRef.current.trigger("keyboard", "redo", null);
            // Update state after redo
            setTimeout(updateUndoRedoState, 0);
        }
    }, [updateUndoRedoState]);

    // Global keyboard shortcut listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only handle if not in an input/textarea/contenteditable
            const target = e.target as HTMLElement;
            const isEditableField = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

            // Skip if we're in an editable field (let native undo/redo work)
            // But allow if the target is inside Monaco editor (we'll handle it)
            const isInMonaco = target.closest(".monaco-editor") !== null;

            if (isEditableField && !isInMonaco) {
                return;
            }

            // Check for Ctrl/Cmd + Z (undo) or Ctrl/Cmd + Y / Ctrl/Cmd + Shift + Z (redo)
            if ((e.ctrlKey || e.metaKey) && !e.altKey) {
                if (e.key === "z" && !e.shiftKey) {
                    // Ctrl+Z = Undo
                    e.preventDefault();
                    e.stopPropagation();
                    undo();
                } else if (e.key === "z" && e.shiftKey) {
                    // Ctrl+Shift+Z = Redo
                    e.preventDefault();
                    e.stopPropagation();
                    redo();
                } else if (e.key === "y") {
                    // Ctrl+Y = Redo
                    e.preventDefault();
                    e.stopPropagation();
                    redo();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown, true);
        return () => window.removeEventListener("keydown", handleKeyDown, true);
    }, [undo, redo]);

    return <EditorContext.Provider value={{ editorRef, setEditor, undo, redo, canUndo, canRedo }}>{children}</EditorContext.Provider>;
}

export function useEditorContext() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("useEditorContext must be used within an EditorProvider");
    }
    return context;
}
