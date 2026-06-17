import { useState, useRef } from "react";
import { ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable";
import { Panel, type ImperativePanelHandle } from "react-resizable-panels";
import { IframePanel } from "./iframe-panel";
import { CodeEditorPanel } from "./code-editor-panel";
import { INITIAL_CODE } from "@/lib/constants";
import { useEditorStore } from "@/lib/store";

export function EditorPanel() {
    const { isCodePanelOpen } = useEditorStore();
    const [isMaximized, setIsMaximized] = useState(false);
    const [isMinimized, setIsMinimized] = useState(true);

    const iframeRef = useRef<ImperativePanelHandle>(null);
    const codeRef = useRef<ImperativePanelHandle>(null);

    const toggleMaximize = () => {
        const panel = iframeRef.current;
        const codePanel = codeRef.current;
        if (isMaximized) {
            panel?.expand();
            // Automatically state updates via onExpand callback
        } else {
            panel?.collapse();
            // Automatically state updates via onCollapse callback
            if (isMinimized) {
                codePanel?.expand();
            }
        }
    };

    const toggleMinimize = () => {
        const panel = codeRef.current;
        const iframePanel = iframeRef.current;
        if (isMinimized) {
            panel?.expand();
            // Automatically state updates via onExpand callback
        } else {
            panel?.collapse();
            // Automatically state updates via onCollapse callback
            if (isMaximized) {
                iframePanel?.expand();
            }
        }
    };

    return (
        <div className="h-full w-full bg-background overflow-hidden">
            <ResizablePanelGroup direction="vertical">
                <Panel
                    ref={iframeRef}
                    defaultSize={isCodePanelOpen ? 96 : 100}
                    minSize={0}
                    collapsible={true}
                    collapsedSize={0}
                    className="flex flex-col relative min-h-0"
                    onCollapse={() => setIsMaximized(true)}
                    onExpand={() => setIsMaximized(false)}
                >
                    <IframePanel />
                </Panel>

                {isCodePanelOpen && (
                    <>
                        <ResizableHandle />

                        <Panel
                            ref={codeRef}
                            defaultSize={4}
                            minSize={10}
                            collapsible={true}
                            collapsedSize={4}
                            className="flex flex-col relative min-h-0"
                            onCollapse={() => setIsMinimized(true)}
                            onExpand={() => setIsMinimized(false)}
                        >
                            <CodeEditorPanel onToggleMaximize={toggleMaximize} onToggleMinimize={toggleMinimize} isMaximized={isMaximized} isMinimized={isMinimized} />
                        </Panel>
                    </>
                )}
            </ResizablePanelGroup>
        </div>
    );
}
