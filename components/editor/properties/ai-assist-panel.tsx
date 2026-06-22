"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupTextarea, InputGroupButton } from "@/components/ui/input-group";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { Sparkles, Bot, Plus, Wand2, MoreHorizontal, Paperclip, Eraser, ArrowUp, ShoppingBag, MousePointer, Share, BookOpen, Globe, PenTool, AudioLines, X, File as FileIcon, Settings, KeyRound, ExternalLink, RotateCcw } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { useAISettingsStore } from "@/lib/ai-settings-store";
import { streamGeminiChat, classifyError, type ChatMessage, type StreamStatus } from "@/lib/gemini-client";
import morphdom from "morphdom";

// Throttle interval for streaming updates to iframe (ms)
const STREAM_THROTTLE_MS = 500;

// Extract HTML from assistant response text
function extractHtmlFromResponse(text: string): string | null {
    // Try complete code block first
    const completeMatch = text.match(/```html([\s\S]*?)```/i);
    if (completeMatch?.[1]) return completeMatch[1].trim();

    // Try incomplete/in-progress code block
    const incompleteMatch = text.match(/```html([\s\S]*?)$/i);
    if (incompleteMatch?.[1]) {
        const partial = incompleteMatch[1].trim();
        if (partial.length > 10) return partial;
    }

    // Try raw HTML (if the response looks like HTML without code fences)
    const trimmed = text.trim();
    if (trimmed.startsWith("<!") || trimmed.startsWith("<html") || trimmed.startsWith("<head") || trimmed.startsWith("<body") || trimmed.startsWith("<div") || trimmed.startsWith("</div")) {
        if (trimmed.length > 10) return trimmed;
    }

    return null;
}

export function AiAssistPanel() {
    const { setCode, setIsGenerating } = useEditorStore();
    const { apiKey, hasApiKey, isKeyLoaded, loadApiKey, openSettingsDialog, systemPrompt, temperature, maxOutputTokens, model, topP, topK } = useAISettingsStore();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [inputValue, setInputValue] = useState("");

    // Client-side chat state (replaces useChat hook)
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [status, setStatus] = useState<StreamStatus>("ready");
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Refs for throttled streaming updates (sent to iframe only, not code editor)
    const streamingCodeRef = useRef<string | null>(null);
    const throttleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastUpdateTimeRef = useRef<number>(0);

    // Load API key from encrypted localStorage on mount
    useEffect(() => {
        loadApiKey();
    }, [loadApiKey]);

    // Send code directly to iframe via morphdom diffing (doesn't update code editor)
    const sendToIframe = (htmlCode: string, isFinal: boolean = false) => {
        const iframes = document.querySelectorAll('iframe[title="preview"]');
        iframes.forEach((iframe) => {
            const iframeEl = iframe as HTMLIFrameElement;
            const doc = iframeEl.contentDocument;
            if (doc) {
                const parser = new DOMParser();
                const newDoc = parser.parseFromString(htmlCode, "text/html");

                // 1. Sync Head (Scripts & Links)
                Array.from(newDoc.head.children).forEach((el) => {
                    if (el.tagName === "SCRIPT" && (el as HTMLScriptElement).src) {
                        if (!doc.head.querySelector(`script[src="${(el as HTMLScriptElement).src}"]`)) {
                            const s = doc.createElement("script");
                            s.src = (el as HTMLScriptElement).src;
                            doc.head.appendChild(s);
                        }
                    } else if (el.tagName === "LINK" && (el as HTMLLinkElement).href) {
                        if (!doc.head.querySelector(`link[href="${(el as HTMLLinkElement).href}"]`)) {
                            doc.head.appendChild(el.cloneNode(true));
                        }
                    } else if (el.tagName === "STYLE") {
                        const exists = Array.from(doc.head.querySelectorAll("style")).some(
                            (s) => s.textContent === el.textContent
                        );
                        if (!exists) doc.head.appendChild(el.cloneNode(true));
                    }
                });

                // 2. Sync Body
                if (doc.body && newDoc.body) {
                    morphdom(doc.body, newDoc.body, {
                        childrenOnly: false,
                        getNodeKey: (node: Node) => {
                            return (node as HTMLElement).id || null;
                        },
                        onBeforeElUpdated: (fromEl: HTMLElement, toEl: HTMLElement) => {
                            if (fromEl.tagName === "IMG" && (fromEl as HTMLImageElement).src === (toEl as HTMLImageElement).src) {
                                return false; // don't update identical images
                            }
                            if (fromEl.classList && toEl.classList) {
                                ["__builder-hover__", "__builder-selected__", "__builder-hover-parent__", "__builder-hover-grandparent__"].forEach(
                                    (cls) => {
                                        if (fromEl.classList.contains(cls)) toEl.classList.add(cls);
                                    }
                                );
                            }
                            return true;
                        },
                    });

                    // Execute scripts in body ONLY if it's the final update
                    if (isFinal) {
                        Array.from(doc.body.querySelectorAll("script")).forEach((oldScript) => {
                            const newScript = doc.createElement("script");
                            Array.from(oldScript.attributes).forEach((attr) => {
                                newScript.setAttribute(attr.name, attr.value);
                            });
                            newScript.appendChild(doc.createTextNode(oldScript.innerHTML));
                            if (oldScript.parentNode) {
                                oldScript.parentNode.replaceChild(newScript, oldScript);
                            }
                        });
                    }
                }
            }
        });
    };

    // Throttled iframe update during streaming
    const throttledIframeUpdate = useCallback((code: string) => {
        streamingCodeRef.current = code;
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

        if (timeSinceLastUpdate >= STREAM_THROTTLE_MS) {
            sendToIframe(code);
            lastUpdateTimeRef.current = now;
        } else if (!throttleTimerRef.current) {
            throttleTimerRef.current = setTimeout(() => {
                if (streamingCodeRef.current) {
                    sendToIframe(streamingCodeRef.current);
                    lastUpdateTimeRef.current = Date.now();
                }
                throttleTimerRef.current = null;
            }, STREAM_THROTTLE_MS - timeSinceLastUpdate);
        }
    }, []);

    // Send message using client-side Gemini streaming
    const sendMessage = async (text: string, currentMessages: ChatMessage[] = messages) => {
        if (!apiKey || !text.trim()) return;

        setError(null);
        setStatus("submitted");

        // Add user message
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: text.trim(),
            createdAt: new Date(),
        };

        const assistantMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "",
            createdAt: new Date(),
        };

        const updatedMessages = [...currentMessages, userMessage];
        setMessages([...updatedMessages, assistantMessage]);

        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        let fullResponse = "";

        try {
            setStatus("streaming");
            setIsGenerating(true);

            const settings = { systemPrompt, temperature, maxOutputTokens, model, topP, topK };

            for await (const chunk of streamGeminiChat(apiKey, updatedMessages, settings, abortController.signal)) {
                if (abortController.signal.aborted) break;

                fullResponse += chunk;

                // Update assistant message in real-time
                setMessages((prev) => {
                    const updated = [...prev];
                    const lastIdx = updated.length - 1;
                    if (updated[lastIdx]?.role === "assistant") {
                        updated[lastIdx] = { ...updated[lastIdx], content: fullResponse };
                    }
                    return updated;
                });

                // Throttled iframe preview update
                const extractedCode = extractHtmlFromResponse(fullResponse);
                if (extractedCode) {
                    throttledIframeUpdate(extractedCode);
                }
            }

            // Enforce that a complete generation MUST contain an closing html tag
            if (!fullResponse.toLowerCase().includes("</html>")) {
                throw new Error("The AI abruptly stopped generating. Please click retry to continue building.");
            }

            // Streaming complete — sync final code to Monaco editor
            const finalCode = extractHtmlFromResponse(fullResponse);
            if (finalCode) {
                setCode(finalCode);
                sendToIframe(finalCode, true);
            }

            setStatus("ready");
            setIsGenerating(false);
        } catch (err) {
            // Attempt to salvage any partially generated code
            const partialCode = extractHtmlFromResponse(fullResponse);
            if (partialCode) {
                try {
                    setCode(partialCode);
                    sendToIframe(partialCode, true);
                } catch (e) {
                    console.warn("Failed to sync partial code to iframe:", e);
                }
            }

            if (abortController.signal.aborted) {
                setStatus("ready");
                setIsGenerating(false);
                return;
            }
            
            const friendlyError = classifyError(err);
            setError(friendlyError);
            setStatus("error");
            setIsGenerating(false);

            // Only remove the assistant message if we didn't generate any code
            if (!partialCode) {
                setMessages((prev) => prev.filter((m) => m.content.length > 0 || m.role === "user"));
            }

            // Reset to ready after a moment so user can retry
            setTimeout(() => setStatus("ready"), 100);
        } finally {
            abortControllerRef.current = null;
            // Clear throttle timers
            if (throttleTimerRef.current) {
                clearTimeout(throttleTimerRef.current);
                throttleTimerRef.current = null;
            }
        }
    };

    // Scroll to bottom logic
    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleClearChat = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setMessages([]);
        setError(null);
        setStatus("ready");
    };

    const handleRetry = () => {
        // Find the last user message index
        const lastUserMsgIndex = messages.map(m => m.role).lastIndexOf("user");
        
        if (lastUserMsgIndex !== -1) {
            const lastUserMsg = messages[lastUserMsgIndex];
            // Slice the history up to the user message
            const previousHistory = messages.slice(0, lastUserMsgIndex);
            setMessages(previousHistory);
            sendMessage(lastUserMsg.content, previousHistory);
        }
    };

    const handleFileUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAttachments((prev) => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() && attachments.length === 0) return;
        if (!hasApiKey()) return;

        // Clear attachments
        if (attachments.length > 0) {
            if (process.env.NODE_ENV === 'development') console.log("Submitting with attachments:", attachments);
            setAttachments([]);
        }

        sendMessage(inputValue);
        setInputValue("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    const isSubmitting = status === "streaming" || status === "submitted";
    const hasKey = hasApiKey();
    const canSubmit = hasKey && status === "ready" && (inputValue.trim() || attachments.length > 0);

    // Show loading state while key is being decrypted
    if (!isKeyLoaded) {
        return (
            <div className="flex flex-col h-full bg-muted/10 items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-muted/10 relative overflow-hidden">
            {messages.length > 0 && (
                <div className="absolute top-2 right-2 z-10">
                    <Button variant="ghost" size="icon-sm" onClick={handleClearChat} className="h-6 w-6 opacity-50 hover:opacity-100" aria-label="Clear chat">
                        <Eraser className="w-3 h-3" />
                    </Button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar px-4" ref={scrollAreaRef}>
                <div className="py-4 space-y-4 min-h-full flex flex-col">
                    {!hasKey ? (
                        <div className="flex-1 flex flex-col justify-center items-center gap-5 text-center select-none px-4">
                            <div className="space-y-3">
                                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/80 border border-border mb-2">
                                    <KeyRound className="h-7 w-7 text-muted-foreground" />
                                </div>
                                <h2 className="font-semibold text-sm">Set Up Your API Key</h2>
                                <p className="text-xs text-foreground max-w-[220px] mx-auto leading-relaxed">
                                    Bring your own Google Gemini API key to unlock AI features. Your key stays encrypted in your browser — never sent to our servers.
                                </p>
                            </div>
                            <Button
                                size="sm"
                                onClick={openSettingsDialog}
                                className="gap-2"
                            >
                                <Settings className="w-3.5 h-3.5" />
                                Open Settings
                            </Button>
                            <a
                                href="https://aistudio.google.com/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                            >
                                Get a free API key
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex-1 flex flex-col justify-center items-center gap-6 text-center select-none opacity-50">
                            <div className="space-y-2">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm border mb-2">
                                    <Sparkles className="h-6 w-6 text-foreground" />
                                </div>
                                <h2 className="font-semibold text-sm">How can I help you?</h2>
                                <p className="text-xs text-foreground max-w-[200px] mx-auto">I can help you build, design, and debug.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 flex flex-col justify-end min-h-0 pb-4">
                            {messages.map((message) => (
                                <div key={message.id} className={cn("flex gap-3 text-sm max-w-[90%]", message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}>
                                    <Avatar className="h-6 w-6 mt-1 shrink-0">
                                        {message.role === "assistant" ? (
                                            <div className="bg-brand/10 w-full h-full flex items-center justify-center">
                                                <Bot className="h-3.5 w-3.5 text-brand" />
                                            </div>
                                        ) : (
                                            <AvatarFallback className="bg-muted text-[10px]">U</AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div
                                        className={cn(
                                            "rounded-lg px-3 py-2 leading-relaxed whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto custom-scrollbar overflow-x-hidden",
                                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted shadow-sm border border-border/50"
                                        )}
                                    >
                                        {message.content ? message.content : (
                                            message.role === "assistant" && isSubmitting ? (
                                                <div className="flex items-center gap-1.5 h-5 px-1">
                                                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce"></span>
                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                </div>
                            ))}
                            {error && (
                                <div className="mx-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex items-start gap-2">
                                        <X className="w-4 h-4 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="font-medium wrap-break-word">Error</p>
                                            <p className="opacity-90">{error}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="w-full mt-1 border-destructive/30 hover:bg-destructive/10 text-destructive hover:text-destructive" onClick={handleRetry}>
                                        <RotateCcw className="w-3.5 h-3.5 mr-2" />
                                        Retry
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area (Always shown) */}
            <div className="p-3 bg-background border-t border-border z-20">
                <form onSubmit={handleFormSubmit} className="w-full">
                    <TooltipProvider>
                        <InputGroup className={cn("shadow-sm bg-muted/30 border border-border/50 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-ring focus-within:border-ring transition-all", !hasKey && "opacity-50 pointer-events-none")}>
                            <InputGroupTextarea
                                placeholder={hasKey ? "Ask anything..." : "Add your API key in Settings to start"}
                                className="min-h-[40px] max-h-[200px] bg-transparent border-0 focus-visible:ring-0 resize-none py-3"
                                value={inputValue}
                                onChange={handleInputChange}
                                disabled={!hasKey}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleFormSubmit(e);
                                    }
                                }}
                            />
                            <InputGroupAddon align="block-end" className="gap-1 p-2 justify-between w-full flex bg-transparent border-t border-border/10">
                                <DropdownMenu>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DropdownMenuTrigger asChild>
                                                <InputGroupButton variant="ghost" size="icon-sm" className="rounded-lg h-7 w-7 text-muted-foreground hover:text-foreground" aria-label="Add files">
                                                    <Plus className="w-4 h-4" />
                                                </InputGroupButton>
                                            </DropdownMenuTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Add files and more <Kbd>/</Kbd>
                                        </TooltipContent>
                                    </Tooltip>
                                    <DropdownMenuContent className="w-56" align="start">
                                        <DropdownMenuItem onClick={handleFileUploadClick}>
                                            <Paperclip className="w-4 h-4 mr-2" />
                                            Add photos & files
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Deep research
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                            Shopping research
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Wand2 className="w-4 h-4 mr-2" />
                                            Create image
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <MousePointer className="w-4 h-4 mr-2" />
                                            Agent mode
                                        </DropdownMenuItem>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                <MoreHorizontal className="w-4 h-4 mr-2" />
                                                More
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>
                                                    <Share className="w-4 h-4 mr-2" />
                                                    Add sources
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <BookOpen className="w-4 h-4 mr-2" />
                                                    Study and learn
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Globe className="w-4 h-4 mr-2" />
                                                    Web search
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <PenTool className="w-4 h-4 mr-2" />
                                                    Canvas
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <InputGroupButton variant="ghost" size="icon-sm" onClick={openSettingsDialog} className="rounded-lg h-7 w-7 text-muted-foreground hover:text-foreground" aria-label="AI Settings">
                                            <Settings className="w-4 h-4" />
                                        </InputGroupButton>
                                    </TooltipTrigger>
                                    <TooltipContent>AI Settings</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <InputGroupButton variant="ghost" size="icon-sm" onClick={toggleRecording} className="ml-auto rounded-lg h-7 w-7 text-muted-foreground hover:text-foreground" aria-label="Dictate">
                                            <AudioLines className={cn("w-4 h-4", isRecording && "text-red-500 animate-pulse")} />
                                        </InputGroupButton>
                                    </TooltipTrigger>
                                    <TooltipContent>Dictate</TooltipContent>
                                </Tooltip>

                                <InputGroupButton size="icon-sm" variant="default" className="rounded-lg h-7 w-7" type="submit" disabled={!canSubmit} aria-label="Send message">
                                    <ArrowUp className="w-4 h-4" />
                                </InputGroupButton>
                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple />
                            </InputGroupAddon>
                        </InputGroup>
                    </TooltipProvider>
                </form>
                {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 w-full px-1 mt-2">
                        {attachments.map((file, index) => (
                            <div key={index} className="relative group shrink-0">
                                <div className="relative overflow-hidden rounded-md border border-border bg-muted w-16 h-16 flex items-center justify-center">
                                    {file.type.startsWith("image/") ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                            onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                        />
                                    ) : (
                                        <FileIcon className="w-8 h-8 text-muted-foreground" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(index)}
                                        className="absolute top-0.5 right-0.5 bg-black/50 hover:bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                                <span className="text-[10px] text-muted-foreground truncate max-w-[64px] block mt-0.5" title={file.name}>
                                    {file.name}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
