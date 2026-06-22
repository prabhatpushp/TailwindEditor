"use client";

import { useEditorStore } from "@/lib/store";
import { EditorProvider } from "@/lib/editor-context";
import { TopBar } from "@/components/editor/top-bar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import dynamic from "next/dynamic";

// Dynamically import heavy panels to keep them out of the initial JS bundle.
// This prevents Monaco Editor (~900 KiB), AI assist, and block data from
// loading until after the shell (TopBar) has rendered.
const LeftPanel = dynamic(() => import("@/components/editor/left-panel").then((m) => m.LeftPanel), { ssr: false });
const EditorPanel = dynamic(() => import("@/components/editor/editor-panel").then((m) => m.EditorPanel), { ssr: false });
const PropertiesPanel = dynamic(() => import("@/components/editor/properties-panel").then((m) => m.PropertiesPanel), { ssr: false });

export default function DesktopEditor() {
    const { isLeftPanelOpen, isPropertiesPanelOpen } = useEditorStore();

    return (
        <EditorProvider>
            <main className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground relative" aria-label="Tailwind Editor workspace">
                <header className="shrink-0">
                    <TopBar />
                </header>
                <div className="flex-1 overflow-hidden">
                    <ResizablePanelGroup direction="horizontal">
                        {isLeftPanelOpen && (
                            <>
                                <ResizablePanel defaultSize={20} minSize={15} maxSize={40} className="min-w-[280px] border-r border-border">
                                    <aside aria-label="Component blocks panel" className="h-full">
                                        <LeftPanel />
                                    </aside>
                                </ResizablePanel>
                                <ResizableHandle />
                            </>
                        )}
                        <ResizablePanel defaultSize={65} minSize={30}>
                            <section aria-label="Visual editor canvas" className="h-full">
                                <EditorPanel />
                            </section>
                        </ResizablePanel>
                        {isPropertiesPanelOpen && (
                            <>
                                <ResizableHandle />
                                <ResizablePanel defaultSize={15} minSize={15} maxSize={40} className="min-w-[280px] border-l border-border">
                                    <aside aria-label="Properties inspector panel" className="h-full">
                                        <PropertiesPanel />
                                    </aside>
                                </ResizablePanel>
                            </>
                        )}
                    </ResizablePanelGroup>
                </div>
            </main>
        </EditorProvider>
    );
}
