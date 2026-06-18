import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
    Monitor,
    Tablet,
    Smartphone,
    Laptop,
    Tv,
    Box,
    Wand2,
    Eye,
    EyeOff,
    Grid,
    Layers,
    ArrowDown,
    ArrowRight,
    AlignHorizontalJustifyStart,
    AlignHorizontalJustifyCenter,
    AlignHorizontalJustifyEnd,
    AlignHorizontalSpaceBetween,
    AlignHorizontalSpaceAround,
    AlignVerticalJustifyStart,
    AlignVerticalJustifyCenter,
    AlignVerticalJustifyEnd,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    CaseUpper,
    CaseLower,
    CaseSensitive,
    WrapText,
    Type,
    Maximize,
    MoveHorizontal,
    Columns,
    GalleryVertical,
    List,
    Kanban,
    LayoutTemplate,
    MousePointer2,
    Palette,
    // New icons for enhanced sections
    Scan,
    Sun,
    Hash,
    Contrast,
    Eclipse,
    Unlink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertySection } from "./property-section";
import { PropertyRow } from "./property-row";
import {
    PropertySelect,
    GAP_OPTIONS,
    GRID_TRACK_OPTIONS,
    SIZING_OPTIONS,
    SPACING_OPTIONS,
    FONT_SIZE_OPTIONS,
    LINE_HEIGHT_OPTIONS,
    BORDER_RADIUS_OPTIONS,
    BORDER_WIDTH_OPTIONS,
} from "./property-select";
import { ColorPicker } from "./color-picker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useEditorStore } from "@/lib/store";
import { parseClasses, type Breakpoint } from "@/lib/tailwind-utils";
import { replaceConflictingClasses } from "@/lib/tailwind-conflict-groups";

const NavIconButton = ({
    icon: Icon,
    className,
    active,
    onClick,
    tooltip,
    disabled,
}: {
    icon: any;
    className?: string;
    active?: boolean;
    onClick?: (e?: any) => void;
    tooltip: string;
    disabled?: boolean;
}) => (
    <Tooltip disableHoverableContent>
        <TooltipTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                onClick={onClick}
                disabled={disabled}
                className={cn(
                    "w-7 h-7 rounded-sm transition-all duration-200",
                    active ? "bg-card text-brand shadow-sm hover:bg-card hover:text-brand" : "text-muted-foreground hover:text-brand hover:bg-muted/50",
                    disabled && "opacity-40 cursor-not-allowed",
                    className
                )}
            >
                <Icon className="w-3.5 h-3.5" />
            </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
            {tooltip}
        </TooltipContent>
    </Tooltip>
);

// Editable slider value — click the label to type a value manually (Figma-style UX)
const EditableSliderValue = ({
    value,
    suffix = "",
    min,
    max,
    onCommit,
}: {
    value: number;
    suffix?: string;
    min: number;
    max: number;
    onCommit: (val: number) => void;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(String(value));
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isEditing) setInputValue(String(value));
    }, [value, isEditing]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const commit = () => {
        setIsEditing(false);
        const num = parseInt(inputValue, 10);
        if (!isNaN(num)) {
            const clamped = Math.max(min, Math.min(max, num));
            onCommit(clamped);
        }
    };

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                    if (e.key === "Enter") commit();
                    if (e.key === "Escape") setIsEditing(false);
                }}
                className="w-10 h-5 text-[10px] text-center bg-card border border-brand/50 rounded-sm outline-none text-foreground font-medium tabular-nums"
            />
        );
    }

    return (
        <button
            onClick={() => setIsEditing(true)}
            className="w-8 text-[10px] text-muted-foreground text-right cursor-text hover:text-brand transition-colors tabular-nums"
            title="Click to edit"
        >
            {value}{suffix}
        </button>
    );
};

// Tailwind color hex values has been moved to color-picker.tsx modules or are self-contained
// Local ColorPicker component has been replaced by the imported version

