

export const TAILWIND_CLASSES = [
    "flex",
    "grid",
    "block",
    "inline-block",
    "hidden",
    "absolute",
    "relative",
    "fixed",
    "sticky",
    "static",
    "w-full",
    "h-full",
    "w-screen",
    "h-screen",
    "min-h-screen",
    "max-w-7xl",
    "p-0",
    "p-1",
    "p-2",
    "p-3",
    "p-4",
    "p-5",
    "p-6",
    "p-8",
    "p-10",
    "px-2",
    "px-4",
    "py-2",
    "py-4",
    "m-0",
    "m-1",
    "m-2",
    "m-4",
    "m-auto",
    "my-auto",
    "mx-auto",
    "bg-background",
    "bg-foreground",
    "bg-card",
    "bg-popover",
    "bg-primary",
    "bg-secondary",
    "bg-muted",
    "bg-accent",
    "bg-destructive",
    "text-background",
    "text-foreground",
    "text-primary",
    "text-secondary",
    "text-muted-foreground",
    "text-accent-foreground",
    "border",
    "border-border",
    "border-input",
    "border-t",
    "border-b",
    "rounded",
    "rounded-md",
    "rounded-lg",
    "rounded-full",
    "flex-row",
    "flex-col",
    "items-center",
    "items-start",
    "items-end",
    "justify-center",
    "justify-between",
    "justify-start",
    "justify-end",
    "gap-1",
    "gap-2",
    "gap-4",
    "gap-6",
    "gap-8",
    "text-xs",
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "text-3xl",
    "font-bold",
    "font-semibold",
    "font-medium",
    "font-normal",
    "shadow",
    "shadow-sm",
    "shadow-md",
    "shadow-lg",
    "shadow-xl",
    "ring-1",
    "ring-offset-2",
    "transition-all",
    "duration-200",
    "duration-300",
    "ease-in-out",
    "cursor-pointer",
    "hover:opacity-80",
];

// =============================================================================
// PROPERTY SELECT OPTIONS
// =============================================================================

export interface PropertyOption {
    label: string;
    value: string;
    desc?: string;
}

export interface PropertyGroup {
    category: string;
    items: PropertyOption[];
}

/** Width/Height sizing options */
export const SIZING_OPTIONS: PropertyGroup[] = [
    {
        category: "Common",
        items: [
            { label: "auto", value: "auto", desc: "auto" },
            { label: "full", value: "full", desc: "100%" },
            { label: "screen", value: "screen", desc: "100vw/vh" },
            { label: "min", value: "min", desc: "min-content" },
            { label: "max", value: "max", desc: "max-content" },
            { label: "fit", value: "fit", desc: "fit-content" },
        ],
    },
    {
        category: "Fractions",
        items: [
            { label: "1/2", value: "1/2", desc: "50%" },
            { label: "1/3", value: "1/3", desc: "33.3%" },
            { label: "2/3", value: "2/3", desc: "66.6%" },
            { label: "1/4", value: "1/4", desc: "25%" },
            { label: "3/4", value: "3/4", desc: "75%" },
            { label: "1/5", value: "1/5", desc: "20%" },
            { label: "2/5", value: "2/5", desc: "40%" },
            { label: "3/5", value: "3/5", desc: "60%" },
            { label: "4/5", value: "4/5", desc: "80%" },
        ],
    },
    {
        category: "Fixed Scale",
        items: [
            { label: "0", value: "0", desc: "0px" },
            { label: "px", value: "px", desc: "1px" },
            { label: "0.5", value: "0.5", desc: "2px" },
            { label: "1", value: "1", desc: "4px" },
            { label: "2", value: "2", desc: "8px" },
            { label: "3", value: "3", desc: "12px" },
            { label: "4", value: "4", desc: "16px" },
            { label: "5", value: "5", desc: "20px" },
            { label: "6", value: "6", desc: "24px" },
            { label: "8", value: "8", desc: "32px" },
            { label: "10", value: "10", desc: "40px" },
            { label: "12", value: "12", desc: "48px" },
            { label: "16", value: "16", desc: "64px" },
            { label: "20", value: "20", desc: "80px" },
            { label: "24", value: "24", desc: "96px" },
            { label: "32", value: "32", desc: "128px" },
            { label: "40", value: "40", desc: "160px" },
            { label: "48", value: "48", desc: "192px" },
            { label: "56", value: "56", desc: "224px" },
            { label: "64", value: "64", desc: "256px" },
            { label: "72", value: "72", desc: "288px" },
            { label: "80", value: "80", desc: "320px" },
            { label: "96", value: "96", desc: "384px" },
        ],
    },
    {
        category: "Containers",
        items: [
            { label: "xs", value: "xs", desc: "320px" },
            { label: "sm", value: "sm", desc: "384px" },
            { label: "md", value: "md", desc: "448px" },
            { label: "lg", value: "lg", desc: "512px" },
            { label: "xl", value: "xl", desc: "576px" },
            { label: "2xl", value: "2xl", desc: "672px" },
            { label: "3xl", value: "3xl", desc: "768px" },
            { label: "4xl", value: "4xl", desc: "896px" },
            { label: "5xl", value: "5xl", desc: "1024px" },
            { label: "6xl", value: "6xl", desc: "1152px" },
            { label: "7xl", value: "7xl", desc: "1280px" },
        ],
    },
];

