import React, { useState } from "react";
import { ChevronDown, Frame, Box, Type, AlignLeft, MousePointer2, Image as ImageIcon, List, Minus, Lock, LockOpen, Eye, EyeOff, Search, ChevronsDown, ChevronsUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { ButtonGroup } from "@/components/ui/button-group";

// --- Data Logic & AST ---
const ELEMENT_CONFIG: Record<string, { icon: any; color: string }> = {
    // Layout & Containers
    body: { icon: Frame, color: "text-muted-foreground" },
    div: { icon: Frame, color: "text-blue-500" }, // Updated to blue based on common patterns
    section: { icon: Frame, color: "text-orange-500" },
    header: { icon: Frame, color: "text-orange-500" },
    footer: { icon: Frame, color: "text-orange-500" },
    nav: { icon: Frame, color: "text-orange-500" },
    main: { icon: Box, color: "text-blue-500" },

    // Content & Typography
    h1: { icon: Type, color: "text-blue-500" },
    h2: { icon: Type, color: "text-blue-500" },
    h3: { icon: Type, color: "text-blue-500" },
    h4: { icon: Type, color: "text-blue-500" },
    p: { icon: AlignLeft, color: "text-blue-500" },
    span: { icon: Type, color: "text-blue-500" },
    a: { icon: MousePointer2, color: "text-blue-500" },

    // Interactive & Media
    button: { icon: Box, color: "text-blue-500" },
    img: { icon: ImageIcon, color: "text-blue-500" },
    input: { icon: Type, color: "text-blue-500" },
    form: { icon: Box, color: "text-blue-500" },
    ul: { icon: List, color: "text-muted-foreground" },
    li: { icon: Minus, color: "text-muted-foreground" },

    // Default
    default: { icon: Box, color: "text-muted-foreground" },
};

const getNodeConfig = (tagName: string) => {
    return ELEMENT_CONFIG[tagName.toLowerCase()] || ELEMENT_CONFIG.default;
};

// Professional Nested HTML AST Data
const KEY_AST_DATA = [
    {
        id: "nav-main",
        tagName: "nav",
        label: "Navbar",
        expanded: true,
        children: [
            {
                id: "brand",
                tagName: "div",
                label: "Brand Container",
                children: [
                    { id: "logo", tagName: "img", label: "Logo Icon" },
                    { id: "brand-name", tagName: "span", label: "Tailwind Editor" },
                ],
            },
            {
                id: "nav-links",
                tagName: "ul",
                label: "Menu Items",
                children: [
                    { id: "li-1", tagName: "li", label: "Home Item", children: [{ id: "a-1", tagName: "a", label: "Home Link" }] },
                    { id: "li-2", tagName: "li", label: "Product Item", children: [{ id: "a-2", tagName: "a", label: "products Link" }] },
                    { id: "li-3", tagName: "li", label: "Pricing Item", children: [{ id: "a-3", tagName: "a", label: "Pricing Link" }] },
                ],
            },
        ],
    },
    {
        id: "hero-sec",
        tagName: "section",
        label: "Hero Section",
        expanded: true,
        children: [
            {
                id: "hero-container",
                tagName: "div",
                label: "Container",
                expanded: true,
                children: [
                    {
                        id: "hero-left",
                        tagName: "div",
                        label: "Text Column",
                        expanded: true,
                        children: [
                            { id: "h1-main", tagName: "h1", label: "Main Headline container" },
                            { id: "p-sub", tagName: "p", label: "Sub-headline description text..." },
                            {
                                id: "cta-group",
                                tagName: "div",
                                label: "CTA Buttons",
                                children: [
                                    { id: "btn-pri", tagName: "button", label: "Start Free Trial" },
                                    { id: "btn-sec", tagName: "button", label: "View Demo" },
                                ],
                            },
                        ],
                    },
                    {
                        id: "hero-right",
                        tagName: "div",
                        label: "Image Column",
                        children: [{ id: "hero-img", tagName: "img", label: "Platform Screenshot" }],
                    },
                ],
            },
        ],
    },
    {
        id: "features-sec",
        tagName: "section",
        label: "Features Section",
        children: [
            { id: "feat-h2", tagName: "h2", label: "Section Title" },
            {
                id: "feat-grid",
                tagName: "div",
                label: "Features Grid",
                children: [
                    { id: "card-1", tagName: "div", label: "Feature Card 1" },
                    { id: "card-2", tagName: "div", label: "Feature Card 2" },
                    { id: "card-3", tagName: "div", label: "Feature Card 3" },
                ],
            },
        ],
    },
    {
        id: "footer-main",
        tagName: "footer",
        label: "Footer",
        collapsed: true,
        children: [{ id: "foot-row", tagName: "div", label: "Footer Content" }],
    },
];

interface TreeItemProps {
    id: string;
    label: string;
    tagName?: string;
    icon?: any;
    isOpen: boolean;
    onToggle: () => void;
    children?: React.ReactNode;
    activeParent?: boolean;
    selected?: boolean;
    color?: string;
    depth?: number;
}

const TreeItem = ({ id, label, tagName, icon: Icon, isOpen, onToggle, children, activeParent, selected, color, depth = 0 }: TreeItemProps) => {
    const [isLocked, setIsLocked] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle();
    };

    const toggleLock = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLocked(!isLocked);
    };

    const toggleVisible = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(!isVisible);
    };

    const itemRow = (
        <div
            className={cn("flex items-center gap-2 py-1.5 hover:bg-accent/50 group cursor-pointer transition-colors relative", selected && "bg-accent", !isVisible && "opacity-60")}
            style={{ paddingLeft: `${depth * 12 + 12}px`, paddingRight: "12px" }}
            onClick={handleToggle}
        >
            {/* Indent / Collapse Icon */}
            <div className={cn("flex items-center justify-center w-4 h-4 shrink-0 hover:bg-muted rounded transition-colors", !children && "opacity-0 pointer-events-none")}>
                <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform duration-200", !isOpen && "-rotate-90")} />
            </div>

            {Icon && <Icon className={cn("w-3.5 h-3.5 shrink-0", color || "text-muted-foreground")} />}

            <span className={cn("text-xs font-medium truncate min-w-0 max-w-[150px]", selected ? "text-accent-foreground" : "text-foreground/80")}>{label}</span>

            {tagName && (
                <span className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded-full font-mono ml-2 border border-border group-hover:bg-background transition-colors shrink-0">
                    {tagName}
                </span>
            )}

            <div className={cn("flex items-center gap-0.5 ml-2 transition-all", isLocked || !isVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                <Tooltip disableHoverableContent>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground p-0.5" onClick={toggleLock}>
                            {isLocked ? <Lock className="w-3 h-3 text-orange-500" /> : <LockOpen className="w-3 h-3" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isLocked ? "Unlock" : "Lock"}</TooltipContent>
                </Tooltip>

                <Tooltip disableHoverableContent>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground p-0.5" onClick={toggleVisible}>
                            {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isVisible ? "Hide" : "Show"}</TooltipContent>
                </Tooltip>
            </div>
        </div>
    );

    if (!children) {
        return <div className="w-full">{itemRow}</div>;
    }

    return (
        <Collapsible open={isOpen} onOpenChange={() => onToggle()} className="w-full">
            {itemRow}
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">{children}</CollapsibleContent>
        </Collapsible>
    );
};

export function LayersPanel() {
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        const traverse = (nodes: any[]) => {
            nodes.forEach((node) => {
                if (node.expanded && !node.collapsed) initial[node.id] = true;
                if (node.children) traverse(node.children);
            });
        };
        traverse(KEY_AST_DATA);
        return initial;
    });
    const [searchQuery, setSearchQuery] = useState("");

    // Helper: Get all parent IDs + self ID if match
    const getMatchesAndParents = (nodes: any[], query: string): { matches: Set<string>; parents: Set<string> } => {
        const matches = new Set<string>();
        const parents = new Set<string>();

        const traverse = (n: any, currentPath: string[]) => {
            const isMatch = n.label.toLowerCase().includes(query.toLowerCase()) || n.tagName.toLowerCase().includes(query.toLowerCase());
            if (isMatch) {
                matches.add(n.id);
                currentPath.forEach((id) => parents.add(id));
            }
            if (n.children) {
                n.children.forEach((child: any) => traverse(child, [...currentPath, n.id]));
            }
        };

        nodes.forEach((node) => traverse(node, []));
        return { matches, parents };
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query) {
            const { parents } = getMatchesAndParents(KEY_AST_DATA, query);
            setExpandedIds(() => {
                const next: Record<string, boolean> = {};
                parents.forEach((id) => (next[id] = true));
                return next;
            });
        }
    };

    const toggleExpansion = (id: string) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const expandAll = () => {
        const allIds: Record<string, boolean> = {};
        const traverse = (nodes: any[]) => {
            nodes.forEach((node) => {
                if (node.children) {
                    allIds[node.id] = true;
                    traverse(node.children);
                }
            });
        };
        traverse(KEY_AST_DATA);
        setExpandedIds(allIds);
    };

    const collapseAll = () => {
        setExpandedIds({});
    };

    const filterNodes = (nodes: any[]): any[] => {
        if (!searchQuery) return nodes;
        return nodes.reduce((acc: any[], node) => {
            const isMatch = node.label.toLowerCase().includes(searchQuery.toLowerCase()) || node.tagName.toLowerCase().includes(searchQuery.toLowerCase());

            if (isMatch) {
                acc.push(node);
            } else {
                const filteredChildren = node.children ? filterNodes(node.children) : [];
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

    // Modification: If the node matches, we should probably return it as is, but if we filter strictly, we lose context.
    // However, the standard tree search often filters out non-matching siblings.
    // Let's stick to the filter logic used in PagesPanel for consistency.

    const filteredData = filterNodes(KEY_AST_DATA);

    const renderTreeNodes = (nodes: any[], depth = 0) => {
        return nodes.map((node) => {
            const config = getNodeConfig(node.tagName);
            const itemColor = node.color || config.color;
            const ItemIcon = node.icon || config.icon;
            const isExpanded = expandedIds[node.id];

            return (
                <TreeItem
                    key={node.id}
                    id={node.id}
                    label={node.label || node.tagName}
                    tagName={node.tagName}
                    icon={ItemIcon}
                    color={itemColor}
                    isOpen={!!isExpanded}
                    onToggle={() => toggleExpansion(node.id)}
                    selected={node.selected}
                    activeParent={node.activeParent}
                    depth={depth}
                >
                    {node.children ? renderTreeNodes(node.children, depth + 1) : null}
                </TreeItem>
            );
        });
    };

    return (
        <TooltipProvider>
            <div className="flex flex-col h-full overflow-hidden">
                {/* Search and Control Bar */}
                <div className="p-2 border-b border-border/40 flex items-center gap-1.5 shrink-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                        <Input className="h-7 pl-8 text-xs bg-background border-input transition-colors shadow-none" placeholder="Search layers..." value={searchQuery} onChange={handleSearch} />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    collapseAll();
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                    <ButtonGroup>
                        <Tooltip disableHoverableContent>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="h-7 w-7 text-muted-foreground" onClick={collapseAll}>
                                    <ChevronsUp className="w-3.5 h-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Collapse All</TooltipContent>
                        </Tooltip>
                        <Tooltip disableHoverableContent>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="h-7 w-7 text-muted-foreground" onClick={expandAll}>
                                    <ChevronsDown className="w-3.5 h-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Expand All</TooltipContent>
                        </Tooltip>
                    </ButtonGroup>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="w-fit min-w-full pb-4">
                        {filteredData.length > 0 ? (
                            renderTreeNodes(filteredData)
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <p className="text-xs">No layers found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
