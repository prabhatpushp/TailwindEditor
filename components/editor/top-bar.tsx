import { useState, useRef, useEffect } from "react";
import { useEditorStore } from "@/lib/store";
import { useEditorContext } from "@/lib/editor-context";
import { useAISettingsStore } from "@/lib/ai-settings-store";
import { AISettingsDialog } from "@/components/editor/ai-settings-dialog";
import {
    AppWindow,
    ChevronDown,
    Plus,
    Type,
    Square,
    BoxSelect,
    MousePointer2,
    Hand,
    MessageSquare,
    Sun,
    Moon,
    RotateCcw,
    RotateCw,
    Monitor,
    Laptop,
    Tablet,
    Smartphone,
    Tv,
    Settings,
    Play,
    Code,
    Share2,
    Upload,
    PanelLeft,
    PanelRight,
    Columns3,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface TopBarButtonProps {
    icon: LucideIcon;
    tooltip: string;
    isActive?: boolean;
    disabled?: boolean;
    variant?: "ghost" | "secondary" | "default" | "destructive" | "outline";
    className?: string;
    iconClassName?: string;
    onClick?: () => void;
}

function TopBarButton({ icon: Icon, tooltip, isActive, disabled, variant = "ghost", className, iconClassName, onClick }: TopBarButtonProps) {
    return (
        <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
                <Button
                    variant={variant}
                    size="icon"
                    className={cn(
                        "h-8 w-8",
                        isActive && "bg-primary/10 text-primary border-primary/50 ring-1 ring-primary/30",
                        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
                        className,
                    )}
                    onClick={onClick}
                    disabled={disabled}
                >
                    <Icon className={cn("w-4 h-4", iconClassName)} />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={10}>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    );
}

export function TopBar() {
    const { code, setCode, isLeftPanelOpen, toggleLeftPanel, isPropertiesPanelOpen, togglePropertiesPanel, isCodePanelOpen, toggleCodePanel, activeBreakpoint, setActiveBreakpoint } = useEditorStore();
    const { undo, redo, canUndo, canRedo } = useEditorContext();
    const [activeTool, setActiveTool] = useState<string | null>("transform");
    const [activeInteraction, setActiveInteraction] = useState<string>("select");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { setTheme, resolvedTheme } = useTheme();

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                setCode(content);
            };
            reader.readAsText(file);
        }
        // Reset the value so the same file can be selected again
        if (e.target) {
            e.target.value = "";
        }
    };

    const handleExport = async () => {
        try {
            // Check if the File System Access API is supported
            if ("showSaveFilePicker" in window) {
                const handle = await (window as any).showSaveFilePicker({
                    suggestedName: "index.html",
                    types: [
                        {
                            description: "HTML File",
                            accept: { "text/html": [".html"] },
                        },
                    ],
                });
                const writable = await handle.createWritable();
                await writable.write(code);
                await writable.close();
            } else {
                throw new Error("File System Access API not supported");
            }
        } catch (err: any) {
            if (err.name !== "AbortError") {
                const blob = new Blob([code], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "index.html";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        }
    };

    return (
    <>
        <TooltipProvider>
            <div className="h-14 bg-background border-b border-border flex items-center justify-between px-3 shrink-0 gap-2">
                {/* Left Section */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2 hover:bg-muted cursor-pointer">
                        <div className="bg-primary rounded p-0.5">
                            <AppWindow className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-sm">Tailwind Editor</span>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                    <DropdownMenu>
                        <Tooltip disableHoverableContent>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer">
                                        <Columns3 className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" sideOffset={10}>
                                <p>Toggle Panels</p>
                            </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuLabel>Toggle Panels</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked={isLeftPanelOpen} onCheckedChange={toggleLeftPanel} onSelect={(e) => e.preventDefault()}>
                                <PanelLeft className="w-4 h-4 mr-2" />
                                Left Panel
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={isPropertiesPanelOpen} onCheckedChange={togglePropertiesPanel} onSelect={(e) => e.preventDefault()}>
                                <PanelRight className="w-4 h-4 mr-2" />
                                Properties Panel
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={isCodePanelOpen} onCheckedChange={toggleCodePanel} onSelect={(e) => e.preventDefault()}>
                                <Code className="w-4 h-4 mr-2" />
                                Code Panel
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    {/* Import Button */}
                    <input type="file" ref={fileInputRef} className="hidden" accept=".html,.txt,.js,.jsx,.ts,.tsx,.css" onChange={handleFileChange} />
                    <TopBarButton icon={Upload} tooltip="Import Code" variant="outline" onClick={handleImportClick} />

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    <ButtonGroup>
                        <TopBarButton icon={Plus} tooltip="Insert Element" variant="outline" isActive={activeTool === "insert"} onClick={() => setActiveTool("insert")} />
                        <TopBarButton icon={Type} tooltip="Text" variant="outline" isActive={activeTool === "text"} onClick={() => setActiveTool("text")} />
                        <TopBarButton icon={Square} tooltip="Frame" variant="outline" isActive={activeTool === "frame"} onClick={() => setActiveTool("frame")} />
                        <TopBarButton icon={BoxSelect} tooltip="Transform" variant="outline" isActive={activeTool === "transform"} onClick={() => setActiveTool("transform")} />
                    </ButtonGroup>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    <ButtonGroup>
                        <TopBarButton icon={MousePointer2} tooltip="Select" variant="outline" isActive={activeInteraction === "select"} onClick={() => setActiveInteraction("select")} />
                        <TopBarButton icon={Hand} tooltip="Pan" variant="outline" isActive={activeInteraction === "pan"} onClick={() => setActiveInteraction("pan")} />
                        <TopBarButton icon={MessageSquare} tooltip="Comments" variant="outline" isActive={activeInteraction === "comments"} onClick={() => setActiveInteraction("comments")} />
                    </ButtonGroup>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    <div className="flex items-center gap-2">
                        <Tooltip disableHoverableContent>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 px-0 border-0" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Appearance</p>
                            </TooltipContent>
                        </Tooltip>
                        <span className="text-xs font-medium text-muted-foreground">50%</span>
                        <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    </div>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    <ButtonGroup>
                        <TopBarButton icon={RotateCcw} tooltip="Undo" variant="outline" onClick={undo} disabled={!canUndo} />
                        <TopBarButton icon={RotateCw} tooltip="Redo" variant="outline" onClick={redo} disabled={!canRedo} />
                    </ButtonGroup>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    <ButtonGroup>
                        <TopBarButton
                            icon={Smartphone}
                            tooltip={activeBreakpoint === "" ? "Mobile (Base) • Click to deselect" : "Mobile (Base)"}
                            variant="outline"
                            isActive={activeBreakpoint === ""}
                            iconClassName="w-3.5 h-3.5"
                            onClick={() => setActiveBreakpoint(activeBreakpoint === "" ? null : "")}
                        />
                        <TopBarButton
                            icon={Tablet}
                            tooltip={activeBreakpoint === "sm:" ? "Small (640px) • Click to deselect" : "Small (640px)"}
                            variant="outline"
                            isActive={activeBreakpoint === "sm:"}
                            iconClassName="w-3.5 h-3.5"
                            onClick={() => setActiveBreakpoint(activeBreakpoint === "sm:" ? null : "sm:")}
                        />
                        <TopBarButton
                            icon={Laptop}
                            tooltip={activeBreakpoint === "md:" ? "Medium (768px) • Click to deselect" : "Medium (768px)"}
                            variant="outline"
                            isActive={activeBreakpoint === "md:"}
                            iconClassName="w-3.5 h-3.5"
                            onClick={() => setActiveBreakpoint(activeBreakpoint === "md:" ? null : "md:")}
                        />
                        <TopBarButton
                            icon={Monitor}
                            tooltip={activeBreakpoint === "lg:" ? "Large (1024px) • Click to deselect" : "Large (1024px)"}
                            variant="outline"
                            isActive={activeBreakpoint === "lg:"}
                            iconClassName="w-3.5 h-3.5"
                            onClick={() => setActiveBreakpoint(activeBreakpoint === "lg:" ? null : "lg:")}
                        />
                        <TopBarButton
                            icon={Tv}
                            tooltip={activeBreakpoint === "xl:" ? "XL (1280px) • Click to deselect" : "XL (1280px)"}
                            variant="outline"
                            isActive={activeBreakpoint === "xl:"}
                            iconClassName="w-3.5 h-3.5"
                            onClick={() => setActiveBreakpoint(activeBreakpoint === "xl:" ? null : "xl:")}
                        />
                    </ButtonGroup>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        <Avatar className="h-8 w-8 border-2 border-background">
                            <AvatarImage src="https://i.pravatar.cc/100?img=5" />
                            <AvatarFallback>U1</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8 border-2 border-background">
                            <AvatarImage src="https://i.pravatar.cc/100?img=9" />
                            <AvatarFallback>U2</AvatarFallback>
                        </Avatar>
                        <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center -ml-3 z-10 hover:bg-muted/80 cursor-pointer text-muted-foreground">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>

                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-4 text-xs cursor-pointer">Share</Button>

                    <ButtonGroup>
                        <TopBarButton icon={Settings} tooltip="AI Settings" variant="outline" onClick={() => useAISettingsStore.getState().openSettingsDialog()} />
                        <TopBarButton icon={Play} tooltip="Preview" variant="outline" iconClassName="fill-current text-primary" />
                        <TopBarButton icon={Code} tooltip="Export Code" variant="outline" onClick={handleExport} />
                    </ButtonGroup>
                </div>
            </div>
        </TooltipProvider>

        {/* AI Settings Dialog */}
        <AISettingsDialog />
    </>);
}
