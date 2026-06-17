import React, { useState, useMemo } from "react";
import {
    Plus,
    MoreHorizontal,
    FileText,
    LayoutTemplate,
    AlertCircle,
    ExternalLink,
    Edit2,
    Copy,
    Trash2,
    Globe,
    Folder,
    FolderOpen,
    ChevronRight,
    Search,
    ChevronsDown,
    ChevronsUp,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Item, ItemContent, ItemDescription, ItemActions, ItemTitle, ItemMedia } from "@/components/ui/item";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// --- Types ---
interface PageNode {
    id: string;
    name: string;
    path: string;
    type: "page" | "folder" | "dynamic" | "system";
    children?: PageNode[];
    isHome?: boolean;
}

// --- Mock Data (Nested) ---
const PAGES_DATA: PageNode[] = [
    {
        id: "home",
        name: "Home",
        path: "/",
        type: "page",
        isHome: true,
    },
    {
        id: "about",
        name: "About",
        path: "/about",
        type: "page",
    },
    {
        id: "blog",
        name: "Blog",
        path: "/blog",
        type: "folder",
        children: [
            { id: "blog-index", name: "Index", path: "/blog", type: "page" },
            { id: "blog-slug", name: "[slug]", path: "/blog/:slug", type: "dynamic" },
            { id: "blog-cat", name: "Category", path: "/blog/category", type: "folder", children: [{ id: "blog-cat-slug", name: "[cat]", path: "/blog/category/:cat", type: "dynamic" }] },
        ],
    },
    {
        id: "shop",
        name: "Shop",
        path: "/shop",
        type: "folder",
        children: [
            { id: "shop-index", name: "Products", path: "/shop", type: "page" },
            { id: "shop-id", name: "Product Detail", path: "/shop/:id", type: "dynamic" },
            { id: "shop-cart", name: "Cart", path: "/shop/cart", type: "page" },
            { id: "shop-checkout", name: "Checkout", path: "/shop/checkout", type: "page" },
        ],
    },
    {
        id: "auth",
        name: "Auth",
        path: "/auth",
        type: "folder",
        children: [
            { id: "login", name: "Login", path: "/auth/login", type: "system" },
            { id: "register", name: "Register", path: "/auth/register", type: "system" },
            { id: "forgot-pw", name: "Forgot Password", path: "/auth/forgot-password", type: "system" },
        ],
    },
    {
        id: "404",
        name: "404",
        path: "/404",
        type: "system",
    },
];

