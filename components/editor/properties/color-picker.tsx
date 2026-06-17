import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
    Check,
    ChevronDown,
    Loader2,
    Palette,
    Trash2,
    Plus,
    ArrowDown,
    ArrowRight,
    ArrowUp,
    ArrowLeft,
    CornerRightDown,
    CornerRightUp,
    CornerLeftDown,
    CornerLeftUp,
    Circle,
    Maximize,
    ChevronLeft,
    ChevronRight,
    GripVertical,
    X,
    Code,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

// --- Constants ---

const TAILWIND_COLORS: Record<string, string> = {
    transparent: "transparent",
    white: "#ffffff",
    black: "#000000",
    "slate-50": "#f8fafc",
    "slate-100": "#f1f5f9",
    "slate-200": "#e2e8f0",
    "slate-300": "#cbd5e1",
    "slate-400": "#94a3b8",
    "slate-500": "#64748b",
    "slate-600": "#475569",
    "slate-700": "#334155",
    "slate-800": "#1e293b",
    "slate-900": "#0f172a",
    "gray-50": "#f9fafb",
    "gray-100": "#f3f4f6",
    "gray-200": "#e5e7eb",
    "gray-300": "#d1d5db",
    "gray-400": "#9ca3af",
    "gray-500": "#6b7280",
    "gray-600": "#4b5563",
    "gray-700": "#374151",
    "gray-800": "#1f2937",
    "gray-900": "#111827",
    "zinc-50": "#fafafa",
    "zinc-100": "#f4f4f5",
    "zinc-200": "#e4e4e7",
    "zinc-300": "#d4d4d8",
    "zinc-400": "#a1a1aa",
    "zinc-500": "#71717a",
    "zinc-600": "#52525b",
    "zinc-700": "#3f3f46",
    "zinc-800": "#27272a",
    "zinc-900": "#18181b",
    "neutral-50": "#fafafa",
    "neutral-100": "#f5f5f5",
    "neutral-200": "#e5e5e5",
    "neutral-300": "#d4d4d4",
    "neutral-400": "#a3a3a3",
    "neutral-500": "#737373",
    "neutral-600": "#525252",
    "neutral-700": "#404040",
    "neutral-800": "#262626",
    "neutral-900": "#171717",
    "stone-50": "#fafaf9",
    "stone-100": "#f5f5f4",
    "stone-200": "#e7e5e4",
    "stone-300": "#d6d3d1",
    "stone-400": "#a8a29e",
    "stone-500": "#78716c",
    "stone-600": "#57534e",
    "stone-700": "#44403c",
    "stone-800": "#292524",
    "stone-900": "#1c1917",
    "red-50": "#fef2f2",
    "red-100": "#fee2e2",
    "red-200": "#fecaca",
    "red-300": "#fca5a5",
    "red-400": "#f87171",
    "red-500": "#ef4444",
    "red-600": "#dc2626",
    "red-700": "#b91c1c",
    "red-800": "#991b1b",
    "red-900": "#7f1d1d",
    "orange-50": "#fff7ed",
    "orange-100": "#ffedd5",
    "orange-200": "#fed7aa",
    "orange-300": "#fdba74",
    "orange-400": "#fb923c",
    "orange-500": "#f97316",
    "orange-600": "#ea580c",
    "orange-700": "#c2410c",
    "orange-800": "#9a3412",
    "orange-900": "#7c2d12",
    "amber-50": "#fffbeb",
    "amber-100": "#fef3c7",
    "amber-200": "#fde68a",
    "amber-300": "#fcd34d",
    "amber-400": "#fbbf24",
    "amber-500": "#f59e0b",
    "amber-600": "#d97706",
    "amber-700": "#b45309",
    "amber-800": "#92400e",
    "amber-900": "#78350f",
    "yellow-50": "#fefce8",
    "yellow-100": "#fef9c3",
    "yellow-200": "#fef08a",
    "yellow-300": "#fde047",
    "yellow-400": "#facc15",
    "yellow-500": "#eab308",
    "yellow-600": "#ca8a04",
    "yellow-700": "#a16207",
    "yellow-800": "#854d0e",
    "yellow-900": "#713f12",
    "lime-50": "#f7fee7",
    "lime-100": "#ecfccb",
    "lime-200": "#d9f99d",
    "lime-300": "#bef264",
    "lime-400": "#a3e635",
    "lime-500": "#84cc16",
    "lime-600": "#65a30d",
    "lime-700": "#4d7c0f",
    "lime-800": "#3f6212",
    "lime-900": "#365314",
    "green-50": "#f0fdf4",
    "green-100": "#dcfce7",
    "green-200": "#bbf7d0",
    "green-300": "#86efac",
    "green-400": "#4ade80",
    "green-500": "#22c55e",
    "green-600": "#16a34a",
    "green-700": "#15803d",
    "green-800": "#166534",
    "green-900": "#14532d",
    "emerald-50": "#ecfdf5",
    "emerald-100": "#d1fae5",
    "emerald-200": "#a7f3d0",
    "emerald-300": "#6ee7b7",
    "emerald-400": "#34d399",
    "emerald-500": "#10b981",
    "emerald-600": "#059669",
    "emerald-700": "#047857",
    "emerald-800": "#065f46",
    "emerald-900": "#064e3b",
    "teal-50": "#f0fdfa",
    "teal-100": "#ccfbf1",
    "teal-200": "#99f6e4",
    "teal-300": "#5eead4",
    "teal-400": "#2dd4bf",
    "teal-500": "#14b8a6",
    "teal-600": "#0d9488",
    "teal-700": "#0f766e",
    "teal-800": "#115e59",
    "teal-900": "#134e4a",
    "cyan-50": "#ecfeff",
    "cyan-100": "#cffafe",
    "cyan-200": "#a5f3fc",
    "cyan-300": "#67e8f9",
    "cyan-400": "#22d3ee",
    "cyan-500": "#06b6d4",
    "cyan-600": "#0891b2",
    "cyan-700": "#0e7490",
    "cyan-800": "#155e75",
    "cyan-900": "#164e63",
    "sky-50": "#f0f9ff",
    "sky-100": "#e0f2fe",
    "sky-200": "#bae6fd",
    "sky-300": "#7dd3fc",
    "sky-400": "#38bdf8",
    "sky-500": "#0ea5e9",
    "sky-600": "#0284c7",
    "sky-700": "#0369a1",
    "sky-800": "#075985",
    "sky-900": "#0c4a6e",
    "blue-50": "#eff6ff",
    "blue-100": "#dbeafe",
    "blue-200": "#bfdbfe",
    "blue-300": "#93c5fd",
    "blue-400": "#60a5fa",
    "blue-500": "#3b82f6",
    "blue-600": "#2563eb",
    "blue-700": "#1d4ed8",
    "blue-800": "#1e40af",
    "blue-900": "#1e3a8a",
    "indigo-50": "#eef2ff",
    "indigo-100": "#e0e7ff",
    "indigo-200": "#c7d2fe",
    "indigo-300": "#a5b4fc",
    "indigo-400": "#818cf8",
    "indigo-500": "#6366f1",
    "indigo-600": "#4f46e5",
    "indigo-700": "#4338ca",
    "indigo-800": "#3730a3",
    "indigo-900": "#312e81",
    "violet-50": "#f5f3ff",
    "violet-100": "#ede9fe",
    "violet-200": "#ddd6fe",
    "violet-300": "#c4b5fd",
    "violet-400": "#a78bfa",
    "violet-500": "#8b5cf6",
    "violet-600": "#7c3aed",
    "violet-700": "#6d28d9",
    "violet-800": "#5b21b6",
    "violet-900": "#4c1d95",
    "purple-50": "#faf5ff",
    "purple-100": "#f3e8ff",
    "purple-200": "#e9d5ff",
    "purple-300": "#d8b4fe",
    "purple-400": "#c084fc",
    "purple-500": "#a855f7",
    "purple-600": "#9333ea",
    "purple-700": "#7e22ce",
    "purple-800": "#6b21a8",
    "purple-900": "#581c87",
    "fuchsia-50": "#fdf4ff",
    "fuchsia-100": "#fae8ff",
    "fuchsia-200": "#f5d0fe",
    "fuchsia-300": "#f0abfc",
    "fuchsia-400": "#e879f9",
    "fuchsia-500": "#d946ef",
    "fuchsia-600": "#c026d3",
    "fuchsia-700": "#a21caf",
    "fuchsia-800": "#86198f",
    "fuchsia-900": "#701a75",
    "pink-50": "#fdf2f8",
    "pink-100": "#fce7f3",
    "pink-200": "#fbcfe8",
    "pink-300": "#f9a8d4",
    "pink-400": "#f472b6",
    "pink-500": "#ec4899",
    "pink-600": "#db2777",
    "pink-700": "#be185d",
    "pink-800": "#9d174d",
    "pink-900": "#831843",
    "rose-50": "#fff1f2",
    "rose-100": "#ffe4e6",
    "rose-200": "#fecdd3",
    "rose-300": "#fda4af",
    "rose-400": "#fb7185",
    "rose-500": "#f43f5e",
    "rose-600": "#e11d48",
    "rose-700": "#be123c",
    "rose-800": "#9f1239",
    "rose-900": "#881337",
};

