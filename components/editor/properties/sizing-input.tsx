import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SizingInputProps {
    label: string;
    placeholder?: string;
    defaultValue?: string;
    unit?: string;
    value?: string;
    onChange?: (value: string) => void;
    // These are now optional - component manages its own state if not provided
    isOpen?: boolean;
    onToggle?: () => void;
    onClose?: () => void;
}

export const SizingInput = ({
    label,
    placeholder,
    defaultValue,
    value: controlledValue,
    unit,
    onChange,
    isOpen: externalIsOpen,
    onToggle: externalOnToggle,
    onClose: externalOnClose,
}: SizingInputProps) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    // Internal open state management
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalOpen;
    const onToggle = externalOnToggle || (() => setInternalOpen((prev) => !prev));
    const onClose = externalOnClose || (() => setInternalOpen(false));

    const setValue = (newValue: string | undefined) => {
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }
        if (onChange && newValue !== undefined) {
            onChange(newValue);
        }
    };
    const [currentUnit, setCurrentUnit] = useState(unit || "px");
    const [customValue, setCustomValue] = useState("");
    const [showUnitPicker, setShowUnitPicker] = useState(false);
    const [filter, setFilter] = useState("");

    const triggerRef = useRef<HTMLDivElement>(null);
    const activeItemRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Comprehensive Tailwind Presets
    const TAILWIND_PRESETS = [
        {
            category: "Containers",
            items: [
                { label: "3xs", value: "16rem", desc: "256px" },
                { label: "2xs", value: "18rem", desc: "288px" },
                { label: "xs", value: "20rem", desc: "320px" },
                { label: "sm", value: "24rem", desc: "384px" },
                { label: "md", value: "28rem", desc: "448px" },
                { label: "lg", value: "32rem", desc: "512px" },
                { label: "xl", value: "36rem", desc: "576px" },
                { label: "2xl", value: "42rem", desc: "672px" },
                { label: "3xl", value: "48rem", desc: "768px" },
                { label: "4xl", value: "56rem", desc: "896px" },
                { label: "5xl", value: "64rem", desc: "1024px" },
                { label: "6xl", value: "72rem", desc: "1152px" },
                { label: "7xl", value: "80rem", desc: "1280px" },
            ],
        },
        {
            category: "Relative",
            items: [
                { label: "Full", value: "100%", desc: "100%" },
                { label: "1/2", value: "50%", desc: "50%" },
                { label: "1/3", value: "33.333333%", desc: "33.3%" },
                { label: "2/3", value: "66.666667%", desc: "66.6%" },
                { label: "1/4", value: "25%", desc: "25%" },
                { label: "3/4", value: "75%", desc: "75%" },
                { label: "Auto", value: "auto", desc: "auto" },
                { label: "None", value: "none", desc: "none" },
                { label: "px", value: "1px", desc: "1px" },
            ],
        },
        {
            category: "Viewport",
            items: [
                { label: "Screen W", value: "100vw", desc: "100vw" },
                { label: "Screen H", value: "100vh", desc: "100vh" },
                { label: "dvw", value: "100dvw", desc: "Dynamic W" },
                { label: "dvh", value: "100dvh", desc: "Dynamic H" },
                { label: "svw", value: "100svw", desc: "Small W" },
                { label: "svh", value: "100svh", desc: "Small H" },
            ],
        },
        {
            category: "Content",
            items: [
                { label: "Min", value: "min-content", desc: "min-content" },
                { label: "Max", value: "max-content", desc: "max-content" },
                { label: "Fit", value: "fit-content", desc: "fit-content" },
            ],
        },
        {
            category: "Spacing Scale",
            items: [
                { label: "0", value: "0px", desc: "0px" },
                { label: "0.5", value: "0.125rem", desc: "2px" },
                { label: "1", value: "0.25rem", desc: "4px" },
                { label: "1.5", value: "0.375rem", desc: "6px" },
                { label: "2", value: "0.5rem", desc: "8px" },
                { label: "3", value: "0.75rem", desc: "12px" },
                { label: "4", value: "1rem", desc: "16px" },
                { label: "6", value: "1.5rem", desc: "24px" },
                { label: "8", value: "2rem", desc: "32px" },
                { label: "12", value: "3rem", desc: "48px" },
                { label: "16", value: "4rem", desc: "64px" },
            ],
        },
    ];

    const units = ["px", "%", "rem", "em", "vh", "vw", "-"];

    const getFilteredPresets = () => {
        if (!filter) return TAILWIND_PRESETS;
        const lowerFilter = filter.toLowerCase();
        return TAILWIND_PRESETS.map((cat) => ({
            ...cat,
            items: cat.items.filter((item) => item.label.toLowerCase().includes(lowerFilter) || item.value.toLowerCase().includes(lowerFilter)),
        })).filter((cat) => cat.items.length > 0);
    };

    const filteredPresets = getFilteredPresets();

    const handlePresetClick = (presetValue: string) => {
        setValue(presetValue);
        onClose();
        setError(false);
    };

    const handleCustomApply = () => {
        const lowerValue = customValue.toLowerCase();
        const presetMatch = TAILWIND_PRESETS.flatMap((c) => c.items).find((i) => i.label.toLowerCase() === lowerValue || i.value.toLowerCase() === lowerValue);

        if (presetMatch) {
            setValue(presetMatch.value);
            onClose();
            setError(false);
            return;
        }

        const valueWithUnitMatch = customValue.match(/^(\d*\.?\d+)([a-z%]+)$/i);
        if (valueWithUnitMatch) {
            const [, val, unit] = valueWithUnitMatch;
            if (["px", "rem", "em", "vh", "vw", "%", "deg", "s", "ms"].includes(unit.toLowerCase())) {
                setValue(customValue);
                onClose();
                setError(false);
                return;
            }
        }

        const numericValue = parseFloat(customValue);
        if (!isNaN(numericValue) && isFinite(Number(customValue))) {
            const unitToUse = currentUnit === "-" ? "" : currentUnit;
            setValue(`${numericValue}${unitToUse}`);
            onClose();
            setError(false);
            return;
        }

        if (customValue.trim().length > 0) {
            setValue(customValue);
            onClose();
            setError(false);
            return;
        }

        setError(true);
        setErrorMessage("Invalid input");
        setTimeout(() => {
            setError(false);
            setErrorMessage("");
        }, 3000);
    };

    const handleToggleOpen = () => {
        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
            setFilter("");
            setCustomValue("");
            setError(false);
        }
        onToggle();
        setShowUnitPicker(false);
    };

    const getDisplayValue = () => {
        if (!value) return placeholder;
        const preset = TAILWIND_PRESETS.flatMap((c) => c.items).find((i) => i.value === value);
        if (preset) return preset.label;

        if (["auto", "min-content", "max-content", "fit-content", "none"].includes(value)) {
            return value;
        }

        return `[${value}]`;
    };

    useEffect(() => {
        if (isOpen) {
            const isPreset = TAILWIND_PRESETS.flatMap((c) => c.items).some((i) => i.value === value) || ["auto", "min-content", "max-content", "fit-content", "none"].includes(value || "");

            if (isPreset) {
                setCustomValue("");
            } else {
                const match = value?.match(/^(\d*\.?\d+)([a-z%]+)$/i);
                if (match) {
                    const [, num, u] = match;
                    setCustomValue(num);
                    if (units.includes(u)) {
                        setCurrentUnit(u);
                    }
                } else if (!isNaN(parseFloat(value || ""))) {
                    setCustomValue(value || "");
                } else {
                    setCustomValue(value || "");
                }
            }
        }
    }, [isOpen, value]);

    useEffect(() => {
        if (isOpen && activeItemRef.current) {
            activeItemRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleMouseDown = (e: MouseEvent) => {
            if (triggerRef.current && triggerRef.current.contains(e.target as Node)) return;
            if (popupRef.current && popupRef.current.contains(e.target as Node)) return;
            onClose();
        };

        document.addEventListener("mousedown", handleMouseDown);
        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, [isOpen, onClose]);

    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-muted-foreground font-medium pl-1 select-none">{label}</span>
            <div className="relative z-[50]" ref={triggerRef}>
                <div
                    onClick={handleToggleOpen}
                    className={cn(
                        "flex items-center justify-between bg-card border rounded-md shadow-sm transition-all h-8 cursor-pointer select-none px-3 hover:bg-muted/20",
                        isOpen ? "border-brand ring-1 ring-brand/10" : "border-border hover:border-muted-foreground/50"
                    )}
                >
                    <div className="text-xs font-mono text-foreground overflow-x-auto whitespace-nowrap w-full">{getDisplayValue()}</div>
                </div>
            </div>

            {isOpen &&
                createPortal(
                    <div
                        ref={popupRef}
                        className="fixed z-[9999] bg-card border border-border rounded-lg shadow-xl p-2 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-2 w-56 accent-orange-500"
                        style={{
                            top: coords.top,
                            left: coords.left - (224 - coords.width),
                            maxHeight: "400px",
                        }}
                    >
                        <div className="relative">
                            <div className="flex items-center gap-1.5 shrink-0">
                                <input
                                    type="text"
                                    className={cn(
                                        "flex-1 min-w-0 bg-muted border rounded px-2 py-1.5 text-xs outline-none focus:ring-1 font-mono transition-colors",
                                        error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-600" : "border-border focus:border-brand focus:ring-brand/20"
                                    )}
                                    placeholder="Value or search..."
                                    value={customValue}
                                    onChange={(e) => {
                                        setCustomValue(e.target.value);
                                        setFilter(e.target.value);
                                        setError(false);
                                    }}
                                    onKeyDown={(e) => e.key === "Enter" && handleCustomApply()}
                                    autoFocus
                                />

                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowUnitPicker(!showUnitPicker);
                                        }}
                                        className="w-14 flex items-center justify-between bg-muted border border-border rounded px-1.5 py-1.5 text-[10px] hover:border-muted-foreground hover:bg-muted/80 transition-colors shadow-sm"
                                    >
                                        <span className="truncate flex-1 text-center font-medium">{currentUnit}</span>
                                        <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0 ml-1" />
                                    </button>

                                    {showUnitPicker && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-[10000]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowUnitPicker(false);
                                                }}
                                            />
                                            <div className="absolute right-0 top-full mt-1 w-20 bg-card border border-border rounded-md shadow-xl z-[10001] py-1 max-h-40 overflow-y-auto custom-scrollbar">
                                                {units.map((u) => (
                                                    <button
                                                        key={u}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCurrentUnit(u);
                                                            setShowUnitPicker(false);
                                                            const numericValue = parseFloat(customValue);
                                                            if (!isNaN(numericValue) && isFinite(Number(customValue))) {
                                                                const unitToUse = u === "-" ? "" : u;
                                                                setValue(`${numericValue}${unitToUse}`);
                                                            }
                                                        }}
                                                        className={cn(
                                                            "w-full text-left px-3 py-1.5 text-[10px] hover:bg-muted hover:text-brand transition-colors block truncate",
                                                            currentUnit === u ? "text-brand font-semibold bg-muted" : "text-muted-foreground"
                                                        )}
                                                    >
                                                        {u}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <div className="absolute top-full left-0 mt-1 w-full bg-red-50 text-red-600 text-[10px] px-2 py-1 rounded border border-red-200 shadow-sm animate-in fade-in slide-in-from-top-1 z-20 font-medium">
                                    {errorMessage || "Invalid input"}
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-border w-full shrink-0"></div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 min-h-0">
                            {filteredPresets.map((category) => (
                                <div key={category.category}>
                                    <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-1 sticky top-0 bg-card/90 backdrop-blur-sm py-1 z-10">
                                        {category.category}
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        {category.items.map((item) => (
                                            <button
                                                key={item.label}
                                                ref={value === item.value ? activeItemRef : null}
                                                onClick={() => handlePresetClick(item.value)}
                                                className={cn(
                                                    "w-full text-left px-2 py-1.5 text-[10px] rounded transition-colors truncate flex items-center justify-between group",
                                                    value === item.value ? "bg-muted text-brand font-medium" : "hover:bg-muted hover:text-brand text-muted-foreground"
                                                )}
                                            >
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <span className={cn("group-hover:text-brand", value === item.value ? "text-brand" : "text-foreground")}>{item.label}</span>
                                                    <span className="text-muted-foreground text-[9px] truncate">{item.desc}</span>
                                                </div>
                                                <span className={cn("font-mono text-[9px] group-hover:text-brand/70 shrink-0 ml-2", value === item.value ? "text-brand/70" : "text-muted-foreground")}>
                                                    {item.value}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {filteredPresets.length === 0 && <div className="px-2 py-4 text-center text-[10px] text-gray-400">No presets found</div>}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};