/** Gap/Spacing values */
export const GAP_OPTIONS: PropertyGroup[] = [
    {
        category: "Common",
        items: [
            { label: "0", value: "0", desc: "0px" },
            { label: "1", value: "1", desc: "4px" },
            { label: "2", value: "2", desc: "8px" },
            { label: "3", value: "3", desc: "12px" },
            { label: "4", value: "4", desc: "16px" },
            { label: "6", value: "6", desc: "24px" },
            { label: "8", value: "8", desc: "32px" },
        ],
    },
    {
        category: "Spacing Scale",
        items: [
            { label: "px", value: "px", desc: "1px" },
            { label: "0.5", value: "0.5", desc: "2px" },
            { label: "1.5", value: "1.5", desc: "6px" },
            { label: "2.5", value: "2.5", desc: "10px" },
            { label: "3.5", value: "3.5", desc: "14px" },
            { label: "5", value: "5", desc: "20px" },
            { label: "7", value: "7", desc: "28px" },
            { label: "9", value: "9", desc: "36px" },
            { label: "10", value: "10", desc: "40px" },
            { label: "11", value: "11", desc: "44px" },
            { label: "12", value: "12", desc: "48px" },
            { label: "14", value: "14", desc: "56px" },
            { label: "16", value: "16", desc: "64px" },
            { label: "20", value: "20", desc: "80px" },
            { label: "24", value: "24", desc: "96px" },
        ],
    },
];

/** Margin/Padding spacing values */
export const SPACING_OPTIONS: PropertyGroup[] = [
    {
        category: "Common",
        items: [
            { label: "0", value: "0", desc: "0px" },
            { label: "auto", value: "auto", desc: "auto" },
            { label: "px", value: "px", desc: "1px" },
            { label: "1", value: "1", desc: "4px" },
            { label: "2", value: "2", desc: "8px" },
            { label: "3", value: "3", desc: "12px" },
            { label: "4", value: "4", desc: "16px" },
            { label: "5", value: "5", desc: "20px" },
            { label: "6", value: "6", desc: "24px" },
            { label: "8", value: "8", desc: "32px" },
            { label: "10", value: "10", desc: "40px" },
            { label: "12", value: "12", desc: "48px" },
            { label: "16", value: "16", desc: "64px" },
        ],
    },
    {
        category: "Extended",
        items: [
            { label: "0.5", value: "0.5", desc: "2px" },
            { label: "1.5", value: "1.5", desc: "6px" },
            { label: "2.5", value: "2.5", desc: "10px" },
            { label: "3.5", value: "3.5", desc: "14px" },
            { label: "20", value: "20", desc: "80px" },
            { label: "24", value: "24", desc: "96px" },
            { label: "28", value: "28", desc: "112px" },
            { label: "32", value: "32", desc: "128px" },
            { label: "36", value: "36", desc: "144px" },
            { label: "40", value: "40", desc: "160px" },
        ],
    },
];

/** Font size options */
export const FONT_SIZE_OPTIONS: PropertyGroup[] = [
    {
        category: "Text Sizes",
        items: [
            { label: "xs", value: "xs", desc: "12px" },
            { label: "sm", value: "sm", desc: "14px" },
            { label: "base", value: "base", desc: "16px" },
            { label: "lg", value: "lg", desc: "18px" },
            { label: "xl", value: "xl", desc: "20px" },
            { label: "2xl", value: "2xl", desc: "24px" },
            { label: "3xl", value: "3xl", desc: "30px" },
            { label: "4xl", value: "4xl", desc: "36px" },
            { label: "5xl", value: "5xl", desc: "48px" },
            { label: "6xl", value: "6xl", desc: "60px" },
            { label: "7xl", value: "7xl", desc: "72px" },
            { label: "8xl", value: "8xl", desc: "96px" },
            { label: "9xl", value: "9xl", desc: "128px" },
        ],
    },
];

