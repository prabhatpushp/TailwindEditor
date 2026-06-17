import React, { useState } from "react";
import {
    Plus,
    MoreHorizontal,
    FileImage,
    FileVideo,
    FileText,
    Folder,
    Download,
    Trash2,
    ExternalLink,
    Search,
    Filter,
    Edit2,
    Copy,
    Share2,
    Info,
    LayoutGrid,
    List,
    ChevronsDown,
    ChevronsUp,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Item, ItemContent, ItemTitle, ItemMedia, ItemActions, ItemDescription } from "@/components/ui/item";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface AssetProps {
    name: string;
    type: string;
    category: string;
    size: string;
    date: string;
    icon: React.ElementType;
}

const ALL_ASSETS: AssetProps[] = [
    { name: "hero-background.jpg", type: "Image", category: "Images", size: "2.4 MB", date: "2m ago", icon: FileImage },
    { name: "logo-white.svg", type: "Vector", category: "Images", size: "12 KB", date: "1h ago", icon: FileImage },
    { name: "product-demo.mp4", type: "Video", category: "Media", size: "14.2 MB", date: "3h ago", icon: FileVideo },
    { name: "brand-guidelines.pdf", type: "PDF", category: "Documents", size: "4.5 MB", date: "1d ago", icon: FileText },
    { name: "social-icons", type: "Folder", category: "Images", size: "8 items", date: "2d ago", icon: Folder },
    { name: "avatar-placeholder.png", type: "Image", category: "Images", size: "45 KB", date: "3d ago", icon: FileImage },
    { name: "feature-graph.png", type: "Image", category: "Images", size: "1.2 MB", date: "4d ago", icon: FileImage },
    { name: "intro-music.mp3", type: "Audio", category: "Media", size: "3.5 MB", date: "5d ago", icon: FileVideo },
    { name: "user-manual.docx", type: "DOC", category: "Documents", size: "1.5 MB", date: "1w ago", icon: FileText },
];