const COLOR_FAMILIES = [
    { name: "Base", colors: ["transparent", "white", "black"] },
    { name: "Slate", colors: ["slate-50", "slate-100", "slate-200", "slate-300", "slate-400", "slate-500", "slate-600", "slate-700", "slate-800", "slate-900"] },
    { name: "Gray", colors: ["gray-50", "gray-100", "gray-200", "gray-300", "gray-400", "gray-500", "gray-600", "gray-700", "gray-800", "gray-900"] },
    { name: "Zinc", colors: ["zinc-50", "zinc-100", "zinc-200", "zinc-300", "zinc-400", "zinc-500", "zinc-600", "zinc-700", "zinc-800", "zinc-900"] },
    { name: "Neutral", colors: ["neutral-50", "neutral-100", "neutral-200", "neutral-300", "neutral-400", "neutral-500", "neutral-600", "neutral-700", "neutral-800", "neutral-900"] },
    { name: "Stone", colors: ["stone-50", "stone-100", "stone-200", "stone-300", "stone-400", "stone-500", "stone-600", "stone-700", "stone-800", "stone-900"] },
    { name: "Red", colors: ["red-50", "red-100", "red-200", "red-300", "red-400", "red-500", "red-600", "red-700", "red-800", "red-900"] },
    { name: "Orange", colors: ["orange-50", "orange-100", "orange-200", "orange-300", "orange-400", "orange-500", "orange-600", "orange-700", "orange-800", "orange-900"] },
    { name: "Amber", colors: ["amber-50", "amber-100", "amber-200", "amber-300", "amber-400", "amber-500", "amber-600", "amber-700", "amber-800", "amber-900"] },
    { name: "Yellow", colors: ["yellow-50", "yellow-100", "yellow-200", "yellow-300", "yellow-400", "yellow-500", "yellow-600", "yellow-700", "yellow-800", "yellow-900"] },
    { name: "Lime", colors: ["lime-50", "lime-100", "lime-200", "lime-300", "lime-400", "lime-500", "lime-600", "lime-700", "lime-800", "lime-900"] },
    { name: "Green", colors: ["green-50", "green-100", "green-200", "green-300", "green-400", "green-500", "green-600", "green-700", "green-800", "green-900"] },
    { name: "Emerald", colors: ["emerald-50", "emerald-100", "emerald-200", "emerald-300", "emerald-400", "emerald-500", "emerald-600", "emerald-700", "emerald-800", "emerald-900"] },
    { name: "Teal", colors: ["teal-50", "teal-100", "teal-200", "teal-300", "teal-400", "teal-500", "teal-600", "teal-700", "teal-800", "teal-900"] },
    { name: "Cyan", colors: ["cyan-50", "cyan-100", "cyan-200", "cyan-300", "cyan-400", "cyan-500", "cyan-600", "cyan-700", "cyan-800", "cyan-900"] },
    { name: "Sky", colors: ["sky-50", "sky-100", "sky-200", "sky-300", "sky-400", "sky-500", "sky-600", "sky-700", "sky-800", "sky-900"] },
    { name: "Blue", colors: ["blue-50", "blue-100", "blue-200", "blue-300", "blue-400", "blue-500", "blue-600", "blue-700", "blue-800", "blue-900"] },
    { name: "Indigo", colors: ["indigo-50", "indigo-100", "indigo-200", "indigo-300", "indigo-400", "indigo-500", "indigo-600", "indigo-700", "indigo-800", "indigo-900"] },
    { name: "Violet", colors: ["violet-50", "violet-100", "violet-200", "violet-300", "violet-400", "violet-500", "violet-600", "violet-700", "violet-800", "violet-900"] },
    { name: "Purple", colors: ["purple-50", "purple-100", "purple-200", "purple-300", "purple-400", "purple-500", "purple-600", "purple-700", "purple-800", "purple-900"] },
    { name: "Fuchsia", colors: ["fuchsia-50", "fuchsia-100", "fuchsia-200", "fuchsia-300", "fuchsia-400", "fuchsia-500", "fuchsia-600", "fuchsia-700", "fuchsia-800", "fuchsia-900"] },
    { name: "Pink", colors: ["pink-50", "pink-100", "pink-200", "pink-300", "pink-400", "pink-500", "pink-600", "pink-700", "pink-800", "pink-900"] },
    { name: "Rose", colors: ["rose-50", "rose-100", "rose-200", "rose-300", "rose-400", "rose-500", "rose-600", "rose-700", "rose-800", "rose-900"] },
];

const LINEAR_PRESETS = [
    "from-slate-900 to-slate-700",
    "from-slate-500 to-slate-800",
    "from-zinc-900 to-zinc-700",
    "from-neutral-800 to-neutral-600",
    "from-stone-900 to-stone-700",
    "from-red-500 to-orange-500",
    "from-rose-400 to-red-500",
    "from-orange-500 to-yellow-500",
    "from-amber-200 to-yellow-500",
    "from-lime-400 to-lime-500",
    "from-green-400 to-emerald-600",
    "from-emerald-400 to-cyan-400",
    "from-teal-400 to-yellow-200",
    "from-cyan-500 to-blue-500",
    "from-sky-400 to-blue-800",
    "from-blue-600 to-violet-600",
    "from-indigo-500 to-purple-500",
    "from-violet-200 to-pink-200",
    "from-purple-500 to-pink-500",
    "from-fuchsia-500 to-pink-500",
    "from-pink-500 to-rose-500",
    "from-indigo-400 to-cyan-400",
    "from-orange-500 to-red-500",
    "from-blue-800 to-indigo-900",
];
const GRADIENT_PAGES_SIZE = 12; // 6x2 grid

