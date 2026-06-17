"use client";

import { useEditorStore } from "@/lib/store";
import { EditorProvider } from "@/lib/editor-context";
import { TopBar } from "@/components/editor/top-bar";
import { LeftPanel } from "@/components/editor/left-panel";
import { EditorPanel } from "@/components/editor/editor-panel";
import { PropertiesPanel } from "@/components/editor/properties-panel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Monitor } from "lucide-react";

export default function Page() {
    const { isLeftPanelOpen, isPropertiesPanelOpen } = useEditorStore();

    return (
        <EditorProvider>
            {/* Mobile Block */}
            <div className="flex lg:hidden h-screen w-screen flex-col items-center justify-center bg-background p-6 text-center relative overflow-hidden">
                {/* Background ambient gradients */}
                <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-primary/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-[20%] right-[20%] w-72 h-72 bg-blue-500/20 rounded-full blur-[80px]" />
                
                {/* Glassmorphic Card */}
                <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 dark:border-white/5 bg-background/40 backdrop-blur-2xl p-8 shadow-2xl flex flex-col items-center ring-1 ring-border/50">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20 shadow-[0_0_25px_rgba(var(--primary),0.2)]">
                        <Monitor className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold mb-3 tracking-tight text-foreground">Desktop Only</h1>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                        This AI Editor is optimized for larger screens to provide the best creative experience. Please open it on a desktop browser to continue.
                    </p>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground relative">
                <TopBar />
                <div className="flex-1 overflow-hidden">
                    <ResizablePanelGroup direction="horizontal">
                        {isLeftPanelOpen && (
                            <>
                                <ResizablePanel defaultSize={20} minSize={15} maxSize={40} className="min-w-[280px] border-r border-border">
                                    <LeftPanel />
                                </ResizablePanel>
                                <ResizableHandle />
                            </>
                        )}
                        <ResizablePanel defaultSize={65} minSize={30}>
                            <EditorPanel />
                        </ResizablePanel>
                        {isPropertiesPanelOpen && (
                            <>
                                <ResizableHandle />
                                <ResizablePanel defaultSize={15} minSize={15} maxSize={40} className="min-w-[280px] border-l border-border">
                                    <PropertiesPanel />
                                </ResizablePanel>
                            </>
                        )}
                    </ResizablePanelGroup>
                </div>
            </div>
        </EditorProvider>
    );
}