function AssetRow({ asset, viewMode }: { asset: AssetProps; viewMode: "list" | "grid" }) {
    const isFolder = asset.type === "Folder";

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (viewMode === "grid") {
        return (
            <div
                className={cn(
                    "aspect-square relative flex flex-col items-center justify-center p-2 rounded-lg hover:bg-muted/40 cursor-pointer group border border-transparent hover:border-border/40 transition-all bg-card shadow-sm hover:shadow-md",
                    isDropdownOpen && "border-border/40 bg-muted/40 shadow-md"
                )}
            >
                <div className="flex-1 flex items-center justify-center w-full">
                    <asset.icon className="w-8 h-8 text-muted-foreground/60 group-hover:text-primary transition-colors duration-300" />
                </div>

                <div className="w-full mt-2 text-center">
                    <div className="text-[10px] font-medium truncate text-foreground/90 w-full">{asset.name}</div>
                    <div className="text-[9px] text-muted-foreground truncate w-full opacity-60 group-hover:opacity-100 transition-opacity">{asset.size}</div>
                </div>

                <div className={cn("absolute top-1 right-1 transition-opacity", isDropdownOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                    <DropdownMenu onOpenChange={setIsDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-background/80 hover:text-foreground cursor-pointer">
                                <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>Open</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        );
    }

    return (
        <Item size="sm" className={cn("hover:bg-muted/40 transition-colors px-2 rounded-md cursor-pointer border-transparent group", isDropdownOpen && "bg-muted/40")}>
            <ItemMedia variant="icon" className="text-muted-foreground">
                <asset.icon className="w-4 h-4" />
            </ItemMedia>
            <ItemContent>
                <ItemTitle className="text-xs font-medium text-foreground/90">{asset.name}</ItemTitle>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground group-hover:text-muted-foreground/80">
                    <span>{asset.type}</span>
                    <span>•</span>
                    <span>{asset.size}</span>
                </div>
            </ItemContent>
            <ItemActions>
                <DropdownMenu onOpenChange={setIsDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-6 w-6 transition-opacity focus:opacity-100 cursor-pointer", isDropdownOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100")}
                        >
                            <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase font-bold">{isFolder ? "Folder Actions" : "Asset Actions"}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <ExternalLink className="w-3.5 h-3.5 mr-2" />
                            {isFolder ? "Open" : "Preview"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Download className="w-3.5 h-3.5 mr-2" />
                            Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Share2 className="w-3.5 h-3.5 mr-2" />
                            Share
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Edit2 className="w-3.5 h-3.5 mr-2" />
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Copy className="w-3.5 h-3.5 mr-2" />
                                Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Info className="w-3.5 h-3.5 mr-2" />
                                Properties
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </ItemActions>
        </Item>
    );
}

export function AssetsPanel() {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
    const [openCategories, setOpenCategories] = useState<string[]>(["Images", "Media", "Documents"]);

    const collapseAll = () => setOpenCategories([]);
    const expandAll = () => setOpenCategories(["Images", "Media", "Documents"]);

    const filteredAssets = ALL_ASSETS.filter((asset) => asset.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const groupedAssets = {
        Images: filteredAssets.filter((a) => a.category === "Images"),
        Media: filteredAssets.filter((a) => a.category === "Media"),
        Documents: filteredAssets.filter((a) => a.category === "Documents"),
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query) {
            // Find categories that have matches
            const categoriesToExpand: string[] = [];
            const tempGrouped = {
                Images: ALL_ASSETS.filter((a) => a.category === "Images" && a.name.toLowerCase().includes(query.toLowerCase())),
                Media: ALL_ASSETS.filter((a) => a.category === "Media" && a.name.toLowerCase().includes(query.toLowerCase())),
                Documents: ALL_ASSETS.filter((a) => a.category === "Documents" && a.name.toLowerCase().includes(query.toLowerCase())),
            };

            Object.entries(tempGrouped).forEach(([key, items]) => {
                if (items.length > 0) categoriesToExpand.push(key);
            });

            setOpenCategories(categoriesToExpand);
        }
    };

    return (
        <TooltipProvider>
            <div className="flex flex-col h-full bg-card">
                <div className="px-3 pb-0 border-b border-border/40 flex items-center justify-between sticky top-0 bg-card z-10 h-10 shrink-0">
                    <ItemContent>
                        <ItemTitle className="text-sm font-semibold">Assets</ItemTitle>
                        <ItemDescription>media & files</ItemDescription>
                    </ItemContent>
                    <div className="flex items-center gap-1">
                        <Tooltip disableHoverableContent>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}>
                                    {viewMode === "list" ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">{viewMode === "list" ? "Grid View" : "List View"}</TooltipContent>
                        </Tooltip>
                        <Tooltip disableHoverableContent>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer">
                                    <Filter className="w-3.5 h-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Filter</TooltipContent>
                        </Tooltip>
                        <Tooltip disableHoverableContent>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer">
                                    <Plus className="w-3.5 h-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Upload Asset</TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                <div className="p-2 border-b border-border/40 flex items-center gap-1.5 shrink-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                        <Input placeholder="Search assets..." className="h-7 pl-8 text-xs bg-background border-input transition-colors shadow-none" value={searchQuery} onChange={handleSearch} />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    collapseAll();
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                    <ButtonGroup>
                        <Tooltip disableHoverableContent>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="h-7 w-7 text-muted-foreground cursor-pointer" onClick={collapseAll}>
                                    <ChevronsUp className="w-3.5 h-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Collapse All</TooltipContent>
                        </Tooltip>
                        <Tooltip disableHoverableContent>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="h-7 w-7 text-muted-foreground cursor-pointer" onClick={expandAll}>
                                    <ChevronsDown className="w-3.5 h-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Expand All</TooltipContent>
                        </Tooltip>
                    </ButtonGroup>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <Accordion type="multiple" value={openCategories} onValueChange={setOpenCategories} className="w-full border-0 rounded-none">
                            {Object.entries(groupedAssets).map(
                                ([category, items]) =>
                                    items.length > 0 && (
                                        <AccordionItem key={category} value={category} className="border-b-0 rounded-none bg-transparent data-[state=open]:bg-transparent">
                                            <AccordionTrigger className="py-2 px-3 text-xs font-semibold hover:bg-muted/30 hover:no-underline rounded-none bg-transparent data-[state=open]:bg-transparent [&>svg]:w-3.5 [&>svg]:h-3.5 transition-colors">
                                                <span className="flex items-center gap-2">
                                                    {category}
                                                    <span className="text-[10px] font-normal text-muted-foreground bg-muted-foreground/10 px-1.5 py-0.5 rounded-full">{items.length}</span>
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent className="p-0 pb-0 bg-transparent">
                                                <div className={cn("px-3 pb-3 pt-1", viewMode === "grid" ? "grid grid-cols-2 gap-2" : "flex flex-col gap-0.5")}>
                                                    {items.map((asset) => (
                                                        <AssetRow key={asset.name} asset={asset} viewMode={viewMode} />
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                            )}
                        </Accordion>
                    </ScrollArea>
                </div>

                <Separator className="my-1" />
                <div className="px-4 py-2 text-[10px] text-muted-foreground flex justify-between items-center">
                    <span>{filteredAssets.length} items</span>
                    <span className="font-medium text-foreground cursor-pointer hover:underline">Storage</span>
                </div>
            </div>
        </TooltipProvider>
    );
}