const GRADIENT_DIRECTIONS: { id: string; label: string; icon: any; cssDirection: string }[] = [
    { id: "t", label: "Bottom to Top", icon: ArrowUp, cssDirection: "to top" },
    { id: "tr", label: "Bottom Left to Top Right", icon: CornerRightUp, cssDirection: "to top right" },
    { id: "r", label: "Left to Right", icon: ArrowRight, cssDirection: "to right" },
    { id: "br", label: "Top Left to Bottom Right", icon: CornerLeftDown, cssDirection: "to bottom right" },
    { id: "b", label: "Top to Bottom", icon: ArrowDown, cssDirection: "to bottom" },
    { id: "bl", label: "Top Right to Bottom Left", icon: CornerRightDown, cssDirection: "to bottom left" },
    { id: "l", label: "Right to Left", icon: ArrowLeft, cssDirection: "to left" },
    { id: "tl", label: "Bottom Right to Top Left", icon: CornerLeftUp, cssDirection: "to top left" },
];

const RADIAL_POSITIONS = ["tl", "t", "tr", "l", "c", "r", "bl", "b", "br"];

// For Tailwind v4 arbitrary values, spaces become underscores: [at_top_left]
const RADIAL_POSITION_MAP: Record<string, string> = {
    tl: "at_top_left",
    t: "at_top",
    tr: "at_top_right",
    l: "at_left",
    c: "at_center",
    r: "at_right",
    bl: "at_bottom_left",
    b: "at_bottom",
    br: "at_bottom_right",
};

// For CSS preview (with spaces)
const RADIAL_POSITION_CSS_MAP: Record<string, string> = {
    tl: "at top left",
    t: "at top",
    tr: "at top right",
    l: "at left",
    c: "at center",
    r: "at right",
    bl: "at bottom left",
    b: "at bottom",
    br: "at bottom right",
};

// --- Helper Functions ---

const getHexColor = (colorName: string): string => {
    if (!colorName) return "transparent";
    if (colorName.startsWith("#")) return colorName;
    if (colorName.startsWith("[") && colorName.endsWith("]")) {
        return colorName.slice(1, -1);
    }
    return TAILWIND_COLORS[colorName] || colorName;
};

// Reverse lookup: get Tailwind color name from hex value
const HEX_TO_TAILWIND: Record<string, string> = Object.entries(TAILWIND_COLORS).reduce(
    (acc, [name, hex]) => {
        if (hex !== "transparent") {
            acc[hex.toLowerCase()] = name;
        }
        return acc;
    },
    {} as Record<string, string>
);

const getTailwindColorName = (hexOrName: string): string => {
    if (!hexOrName) return "";
    // If already a tailwind name, return it
    if (TAILWIND_COLORS[hexOrName]) return hexOrName;
    // Check if it's a hex and find matching tailwind color
    const hex = hexOrName.toLowerCase();
    return HEX_TO_TAILWIND[hex] || hexOrName;
};

const getPreviewStyle = (colorName: string): React.CSSProperties => {
    if (colorName === "transparent") {
        return {
            background: "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)",
            backgroundSize: "8px 8px",
            backgroundPosition: "0 0, 4px 4px",
            backgroundColor: "white",
        };
    }
    return { backgroundColor: getHexColor(colorName) };
};

// --- Recently Used Colors Store ---
const MAX_RECENT_COLORS = 20; // 2 rows of 10
let recentColors: string[] = [];

const addRecentColor = (color: string) => {
    if (!color || color === "transparent") return;
    // Remove if already exists
    recentColors = recentColors.filter((c) => c !== color);
    // Add to front
    recentColors.unshift(color);
    // Limit size
    if (recentColors.length > MAX_RECENT_COLORS) {
        recentColors = recentColors.slice(0, MAX_RECENT_COLORS);
    }
};

const getRecentColors = () => recentColors;

// --- Shared ColorGrid Component ---
interface ColorGridProps {
    value: string;
    onChange: (color: string) => void;
    codeColors?: string[];
    size?: "sm" | "md";
}