/** Line height options */
export const LINE_HEIGHT_OPTIONS: PropertyGroup[] = [
    {
        category: "Relative",
        items: [
            { label: "none", value: "none", desc: "1" },
            { label: "tight", value: "tight", desc: "1.25" },
            { label: "snug", value: "snug", desc: "1.375" },
            { label: "normal", value: "normal", desc: "1.5" },
            { label: "relaxed", value: "relaxed", desc: "1.625" },
            { label: "loose", value: "loose", desc: "2" },
        ],
    },
    {
        category: "Fixed",
        items: [
            { label: "3", value: "3", desc: "12px" },
            { label: "4", value: "4", desc: "16px" },
            { label: "5", value: "5", desc: "20px" },
            { label: "6", value: "6", desc: "24px" },
            { label: "7", value: "7", desc: "28px" },
            { label: "8", value: "8", desc: "32px" },
            { label: "9", value: "9", desc: "36px" },
            { label: "10", value: "10", desc: "40px" },
        ],
    },
];

/** Border radius options */
export const BORDER_RADIUS_OPTIONS: PropertyGroup[] = [
    {
        category: "Radius",
        items: [
            { label: "none", value: "none", desc: "0px" },
            { label: "sm", value: "sm", desc: "2px" },
            { label: "default", value: "", desc: "4px" },
            { label: "md", value: "md", desc: "6px" },
            { label: "lg", value: "lg", desc: "8px" },
            { label: "xl", value: "xl", desc: "12px" },
            { label: "2xl", value: "2xl", desc: "16px" },
            { label: "3xl", value: "3xl", desc: "24px" },
            { label: "full", value: "full", desc: "9999px" },
        ],
    },
];

/** Border width options */
export const BORDER_WIDTH_OPTIONS: PropertyGroup[] = [
    {
        category: "Width",
        items: [
            { label: "0", value: "0", desc: "0px" },
            { label: "1", value: "1", desc: "1px" },
            { label: "2", value: "2", desc: "2px" },
            { label: "4", value: "4", desc: "4px" },
            { label: "8", value: "8", desc: "8px" },
        ],
    },
];

/** Grid columns/rows values */
export const GRID_TRACK_OPTIONS: PropertyGroup[] = [
    {
        category: "Count",
        items: [
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
            { label: "6", value: "6" },
            { label: "7", value: "7" },
            { label: "8", value: "8" },
            { label: "9", value: "9" },
            { label: "10", value: "10" },
            { label: "11", value: "11" },
            { label: "12", value: "12" },
        ],
    },
    {
        category: "Special",
        items: [
            { label: "none", value: "none", desc: "No explicit grid" },
            { label: "subgrid", value: "subgrid", desc: "Use parent grid" },
        ],
    },
];