const PageTreeItem = ({ node, level = 0, isOpen, onToggle, children }: { node: PageNode; level?: number; isOpen: boolean; onToggle: () => void; children?: React.ReactNode }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const hasChildren = node.children && node.children.length > 0;
    const isFolder = node.type === "folder";

    const Icon = node.type === "folder" ? (isOpen ? FolderOpen : Folder) : node.type === "dynamic" ? LayoutTemplate : node.type === "system" ? AlertCircle : FileText;

    const handleToggle = (e: React.MouseEvent) => {
        if (hasChildren) {
            e.stopPropagation();
            onToggle();
        }
    };

    return (
        <div className="flex flex-col select-none">
            <Item
                size="sm"
                className={cn(
                    "px-2 py-1.5 rounded-md cursor-pointer border-transparent hover:bg-muted/50 transition-colors group relative items-start",
                    node.isHome && "bg-muted/30",
                    isDropdownOpen && "bg-muted/50"
                )}
                style={{ paddingLeft: `${8 + level * 16}px` }}
                onClick={handleToggle}
            >
                {/* Expand Toggle for Folders */}
                {hasChildren ? (
                    <div className="mr-1.5 mt-0.5 flex items-center justify-center p-0.5 rounded-sm hover:bg-muted-foreground/10 text-muted-foreground transition-colors shrink-0">
                        <ChevronRight className={cn("w-3 h-3 transition-transform duration-200", isOpen && "rotate-90")} />
                    </div>
                ) : (
                    <div className="w-4 mr-1.5 shrink-0" />
                )}

                <ItemMedia variant="icon" className={cn("w-4 h-4 mr-2 mt-0.5 shrink-0", isFolder ? "text-blue-500/80" : "text-muted-foreground")}>
                    <Icon className="w-full h-full" />
                </ItemMedia>

                <ItemContent className="gap-0 min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0 w-full mb-0.5">
                        <span className={cn("text-xs font-medium truncate", node.isHome ? "text-foreground" : "text-foreground/90")}>{node.name}</span>
                        {node.isHome && (
                            <Badge variant="secondary" className="h-3.5 px-1 py-0 text-[9px] font-normal text-muted-foreground bg-muted-foreground/10 border-0 shrink-0">
                                HOME
                            </Badge>
                        )}
                        {node.type === "dynamic" && <span className="text-[9px] text-muted-foreground font-mono bg-muted px-1 rounded-sm border border-border/50 shrink-0">dynamic</span>}
                    </div>

                    {/* 
                        Use Grid Template Rows for pure CSS height transition
                        We apply this to ALL nodes (Folder & Page) so the interaction is consistent
                        This prevents the "layout shift" annoyance where some items jump and others don't.
                    */}
                    <div className={cn("grid transition-[grid-template-rows] duration-200 ease-out", isDropdownOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] group-hover:grid-rows-[1fr]")}>
                        <div className="overflow-hidden">
                            <span className="text-[10px] text-muted-foreground/60 truncate font-mono block pb-0.5">
                                {isFolder ? (node.children?.length ? `${node.children.length} routes` : "Empty") : node.path}
                            </span>
                        </div>
                    </div>
                </ItemContent>

                <ItemActions
                    className={cn("absolute right-2 top-1.5 transition-opacity bg-background/80 backdrop-blur-sm rounded-sm", isDropdownOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100")}
                >
                    <DropdownMenu onOpenChange={setIsDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase font-bold">{node.type}</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <ExternalLink className="w-3.5 h-3.5 mr-2" />
                                {isFolder ? "Browse" : "Open Page"}
                            </DropdownMenuItem>

                            {isFolder && (
                                <DropdownMenuItem>
                                    <Plus className="w-3.5 h-3.5 mr-2" />
                                    New Sub-page...
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Edit2 className="w-3.5 h-3.5 mr-2" />
                                    Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Copy className="w-3.5 h-3.5 mr-2" />
                                    Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Globe className="w-3.5 h-3.5 mr-2" />
                                    Route Settings
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

            {/* Recursive Children - Rendered by Parent */}
            {isOpen && hasChildren && children && <div className="flex flex-col border-l border-border/40 ml-[19px]">{children}</div>}
        </div>
    );
};

export function PagesPanel() {
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
        // Initialize with folders expanded by default as per original boolean
        const initial: Record<string, boolean> = {};
        const traverse = (nodes: PageNode[]) => {
            nodes.forEach((node) => {
                if (node.children) {
                    initial[node.id] = true;
                    traverse(node.children);
                }
            });
        };
        traverse(PAGES_DATA);
        return initial;
    });
    const [searchQuery, setSearchQuery] = useState("");

    const toggleExpansion = (id: string) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const expandAll = () => {
        const allIds: Record<string, boolean> = {};
        const traverse = (nodes: PageNode[]) => {
            nodes.forEach((node) => {
                if (node.children) {
                    allIds[node.id] = true;
                    traverse(node.children);
                }
            });
        };
        traverse(PAGES_DATA);
        setExpandedIds(allIds);
    };

    const collapseAll = () => {
        setExpandedIds({});
    };

    // Filter Logic
    const filterNodes = (nodes: PageNode[], query: string): PageNode[] => {
        if (!query) return nodes;

        return nodes.reduce((acc: PageNode[], node) => {
            const matchesName = node.name.toLowerCase().includes(query.toLowerCase());
            const matchesPath = node.path.toLowerCase().includes(query.toLowerCase());
            const isMatch = matchesName || matchesPath;

            if (isMatch) {
                acc.push(node);
            } else {
                let filteredChildren: PageNode[] = [];
                if (node.children) {
                    filteredChildren = filterNodes(node.children, query);
                }

                if (filteredChildren.length > 0) {
                    acc.push({
                        ...node,
                        children: filteredChildren,
                    });
                }
            }
            return acc;
        }, []);
    };

    // Helper: Get all parent IDs for search auto-expansion
    const getParentsOfMatches = (nodes: PageNode[], query: string): Set<string> => {
        const parents = new Set<string>();
        const traverse = (n: PageNode, currentPath: string[]) => {
            const isMatch = n.name.toLowerCase().includes(query.toLowerCase()) || n.path.toLowerCase().includes(query.toLowerCase());
            if (isMatch) {
                currentPath.forEach((id) => parents.add(id));
            }
            if (n.children) {
                n.children.forEach((child) => traverse(child, [...currentPath, n.id]));
            }
        };
        nodes.forEach((node) => traverse(node, []));
        return parents;
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query) {
            const parents = getParentsOfMatches(PAGES_DATA, query);
            setExpandedIds(() => {
                const next: Record<string, boolean> = {};
                parents.forEach((id) => (next[id] = true));
                return next;
            });
        }
    };

    const filteredData = useMemo(() => filterNodes(PAGES_DATA, searchQuery), [searchQuery]);

    const renderTreeNodes = (nodes: PageNode[], level = 0) => {
        return nodes.map((node) => {
            const isExpanded = expandedIds[node.id];

            return (
                <PageTreeItem key={node.id} node={node} level={level} isOpen={!!isExpanded} onToggle={() => toggleExpansion(node.id)}>
                    {node.children ? renderTreeNodes(node.children, level + 1) : null}
                </PageTreeItem>
            );
        });
    };

    return (
        <TooltipProvider>
            <div className="flex flex-col h-full bg-card">
                <div className="px-3 pb-0 border-b border-border/40 flex items-center justify-between sticky top-0 bg-card z-10 h-10 shrink-0">
                    <ItemContent>
                        <ItemTitle className="text-sm font-semibold">Pages</ItemTitle>
                        <ItemDescription>site structure & routes</ItemDescription>
                    </ItemContent>
                    <div className="flex items-center gap-1">
                        <Tooltip disableHoverableContent>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">New Page</TooltipContent>
                        </Tooltip>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem>
                                    <Folder className="w-3.5 h-3.5 mr-2" />
                                    New Group...
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LayoutTemplate className="w-3.5 h-3.5 mr-2" />
                                    New Template...
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="px-2 py-2 border-b border-border/40 bg-muted/10 flex items-center gap-1.5">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                        <Input placeholder="Filter pages..." className="h-7 pl-8 text-xs bg-background border-input transition-colors shadow-none" value={searchQuery} onChange={handleSearch} />
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
                        <div className="px-2 pb-2 pt-1">
                            <div className="flex flex-col gap-0.5">
                                {filteredData.length > 0 ? renderTreeNodes(filteredData) : <div className="text-center py-8 text-muted-foreground text-xs">No pages found</div>}
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                <Separator className="my-1" />
                <div className="px-4 py-2 text-[10px] text-muted-foreground flex justify-between items-center">
                    <span>{PAGES_DATA.reduce((acc, curr) => acc + 1 + (curr.children ? curr.children.length : 0), 0)} routes</span>
                    <span className="font-medium text-foreground cursor-pointer hover:underline">Graph View</span>
                </div>
            </div>
        </TooltipProvider>
    );
}
