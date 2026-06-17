"use client";

import { CheckIcon, ChevronDown, ChevronDownIcon } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Re-export types and constants from constants.ts for backward compatibility
export type { PropertyOption, PropertyGroup } from "@/lib/constants";
export { SIZING_OPTIONS, GAP_OPTIONS, SPACING_OPTIONS, FONT_SIZE_OPTIONS, LINE_HEIGHT_OPTIONS, BORDER_RADIUS_OPTIONS, BORDER_WIDTH_OPTIONS, GRID_TRACK_OPTIONS } from "@/lib/constants";
import type { PropertyOption, PropertyGroup } from "@/lib/constants";

interface PropertySelectProps {
    /** Current value */
    value: string;
    /** Callback when value changes */
    onChange: (value: string) => void;
    /** Placeholder text when no value is selected */
    placeholder?: string;
    /** Available units for custom values */
    units?: string[];
    /** Default unit for custom numeric values */
    defaultUnit?: string;
    /** Grouped options */
    groups?: PropertyGroup[];
    /** Flat options (if not using groups) */
    options?: PropertyOption[];
    /** Allow custom values */
    allowCustom?: boolean;
    /** Search placeholder */
    searchPlaceholder?: string;
    /** Empty state message */
    emptyMessage?: string;
    /** Width of the trigger button */
    triggerWidth?: string;
    /** Additional className for trigger */
    className?: string;
    /** Hide units picker for non-numeric properties */
    hideUnits?: boolean;
}