export function DesignPanel() {
    const { selectedElement, selectedElements, updateElementClasses, updateElementText, updateElementId, updateElementStyle, activeBreakpoint } = useEditorStore();

    // Expand toggles for margin/padding (linked vs individual sides)
    const [marginExpanded, setMarginExpanded] = useState(false);
    const [paddingExpanded, setPaddingExpanded] = useState(false);
    const [positionExpanded, setPositionExpanded] = useState(false);

    // Slider local values (for display while dragging)
    const [opacityValue, setOpacityValue] = useState(100);
    const [brightnessValue, setBrightnessValue] = useState(100);
    const [contrastValue, setContrastValue] = useState(100);
    const [saturateValue, setSaturateValue] = useState(100);
    const [hueValue, setHueValue] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [scaleValue, setScaleValue] = useState(100);
    const [skewXValue, setSkewXValue] = useState(0);
    const [skewYValue, setSkewYValue] = useState(0);
    const [rotateXValue, setRotateXValue] = useState(0);
    const [rotateYValue, setRotateYValue] = useState(0);
    const [rotateZValue, setRotateZValue] = useState(0);

    // Parse classes from selected element(s)
    // When activeBreakpoint is null (full width mode), use "" for base styles
    const parsedClasses = useMemo(() => {
        const breakpointForParsing = activeBreakpoint ?? "";
        if (!selectedElement?.className) {
            return parseClasses("", breakpointForParsing);
        }
        return parseClasses(selectedElement.className, breakpointForParsing);
    }, [selectedElement?.className, activeBreakpoint]);

    // Helper to update classes — uses conflict groups to precisely replace matching classes
    // Accepts a conflict group key (or array of keys) that maps to a regex in CONFLICT_GROUPS.
    // This prevents duplicate/conflicting classes (e.g., position, font-weight vs font-family).
    const updateClasses = useCallback(
        (conflictGroup: string | string[], newValue: string) => {
            const elementsToUpdate = selectedElements.length > 0 ? selectedElements : selectedElement ? [selectedElement] : [];

            for (const element of elementsToUpdate) {
                if (!element.builderId) continue;

                const currentClasses = element.className || "";
                const newClasses = replaceConflictingClasses(currentClasses, conflictGroup, newValue, activeBreakpoint);
                updateElementClasses(element.builderId, newClasses);
            }
        },
        [selectedElement, selectedElements, updateElementClasses, activeBreakpoint]
    );

    // Helper to update background classes (handling solid colors and gradients)
    const updateBackgroundClasses = useCallback(
        (newValue: string) => {
            const elementsToUpdate = selectedElements.length > 0 ? selectedElements : selectedElement ? [selectedElement] : [];

            for (const element of elementsToUpdate) {
                if (!element.builderId) continue;

                let classes = element.className || "";
                const classArray = classes.split(/\s+/).filter(Boolean);

                // Remove existing background and gradient classes for current breakpoint
                const filtered = classArray.filter((cls) => {
                    // Check if matches active breakpoint
                    const isMatch = activeBreakpoint ? cls.startsWith(activeBreakpoint) : !cls.includes(":");
                    if (!isMatch) return true; // Keep if not matching current breakpoint

                    const normalized = activeBreakpoint ? cls.replace(activeBreakpoint, "") : cls;

                    // Helper: checks if class is background or gradient related
                    // Excluding bg-opacity, bg-blend, etc if possible, but simplicity first. (Updated logic for safer ignores)
                    if (
                        normalized.startsWith("bg-") &&
                        !normalized.startsWith("bg-opacity-") &&
                        !normalized.startsWith("bg-blend-") &&
                        !normalized.startsWith("bg-clip-") &&
                        !normalized.startsWith("bg-origin-") &&
                        !normalized.startsWith("bg-local") &&
                        !normalized.startsWith("bg-scroll") &&
                        !normalized.startsWith("bg-fixed") &&
                        !normalized.startsWith("bg-top") &&
                        !normalized.startsWith("bg-bottom") &&
                        !normalized.startsWith("bg-left") &&
                        !normalized.startsWith("bg-right") &&
                        !normalized.startsWith("bg-center") &&
                        !normalized.startsWith("bg-no-repeat") &&
                        !normalized.startsWith("bg-repeat") &&
                        !normalized.startsWith("bg-auto") &&
                        !normalized.startsWith("bg-cover") &&
                        !normalized.startsWith("bg-contain")
                    ) {
                        return false;
                    }
                    if (normalized.startsWith("from-") || normalized.startsWith("via-") || normalized.startsWith("to-")) return false;

                    return true;
                });

                // Append new classes
                // newValue might be "bg-red-500" or "bg-gradient-to-r from-x to-y" etc.
                // We need to apply breakpoint prefix to EACH space-separated class in newValue
                const newParts = newValue.split(" ").filter(Boolean);
                const prefixedNewParts = newParts.map((part) => {
                    // The component returns e.g. "red-500" (solid) or "gradient-to-r from-..." (linear)
                    // If it doesn't start with bg- or from/via/to and it's color/gradient-type, we might need to prefix?
                    // My component returns "red-500" for solid. It assumes parent prefixes `bg-`.
                    // My component returns "gradient-to-r ..." for linear. It assumes parent prefixes `bg-` for `gradient-to-r` but not others?
                    // Wait, `updateClasses` assumed a single prefix replacement.
                    // Here I am manually reconstructing.

                    // Component contract update:
                    // Solid -> "red-500" (or transparent/hex)
                    // Linear -> "gradient-to-r from-red-500 to-blue-500"

                    // I will normalize here:
                    if (part.startsWith("from-") || part.startsWith("via-") || part.startsWith("to-")) {
                        return activeBreakpoint ? activeBreakpoint + part : part;
                    }

                    if (part.startsWith("[")) {
                        // arbitrary value like [radial-gradient...] or [conic-gradient...] or [#hex]
                        // These assume bg- prefix usually?
                        // bg-[#hex] -> Yes
                        // bg-[radial...] -> Yes
                        return activeBreakpoint ? `${activeBreakpoint}bg-${part}` : `bg-${part}`;
                    }

                    // Standard utilities
                    // gradient-to-r -> bg-gradient-to-r
                    if (part.startsWith("gradient-to-")) {
                        return activeBreakpoint ? `${activeBreakpoint}bg-${part}` : `bg-${part}`;
                    }

                    // Colors: red-500 -> bg-red-500
                    // But check if it already has bg- (unlikely from my component unless I change it)
                    if (part.startsWith("bg-")) return activeBreakpoint ? activeBreakpoint + part : part;

                    return activeBreakpoint ? `${activeBreakpoint}bg-${part}` : `bg-${part}`;
                });

                filtered.push(...prefixedNewParts);
                updateElementClasses(element.builderId, filtered.join(" "));
            }
        },
        [selectedElement, selectedElements, updateElementClasses, activeBreakpoint]
    );

    // Computed values from parsed classes
    const layoutDirection = parsedClasses.flexDirection === "row" || parsedClasses.flexDirection === "row-reverse" ? "Horizontal" : "Vertical";
    const justifyContent = parsedClasses.justifyContent || "start";
    const alignItems = parsedClasses.alignItems || "stretch";
    const flexWrap = parsedClasses.flexWrap === "wrap" ? "Wrap" : "No Wrap";
    const gap = parsedClasses.gap || "";
    const gridColumns = parsedClasses.gridCols || "2";
    const gridRows = parsedClasses.gridRows || "auto";
    const gridAutoFlow = parsedClasses.gridAutoFlow || "row";

    // Sizing values
    const width = parsedClasses.width || "";
    const height = parsedClasses.height || "";
    const minWidth = parsedClasses.minWidth || "";
    const maxWidth = parsedClasses.maxWidth || "";
    const minHeight = parsedClasses.minHeight || "";
    const maxHeight = parsedClasses.maxHeight || "";

    // Spacing values
    const paddingT = parsedClasses.padding?.t || parsedClasses.padding?.all || "";
    const paddingR = parsedClasses.padding?.r || parsedClasses.padding?.all || "";
    const paddingB = parsedClasses.padding?.b || parsedClasses.padding?.all || "";
    const paddingL = parsedClasses.padding?.l || parsedClasses.padding?.all || "";
    const marginT = parsedClasses.margin?.t || parsedClasses.margin?.all || "";
    const marginR = parsedClasses.margin?.r || parsedClasses.margin?.all || "";
    const marginB = parsedClasses.margin?.b || parsedClasses.margin?.all || "";
    const marginL = parsedClasses.margin?.l || parsedClasses.margin?.all || "";

    // Style values
    const borderRadius = parsedClasses.borderRadius || "";
    const opacity = parsedClasses.opacity ? parseInt(parsedClasses.opacity) : 100;
    const overflow = parsedClasses.overflow || "visible";
    const backgroundColor = parsedClasses.backgroundColor || "";

    // Typography values
    const fontSize = parsedClasses.fontSize || "";
    const fontWeight = parsedClasses.fontWeight || "";
    const fontFamily = parsedClasses.fontFamily || "";
    const textAlign = parsedClasses.textAlign || "left";
    const lineHeight = parsedClasses.lineHeight || "";
    const letterSpacing = parsedClasses.letterSpacing || "";
    const textColor = parsedClasses.textColor || "";

    // Text styles
    const isBold = fontWeight === "bold" || fontWeight === "semibold" || fontWeight === "extrabold" || fontWeight === "black";
    const isItalic = parsedClasses.other.includes("italic");
    const isUnderline = parsedClasses.textDecoration === "underline";
    const isStrikethrough = parsedClasses.textDecoration === "line-through";
    const textTransform = parsedClasses.textTransform || "";

    // Filter toggles — derive from raw className for reliability
    const rawClasses = (selectedElement?.className || "").split(/\s+/);
    const isGrayscale = rawClasses.includes("grayscale");
    const isInvert = rawClasses.includes("invert");
    const isSepia = rawClasses.includes("sepia");

    // 3D Transform states
    const hasPreserve3d = rawClasses.includes("[transform-style:preserve-3d]");
    const hasBackfaceHidden = rawClasses.includes("backface-hidden");
    const hasBackfaceVisible = rawClasses.includes("backface-visible");

    // No element selected state
    const hasSelection = selectedElement !== null || selectedElements.length > 0;
    const multipleSelected = selectedElements.length > 1;

    if (!hasSelection) {
        return (
            <TooltipProvider>
                <div className="flex flex-col h-full bg-background items-center justify-center p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <MousePointer2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-medium text-foreground mb-1">No element selected</h3>
                    <p className="text-xs text-muted-foreground max-w-[200px]">Select an element in the preview to edit its design properties</p>
                </div>
            </TooltipProvider>
        );
    }

    return (
        <TooltipProvider>
            <div className="flex flex-col h-full bg-background custom-scrollbar overflow-y-auto pb-12">
                {/* Selection Info */}
                {multipleSelected && (
                    <div className="px-3 py-2 bg-brand/10 border-b border-brand/20">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] bg-brand/20 text-brand">
                                {selectedElements.length} elements selected
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">Changes apply to all</span>
                        </div>
                    </div>
                )}

                {/* Element Info */}
                {selectedElement && !multipleSelected && (
                    <div className="px-3 py-2 border-b border-border/50 bg-muted/30">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-mono">
                                {selectedElement.tagName}
                            </Badge>
                            {selectedElement.id && <span className="text-[10px] text-muted-foreground font-mono">#{selectedElement.id}</span>}
                        </div>
                        {selectedElement.className && <p className="text-[9px] text-muted-foreground mt-1 truncate font-mono">{selectedElement.className}</p>}
                    </div>
                )}

                {/* Element Properties Section */}
                <PropertySection title="Element" defaultOpen={true}>
                    <div className="space-y-3">
                        {/* Text Content */}
                        <div>
                            <Textarea
                                placeholder="Text content..."
                                rows={2}
                                className="text-xs resize-none min-h-[32px]"
                                value={selectedElement?.innerText || ""}
                                onChange={(e) => {
                                    if (selectedElement?.builderId) {
                                        updateElementText(selectedElement.builderId, e.target.value);
                                    }
                                }}
                                disabled={!selectedElement?.innerText && selectedElement?.innerText !== ""}
                            />
                            {selectedElement && !selectedElement.innerText && <p className="text-[9px] text-muted-foreground mt-1">Double-click element in preview to edit text</p>}
                        </div>

                        {/* Tailwind Classes */}
                        <div>
                            <Textarea
                                placeholder="Tailwind classes..."
                                rows={2}
                                className="text-xs resize-none min-h-[32px] font-mono"
                                value={selectedElement?.className || ""}
                                onChange={(e) => {
                                    if (selectedElement?.builderId) {
                                        updateElementClasses(selectedElement.builderId, e.target.value);
                                    }
                                }}
                            />
                        </div>

                        {/* Inline CSS */}
                        <div>
                            <Input
                                placeholder="Inline CSS (e.g. color: red;)"
                                className="h-7 text-xs font-mono"
                                value={selectedElement?.style || ""}
                                onChange={(e) => {
                                    if (selectedElement?.builderId) {
                                        updateElementStyle(selectedElement.builderId, e.target.value);
                                    }
                                }}
                            />
                        </div>

                        {/* Element ID */}
                        <div className="flex items-center gap-2">
                            <Tooltip disableHoverableContent>
                                <TooltipTrigger asChild>
                                    <div className="text-muted-foreground">
                                        <Hash className="w-3.5 h-3.5" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="text-xs">
                                    Element ID
                                </TooltipContent>
                            </Tooltip>
                            <Input
                                placeholder="element-id"
                                className="h-7 text-xs font-mono flex-1"
                                value={selectedElement?.id || ""}
                                onChange={(e) => {
                                    if (selectedElement?.builderId) {
                                        updateElementId(selectedElement.builderId, e.target.value);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </PropertySection>

                {/* Alignment Section
                <PropertySection title="Alignment">
                    <div className="flex flex-wrap gap-1 p-1 bg-muted/20 rounded-lg border border-border/50 justify-between">
                        <NavIconButton icon={AlignHorizontalJustifyStart} tooltip="Justify Start" active={justifyContent === "start"} onClick={() => updateClasses("justify-", "justify-start")} />
                        <NavIconButton icon={AlignHorizontalJustifyCenter} tooltip="Justify Center" active={justifyContent === "center"} onClick={() => updateClasses("justify-", "justify-center")} />
                        <NavIconButton icon={AlignHorizontalJustifyEnd} tooltip="Justify End" active={justifyContent === "end"} onClick={() => updateClasses("justify-", "justify-end")} />
                        <NavIconButton icon={AlignVerticalJustifyStart} tooltip="Align Start" active={alignItems === "start"} onClick={() => updateClasses("items-", "items-start")} />
                        <NavIconButton icon={AlignVerticalJustifyCenter} tooltip="Align Center" active={alignItems === "center"} onClick={() => updateClasses("items-", "items-center")} />
                        <NavIconButton icon={AlignVerticalJustifyEnd} tooltip="Align End" active={alignItems === "end"} onClick={() => updateClasses("items-", "items-end")} />
                        <NavIconButton icon={AlignHorizontalSpaceBetween} tooltip="Space Between" active={justifyContent === "between"} onClick={() => updateClasses("justify-", "justify-between")} />
                        <NavIconButton icon={GalleryVertical} tooltip="Distribute Vertical" />
                        <NavIconButton icon={AlignHorizontalSpaceAround} tooltip="Space Around" active={justifyContent === "around"} onClick={() => updateClasses("justify-", "justify-around")} />
                        <NavIconButton icon={List} tooltip="Space Evenly" active={justifyContent === "evenly"} onClick={() => updateClasses("justify-", "justify-evenly")} />
                        <NavIconButton icon={Kanban} tooltip="Stretch" active={alignItems === "stretch"} onClick={() => updateClasses("items-", "items-stretch")} />
                        <NavIconButton icon={LayoutTemplate} tooltip="Baseline" active={alignItems === "baseline"} onClick={() => updateClasses("items-", "items-baseline")} />
                        <NavIconButton icon={Maximize} className="rotate-45" tooltip="Tidy Up" />
                        <NavIconButton icon={Box} tooltip="Add Flex" onClick={() => updateClasses("", "flex")} />
                    </div>
                </PropertySection> */}

                {/* Sizing Section */}
                <PropertySection title="Sizing">
                    <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] text-muted-foreground font-medium pl-1 select-none">width</span>
                                <PropertySelect
                                    value={width}
                                    onChange={(val) => updateClasses("width", val ? `w-${val}` : "")}
                                    groups={SIZING_OPTIONS}
                                    placeholder="auto"
                                    searchPlaceholder="Search width..."
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] text-muted-foreground font-medium pl-1 select-none">height</span>
                                <PropertySelect
                                    value={height}
                                    onChange={(val) => updateClasses("height", val ? `h-${val}` : "")}
                                    groups={SIZING_OPTIONS}
                                    placeholder="auto"
                                    searchPlaceholder="Search height..."
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] text-muted-foreground font-medium pl-1 select-none">min-width</span>
                                <PropertySelect
                                    value={minWidth}
                                    onChange={(val) => updateClasses("minWidth", val ? `min-w-${val}` : "")}
                                    groups={SIZING_OPTIONS}
                                    placeholder="0"
                                    searchPlaceholder="Search min-width..."
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] text-muted-foreground font-medium pl-1 select-none">max-width</span>
                                <PropertySelect
                                    value={maxWidth}
                                    onChange={(val) => updateClasses("maxWidth", val ? `max-w-${val}` : "")}
                                    groups={SIZING_OPTIONS}
                                    placeholder="none"
                                    searchPlaceholder="Search max-width..."
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] text-muted-foreground font-medium pl-1 select-none">min-height</span>
                                <PropertySelect
                                    value={minHeight}
                                    onChange={(val) => updateClasses("minHeight", val ? `min-h-${val}` : "")}
                                    groups={SIZING_OPTIONS}
                                    placeholder="0"
                                    searchPlaceholder="Search min-height..."
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] text-muted-foreground font-medium pl-1 select-none">max-height</span>
                                <PropertySelect
                                    value={maxHeight}
                                    onChange={(val) => updateClasses("maxHeight", val ? `max-h-${val}` : "")}
                                    groups={SIZING_OPTIONS}
                                    placeholder="none"
                                    searchPlaceholder="Search max-height..."
                                />
                            </div>
                        </div>

                        {/* Overflow */}
                        <div className="pt-2 flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground font-medium">overflow</span>
                            <div className="flex items-center bg-muted rounded-md p-0.5">
                                {[
                                    { id: "visible", icon: Eye, label: "Visible" },
                                    { id: "hidden", icon: EyeOff, label: "Hidden" },
                                    { id: "scroll", icon: Box, label: "Scroll" },
                                    { id: "auto", icon: Wand2, label: "Auto" },
                                ].map(({ id, icon: Icon, label }) => (
                                    <NavIconButton key={id} icon={Icon} tooltip={label} active={overflow === id} onClick={() => updateClasses("overflow", `overflow-${id}`)} />
                                ))}
                            </div>
                        </div>
                    </div>
                </PropertySection>

                {/* Layout Section */}
                <PropertySection title="Layout">
                    <div className="space-y-4">
                        {/* Position Controls - Moved to top */}
                        <PropertyRow label="position">
                            <Select onValueChange={(val) => updateClasses("position", val)}>
                                <SelectTrigger className="w-[120px] h-7 text-[10px]">
                                    <SelectValue placeholder="static" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["static", "relative", "absolute", "fixed", "sticky"].map((val) => (
                                        <SelectItem key={val} value={val}>
                                            {val}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </PropertyRow>

                        <PropertyRow label="display">
                            <Select value={parsedClasses.display || "block"} onValueChange={(val) => updateClasses("display", val === "block" ? "" : val)}>
                                <SelectTrigger className="w-[120px] h-7 text-[10px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {["block", "inline-block", "inline", "flex", "inline-flex", "grid", "inline-grid", "contents", "hidden"].map((val) => (
                                        <SelectItem key={val} value={val}>
                                            {val}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </PropertyRow>

                        {/* Grid Options */}
                        {(parsedClasses.display === "grid" || parsedClasses.display === "inline-grid") && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <PropertyRow label="grid-template-columns">
                                    <PropertySelect
                                        value={gridColumns}
                                        onChange={(val) => updateClasses("gridCols", `grid-cols-${val}`)}
                                        groups={GRID_TRACK_OPTIONS}
                                        placeholder="2"
                                        searchPlaceholder="Search columns..."
                                        allowCustom={false}
                                    />
                                </PropertyRow>
                                <PropertyRow label="grid-template-rows">
                                    <PropertySelect
                                        value={gridRows}
                                        onChange={(val) => updateClasses("gridRows", `grid-rows-${val}`)}
                                        groups={GRID_TRACK_OPTIONS}
                                        placeholder="auto"
                                        searchPlaceholder="Search rows..."
                                        allowCustom={false}
                                    />
                                </PropertyRow>
                                <PropertyRow label="justify-content">
                                    <Select value={justifyContent} onValueChange={(val) => updateClasses("justifyContent", `justify-${val}`)}>
                                        <SelectTrigger className="w-[120px] h-7 text-[10px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="start">start</SelectItem>
                                            <SelectItem value="center">center</SelectItem>
                                            <SelectItem value="end">end</SelectItem>
                                            <SelectItem value="between">space-between</SelectItem>
                                            <SelectItem value="around">space-around</SelectItem>
                                            <SelectItem value="evenly">space-evenly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </PropertyRow>
                                <PropertyRow label="align-items">
                                    <div className="flex bg-muted rounded p-0.5 w-[120px]">
                                        {[
                                            { id: "start", icon: AlignHorizontalJustifyStart, label: "start" },
                                            { id: "center", icon: AlignHorizontalJustifyCenter, label: "center" },
                                            { id: "end", icon: AlignHorizontalJustifyEnd, label: "end" },
                                            { id: "stretch", icon: AlignJustify, label: "stretch" },
                                        ].map(({ id, icon: Icon, label }) => (
                                            <NavIconButton key={id} icon={Icon} tooltip={label} active={alignItems === id} onClick={() => updateClasses("alignItems", `items-${id}`)} />
                                        ))}
                                    </div>
                                </PropertyRow>
                                <PropertyRow label="gap">
                                    <PropertySelect
                                        value={gap || "0"}
                                        onChange={(val) => updateClasses("gap", val !== "0" ? `gap-${val}` : "")}
                                        groups={GAP_OPTIONS}
                                        placeholder="0"
                                        searchPlaceholder="Search gap..."
                                        allowCustom={true}
                                    />
                                </PropertyRow>
                            </div>
                        )}

                        {(parsedClasses.display === "flex" || parsedClasses.display === "inline-flex") && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <PropertyRow label="flex-direction">
                                    <div className="flex bg-muted rounded p-0.5 w-[120px]">
                                        <button
                                            onClick={() => updateClasses("flexDirection", "flex-col")}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-1 py-1 rounded-sm text-[10px] font-medium transition-all",
                                                layoutDirection === "Vertical" ? "bg-card text-brand shadow-sm" : "text-muted-foreground hover:text-brand hover:bg-muted/50"
                                            )}
                                        >
                                            <ArrowDown className="w-3 h-3" /> column
                                        </button>
                                        <button
                                            onClick={() => updateClasses("flexDirection", "flex-row")}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-1 py-1 rounded-sm text-[10px] font-medium transition-all",
                                                layoutDirection === "Horizontal" ? "bg-card text-brand shadow-sm" : "text-muted-foreground hover:text-brand hover:bg-muted/50"
                                            )}
                                        >
                                            <ArrowRight className="w-3 h-3" /> row
                                        </button>
                                    </div>
                                </PropertyRow>

                                <PropertyRow label="justify-content">
                                    <Select value={justifyContent} onValueChange={(val) => updateClasses("justifyContent", `justify-${val}`)}>
                                        <SelectTrigger className="w-[120px] h-7 text-[10px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="start">flex-start</SelectItem>
                                            <SelectItem value="center">center</SelectItem>
                                            <SelectItem value="end">flex-end</SelectItem>
                                            <SelectItem value="between">space-between</SelectItem>
                                            <SelectItem value="around">space-around</SelectItem>
                                            <SelectItem value="evenly">space-evenly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </PropertyRow>

                                <PropertyRow label="align-items">
                                    <div className="flex bg-muted rounded p-0.5 w-[120px]">
                                        {[
                                            { id: "start", icon: AlignHorizontalJustifyStart, label: "flex-start" },
                                            { id: "center", icon: AlignHorizontalJustifyCenter, label: "center" },
                                            { id: "end", icon: AlignHorizontalJustifyEnd, label: "flex-end" },
                                            { id: "stretch", icon: AlignJustify, label: "stretch" },
                                        ].map(({ id, icon: Icon, label }) => (
                                            <NavIconButton key={id} icon={Icon} tooltip={label} active={alignItems === id} onClick={() => updateClasses("alignItems", `items-${id}`)} />
                                        ))}
                                    </div>
                                </PropertyRow>

                                <PropertyRow label="flex-wrap">
                                    <Select value={parsedClasses.flexWrap || "nowrap"} onValueChange={(val) => updateClasses("flexWrap", val === "nowrap" ? "" : `flex-${val}`)}>
                                        <SelectTrigger className="w-[120px] h-7 text-[10px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="nowrap">nowrap</SelectItem>
                                            <SelectItem value="wrap">wrap</SelectItem>
                                            <SelectItem value="wrap-reverse">wrap-reverse</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </PropertyRow>

                                <PropertyRow label="gap">
                                    <PropertySelect
                                        value={gap || "0"}
                                        onChange={(val) => updateClasses("gap", val !== "0" ? `gap-${val}` : "")}
                                        groups={GAP_OPTIONS}
                                        placeholder="0"
                                        searchPlaceholder="Search gap..."
                                        allowCustom={true}
                                    />
                                </PropertyRow>
                            </div>
                        )}

                        <Separator className="my-2" />

                        <div className="space-y-3 pt-2">
                            {/* Margin */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-muted-foreground font-medium">margin</span>
                                    <Tooltip disableHoverableContent>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setMarginExpanded(!marginExpanded)}
                                                className={cn("w-5 h-5 rounded-sm", marginExpanded ? "text-brand" : "text-muted-foreground hover:text-foreground")}
                                            >
                                                {marginExpanded ? <Unlink className="w-3 h-3" /> : <Scan className="w-3 h-3" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="text-xs">
                                            {marginExpanded ? "Link all sides" : "Edit individual sides"}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                {marginExpanded ? (
                                    <div className="grid grid-cols-2 gap-1">
                                        {[
                                            { key: "t", label: "T", value: marginT, conflictGroup: "marginTop", classPrefix: "mt-" },
                                            { key: "r", label: "R", value: marginR, conflictGroup: "marginRight", classPrefix: "mr-" },
                                            { key: "b", label: "B", value: marginB, conflictGroup: "marginBottom", classPrefix: "mb-" },
                                            { key: "l", label: "L", value: marginL, conflictGroup: "marginLeft", classPrefix: "ml-" },
                                        ].map(({ key, label, value, conflictGroup, classPrefix }) => (
                                            <PropertySelect
                                                key={key}
                                                value={value}
                                                onChange={(val) => updateClasses(conflictGroup, val ? `${classPrefix}${val}` : "")}
                                                groups={SPACING_OPTIONS}
                                                placeholder={label}
                                                triggerWidth="w-[56px]"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <PropertySelect
                                        value={parsedClasses.margin?.all || marginT || marginR || marginB || marginL || ""}
                                        onChange={(val) => updateClasses("marginAll", val ? `m-${val}` : "")}
                                        groups={SPACING_OPTIONS}
                                        placeholder="0"
                                    />
                                )}
                            </div>

                            {/* Padding */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-muted-foreground font-medium">padding</span>
                                    <Tooltip disableHoverableContent>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setPaddingExpanded(!paddingExpanded)}
                                                className={cn("w-5 h-5 rounded-sm", paddingExpanded ? "text-brand" : "text-muted-foreground hover:text-foreground")}
                                            >
                                                {paddingExpanded ? <Unlink className="w-3 h-3" /> : <Scan className="w-3 h-3" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="text-xs">
                                            {paddingExpanded ? "Link all sides" : "Edit individual sides"}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                {paddingExpanded ? (
                                    <div className="grid grid-cols-2 gap-1">
                                        {[
                                            { key: "t", label: "T", value: paddingT, conflictGroup: "paddingTop", classPrefix: "pt-" },
                                            { key: "r", label: "R", value: paddingR, conflictGroup: "paddingRight", classPrefix: "pr-" },
                                            { key: "b", label: "B", value: paddingB, conflictGroup: "paddingBottom", classPrefix: "pb-" },
                                            { key: "l", label: "L", value: paddingL, conflictGroup: "paddingLeft", classPrefix: "pl-" },
                                        ].map(({ key, label, value, conflictGroup, classPrefix }) => (
                                            <PropertySelect
                                                key={key}
                                                value={value}
                                                onChange={(val) => updateClasses(conflictGroup, val ? `${classPrefix}${val}` : "")}
                                                groups={SPACING_OPTIONS}
                                                placeholder={label}
                                                triggerWidth="w-[56px]"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <PropertySelect
                                        value={parsedClasses.padding?.all || paddingT || paddingR || paddingB || paddingL || ""}
                                        onChange={(val) => updateClasses("paddingAll", val ? `p-${val}` : "")}
                                        groups={SPACING_OPTIONS}
                                        placeholder="0"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </PropertySection>

                {/* Styles Section */}
                <PropertySection title="Styles">
                    <div className="space-y-4">
                        <PropertyRow label="background">
                            <ColorPicker
                                value={parsedClasses.backgroundColor ? `bg-${parsedClasses.backgroundColor} ${parsedClasses.other.join(" ")}` : ""}
                                onChange={updateBackgroundClasses}
                                label="Background"
                            />
                        </PropertyRow>

                        <PropertyRow label="opacity">
                            <div className="flex items-center gap-2 w-[120px]">
                                <Slider
                                    value={[opacityValue]}
                                    min={0}
                                    max={100}
                                    step={5}
                                    onValueChange={(vals) => setOpacityValue(vals[0])}
                                    onValueCommit={(vals) => updateClasses("opacity", vals[0] !== 100 ? `opacity-${vals[0]}` : "")}
                                    className="flex-1"
                                />
                                <EditableSliderValue value={opacityValue} suffix="%" min={0} max={100} onCommit={(v) => { setOpacityValue(v); updateClasses("opacity", v !== 100 ? `opacity-${v}` : ""); }} />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="mix-blend-mode">
                            <Select onValueChange={(val) => updateClasses("mixBlendMode", val === "normal" ? "" : `mix-blend-${val}`)}>
                                <SelectTrigger className="w-[120px] h-7 text-[10px]">
                                    <SelectValue placeholder="normal" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "difference", "exclusion"].map((val) => (
                                        <SelectItem key={val} value={val}>
                                            {val}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </PropertyRow>

                        <PropertyRow label="cursor">
                            <Select onValueChange={(val) => updateClasses("cursor", val === "default" ? "" : `cursor-${val}`)}>
                                <SelectTrigger className="w-[120px] h-7 text-[10px]">
                                    <SelectValue placeholder="default" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["default", "pointer", "wait", "text", "move", "not-allowed", "grab", "grabbing"].map((val) => (
                                        <SelectItem key={val} value={val}>
                                            {val}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </PropertyRow>
                    </div>
                </PropertySection>

                {/* Typography Section */}
                <PropertySection title="Typography">
                    <div className="space-y-4">
                        <PropertyRow label="font-family">
                            <Select value={fontFamily || "sans"} onValueChange={(val) => updateClasses("fontFamily", `font-${val}`)}>
                                <SelectTrigger className="w-[120px] h-7 text-[10px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sans">Sans</SelectItem>
                                    <SelectItem value="serif">Serif</SelectItem>
                                    <SelectItem value="mono">Mono</SelectItem>
                                </SelectContent>
                            </Select>
                        </PropertyRow>

                        <PropertyRow label="font-weight">
                            <Select value={fontWeight || "normal"} onValueChange={(val) => updateClasses("fontWeight", `font-${val}`)}>
                                <SelectTrigger className="w-[120px] h-7 text-[10px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="thin">Thin</SelectItem>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="semibold">Semibold</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                    <SelectItem value="extrabold">Extra Bold</SelectItem>
                                </SelectContent>
                            </Select>
                        </PropertyRow>

                        <PropertyRow label="font-size">
                            <PropertySelect
                                value={fontSize}
                                onChange={(val) => updateClasses("fontSize", val ? `text-${val}` : "")}
                                groups={FONT_SIZE_OPTIONS}
                                placeholder="base"
                                searchPlaceholder="Search sizes..."
                            />
                        </PropertyRow>

                        <PropertyRow label="line-height">
                            <PropertySelect
                                value={lineHeight}
                                onChange={(val) => updateClasses("lineHeight", val ? `leading-${val}` : "")}
                                groups={LINE_HEIGHT_OPTIONS}
                                placeholder="normal"
                                searchPlaceholder="Search line heights..."
                            />
                        </PropertyRow>

                        <PropertyRow label="color">
                            <ColorPicker value={textColor} onChange={(val) => updateClasses("textColor", val ? `text-${val}` : "")} label="Text Color" />
                        </PropertyRow>

                        <Separator />

                        <PropertyRow label="text-align">
                            <div className="flex bg-muted rounded p-0.5 w-[120px]">
                                {[
                                    { id: "left", icon: AlignLeft, label: "Left" },
                                    { id: "center", icon: AlignCenter, label: "Center" },
                                    { id: "right", icon: AlignRight, label: "Right" },
                                    { id: "justify", icon: AlignJustify, label: "Justify" },
                                ].map(({ id, icon: Icon, label }) => (
                                    <NavIconButton key={id} icon={Icon} tooltip={label} active={textAlign === id} onClick={() => updateClasses("textAlign", `text-${id}`)} />
                                ))}
                            </div>
                        </PropertyRow>

                        <PropertyRow label="font-style">
                            <div className="flex bg-muted rounded p-0.5 w-[120px]">
                                <NavIconButton icon={Bold} tooltip="Bold" active={isBold} onClick={() => updateClasses("fontWeight", isBold ? "font-normal" : "font-bold")} />
                                <NavIconButton
                                    icon={Italic}
                                    tooltip="Italic"
                                    active={isItalic}
                                    onClick={() => updateClasses("fontStyle", isItalic ? "" : "italic")}
                                />
                                <NavIconButton icon={Underline} tooltip="Underline" active={isUnderline} onClick={() => updateClasses("textDecoration", isUnderline ? "" : "underline")} />
                                <NavIconButton
                                    icon={Strikethrough}
                                    tooltip="Strikethrough"
                                    active={isStrikethrough}
                                    onClick={() => updateClasses("textDecoration", isStrikethrough ? "" : "line-through")}
                                />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="text-transform">
                            <div className="flex bg-muted rounded p-0.5 w-[90px]">
                                {[
                                    { id: "uppercase", icon: CaseUpper, label: "Uppercase" },
                                    { id: "lowercase", icon: CaseLower, label: "Lowercase" },
                                    { id: "capitalize", icon: CaseSensitive, label: "Capitalize" },
                                ].map(({ id, icon: Icon, label }) => (
                                    <NavIconButton
                                        key={id}
                                        icon={Icon}
                                        tooltip={label}
                                        active={textTransform === id}
                                        onClick={() => updateClasses("textTransform", textTransform === id ? "normal-case" : id)}
                                    />
                                ))}
                            </div>
                        </PropertyRow>
                    </div>
                </PropertySection>

                {/* Borders Section */}
                <PropertySection title="Borders">
                    <div className="space-y-4">
                        <PropertyRow label="border-width">
                            <PropertySelect
                                value={parsedClasses.borderWidth || ""}
                                onChange={(val) => updateClasses("borderWidth", val === "0" || !val ? "" : val === "1" ? "border" : `border-${val}`)}
                                groups={BORDER_WIDTH_OPTIONS}
                                placeholder="0"
                                searchPlaceholder="Search widths..."
                            />
                        </PropertyRow>

                        <PropertyRow label="border-color">
                            <ColorPicker value={parsedClasses.borderColor || ""} onChange={(val) => updateClasses("borderColor", val ? `border-${val}` : "")} label="Border" />
                        </PropertyRow>

                        <PropertyRow label="border-radius">
                            <PropertySelect
                                value={borderRadius || ""}
                                onChange={(val) => updateClasses("borderRadius", !val || val === "none" ? "" : val === "" ? "rounded" : `rounded-${val}`)}
                                groups={BORDER_RADIUS_OPTIONS}
                                placeholder="none"
                                searchPlaceholder="Search radius..."
                            />
                        </PropertyRow>

                        <PropertyRow label="ring">
                            <div className="flex items-center gap-2">
                                <Select onValueChange={(val) => updateClasses("ringWidth", val === "0" ? "" : val === "1" ? "ring" : `ring-${val}`)}>
                                    <SelectTrigger className="w-[70px] h-7 text-[10px]">
                                        <SelectValue placeholder="0" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["0", "1", "2", "4", "8"].map((val) => (
                                            <SelectItem key={val} value={val}>
                                                {val}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <ColorPicker value={""} onChange={(val) => updateClasses("ringColor", val ? `ring-${val}` : "")} label="Ring" />
                            </div>
                        </PropertyRow>
                         {/* Border Side Toggles */}
                        <PropertyRow label="border-style">
                            <div className="flex bg-muted rounded p-0.5">
                                {[
                                    { id: "all", label: "All" },
                                    { id: "t", label: "T" },
                                    { id: "r", label: "R" },
                                    { id: "b", label: "B" },
                                    { id: "l", label: "L" },
                                ].map(({ id, label }) => {
                                    const isActive = id === "all"
                                        ? rawClasses.includes("border")
                                        : rawClasses.includes(`border-${id}`);
                                    return (
                                        <Tooltip key={id} disableHoverableContent>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => updateClasses("borderWidth", id === "all" ? "border" : `border-${id}`)}
                                                    className={cn(
                                                        "h-6 px-2 text-[9px] font-medium rounded-sm transition-all",
                                                        isActive ? "bg-card text-brand shadow-sm" : "text-muted-foreground hover:text-brand hover:bg-muted/50"
                                                    )}
                                                >
                                                    {label}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="top" className="text-xs">
                                                {id === "all" ? "All sides" : `Border ${label}`}
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </PropertyRow>
                    </div>
                </PropertySection>

                {/* Effects Section */}
                <PropertySection title="Effects">
                    <div className="space-y-4">
                        <PropertyRow label="box-shadow">
                            <Select onValueChange={(val) => updateClasses("boxShadow", val === "none" ? "" : `shadow-${val}`)}>
                                <SelectTrigger className="w-[120px] h-7 text-[10px]">
                                    <SelectValue placeholder="none" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["none", "sm", "md", "lg", "xl", "2xl", "inner"].map((val) => (
                                        <SelectItem key={val} value={val}>
                                            {val}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </PropertyRow>

                        <PropertyRow label="filter: blur">
                            <Select onValueChange={(val) => updateClasses("blur", val === "none" ? "" : `blur-${val}`)}>
                                <SelectTrigger className="w-[120px] h-7 text-[10px]">
                                    <SelectValue placeholder="none" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["none", "sm", "md", "lg", "xl", "2xl", "3xl"].map((val) => (
                                        <SelectItem key={val} value={val}>
                                            {val}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </PropertyRow>

                        <PropertyRow label="backdrop-filter">
                            <Select onValueChange={(val) => updateClasses("backdropBlur", val === "none" ? "" : `backdrop-blur-${val}`)}>
                                <SelectTrigger className="w-[120px] h-7 text-[10px]">
                                    <SelectValue placeholder="none" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["none", "sm", "md", "lg", "xl", "2xl", "3xl"].map((val) => (
                                        <SelectItem key={val} value={val}>
                                            {val}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </PropertyRow>

                        <PropertyRow label="filter: brightness">
                            <div className="flex items-center gap-2 w-[120px]">
                                <Slider
                                    value={[brightnessValue]}
                                    min={0}
                                    max={200}
                                    step={5}
                                    onValueChange={(vals) => setBrightnessValue(vals[0])}
                                    onValueCommit={(vals) => updateClasses("brightness", vals[0] !== 100 ? `brightness-${vals[0]}` : "")}
                                    className="flex-1"
                                />
                                <EditableSliderValue value={brightnessValue} suffix="%" min={0} max={200} onCommit={(v) => { setBrightnessValue(v); updateClasses("brightness", v !== 100 ? `brightness-${v}` : ""); }} />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="filter: contrast">
                            <div className="flex items-center gap-2 w-[120px]">
                                <Slider
                                    value={[contrastValue]}
                                    min={0}
                                    max={200}
                                    step={5}
                                    onValueChange={(vals) => setContrastValue(vals[0])}
                                    onValueCommit={(vals) => updateClasses("contrast", vals[0] !== 100 ? `contrast-${vals[0]}` : "")}
                                    className="flex-1"
                                />
                                <EditableSliderValue value={contrastValue} suffix="%" min={0} max={200} onCommit={(v) => { setContrastValue(v); updateClasses("contrast", v !== 100 ? `contrast-${v}` : ""); }} />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="filter: saturate">
                            <div className="flex items-center gap-2 w-[120px]">
                                <Slider
                                    value={[saturateValue]}
                                    min={0}
                                    max={200}
                                    step={5}
                                    onValueChange={(vals) => setSaturateValue(vals[0])}
                                    onValueCommit={(vals) => updateClasses("saturate", vals[0] !== 100 ? `saturate-${vals[0]}` : "")}
                                    className="flex-1"
                                />
                                <EditableSliderValue value={saturateValue} suffix="%" min={0} max={200} onCommit={(v) => { setSaturateValue(v); updateClasses("saturate", v !== 100 ? `saturate-${v}` : ""); }} />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="filter: hue-rotate">
                            <div className="flex items-center gap-2 w-[120px]">
                                <Slider
                                    value={[hueValue]}
                                    min={0}
                                    max={360}
                                    step={15}
                                    onValueChange={(vals) => setHueValue(vals[0])}
                                    onValueCommit={(vals) => updateClasses("hueRotate", vals[0] !== 0 ? `hue-rotate-${vals[0]}` : "")}
                                    className="flex-1"
                                />
                                <EditableSliderValue value={hueValue} suffix="°" min={0} max={360} onCommit={(v) => { setHueValue(v); updateClasses("hueRotate", v !== 0 ? `hue-rotate-${v}` : ""); }} />
                            </div>
                        </PropertyRow>

                        {/* Filter toggles */}
                        <PropertyRow label="filter">
                            <div className="flex bg-muted rounded p-0.5">
                                <NavIconButton icon={Contrast} tooltip="Grayscale" active={isGrayscale} onClick={() => updateClasses("grayscale", isGrayscale ? "" : "grayscale")} />
                                <NavIconButton icon={Eclipse} tooltip="Invert" active={isInvert} onClick={() => updateClasses("invert", isInvert ? "" : "invert")} />
                                <NavIconButton icon={Sun} tooltip="Sepia" active={isSepia} onClick={() => updateClasses("sepia", isSepia ? "" : "sepia")} />
                            </div>
                        </PropertyRow>
                    </div>
                </PropertySection>

                {/* Transforms Section */}
                <PropertySection title="Transforms">
                    <div className="space-y-4">
                        <PropertyRow label="translate-x">
                            <div className="flex items-center gap-2 w-[120px]">
                                <Input placeholder="0" className="h-7 text-[10px] text-center" onChange={(e) => updateClasses("translateX", e.target.value ? `translate-x-${e.target.value}` : "")} />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="translate-y">
                            <div className="flex items-center gap-2 w-[120px]">
                                <Input placeholder="0" className="h-7 text-[10px] text-center" onChange={(e) => updateClasses("translateY", e.target.value ? `translate-y-${e.target.value}` : "")} />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="rotate">
                            <div className="flex items-center gap-2 w-[120px]">
                                <Slider
                                    value={[rotateValue]}
                                    min={-180}
                                    max={180}
                                    step={15}
                                    onValueChange={(vals) => setRotateValue(vals[0])}
                                    onValueCommit={(vals) => updateClasses("rotate", vals[0] !== 0 ? `rotate-${vals[0]}` : "")}
                                    className="flex-1"
                                />
                                <EditableSliderValue value={rotateValue} suffix="°" min={-180} max={180} onCommit={(v) => { setRotateValue(v); updateClasses("rotate", v !== 0 ? `rotate-${v}` : ""); }} />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="scale">
                            <div className="flex items-center gap-2 w-[120px]">
                                <Slider
                                    value={[scaleValue]}
                                    min={0}
                                    max={200}
                                    step={5}
                                    onValueChange={(vals) => setScaleValue(vals[0])}
                                    onValueCommit={(vals) => updateClasses("scale", vals[0] !== 100 ? `scale-${vals[0]}` : "")}
                                    className="flex-1"
                                />
                                <EditableSliderValue value={scaleValue} suffix="%" min={0} max={200} onCommit={(v) => { setScaleValue(v); updateClasses("scale", v !== 100 ? `scale-${v}` : ""); }} />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="skew-x">
                            <div className="flex items-center gap-2 w-[120px]">
                                <Slider
                                    value={[skewXValue]}
                                    min={-45}
                                    max={45}
                                    step={3}
                                    onValueChange={(vals) => setSkewXValue(vals[0])}
                                    onValueCommit={(vals) => updateClasses("skewX", vals[0] !== 0 ? `skew-x-${vals[0]}` : "")}
                                    className="flex-1"
                                />
                                <EditableSliderValue value={skewXValue} suffix="°" min={-45} max={45} onCommit={(v) => { setSkewXValue(v); updateClasses("skewX", v !== 0 ? `skew-x-${v}` : ""); }} />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="skew-y">
                            <div className="flex items-center gap-2 w-[120px]">
                                <Slider
                                    value={[skewYValue]}
                                    min={-45}
                                    max={45}
                                    step={3}
                                    onValueChange={(vals) => setSkewYValue(vals[0])}
                                    onValueCommit={(vals) => updateClasses("skewY", vals[0] !== 0 ? `skew-y-${vals[0]}` : "")}
                                    className="flex-1"
                                />
                                <EditableSliderValue value={skewYValue} suffix="°" min={-45} max={45} onCommit={(v) => { setSkewYValue(v); updateClasses("skewY", v !== 0 ? `skew-y-${v}` : ""); }} />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="transform-origin">
                            <Select onValueChange={(val) => updateClasses("transformOrigin", val === "center" ? "" : `origin-${val}`)}>
                                <SelectTrigger className="w-[120px] h-7 text-[10px]">
                                    <SelectValue placeholder="center" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left"].map((val) => (
                                        <SelectItem key={val} value={val}>
                                            {val}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </PropertyRow>
                    </div>
                </PropertySection>

                {/* 3D Transforms Section */}
                <PropertySection title="3D Transforms">
                    <div className="space-y-4">
                        <PropertyRow label="rotate-x">
                            <div className="flex items-center gap-2 w-[120px]">
                                <Slider
                                    value={[rotateXValue]}
                                    min={-180}
                                    max={180}
                                    step={15}
                                    onValueChange={(vals) => setRotateXValue(vals[0])}
                                    onValueCommit={(vals) => updateClasses("rotateX3d", vals[0] !== 0 ? `[transform:rotateX(${vals[0]}deg)]` : "")}
                                    className="flex-1"
                                />
                                <EditableSliderValue value={rotateXValue} suffix="°" min={-180} max={180} onCommit={(v) => { setRotateXValue(v); updateClasses("rotateX3d", v !== 0 ? `[transform:rotateX(${v}deg)]` : ""); }} />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="rotate-y">
                            <div className="flex items-center gap-2 w-[120px]">
                                <Slider
                                    value={[rotateYValue]}
                                    min={-180}
                                    max={180}
                                    step={15}
                                    onValueChange={(vals) => setRotateYValue(vals[0])}
                                    onValueCommit={(vals) => updateClasses("rotateY3d", vals[0] !== 0 ? `[transform:rotateY(${vals[0]}deg)]` : "")}
                                    className="flex-1"
                                />
                                <EditableSliderValue value={rotateYValue} suffix="°" min={-180} max={180} onCommit={(v) => { setRotateYValue(v); updateClasses("rotateY3d", v !== 0 ? `[transform:rotateY(${v}deg)]` : ""); }} />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="rotate-z">
                            <div className="flex items-center gap-2 w-[120px]">
                                <Slider
                                    value={[rotateZValue]}
                                    min={-180}
                                    max={180}
                                    step={15}
                                    onValueChange={(vals) => setRotateZValue(vals[0])}
                                    onValueCommit={(vals) => updateClasses("rotateZ3d", vals[0] !== 0 ? `[transform:rotateZ(${vals[0]}deg)]` : "")}
                                    className="flex-1"
                                />
                                <EditableSliderValue value={rotateZValue} suffix="°" min={-180} max={180} onCommit={(v) => { setRotateZValue(v); updateClasses("rotateZ3d", v !== 0 ? `[transform:rotateZ(${v}deg)]` : ""); }} />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="perspective">
                            <Select onValueChange={(val) => updateClasses("perspective", val === "none" ? "" : `[perspective:${val}px]`)}>
                                <SelectTrigger className="w-[120px] h-7 text-[10px]">
                                    <SelectValue placeholder="none" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["none", "100", "200", "500", "800", "1000", "1500"].map((val) => (
                                        <SelectItem key={val} value={val}>
                                            {val === "none" ? "none" : `${val}px`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </PropertyRow>

                        <PropertyRow label="transform-style">
                            <div className="flex bg-muted rounded p-0.5 w-[120px]">
                                <button
                                    onClick={() => updateClasses("transformStyle", hasPreserve3d ? "" : "[transform-style:preserve-3d]")}
                                    className={cn(
                                        "flex-1 flex items-center justify-center py-1 rounded-sm text-[10px] font-medium transition-all",
                                        hasPreserve3d ? "bg-card text-brand shadow-sm" : "text-muted-foreground hover:text-brand hover:bg-muted/50"
                                    )}
                                >
                                    Enable
                                </button>
                                <button
                                    onClick={() => updateClasses("transformStyle", "")}
                                    className={cn(
                                        "flex-1 flex items-center justify-center py-1 rounded-sm text-[10px] font-medium transition-all",
                                        !hasPreserve3d ? "bg-card text-brand shadow-sm" : "text-muted-foreground hover:text-brand hover:bg-muted/50"
                                    )}
                                >
                                    Flat
                                </button>
                            </div>
                        </PropertyRow>

                        <PropertyRow label="backface-visibility">
                            <div className="flex bg-muted rounded p-0.5 w-[120px]">
                                <button
                                    onClick={() => updateClasses("backfaceVisibility", hasBackfaceVisible ? "" : "backface-visible")}
                                    className={cn(
                                        "flex-1 flex items-center justify-center py-1 rounded-sm text-[10px] font-medium transition-all",
                                        hasBackfaceVisible ? "bg-card text-brand shadow-sm" : "text-muted-foreground hover:text-brand hover:bg-muted/50"
                                    )}
                                >
                                    Visible
                                </button>
                                <button
                                    onClick={() => updateClasses("backfaceVisibility", hasBackfaceHidden ? "" : "backface-hidden")}
                                    className={cn(
                                        "flex-1 flex items-center justify-center py-1 rounded-sm text-[10px] font-medium transition-all",
                                        hasBackfaceHidden ? "bg-card text-brand shadow-sm" : "text-muted-foreground hover:text-brand hover:bg-muted/50"
                                    )}
                                >
                                    Hidden
                                </button>
                            </div>
                        </PropertyRow>
                    </div>
                </PropertySection>
            </div>
        </TooltipProvider>
    );
}