export const INITIAL_CODE = `
<!DOCTYPE html>
<html>
    <head>
        <script defer src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <style>
            /* Hide Scrollbar for clean look */
            ::-webkit-scrollbar { width: 0px; background: transparent; }
        </style>
    </head>
    <body class="bg-white">
        <!-- Navbar -->
        <nav class="h-16 border-b border-gray-100 flex items-center justify-between px-8">
            <div class="w-32 h-8 bg-gray-200 rounded"></div>
            <div class="flex gap-6">
                <div class="w-16 h-4 bg-gray-200 rounded"></div>
                <div class="w-16 h-4 bg-gray-200 rounded"></div>
                <div class="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div class="w-24 h-9 bg-gray-900 rounded"></div>
        </nav>

        <!-- Hero -->
        <section class="max-w-6xl mx-auto px-6 py-24 grid grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
                <div class="w-full h-16 bg-gray-200 rounded-lg"></div>
                <div class="w-3/4 h-16 bg-gray-200 rounded-lg"></div>
                <div class="space-y-2 pt-4">
                    <div class="w-full h-4 bg-gray-100 rounded"></div>
                    <div class="w-full h-4 bg-gray-100 rounded"></div>
                    <div class="w-2/3 h-4 bg-gray-100 rounded"></div>
                </div>
                <div class="flex gap-4 pt-4">
                    <div class="w-32 h-10 bg-gray-900 rounded"></div>
                    <div class="w-32 h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
            <div class="aspect-square bg-gray-100 rounded-2xl border border-gray-200"></div>
        </section>

        <!-- Logos -->
        <section class="border-y border-gray-100 py-12">
            <div class="max-w-6xl mx-auto px-6 flex justify-between opacity-50">
                <div class="w-24 h-8 bg-gray-200 rounded"></div>
                <div class="w-24 h-8 bg-gray-200 rounded"></div>
                <div class="w-24 h-8 bg-gray-200 rounded"></div>
                <div class="w-24 h-8 bg-gray-200 rounded"></div>
                <div class="w-24 h-8 bg-gray-200 rounded"></div>
            </div>
        </section>

        <!-- Features -->
        <section class="max-w-6xl mx-auto px-6 py-24">
            <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <div class="w-32 h-6 bg-gray-200 rounded-full mx-auto"></div>
                <div class="w-full h-10 bg-gray-200 rounded"></div>
            </div>
            <div class="grid grid-cols-3 gap-8">
                <div class="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-4 h-80">
                    <div class="w-12 h-12 bg-white rounded-lg shadow-sm"></div>
                    <div class="w-1/2 h-6 bg-gray-200 rounded"></div>
                    <div class="space-y-2">
                        <div class="w-full h-4 bg-gray-200 rounded"></div>
                        <div class="w-full h-4 bg-gray-200 rounded"></div>
                        <div class="w-2/3 h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div class="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-4 h-80">
                    <div class="w-12 h-12 bg-white rounded-lg shadow-sm"></div>
                    <div class="w-1/2 h-6 bg-gray-200 rounded"></div>
                    <div class="space-y-2">
                        <div class="w-full h-4 bg-gray-200 rounded"></div>
                        <div class="w-full h-4 bg-gray-200 rounded"></div>
                        <div class="w-2/3 h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div class="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-4 h-80">
                    <div class="w-12 h-12 bg-white rounded-lg shadow-sm"></div>
                    <div class="w-1/2 h-6 bg-gray-200 rounded"></div>
                    <div class="space-y-2">
                        <div class="w-full h-4 bg-gray-200 rounded"></div>
                        <div class="w-full h-4 bg-gray-200 rounded"></div>
                        <div class="w-2/3 h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        </section>

         <!-- Feature Row Alternate -->
        <section class="bg-gray-50 py-24">
            <div class="max-w-6xl mx-auto px-6 grid grid-cols-2 gap-16 items-center">
                 <div class="aspect-video bg-white rounded-2xl shadow-sm"></div>
                 <div class="space-y-6">
                    <div class="w-32 h-6 bg-gray-200 rounded-full"></div>
                    <div class="w-full h-10 bg-gray-200 rounded"></div>
                    <div class="space-y-2">
                        <div class="w-full h-4 bg-gray-200 rounded"></div>
                        <div class="w-full h-4 bg-gray-200 rounded"></div>
                        <div class="w-full h-4 bg-gray-200 rounded"></div>
                        <div class="w-2/3 h-4 bg-gray-200 rounded"></div>
                    </div>
                 </div>
            </div>
        </section>

        <!-- Grid 2 -->
        <section class="max-w-6xl mx-auto px-6 py-24">
            <div class="grid grid-cols-4 gap-6 h-96">
                <div class="col-span-2 row-span-2 bg-gray-900 rounded-2xl"></div>
                <div class="col-span-1 bg-gray-100 rounded-2xl"></div>
                <div class="col-span-1 bg-gray-100 rounded-2xl"></div>
                <div class="col-span-2 bg-gray-100 rounded-2xl"></div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="border-t border-gray-100 pt-16 pb-8">
            <div class="max-w-6xl mx-auto px-6 grid grid-cols-4 gap-8 mb-12">
                <div class="space-y-4">
                    <div class="w-24 h-8 bg-gray-200 rounded"></div>
                    <div class="w-48 h-16 bg-gray-100 rounded"></div>
                </div>
                <div class="space-y-3">
                    <div class="w-20 h-5 bg-gray-200 rounded mb-4"></div>
                    <div class="w-24 h-3 bg-gray-100 rounded"></div>
                    <div class="w-24 h-3 bg-gray-100 rounded"></div>
                    <div class="w-24 h-3 bg-gray-100 rounded"></div>
                </div>
                <div class="space-y-3">
                    <div class="w-20 h-5 bg-gray-200 rounded mb-4"></div>
                    <div class="w-24 h-3 bg-gray-100 rounded"></div>
                    <div class="w-24 h-3 bg-gray-100 rounded"></div>
                    <div class="w-24 h-3 bg-gray-100 rounded"></div>
                </div>
                <div class="space-y-3">
                    <div class="w-20 h-5 bg-gray-200 rounded mb-4"></div>
                    <div class="w-24 h-3 bg-gray-100 rounded"></div>
                    <div class="w-24 h-3 bg-gray-100 rounded"></div>
                    <div class="w-24 h-3 bg-gray-100 rounded"></div>
                </div>
            </div>
            <div class="max-w-6xl mx-auto px-6 border-t border-gray-100 pt-8 flex justify-between">
                <div class="w-32 h-4 bg-gray-100 rounded"></div>
                <div class="flex gap-4">
                     <div class="w-4 h-4 bg-gray-200 rounded-full"></div>
                     <div class="w-4 h-4 bg-gray-200 rounded-full"></div>
                     <div class="w-4 h-4 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </footer>
    </body>
</html>
`;