export function PropertySelect({
    value,
    onChange,
    placeholder = "Select...",
    units = ["px", "rem", "em", "%", "vh", "vw", "-"],
    defaultUnit = "px",
    groups,
    options,
    allowCustom = true,
    searchPlaceholder = "Search or enter value...",
    emptyMessage = "No matches found.",
    triggerWidth = "w-[120px]",
    className,
    hideUnits = false,
}: PropertySelectProps) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [selectedUnit, setSelectedUnit] = useState(defaultUnit);
    const [showUnitPicker, setShowUnitPicker] = useState(false);

    // Convert flat options to a single group if provided
    const allGroups: PropertyGroup[] = groups || (options ? [{ category: "", items: options }] : []);

    // Get all items flat for searching
    const allItems = allGroups.flatMap((g) => g.items);

    // Find current option - also check for arbitrary values
    const currentOption = allItems.find((item) => item.value === value);

    // Check if value is an arbitrary value (wrapped in brackets)
    const isArbitraryValue = (val: string): boolean => {
        return val?.startsWith("[") && val?.endsWith("]");
    };

    // Get the inner value from arbitrary syntax
    const getArbitraryInner = (val: string): string => {
        if (isArbitraryValue(val)) {
            return val.slice(1, -1);
        }
        return val;
    };

    // Get display value
    const getDisplayValue = () => {
        if (currentOption) {
            return currentOption.label;
        }
        if (value) {
            // If it's an arbitrary value, show it with brackets
            if (isArbitraryValue(value)) {
                return value;
            }
            return value;
        }
        return placeholder;
    };

    // Check if search value is a valid custom value
    const isCustomValue = (val: string): boolean => {
        if (!val.trim()) return false;

        // Check if it's a number
        const numericMatch = val.match(/^-?\d*\.?\d+$/);
        if (numericMatch) return true;

        // Check if it's a number with unit
        const withUnitMatch = val.match(/^-?\d*\.?\d+\s*(px|rem|em|%|vh|vw|vmin|vmax|ch|ex|dvh|dvw|svh|svw|lvh|lvw)$/i);
        if (withUnitMatch) return true;

        // Check special keywords
        const keywords = ["auto", "inherit", "initial", "unset", "none", "normal"];
        if (keywords.includes(val.toLowerCase())) return true;

        return false;
    };

    // Get filtered groups based on search
    const getFilteredGroups = (): PropertyGroup[] => {
        if (!searchValue) return allGroups;

        const lowerSearch = searchValue.toLowerCase();
        return allGroups
            .map((group) => ({
                ...group,
                items: group.items.filter(
                    (item) => item.label.toLowerCase().includes(lowerSearch) || item.value.toLowerCase().includes(lowerSearch) || (item.desc && item.desc.toLowerCase().includes(lowerSearch))
                ),
            }))
            .filter((group) => group.items.length > 0);
    };

    const filteredGroups = getFilteredGroups();
    const hasResults = filteredGroups.some((g) => g.items.length > 0);
    const showCustomOption = allowCustom && searchValue && isCustomValue(searchValue) && !allItems.some((item) => item.value === searchValue || item.label.toLowerCase() === searchValue.toLowerCase());

    // Handle selecting an option
    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue);
        setOpen(false);
        setSearchValue("");
    };

    // Handle custom value - following sizing-input.tsx validation logic
    const handleCustomApply = () => {
        const trimmed = searchValue.trim();
        if (!trimmed) return;

        // Check if it matches a preset option first
        const presetMatch = allItems.find((item) => item.label.toLowerCase() === trimmed.toLowerCase() || item.value.toLowerCase() === trimmed.toLowerCase());
        if (presetMatch) {
            onChange(presetMatch.value);
            setOpen(false);
            setSearchValue("");
            return;
        }

        // Check if it's a value with unit already (like "32px", "1.5rem")
        const valueWithUnitMatch = trimmed.match(/^(-?\d*\.?\d+)([a-z%]+)$/i);
        if (valueWithUnitMatch) {
            const [, val, unit] = valueWithUnitMatch;
            if (["px", "rem", "em", "vh", "vw", "%", "deg", "s", "ms", "vmin", "vmax", "ch", "ex", "dvh", "dvw", "svh", "svw", "lvh", "lvw"].includes(unit.toLowerCase())) {
                onChange(`[${val}${unit}]`);
                setOpen(false);
                setSearchValue("");
                return;
            }
        }

        // Check if it's just a number - append selected unit
        const numericValue = parseFloat(trimmed);
        if (!isNaN(numericValue) && isFinite(Number(trimmed))) {
            const unitToUse = selectedUnit === "-" ? "" : selectedUnit;
            onChange(`[${numericValue}${unitToUse}]`);
            setOpen(false);
            setSearchValue("");
            return;
        }

        // For other valid values (keywords like auto, inherit, etc.) - wrap in brackets
        if (trimmed.length > 0) {
            onChange(`[${trimmed}]`);
            setOpen(false);
            setSearchValue("");
            return;
        }
    };

    // Get the custom value display (what will be output)
    const getCustomValueDisplay = () => {
        const trimmed = searchValue.trim();

        // Check if it's a value with unit already
        const valueWithUnitMatch = trimmed.match(/^(-?\d*\.?\d+)([a-z%]+)$/i);
        if (valueWithUnitMatch) {
            return `[${trimmed}]`;
        }

        // Check if it's just a number
        const numericMatch = trimmed.match(/^-?\d*\.?\d+$/);
        if (numericMatch) {
            const unitToUse = selectedUnit === "-" ? "" : selectedUnit;
            return `[${trimmed}${unitToUse}]`;
        }

        return `[${trimmed}]`;
    };

    // Reset search when closing
    useEffect(() => {
        if (!open) {
            setSearchValue("");
            setShowUnitPicker(false);
        }
    }, [open]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("h-7 justify-between px-2 font-normal text-[10px] bg-background hover:bg-muted/50", triggerWidth, className)}
                >
                    <span className={cn("truncate", !value && "text-muted-foreground")}>{getDisplayValue()}</span>
                    <ChevronDownIcon size={12} className="shrink-0 text-muted-foreground/80 ml-1" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[224px] p-0" style={{ maxHeight: "340px" }}>
                <Command shouldFilter={false}>
                    {/* Custom input row with search + unit picker */}
                    <div className="flex items-center gap-1.5 p-2 border-b border-border">
                        <input
                            type="text"
                            className="flex-1 min-w-0 bg-muted border border-border rounded px-2 py-1.5 text-xs outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 font-mono transition-colors"
                            placeholder={allowCustom ? "Search or enter value..." : "Search..."}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && searchValue.trim() && allowCustom) {
                                    e.preventDefault();
                                    handleCustomApply();
                                }
                            }}
                            autoFocus
                        />

                        {/* Unit picker dropdown */}
                        {allowCustom && !hideUnits && (
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowUnitPicker(!showUnitPicker);
                                    }}
                                    className="w-14 flex items-center justify-between bg-muted border border-border rounded px-1.5 py-1.5 text-[10px] hover:border-muted-foreground hover:bg-muted/80 transition-colors shadow-sm"
                                >
                                    <span className="truncate flex-1 text-center font-medium">{selectedUnit === "-" ? "—" : selectedUnit}</span>
                                    <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0 ml-0.5" />
                                </button>

                                {showUnitPicker && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-[100]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowUnitPicker(false);
                                            }}
                                        />
                                        <div className="absolute right-0 top-full mt-1 w-16 bg-card border border-border rounded-md shadow-xl z-[101] py-1 max-h-40 overflow-y-auto">
                                            {units.map((u) => (
                                                <button
                                                    key={u}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedUnit(u);
                                                        setShowUnitPicker(false);
                                                        // If there's a numeric value, apply with new unit
                                                        const numericValue = parseFloat(searchValue);
                                                        if (!isNaN(numericValue) && isFinite(Number(searchValue))) {
                                                            const unitToUse = u === "-" ? "" : u;
                                                            onChange(`[${numericValue}${unitToUse}]`);
                                                            setOpen(false);
                                                            setSearchValue("");
                                                        }
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-2 py-1 text-[10px] hover:bg-muted hover:text-brand transition-colors block truncate",
                                                        selectedUnit === u ? "text-brand font-semibold bg-muted" : "text-muted-foreground"
                                                    )}
                                                >
                                                    {u === "-" ? "none" : u}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <CommandList className="max-h-[280px]">
                        {!hasResults && !showCustomOption && <CommandEmpty className="py-3 text-xs text-center">{emptyMessage}</CommandEmpty>}

                        {/* Show custom value option when typing something that can be applied */}
                        {allowCustom && showCustomOption && (
                            <CommandGroup heading="Custom">
                                <CommandItem onSelect={handleCustomApply} className="text-xs gap-2">
                                    <span className="font-mono text-brand">{getCustomValueDisplay()}</span>
                                    <span className="text-muted-foreground text-[10px]">Press Enter to apply</span>
                                </CommandItem>
                            </CommandGroup>
                        )}

                        {/* Grouped options */}
                        {filteredGroups.map((group, groupIndex) => (
                            <CommandGroup key={group.category || groupIndex} heading={group.category || undefined}>
                                {group.items.map((item) => (
                                    <CommandItem key={item.value} value={item.value} onSelect={() => handleSelect(item.value)} className="text-xs gap-2">
                                        <span className="flex-1 truncate">{item.label}</span>
                                        {item.desc && <span className="text-[10px] text-muted-foreground font-mono">{item.desc}</span>}
                                        {value === item.value && <CheckIcon size={12} className="text-brand shrink-0" />}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
