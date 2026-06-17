"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Search, ChevronDown, GripVertical, Square, Type, Shapes, FormInput, Layout, Grid3X3, Megaphone, Quote, DollarSign, Menu, PanelBottom, Rocket, LayoutGrid, X } from "lucide-react";
import { BLOCK_CATEGORIES, SECTION_CATEGORIES, TEMPLATE_CATEGORIES, BlockItem, BlockCategory } from "@/lib/blocks-data";
import { useEditorStore } from "@/lib/store";

// Icon mapping
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    Square,
    Type,
    Shapes,
    FormInput,
    Layout,
    Grid3X3,
    Megaphone,
    Quote,
    DollarSign,
    Menu,
    PanelBottom,
    Rocket,
    LayoutGrid,
};

const getIcon = (iconName: string) => ICON_MAP[iconName] || Square;

interface BlockCardProps {
    block: BlockItem;
    onDragStart: (e: React.DragEvent, block: BlockItem) => void;
}

function BlockCard({ block, onDragStart }: BlockCardProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e: React.DragEvent) => {
        setIsDragging(true);
        onDragStart(e, block);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={cn(
                "group relative bg-background border border-border/50 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all hover:border-border hover:shadow-sm",
                isDragging && "opacity-50 scale-95"
            )}
        >
            {/* Drag Handle */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
            </div>

            {/* Preview */}
            <div
                className="bg-muted/30 rounded-md p-3 mb-2 min-h-[60px] flex items-center justify-center overflow-hidden pointer-events-none select-none"
                dangerouslySetInnerHTML={{ __html: block.preview }}
            />

            {/* Info */}
            <div className="space-y-0.5">
                <div className="text-xs font-medium text-foreground truncate">{block.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{block.description}</div>
            </div>
        </div>
    );
}

interface CategorySectionProps {
    category: BlockCategory;
    onDragStart: (e: React.DragEvent, block: BlockItem) => void;
    defaultOpen?: boolean;
}

function CategorySection({ category, onDragStart, defaultOpen = true }: CategorySectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const IconComponent = getIcon(category.icon);

    if (category.items.length === 0) return null;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted/50 transition-colors rounded-md group">
                <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", !isOpen && "-rotate-90")} />
                <IconComponent className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground flex-1 text-left">{category.name}</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{category.items.length}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="grid grid-cols-2 gap-2 px-2 pb-2 pt-1">
                    {category.items.map((block) => (
                        <BlockCard key={block.id} block={block} onDragStart={onDragStart} />
                    ))}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

export function BlocksPanel() {
    const { setCode, code } = useEditorStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"blocks" | "sections" | "templates">("blocks");

    // Handle drag start - set the block data for transfer
    const handleDragStart = (e: React.DragEvent, block: BlockItem) => {
        const type = activeTab === "blocks" ? "block" : activeTab === "sections" ? "section" : "template";

        e.dataTransfer.setData(
            "application/json",
            JSON.stringify({
                type: "block", // Keep this for backward compatibility with drop handler
                kind: type, // New field
                id: block.id,
                code: block.code,
                name: block.name,
            })
        );

        // Add marker type for dragOver detection
        e.dataTransfer.setData(`application/x-ai-editor-${type}`, "");

        e.dataTransfer.effectAllowed = "copy";

        // Create a custom drag image
        const dragImage = document.createElement("div");
        dragImage.className = "bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-medium shadow-lg";
        dragImage.textContent = block.name;
        dragImage.style.position = "absolute";
        dragImage.style.top = "-1000px";
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        setTimeout(() => document.body.removeChild(dragImage), 0);
    };

    // Filter blocks based on search
    const filterCategories = (categories: BlockCategory[]): BlockCategory[] => {
        if (!searchQuery) return categories;

        return categories
            .map((cat) => ({
                ...cat,
                items: cat.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())),
            }))
            .filter((cat) => cat.items.length > 0);
    };

    const filteredBlocks = filterCategories(BLOCK_CATEGORIES);
    const filteredSections = filterCategories(SECTION_CATEGORIES);
    const filteredTemplates = filterCategories(TEMPLATE_CATEGORIES);

    const clearSearch = () => setSearchQuery("");

    return (
        <TooltipProvider>
            <div className="flex flex-col h-full bg-card overflow-hidden">
                {/* Tabs Header */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex flex-col h-full">
                    <div className="px-3 pt-2 pb-1 border-b border-border/40 shrink-0">
                        <TabsList className="w-full h-8 p-0.5 bg-muted/50 border border-border/40">
                            <TabsTrigger value="blocks" className="flex-1 h-7 text-[11px] data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer">
                                Blocks
                            </TabsTrigger>
                            <TabsTrigger value="sections" className="flex-1 h-7 text-[11px] data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer">
                                Sections
                            </TabsTrigger>
                            <TabsTrigger value="templates" className="flex-1 h-7 text-[11px] data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer">
                                Templates
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Search */}
                    <div className="px-3 py-2 border-b border-border/40 shrink-0">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                            <Input
                                placeholder="Search..."
                                className="h-8 pl-8 pr-8 text-xs bg-background border-input shadow-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button onClick={clearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                        <TabsContent value="blocks" className="m-0 h-full">
                            <ScrollArea className="h-full">
                                <div className="py-2 space-y-1">
                                    {filteredBlocks.length > 0 ? (
                                        filteredBlocks.map((category) => <CategorySection key={category.id} category={category} onDragStart={handleDragStart} />)
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground text-xs">No blocks found</div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="sections" className="m-0 h-full">
                            <ScrollArea className="h-full">
                                <div className="py-2 space-y-1">
                                    {filteredSections.length > 0 ? (
                                        filteredSections.map((category) => <CategorySection key={category.id} category={category} onDragStart={handleDragStart} />)
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground text-xs">No sections found</div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="templates" className="m-0 h-full">
                            <ScrollArea className="h-full">
                                <div className="py-2 space-y-1">
                                    {filteredTemplates.length > 0 ? (
                                        filteredTemplates.map((category) => <CategorySection key={category.id} category={category} onDragStart={handleDragStart} defaultOpen={true} />)
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground text-xs">No templates found</div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </div>
                </Tabs>

                {/* Help Text */}
                <div className="px-3 py-2 border-t border-border/40 bg-muted/20">
                    <p className="text-[10px] text-muted-foreground text-center">Drag and drop blocks to the preview</p>
                </div>
            </div>
        </TooltipProvider>
    );
}