const ColorGrid = ({ value, onChange, codeColors = [], size = "md" }: ColorGridProps) => {
    const recent = getRecentColors();
    const sizeClass = size === "sm" ? "w-5 h-5" : "w-6 h-6";

    const handleColorClick = (colorName: string) => {
        addRecentColor(colorName);
        onChange(colorName);
    };

    // Filter code colors to remove duplicates and empty values
    const uniqueCodeColors = [...new Set(codeColors.filter((c) => c && c !== "transparent" && !recent.includes(c)))];

    return (
        <div className="space-y-3">
            {/* Recently Used */}
            {recent.length > 0 && (
                <div>
                    <div className="text-[9px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Recently Used</div>
                    <div className="grid grid-cols-10 gap-1">
                        {recent.map((colorName) => (
                            <Tooltip key={`recent-${colorName}`} disableHoverableContent>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => handleColorClick(colorName)}
                                        className={cn(
                                            sizeClass,
                                            "rounded-full border border-border/50 shadow-sm hover:scale-110 hover:z-10 transition-all duration-150",
                                            value === colorName && "ring-2 ring-brand ring-offset-1 ring-offset-background scale-110 z-10"
                                        )}
                                        style={getPreviewStyle(colorName)}
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-[10px]">
                                    {colorName}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            )}

            {/* Colors from Code */}
            {uniqueCodeColors.length > 0 && (
                <div>
                    <div className="text-[9px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">From Code</div>
                    <div className="grid grid-cols-10 gap-1">
                        {uniqueCodeColors.slice(0, 10).map((colorName) => (
                            <Tooltip key={`code-${colorName}`} disableHoverableContent>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => handleColorClick(colorName)}
                                        className={cn(
                                            sizeClass,
                                            "rounded-full border border-border/50 shadow-sm hover:scale-110 hover:z-10 transition-all duration-150",
                                            value === colorName && "ring-2 ring-brand ring-offset-1 ring-offset-background scale-110 z-10"
                                        )}
                                        style={getPreviewStyle(colorName)}
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-[10px]">
                                    {colorName}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            )}

            {/* Color Families */}
            {COLOR_FAMILIES.map((family) => (
                <div key={family.name}>
                    <div className="text-[9px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">{family.name}</div>
                    <div className="grid grid-cols-10 gap-1">
                        {family.colors.map((colorName) => (
                            <Tooltip key={colorName} disableHoverableContent>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => handleColorClick(colorName)}
                                        className={cn(
                                            sizeClass,
                                            "rounded-full border border-border/50 shadow-sm hover:scale-110 hover:z-10 transition-all duration-150",
                                            value === colorName && "ring-2 ring-brand ring-offset-1 ring-offset-background scale-110 z-10"
                                        )}
                                        style={getPreviewStyle(colorName)}
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-[10px]">
                                    {colorName}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Generate unique ID for gradient stops
const generateStopId = () => `stop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// --- Types ---

interface GradientStop {
    id: "from" | "via" | "to" | string;
    color: string;
    opacity: string;
    enabled: boolean;
}

interface GradientState {
    type: "solid" | "linear" | "radial" | "conic";
    color: string; // For solid
    direction: string; // linear: t, tr, r, br, b, bl, l, tl
    position: string; // radial: tl, t, tr, l, c, r, bl, b, br
    angle: number; // conic: 0-360
    stops: GradientStop[]; // from/via/to + extra stops
}

// --- Sub-components ---

interface GradientPresetsProps {
    presets: string[];
    onSelect: (val: string) => void;
    type: "linear" | "radial" | "conic";
    direction?: string;
    position?: string;
    angle?: number;
}

const GradientPresets = ({ presets, onSelect, type, direction = "r", position = "c", angle = 0 }: GradientPresetsProps) => {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(presets.length / GRADIENT_PAGES_SIZE);

    const currentPresets = presets.slice(page * GRADIENT_PAGES_SIZE, (page + 1) * GRADIENT_PAGES_SIZE);

    // Get CSS direction string based on current settings (for visual preview)
    const getCssGradientStyle = (from: string, to: string): string => {
        if (type === "linear") {
            const dirObj = GRADIENT_DIRECTIONS.find((d) => d.id === direction);
            const cssDir = dirObj?.cssDirection || "to right";
            return `linear-gradient(${cssDir}, ${from}, ${to})`;
        } else if (type === "radial") {
            const pos = RADIAL_POSITION_CSS_MAP[position] || "at center";
            return `radial-gradient(circle ${pos}, ${from}, ${to})`;
        } else {
            return `conic-gradient(from ${angle}deg, ${from}, ${to})`;
        }
    };

    return (
        <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between px-1">
                <span className="text-[10px] text-muted-foreground font-medium capitalize">{type} Gradients</span>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                        <ChevronLeft className="w-3 h-3" />
                    </Button>
                    <span className="text-[10px] text-muted-foreground font-mono">
                        {page + 1} / {totalPages}
                    </span>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>
                        <ChevronRight className="w-3 h-3" />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-6 gap-2">
                {currentPresets.map((preset) => {
                    // Parse preset for preview - format: "from-{color} to-{color}"
                    const parts = preset.split(" ");
                    const fromColor = parts[0]?.replace("from-", "") || "";
                    const toColor = parts[1]?.replace("to-", "") || "";
                    const from = getHexColor(fromColor);
                    const to = getHexColor(toColor);

                    const bgStyle = getCssGradientStyle(from, to);

                    return (
                        <button
                            key={preset}
                            onClick={() => onSelect(preset)}
                            className="w-8 h-8 rounded-full border border-border/30 hover:scale-110 transition-transform shadow-sm"
                            style={{ background: bgStyle }}
                            title={`${fromColor} → ${toColor}`}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const SolidColorGrid = ({ value, onChange, codeColors = [] }: { value: string; onChange: (val: string) => void; codeColors?: string[] }) => {
    const [customColor, setCustomColor] = useState("");

    const handleColorChange = (color: string) => {
        addRecentColor(color);
        onChange(color);
    };

    return (
        <div className="flex flex-col h-full w-full min-h-0">
            <ScrollArea className="flex-1 min-h-0">
                <div className="p-3">
                    <ColorGrid value={value} onChange={handleColorChange} codeColors={codeColors} size="md" />
                </div>
            </ScrollArea>
            <div className="p-3 border-t border-border space-y-2 bg-popover/50 shrink-0">
                <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Custom Color</div>
                <div className="flex gap-2">
                    <Tooltip disableHoverableContent>
                        <TooltipTrigger asChild>
                            <div className="relative group">
                                <input
                                    type="color"
                                    value={customColor.startsWith("#") ? customColor : "#000000"}
                                    onChange={(e) => setCustomColor(e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer opacity-0 absolute inset-0 z-10"
                                />
                                <div className="w-8 h-8 rounded border border-border shadow-sm group-hover:border-brand/50 transition-colors" style={{ backgroundColor: customColor || "#000000" }} />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-[10px]">
                            Pick custom color
                        </TooltipContent>
                    </Tooltip>
                    <Input value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="h-8 text-[10px] font-mono flex-1" placeholder="#000000" />
                    <Button
                        size="sm"
                        className="h-8 text-[10px] px-3"
                        onClick={() => {
                            if (customColor) {
                                addRecentColor(customColor);
                                onChange(`[${customColor}]`);
                            }
                        }}
                    >
                        Apply
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Color picker popover for individual stop colors - uses shared ColorGrid
const StopColorPicker = ({ color, onChange, codeColors = [] }: { color: string; onChange: (color: string) => void; codeColors?: string[] }) => {
    const [customColor, setCustomColor] = useState(color.startsWith("#") ? color : "#000000");

    const handleColorChange = (newColor: string) => {
        addRecentColor(newColor);
        onChange(newColor);
    };

    return (
        <PopoverContent className="w-[280px] p-0" side="left" sideOffset={8} align="start" collisionPadding={16}>
            <div className="flex flex-col h-[360px]">
                {/* Custom color input - always visible at top */}
                <div className="px-3 py-2 border-b border-border/50 bg-muted/30 flex gap-2 shrink-0">
                    <div className="relative group shrink-0">
                        <input
                            type="color"
                            value={customColor.startsWith("#") ? customColor : "#000000"}
                            onChange={(e) => setCustomColor(e.target.value)}
                            className="w-7 h-7 rounded cursor-pointer opacity-0 absolute inset-0 z-10"
                        />
                        <div className="w-7 h-7 rounded border border-border shadow-sm group-hover:border-brand/50 transition-colors" style={{ backgroundColor: customColor || "#000000" }} />
                    </div>
                    <Input
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="h-7 text-[10px] font-mono flex-1 min-w-0"
                        placeholder="#ff75c3"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && customColor) {
                                addRecentColor(customColor);
                                onChange(customColor);
                            }
                        }}
                    />
                    <Button
                        size="sm"
                        className="h-7 text-[10px] px-3 shrink-0"
                        onClick={() => {
                            if (customColor) {
                                addRecentColor(customColor);
                                onChange(customColor);
                            }
                        }}
                    >
                        Apply
                    </Button>
                </div>

                {/* Color grid with ScrollArea - uses shared ColorGrid */}
                <ScrollArea className="flex-1 min-h-0">
                    <div className="p-3">
                        <ColorGrid value={color} onChange={handleColorChange} codeColors={codeColors} size="sm" />
                    </div>
                </ScrollArea>
            </div>
        </PopoverContent>
    );
};

// Gradient Stops Editor - from/via/to design with ability to add more stops
const GradientStopsEditor = ({ stops, onChange, onAddStop }: { stops: GradientStop[]; onChange: (stops: GradientStop[]) => void; onAddStop?: () => void }) => {
    const handleStopColorChange = (id: string, color: string) => {
        onChange(stops.map((s) => (s.id === id ? { ...s, color, enabled: true } : s)));
    };

    const handleStopOpacityChange = (id: string, opacity: string) => {
        onChange(stops.map((s) => (s.id === id ? { ...s, opacity } : s)));
    };

    const handleStopToggle = (id: string) => {
        onChange(stops.map((s) => (s.id === id ? { ...s, enabled: !s.enabled, color: s.enabled ? "" : s.color } : s)));
    };

    const handleRemoveStop = (id: string) => {
        if (id === "from" || id === "to") return; // Can't remove from/to
        onChange(stops.filter((s) => s.id !== id));
    };

    // Check if via has content (for showing add button)
    const viaStop = stops.find((s) => s.id === "via");
    const viaHasContent = viaStop?.enabled && viaStop?.color;
    const hasExtraStops = stops.length > 3;

    return (
        <div className="space-y-3 p-3 pt-0">
            <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Stops</div>
            {stops.map((stop, index) => {
                const isVia = stop.id === "via";
                const isExtra = !["from", "via", "to"].includes(stop.id);
                const showAddButton = isVia && viaHasContent && onAddStop;

                return (
                    <div key={stop.id} className="flex items-center gap-2">
                        <div className="w-8 text-[10px] text-muted-foreground font-medium capitalize">{isExtra ? `#${index}` : stop.id}</div>

                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    className={cn(
                                        "w-6 h-6 rounded-full border border-border shadow-sm transition-all",
                                        !stop.enabled && "opacity-30 border-dashed border-2",
                                        stop.enabled && "hover:scale-110 cursor-pointer"
                                    )}
                                    style={stop.enabled ? { backgroundColor: getHexColor(stop.color) } : {}}
                                />
                            </PopoverTrigger>
                            <StopColorPicker color={getHexColor(stop.color)} onChange={(color) => handleStopColorChange(stop.id, color)} />
                        </Popover>

                        <Input
                            value={stop.color}
                            onChange={(e) => handleStopColorChange(stop.id, e.target.value)}
                            className="h-7 text-[10px] font-mono flex-1"
                            placeholder="Color"
                            disabled={!stop.enabled}
                        />

                        <Select value={stop.opacity} onValueChange={(val) => handleStopOpacityChange(stop.id, val)} disabled={!stop.enabled}>
                            <SelectTrigger className="w-[60px] h-7 text-[10px]" title="Position percentage">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5, 0].map((v) => (
                                    <SelectItem key={v} value={`${v}%`}>
                                        {v}%
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Toggle/Delete button for via and extra stops */}
                        {(isVia || isExtra) && (
                            <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => (isExtra ? handleRemoveStop(stop.id) : handleStopToggle(stop.id))}>
                                {stop.enabled || isExtra ? <Trash2 className="w-3 h-3 text-muted-foreground" /> : <Plus className="w-3 h-3 text-muted-foreground" />}
                            </Button>
                        )}

                        {/* Add more stops button - shown after via when it has content */}
                        {showAddButton && (
                            <Tooltip disableHoverableContent>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onAddStop}>
                                        <Plus className="w-3 h-3 text-brand" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">Add more colors</TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                );
            })}

            {/* Add Color Button at bottom */}
            {onAddStop && (
                <Button variant="outline" size="sm" className="w-full h-7 text-[10px] mt-2" onClick={onAddStop}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Color Stop
                </Button>
            )}
        </div>
    );
};

// Code Preview Component
const CodePreview = ({ code, onChange }: { code: string; onChange: (code: string) => void }) => {
    const [localCode, setLocalCode] = useState(code);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLocalCode(code);
    }, [code]);

    const handleSubmit = () => {
        onChange(localCode);
    };

    return (
        <div className="px-3 py-2 bg-muted/30 border-b border-border/50">
            <div className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <Input
                    ref={inputRef}
                    value={localCode}
                    onChange={(e) => setLocalCode(e.target.value)}
                    onBlur={handleSubmit}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSubmit();
                            inputRef.current?.blur();
                        }
                    }}
                    className="h-6 text-[10px] font-mono flex-1 bg-background/50"
                    placeholder="linear-gradient(to right, #ff75c3, #ffa647)"
                />
            </div>
        </div>
    );
};

// --- Parsers and Builders ---

// Parse CSS gradient string to state
const parseGradientCode = (code: string): GradientState | null => {
    const trimmed = code.trim();

    // Check for linear-gradient
    const linearMatch = trimmed.match(/^linear-gradient\s*\(\s*(to\s+[\w\s]+|[\d]+deg)\s*,\s*(.+)\s*\)$/i);
    if (linearMatch) {
        const directionStr = linearMatch[1].toLowerCase();
        const colorsStr = linearMatch[2];

        // Parse direction
        let direction = "r";
        if (directionStr.includes("to top right") || directionStr.includes("to right top")) direction = "tr";
        else if (directionStr.includes("to bottom right") || directionStr.includes("to right bottom")) direction = "br";
        else if (directionStr.includes("to bottom left") || directionStr.includes("to left bottom")) direction = "bl";
        else if (directionStr.includes("to top left") || directionStr.includes("to left top")) direction = "tl";
        else if (directionStr.includes("to top")) direction = "t";
        else if (directionStr.includes("to bottom")) direction = "b";
        else if (directionStr.includes("to left")) direction = "l";
        else if (directionStr.includes("to right")) direction = "r";

        // Parse colors - convert to from/via/to structure
        const colorParts = colorsStr.split(",").map((s) => s.trim());
        const stops: GradientStop[] = colorParts.map((part, i) => {
            const match = part.match(/^(#[\da-f]{3,8}|rgba?\([^)]+\)|[\w-]+)(?:\s+([\d.]+%?))?$/i);
            const color = match ? (match[1].startsWith("#") ? match[1] : getHexColor(match[1])) : part;

            // Map to from/via/to or extra stops
            let id: string;
            if (i === 0) id = "from";
            else if (i === colorParts.length - 1) id = "to";
            else if (i === 1 && colorParts.length === 3) id = "via";
            else id = `extra-${i}`;

            return {
                id,
                color,
                opacity: "100%",
                enabled: true,
            };
        });

        // Ensure we have from/via/to structure with via if missing
        if (!stops.find((s) => s.id === "via")) {
            stops.splice(1, 0, { id: "via", color: "", opacity: "100%", enabled: false });
        }

        return {
            type: "linear",
            color: "",
            direction,
            position: "c",
            angle: 180,
            stops,
        };
    }

    // Check for radial-gradient
    const radialMatch = trimmed.match(/^radial-gradient\s*\(\s*([^,]+)\s*,\s*(.+)\s*\)$/i);
    if (radialMatch) {
        const positionStr = radialMatch[1].toLowerCase();
        const colorsStr = radialMatch[2];

        // Parse position
        let position = "c";
        if (positionStr.includes("top left")) position = "tl";
        else if (positionStr.includes("top right")) position = "tr";
        else if (positionStr.includes("bottom left")) position = "bl";
        else if (positionStr.includes("bottom right")) position = "br";
        else if (positionStr.includes("top")) position = "t";
        else if (positionStr.includes("bottom")) position = "b";
        else if (positionStr.includes("left")) position = "l";
        else if (positionStr.includes("right")) position = "r";

        // Parse colors - convert to from/via/to structure
        const colorParts = colorsStr.split(",").map((s) => s.trim());
        const stops: GradientStop[] = colorParts.map((part, i) => {
            const match = part.match(/^(#[\da-f]{3,8}|rgba?\([^)]+\)|[\w-]+)(?:\s+([\d.]+%?))?$/i);
            const color = match ? (match[1].startsWith("#") ? match[1] : getHexColor(match[1])) : part;

            let id: string;
            if (i === 0) id = "from";
            else if (i === colorParts.length - 1) id = "to";
            else if (i === 1 && colorParts.length === 3) id = "via";
            else id = `extra-${i}`;

            return { id, color, opacity: "100%", enabled: true };
        });

        if (!stops.find((s) => s.id === "via")) {
            stops.splice(1, 0, { id: "via", color: "", opacity: "100%", enabled: false });
        }

        return {
            type: "radial",
            color: "",
            direction: "r",
            position,
            angle: 0,
            stops,
        };
    }

    // Check for conic-gradient
    const conicMatch = trimmed.match(/^conic-gradient\s*\(\s*(?:from\s+([\d]+)deg\s*)?(?:at\s+([^,]+)\s*)?,?\s*(.+)\s*\)$/i);
    if (conicMatch) {
        const angle = conicMatch[1] ? parseInt(conicMatch[1]) : 0;
        const colorsStr = conicMatch[3] || conicMatch[2];

        const colorParts = colorsStr.split(",").map((s) => s.trim());
        const stops: GradientStop[] = colorParts.map((part, i) => {
            const match = part.match(/^(#[\da-f]{3,8}|rgba?\([^)]+\)|[\w-]+)(?:\s+([\d.]+%?))?$/i);
            const color = match ? (match[1].startsWith("#") ? match[1] : getHexColor(match[1])) : part;

            let id: string;
            if (i === 0) id = "from";
            else if (i === colorParts.length - 1) id = "to";
            else if (i === 1 && colorParts.length === 3) id = "via";
            else id = `extra-${i}`;

            return { id, color, opacity: "100%", enabled: true };
        });

        if (!stops.find((s) => s.id === "via")) {
            stops.splice(1, 0, { id: "via", color: "", opacity: "100%", enabled: false });
        }

        return {
            type: "conic",
            color: "",
            direction: "r",
            position: "c",
            angle,
            stops,
        };
    }

    return null;
};

// Build CSS gradient string from state (for preview purposes)
const buildGradientCode = (state: GradientState): string => {
    if (state.type === "solid") {
        return getHexColor(state.color);
    }

    // Filter enabled stops and build color string - convert to hex for CSS
    const colorStops = state.stops
        .filter((stop) => stop.enabled && stop.color)
        .map((stop) => getHexColor(stop.color))
        .join(", ");

    if (state.type === "linear") {
        const dir = GRADIENT_DIRECTIONS.find((d) => d.id === state.direction);
        const cssDir = dir?.cssDirection || "to right";
        return `linear-gradient(${cssDir}, ${colorStops})`;
    }

    if (state.type === "radial") {
        const pos = RADIAL_POSITION_CSS_MAP[state.position] || "at center";
        return `radial-gradient(circle ${pos}, ${colorStops})`;
    }

    if (state.type === "conic") {
        return `conic-gradient(from ${state.angle}deg, ${colorStops})`;
    }

    return "";
};

// Parse Tailwind gradient classes to state - supports Tailwind v4 syntax
const parseGradient = (classes: string): GradientState => {
    const classList = classes.split(" ");

    // Default result with proper from/via/to structure - use Tailwind color names
    const result: GradientState = {
        type: "solid",
        color: "",
        direction: "r",
        position: "c",
        angle: 0,
        stops: [
            { id: "from", color: "slate-900", opacity: "100%", enabled: true },
            { id: "via", color: "", opacity: "100%", enabled: false },
            { id: "to", color: "slate-500", opacity: "100%", enabled: true },
        ],
    };

    // Check if it's a CSS gradient (arbitrary value)
    const bgArbitrary = classList.find((c) => c.startsWith("bg-[") || c.startsWith("["));
    if (bgArbitrary) {
        const cssValue = bgArbitrary.startsWith("bg-[") ? bgArbitrary.slice(4, -1) : bgArbitrary.slice(1, -1);
        const parsed = parseGradientCode(cssValue);
        if (parsed) {
            return parsed;
        }
    }

    // Check for Tailwind v4 linear gradient: linear-to-r, linear-to-t, etc.
    // Also check for legacy: gradient-to-r, bg-gradient-to-r, bg-linear-to-r
    const linearMatch = classes.match(/(?:bg-)?linear-to-([a-z]+)/);
    if (linearMatch) {
        result.type = "linear";
        result.direction = linearMatch[1];
    }

    // Legacy gradient-to- syntax
    const legacyLinearMatch = classes.match(/(?:bg-)?gradient-to-([a-z]+)/);
    if (legacyLinearMatch) {
        result.type = "linear";
        result.direction = legacyLinearMatch[1];
    }

    // Check for radial gradient: radial, radial-[at_position]
    const radialClass = classList.find((c) => c.includes("radial"));
    if (radialClass) {
        result.type = "radial";
        // Check for position in arbitrary value: radial-[at_top_left]
        const posMatch = radialClass.match(/radial-\[([^\]]+)\]/);
        if (posMatch) {
            const posValue = posMatch[1];
            // Find matching position key from the map
            for (const [key, value] of Object.entries(RADIAL_POSITION_MAP)) {
                if (value === posValue) {
                    result.position = key;
                    break;
                }
            }
        } else {
            result.position = "c"; // Default center
        }
    }

    // Check for conic gradient: conic, conic-{angle}
    const conicClass = classList.find((c) => c.includes("conic"));
    if (conicClass) {
        result.type = "conic";
        // Check for angle: conic-180, conic-90, etc.
        const angleMatch = conicClass.match(/conic-(\d+)/);
        if (angleMatch) {
            result.angle = parseInt(angleMatch[1]);
        } else {
            result.angle = 0;
        }
    }

    // Extract Colors from Tailwind classes - preserve Tailwind names
    const fromClass = classList.find((c) => c.startsWith("from-"));
    if (fromClass) {
        let colorName = fromClass.replace("from-", "").split("/")[0];
        const opacity = fromClass.includes("/") ? `${fromClass.split("/")[1]}%` : "100%";
        // Handle arbitrary values like [#ff0000] - extract hex
        if (colorName.startsWith("[") && colorName.endsWith("]")) {
            colorName = colorName.slice(1, -1);
        }
        result.stops[0].color = colorName;
        result.stops[0].opacity = opacity;
        result.stops[0].enabled = true;
    }

    const viaClass = classList.find((c) => c.startsWith("via-"));
    if (viaClass) {
        let colorName = viaClass.replace("via-", "").split("/")[0];
        const opacity = viaClass.includes("/") ? `${viaClass.split("/")[1]}%` : "100%";
        if (colorName.startsWith("[") && colorName.endsWith("]")) {
            colorName = colorName.slice(1, -1);
        }
        result.stops[1].color = colorName;
        result.stops[1].opacity = opacity;
        result.stops[1].enabled = true;
    }

    const toClass = classList.find((c) => c.startsWith("to-"));
    if (toClass) {
        let colorName = toClass.replace("to-", "").split("/")[0];
        const opacity = toClass.includes("/") ? `${toClass.split("/")[1]}%` : "100%";
        if (colorName.startsWith("[") && colorName.endsWith("]")) {
            colorName = colorName.slice(1, -1);
        }
        result.stops[2].color = colorName;
        result.stops[2].opacity = opacity;
        result.stops[2].enabled = true;
    }

    // If we found from- or to- classes but no gradient type, assume linear
    if ((fromClass || toClass) && result.type === "solid") {
        result.type = "linear";
        if (!result.direction) result.direction = "r";
    }

    // If no gradient, treat as solid
    if (!fromClass && !toClass && result.type === "solid") {
        const bgClass = classList.find((c) => c.startsWith("bg-") && !c.includes("gradient") && !c.includes("linear") && !c.includes("radial") && !c.includes("conic"));
        if (bgClass) result.color = bgClass.replace("bg-", "");
    }

    return result;
};

// --- Main Component ---

export const ColorPicker = ({ value, onChange, label }: { value: string; onChange: (val: string) => void; label: string }) => {
    const [open, setOpen] = useState(false);

    const [internalState, setInternalState] = useState<GradientState>(() => parseGradient(value));
    const [activeTab, setActiveTab] = useState<string>(() => parseGradient(value).type);

    // Track if the last change was internal to prevent re-parsing
    const isInternalChangeRef = useRef(false);
    const lastEmittedValueRef = useRef<string>(value);

    useEffect(() => {
        // Skip if this update came from our own onChange
        if (isInternalChangeRef.current || value === lastEmittedValueRef.current) {
            isInternalChangeRef.current = false;
            return;
        }

        const parsed = parseGradient(value);
        setInternalState(parsed);
        setActiveTab(parsed.type);
        lastEmittedValueRef.current = value;
    }, [value]);

    // Generate the code preview string - Tailwind v4 syntax
    const codePreview = useMemo(() => {
        if (internalState.type === "solid") {
            return internalState.color;
        }

        // Helper to format color for Tailwind classes
        const formatColor = (color: string): string => {
            if (!color) return "";
            const tailwindName = getTailwindColorName(color);
            if (TAILWIND_COLORS[tailwindName]) return tailwindName;
            if (color.startsWith("#")) return `[${color}]`;
            return color;
        };

        // Helper to format position percentage (only if not 100%)
        const formatPosition = (opacity: string, prefix: string): string => {
            if (!opacity || opacity === "100%") return "";
            const num = parseInt(opacity);
            if (isNaN(num) || num === 100) return "";
            return ` ${prefix}-${num}%`;
        };

        const fromStop = internalState.stops.find((s) => s.id === "from" && s.enabled && s.color);
        const viaStop = internalState.stops.find((s) => s.id === "via" && s.enabled && s.color);
        const toStop = internalState.stops.find((s) => s.id === "to" && s.enabled && s.color);
        const extraStops = internalState.stops.filter((s) => !["from", "via", "to"].includes(s.id) && s.enabled && s.color);

        // Build color stops part with positions
        let colorClasses = "";
        if (fromStop) {
            colorClasses += ` from-${formatColor(fromStop.color)}`;
            colorClasses += formatPosition(fromStop.opacity, "from");
        }
        if (viaStop) {
            colorClasses += ` via-${formatColor(viaStop.color)}`;
            colorClasses += formatPosition(viaStop.opacity, "via");
        }
        extraStops.forEach((stop) => {
            colorClasses += ` via-${formatColor(stop.color)}`;
            colorClasses += formatPosition(stop.opacity, "via");
        });
        if (toStop) {
            colorClasses += ` to-${formatColor(toStop.color)}`;
            colorClasses += formatPosition(toStop.opacity, "to");
        }

        // Build the gradient class based on type - Tailwind v4 syntax
        if (internalState.type === "linear") {
            return `bg-linear-to-${internalState.direction}${colorClasses}`;
        } else if (internalState.type === "radial") {
            if (internalState.position === "c") {
                return `bg-radial${colorClasses}`;
            } else {
                const pos = RADIAL_POSITION_MAP[internalState.position] || "at_center";
                return `bg-radial-[${pos}]${colorClasses}`;
            }
        } else if (internalState.type === "conic") {
            if (internalState.angle === 0) {
                return `bg-conic${colorClasses}`;
            } else {
                return `bg-conic-${internalState.angle}${colorClasses}`;
            }
        }

        return "";
    }, [internalState]);

    // Handle code input changes
    const handleCodeChange = (code: string) => {
        // Try parsing as Tailwind classes first
        if (code.includes("linear-to-") || code.includes("gradient-to-") || code.includes("radial") || code.includes("conic") || code.includes("from-") || code.includes("to-")) {
            const parsed = parseGradient(code);
            if (parsed.type !== "solid") {
                setInternalState(parsed);
                setActiveTab(parsed.type);
                emitChange(parsed);
                return;
            }
        }
        // Try parsing as CSS gradient
        const parsed = parseGradientCode(code);
        if (parsed) {
            setInternalState(parsed);
            setActiveTab(parsed.type);
            emitChange(parsed);
        }
    };

    // Helper to emit changes - uses Tailwind v4 syntax
    const emitChange = useCallback(
        (newState: GradientState) => {
            // Mark as internal change to prevent re-parsing in useEffect
            isInternalChangeRef.current = true;

            let emittedValue = "";

            if (newState.type === "solid") {
                emittedValue = newState.color;
                lastEmittedValueRef.current = emittedValue;
                onChange(emittedValue);
                return;
            }

            // Helper to format color for Tailwind classes
            const formatColor = (color: string): string => {
                if (!color) return "";
                // Try to get Tailwind name, fallback to arbitrary hex
                const tailwindName = getTailwindColorName(color);
                if (TAILWIND_COLORS[tailwindName]) return tailwindName;
                if (color.startsWith("#")) return `[${color}]`;
                return color;
            };

            // Helper to format position percentage (only if not 100%)
            const formatPosition = (opacity: string, prefix: string): string => {
                if (!opacity || opacity === "100%") return "";
                // Extract number from "50%" -> "50"
                const num = parseInt(opacity);
                if (isNaN(num) || num === 100) return "";
                return ` ${prefix}-${num}%`;
            };

            // Get enabled stops
            const fromStop = newState.stops.find((s) => s.id === "from" && s.enabled && s.color);
            const viaStop = newState.stops.find((s) => s.id === "via" && s.enabled && s.color);
            const toStop = newState.stops.find((s) => s.id === "to" && s.enabled && s.color);
            const extraStops = newState.stops.filter((s) => !["from", "via", "to"].includes(s.id) && s.enabled && s.color);

            // Build color stops part with optional positions
            let colorClasses = "";
            if (fromStop) {
                colorClasses += ` from-${formatColor(fromStop.color)}`;
                colorClasses += formatPosition(fromStop.opacity, "from");
            }
            if (viaStop) {
                colorClasses += ` via-${formatColor(viaStop.color)}`;
                colorClasses += formatPosition(viaStop.opacity, "via");
            }
            // Add extra stops as via colors (Tailwind supports multiple via)
            extraStops.forEach((stop) => {
                colorClasses += ` via-${formatColor(stop.color)}`;
                colorClasses += formatPosition(stop.opacity, "via");
            });
            if (toStop) {
                colorClasses += ` to-${formatColor(toStop.color)}`;
                colorClasses += formatPosition(toStop.opacity, "to");
            }

            // Build the gradient class based on type - Tailwind v4 syntax
            if (newState.type === "linear") {
                // bg-linear-to-r, bg-linear-to-t, etc.
                emittedValue = `linear-to-${newState.direction}${colorClasses}`;
            } else if (newState.type === "radial") {
                // bg-radial for center, bg-radial-[at_position] for other positions
                if (newState.position === "c") {
                    emittedValue = `radial${colorClasses}`;
                } else {
                    const pos = RADIAL_POSITION_MAP[newState.position] || "at_center";
                    emittedValue = `radial-[${pos}]${colorClasses}`;
                }
            } else if (newState.type === "conic") {
                // bg-conic for 0deg, bg-conic-{angle} for other angles
                if (newState.angle === 0) {
                    emittedValue = `conic${colorClasses}`;
                } else {
                    emittedValue = `conic-${newState.angle}${colorClasses}`;
                }
            }

            lastEmittedValueRef.current = emittedValue;
            onChange(emittedValue);
        },
        [onChange]
    );

    const handleSolidChange = (color: string) => {
        const newState = { ...internalState, type: "solid" as const, color };
        setInternalState(newState);
        emitChange(newState);
    };

    const handleGradientChange = (updates: Partial<GradientState>) => {
        const newState = { ...internalState, ...updates };
        setInternalState(newState);
        emitChange(newState);
    };

    // Helper for preview in the trigger button
    const getTriggerPreview = (): React.CSSProperties => {
        if (internalState.type === "solid") {
            return getPreviewStyle(internalState.color);
        }

        const cssGradient = buildGradientCode(internalState);
        return { background: cssGradient };
    };

    const handlePresetSelect = (preset: string) => {
        const parts = preset.split(" ");
        // Keep the Tailwind color names from the preset
        const fromColor = parts[0].replace("from-", "");
        const toColor = parts[1].replace("to-", "");
        const newStops: GradientStop[] = [
            { id: "from", color: fromColor, opacity: "100%", enabled: true },
            { id: "via", color: "", opacity: "100%", enabled: false },
            { id: "to", color: toColor, opacity: "100%", enabled: true },
        ];
        handleGradientChange({ stops: newStops });
    };

    const handleAddStop = () => {
        // Add a new extra color stop after via - use Tailwind color name
        const newStop: GradientStop = {
            id: `extra-${Date.now()}`,
            color: "gray-500",
            opacity: "100%",
            enabled: true,
        };
        // Insert before 'to'
        const toIndex = internalState.stops.findIndex((s) => s.id === "to");
        const newStops = [...internalState.stops];
        if (toIndex >= 0) {
            newStops.splice(toIndex, 0, newStop);
        } else {
            newStops.push(newStop);
        }
        handleGradientChange({ stops: newStops });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="flex items-center w-full bg-background rounded border border-input px-2 h-7 cursor-pointer hover:border-brand/50 transition-colors">
                    <div className="w-4 h-4 rounded border border-border mr-2 shadow-sm shrink-0" style={getTriggerPreview()} />
                    <span className="text-[10px] font-mono text-foreground truncate flex-1 text-left">
                        {internalState.type === "solid" ? internalState.color || "None" : `${internalState.type} gradient`}
                    </span>
                    <Palette className="w-3 h-3 text-muted-foreground shrink-0 ml-1" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[340px] p-0" align="end" sideOffset={4}>
                <TooltipProvider>
                    {/* Fixed Height Container for consistent layout */}
                    <div className="h-[480px] flex flex-col">
                        <Tabs
                            value={activeTab}
                            onValueChange={(v) => {
                                setActiveTab(v);
                                // Only update internal state, don't emit changes on tab switch
                                const newState = { ...internalState, type: v as any };
                                // Set logical defaults if switching to gradient
                                if (v !== "solid" && (!newState.stops || newState.stops.length < 3)) {
                                    newState.stops = [
                                        { id: "from", color: "slate-900", opacity: "100%", enabled: true },
                                        { id: "via", color: "", opacity: "100%", enabled: false },
                                        { id: "to", color: "slate-500", opacity: "100%", enabled: true },
                                    ];
                                }
                                if (v === "linear" && !newState.direction) newState.direction = "r";
                                if (v === "radial" && !newState.position) newState.position = "c";
                                if (v === "conic" && newState.angle === undefined) newState.angle = 0;
                                setInternalState(newState);
                                // Don't emit change on tab switch - only when user makes actual changes
                            }}
                            className="flex-1 flex flex-col h-full min-h-0 overflow-hidden"
                        >
                            <TabsList className="w-full grid grid-cols-4 rounded-none border-b h-10 p-0 bg-transparent shrink-0">
                                <TabsTrigger value="solid" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-muted/10 text-xs h-full">
                                    Solid
                                </TabsTrigger>
                                <TabsTrigger value="linear" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-muted/10 text-xs h-full">
                                    Linear
                                </TabsTrigger>
                                <TabsTrigger value="radial" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-muted/10 text-xs h-full">
                                    Radial
                                </TabsTrigger>
                                <TabsTrigger value="conic" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand data-[state=active]:bg-muted/10 text-xs h-full">
                                    Conic
                                </TabsTrigger>
                            </TabsList>

                            {/* Code Preview - shown for gradient tabs */}
                            {activeTab !== "solid" && <CodePreview code={codePreview} onChange={handleCodeChange} />}

                            {/* SOLID TAB */}
                            <TabsContent value="solid" className="mt-0 flex-1 min-h-0 flex flex-col">
                                <SolidColorGrid value={internalState.color} onChange={handleSolidChange} />
                            </TabsContent>

                            {/* LINEAR TAB */}
                            <TabsContent value="linear" className="mt-0 flex-1 min-h-0 flex flex-col h-full overflow-hidden">
                                <ScrollArea className="flex-1 min-h-0">
                                    <div className="p-3 space-y-4">
                                        <GradientPresets type="linear" presets={LINEAR_PRESETS} onSelect={handlePresetSelect} direction={internalState.direction} />

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-muted-foreground font-medium">Direction</span>
                                                <span className="text-[10px] text-muted-foreground font-mono">To {internalState.direction.toUpperCase()}</span>
                                            </div>
                                            <div className="flex gap-1 flex-wrap justify-between bg-muted/20 p-2 rounded-lg border border-border/50">
                                                {GRADIENT_DIRECTIONS.map(({ id, icon: Icon }) => (
                                                    <button
                                                        key={id}
                                                        onClick={() => handleGradientChange({ direction: id })}
                                                        className={cn(
                                                            "w-7 h-7 flex items-center justify-center rounded-sm transition-all",
                                                            internalState.direction === id ? "bg-brand text-brand-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
                                                        )}
                                                    >
                                                        <Icon className="w-3.5 h-3.5" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <GradientStopsEditor stops={internalState.stops} onChange={(stops) => handleGradientChange({ stops })} onAddStop={handleAddStop} />
                                    </div>
                                </ScrollArea>
                            </TabsContent>

                            {/* RADIAL TAB */}
                            <TabsContent value="radial" className="mt-0 flex-1 min-h-0 flex flex-col h-full overflow-hidden">
                                <ScrollArea className="flex-1 min-h-0">
                                    <div className="p-3 space-y-4">
                                        <GradientPresets type="radial" presets={LINEAR_PRESETS} onSelect={handlePresetSelect} position={internalState.position} />

                                        <div className="space-y-2">
                                            <div className="text-[10px] text-muted-foreground font-medium mb-2">Position</div>
                                            <div className="w-[100px] mx-auto grid grid-cols-3 gap-1 p-1 bg-muted/20 rounded-lg border border-border/50">
                                                {RADIAL_POSITIONS.map((pos) => (
                                                    <button
                                                        key={pos}
                                                        onClick={() => handleGradientChange({ position: pos })}
                                                        className={cn(
                                                            "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                                            internalState.position === pos ? "bg-brand scale-110 shadow-sm" : "bg-muted/50 hover:bg-muted"
                                                        )}
                                                    >
                                                        <div className={cn("w-1.5 h-1.5 rounded-full", internalState.position === pos ? "bg-brand-foreground" : "bg-muted-foreground")} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <GradientStopsEditor stops={internalState.stops} onChange={(stops) => handleGradientChange({ stops })} onAddStop={handleAddStop} />
                                    </div>
                                </ScrollArea>
                            </TabsContent>

                            {/* CONIC TAB */}
                            <TabsContent value="conic" className="mt-0 flex-1 min-h-0 flex flex-col h-full overflow-hidden">
                                <ScrollArea className="flex-1 min-h-0">
                                    <div className="p-3 space-y-4">
                                        <GradientPresets type="conic" presets={LINEAR_PRESETS} onSelect={handlePresetSelect} angle={internalState.angle} />

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-muted-foreground font-medium">Angle</span>
                                                <span className="text-[10px] text-muted-foreground font-mono">{internalState.angle}°</span>
                                            </div>
                                            <Slider value={[internalState.angle]} min={0} max={360} step={15} onValueChange={(val) => handleGradientChange({ angle: val[0] })} />
                                        </div>

                                        <GradientStopsEditor stops={internalState.stops} onChange={(stops) => handleGradientChange({ stops })} onAddStop={handleAddStop} />
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    </div>
                </TooltipProvider>
            </PopoverContent>
        </Popover>
    );
};
