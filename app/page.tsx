"use client";

import { useEditorStore } from "@/lib/store";
import { EditorProvider } from "@/lib/editor-context";
import { TopBar } from "@/components/editor/top-bar";
import { LeftPanel } from "@/components/editor/left-panel";
import { EditorPanel } from "@/components/editor/editor-panel";
import { PropertiesPanel } from "@/components/editor/properties-panel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function Page() {
    const { isLeftPanelOpen, isPropertiesPanelOpen } = useEditorStore();

    return (
        <EditorProvider>
            <div className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground relative">
                <TopBar />
                <div className="flex-1 overflow-hidden">
                    <ResizablePanelGroup direction="horizontal">
                        {isLeftPanelOpen && (
                            <>
                                <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="border-r border-border">
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
                                <ResizablePanel defaultSize={15} minSize={15} maxSize={30} className="border-l border-border">
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
