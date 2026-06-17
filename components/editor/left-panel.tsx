"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Sparkles, LayoutGrid } from "lucide-react";
import { AiAssistPanel } from "./properties/ai-assist-panel";
import { BlocksPanel } from "./blocks-panel";

export function LeftPanel() {
    const [activeTab, setActiveTab] = useState<"ai" | "blocks">("ai");

    return (
        <TooltipProvider>
            <div className="h-full flex flex-col bg-card border-r border-border">
                {/* Tab Switcher */}
                <div className="flex items-center justify-center gap-1 px-2 py-2 border-b border-border/40 shrink-0 bg-muted/20">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => setActiveTab("ai")}
                                className={cn(
                                    "flex items-center justify-center w-9 h-9 rounded-lg transition-all cursor-pointer",
                                    activeTab === "ai" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <Sparkles className="w-4 h-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">AI Assistant</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => setActiveTab("blocks")}
                                className={cn(
                                    "flex items-center justify-center w-9 h-9 rounded-lg transition-all cursor-pointer",
                                    activeTab === "blocks" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Blocks & Templates</TooltipContent>
                    </Tooltip>
                </div>

                {/* Panel Content */}
                <div className="flex-1 overflow-hidden">{activeTab === "ai" ? <AiAssistPanel /> : <BlocksPanel />}</div>
            </div>
        </TooltipProvider>
    );
}
