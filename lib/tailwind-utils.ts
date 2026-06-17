/**
 * Tailwind CSS utility functions for the design panel
 */

// Breakpoint prefixes
export const BREAKPOINTS = ['', 'sm:', 'md:', 'lg:', 'xl:', '2xl:'] as const;
export type Breakpoint = typeof BREAKPOINTS[number];

// Common Tailwind class patterns
export interface ParsedClasses {
    // Display & Layout
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    flexWrap?: string;
    gap?: string;
    gridCols?: string;
    gridRows?: string;
    gridAutoFlow?: string;

    // Sizing
    width?: string;
    height?: string;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;

    // Spacing
    padding?: { t?: string; r?: string; b?: string; l?: string; all?: string };
    margin?: { t?: string; r?: string; b?: string; l?: string; all?: string };

    // Typography
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    textAlign?: string;
    textColor?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textDecoration?: string;
    textTransform?: string;

    // Appearance
    backgroundColor?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    opacity?: string;
    overflow?: string;

    // Other classes that don't fit categories
    other: string[];
}

/**
 * Parse a className string into structured data
 */
export function parseClasses(className: string = '', breakpoint: Breakpoint = ''): ParsedClasses {
    const classes = className.split(/\s+/).filter(Boolean);
    const parsed: ParsedClasses = { padding: {}, margin: {}, other: [] };

    for (const cls of classes) {
        // Skip classes with different breakpoints if we're looking for a specific one
        const hasBreakpoint = cls.includes(':');
        const clsBreakpoint = hasBreakpoint ? cls.split(':')[0] + ':' : '';

        if (breakpoint && clsBreakpoint !== breakpoint) {
            if (!clsBreakpoint) {
                // Base class, only include if we're looking for base
                if (breakpoint !== '') {
                    parsed.other.push(cls);
                    continue;
                }
            } else {
                parsed.other.push(cls);
                continue;
            }
        }

        const normalizedCls = hasBreakpoint ? cls.split(':').slice(1).join(':') : cls;

        // Display
        if (['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'hidden', 'contents'].includes(normalizedCls)) {
            parsed.display = normalizedCls;
            continue;
        }

        // Flex Direction
        if (normalizedCls.startsWith('flex-')) {
            const dir = normalizedCls.replace('flex-', '');
            if (['row', 'row-reverse', 'col', 'col-reverse'].includes(dir)) {
                parsed.flexDirection = dir;
                continue;
            }
            // Could be flex-wrap or flex-1, etc.
            if (['wrap', 'wrap-reverse', 'nowrap'].includes(dir)) {
                parsed.flexWrap = dir;
                continue;
            }
        }

        // Justify Content
        if (normalizedCls.startsWith('justify-')) {
            parsed.justifyContent = normalizedCls.replace('justify-', '');
            continue;
        }

        // Align Items
        if (normalizedCls.startsWith('items-')) {
            parsed.alignItems = normalizedCls.replace('items-', '');
            continue;
        }

        // Gap
        if (normalizedCls.startsWith('gap-')) {
            parsed.gap = normalizedCls.replace('gap-', '');
            continue;
        }

        // Grid columns
        if (normalizedCls.startsWith('grid-cols-')) {
            parsed.gridCols = normalizedCls.replace('grid-cols-', '');
            continue;
        }

        // Grid rows
        if (normalizedCls.startsWith('grid-rows-')) {
            parsed.gridRows = normalizedCls.replace('grid-rows-', '');
            continue;
        }

        // Grid auto flow
        if (normalizedCls.startsWith('grid-flow-')) {
            parsed.gridAutoFlow = normalizedCls.replace('grid-flow-', '');
            continue;
        }

        // Width
        if (normalizedCls.startsWith('w-')) {
            parsed.width = normalizedCls.replace('w-', '');
            continue;
        }

        // Height
        if (normalizedCls.startsWith('h-')) {
            parsed.height = normalizedCls.replace('h-', '');
            continue;
        }

        // Min/Max Width
        if (normalizedCls.startsWith('min-w-')) {
            parsed.minWidth = normalizedCls.replace('min-w-', '');
            continue;
        }
        if (normalizedCls.startsWith('max-w-')) {
            parsed.maxWidth = normalizedCls.replace('max-w-', '');
            continue;
        }

        // Min/Max Height
        if (normalizedCls.startsWith('min-h-')) {
            parsed.minHeight = normalizedCls.replace('min-h-', '');
            continue;
        }
        if (normalizedCls.startsWith('max-h-')) {
            parsed.maxHeight = normalizedCls.replace('max-h-', '');
            continue;
        }

        // Padding
        if (normalizedCls.startsWith('p-')) {
            parsed.padding!.all = normalizedCls.replace('p-', '');
            continue;
        }
        if (normalizedCls.startsWith('pt-')) {
            parsed.padding!.t = normalizedCls.replace('pt-', '');
            continue;
        }
        if (normalizedCls.startsWith('pr-')) {
            parsed.padding!.r = normalizedCls.replace('pr-', '');
            continue;
        }
        if (normalizedCls.startsWith('pb-')) {
            parsed.padding!.b = normalizedCls.replace('pb-', '');
            continue;
        }
        if (normalizedCls.startsWith('pl-')) {
            parsed.padding!.l = normalizedCls.replace('pl-', '');
            continue;
        }
        if (normalizedCls.startsWith('px-')) {
            parsed.padding!.l = normalizedCls.replace('px-', '');
            parsed.padding!.r = normalizedCls.replace('px-', '');
            continue;
        }
        if (normalizedCls.startsWith('py-')) {
            parsed.padding!.t = normalizedCls.replace('py-', '');
            parsed.padding!.b = normalizedCls.replace('py-', '');
            continue;
        }

        // Margin
        if (normalizedCls.startsWith('m-')) {
            parsed.margin!.all = normalizedCls.replace('m-', '');
            continue;
        }
        if (normalizedCls.startsWith('mt-')) {
            parsed.margin!.t = normalizedCls.replace('mt-', '');
            continue;
        }
        if (normalizedCls.startsWith('mr-')) {
            parsed.margin!.r = normalizedCls.replace('mr-', '');
            continue;
        }
        if (normalizedCls.startsWith('mb-')) {
            parsed.margin!.b = normalizedCls.replace('mb-', '');
            continue;
        }
        if (normalizedCls.startsWith('ml-')) {
            parsed.margin!.l = normalizedCls.replace('ml-', '');
            continue;
        }
        if (normalizedCls.startsWith('mx-')) {
            parsed.margin!.l = normalizedCls.replace('mx-', '');
            parsed.margin!.r = normalizedCls.replace('mx-', '');
            continue;
        }
        if (normalizedCls.startsWith('my-')) {
            parsed.margin!.t = normalizedCls.replace('my-', '');
            parsed.margin!.b = normalizedCls.replace('my-', '');
            continue;
        }

        // Font Size
        if (normalizedCls.startsWith('text-') && !normalizedCls.match(/text-(left|center|right|justify)/)) {
            // Could be text color or text size
            const sizePatterns = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];
            const value = normalizedCls.replace('text-', '');
            if (sizePatterns.includes(value) || value.startsWith('[')) {
                parsed.fontSize = value;
                continue;
            } else {
                parsed.textColor = value;
                continue;
            }
        }

        // Font Weight
        if (normalizedCls.startsWith('font-')) {
            const value = normalizedCls.replace('font-', '');
            const weights = ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'];
            if (weights.includes(value)) {
                parsed.fontWeight = value;
                continue;
            }
            // Could be font family
            parsed.fontFamily = value;
            continue;
        }

        // Text Align
        if (['text-left', 'text-center', 'text-right', 'text-justify'].includes(normalizedCls)) {
            parsed.textAlign = normalizedCls.replace('text-', '');
            continue;
        }

        // Line Height
        if (normalizedCls.startsWith('leading-')) {
            parsed.lineHeight = normalizedCls.replace('leading-', '');
            continue;
        }

        // Letter Spacing
        if (normalizedCls.startsWith('tracking-')) {
            parsed.letterSpacing = normalizedCls.replace('tracking-', '');
            continue;
        }

        // Text Decoration
        if (['underline', 'overline', 'line-through', 'no-underline'].includes(normalizedCls)) {
            parsed.textDecoration = normalizedCls;
            continue;
        }

        // Text Transform
        if (['uppercase', 'lowercase', 'capitalize', 'normal-case'].includes(normalizedCls)) {
            parsed.textTransform = normalizedCls;
            continue;
        }

        // Background Color
        if (normalizedCls.startsWith('bg-')) {
            parsed.backgroundColor = normalizedCls.replace('bg-', '');
            continue;
        }

        // Border Radius
        if (normalizedCls.startsWith('rounded')) {
            parsed.borderRadius = normalizedCls.replace('rounded-', '').replace('rounded', 'default');
            continue;
        }

        // Border Width
        if (normalizedCls.startsWith('border-') && normalizedCls.match(/border-\d/)) {
            parsed.borderWidth = normalizedCls.replace('border-', '');
            continue;
        }
        if (normalizedCls === 'border') {
            parsed.borderWidth = '1';
            continue;
        }

        // Opacity
        if (normalizedCls.startsWith('opacity-')) {
            parsed.opacity = normalizedCls.replace('opacity-', '');
            continue;
        }

        // Overflow
        if (normalizedCls.startsWith('overflow-')) {
            parsed.overflow = normalizedCls.replace('overflow-', '');
            continue;
        }

        // If nothing matched, add to other
        parsed.other.push(cls);
    }

    return parsed;
}

/**
 * Build a className string from structured data
 */
export function buildClasses(parsed: ParsedClasses, breakpoint: Breakpoint = ''): string {
    const classes: string[] = [];
    const prefix = breakpoint;

    // Display
    if (parsed.display) {
        classes.push(prefix + parsed.display);
    }

    // Flex Direction
    if (parsed.flexDirection) {
        classes.push(prefix + 'flex-' + parsed.flexDirection);
    }

    // Justify Content
    if (parsed.justifyContent) {
        classes.push(prefix + 'justify-' + parsed.justifyContent);
    }

    // Align Items
    if (parsed.alignItems) {
        classes.push(prefix + 'items-' + parsed.alignItems);
    }

    // Flex Wrap
    if (parsed.flexWrap) {
        classes.push(prefix + 'flex-' + parsed.flexWrap);
    }

    // Gap
    if (parsed.gap) {
        classes.push(prefix + 'gap-' + parsed.gap);
    }

    // Grid
    if (parsed.gridCols) {
        classes.push(prefix + 'grid-cols-' + parsed.gridCols);
    }
    if (parsed.gridRows) {
        classes.push(prefix + 'grid-rows-' + parsed.gridRows);
    }
    if (parsed.gridAutoFlow) {
        classes.push(prefix + 'grid-flow-' + parsed.gridAutoFlow);
    }

    // Sizing
    if (parsed.width) {
        classes.push(prefix + 'w-' + parsed.width);
    }
    if (parsed.height) {
        classes.push(prefix + 'h-' + parsed.height);
    }
    if (parsed.minWidth) {
        classes.push(prefix + 'min-w-' + parsed.minWidth);
    }
    if (parsed.maxWidth) {
        classes.push(prefix + 'max-w-' + parsed.maxWidth);
    }
    if (parsed.minHeight) {
        classes.push(prefix + 'min-h-' + parsed.minHeight);
    }
    if (parsed.maxHeight) {
        classes.push(prefix + 'max-h-' + parsed.maxHeight);
    }

    // Padding
    if (parsed.padding) {
        if (parsed.padding.all) {
            classes.push(prefix + 'p-' + parsed.padding.all);
        } else {
            if (parsed.padding.t) classes.push(prefix + 'pt-' + parsed.padding.t);
            if (parsed.padding.r) classes.push(prefix + 'pr-' + parsed.padding.r);
            if (parsed.padding.b) classes.push(prefix + 'pb-' + parsed.padding.b);
            if (parsed.padding.l) classes.push(prefix + 'pl-' + parsed.padding.l);
        }
    }

    // Margin
    if (parsed.margin) {
        if (parsed.margin.all) {
            classes.push(prefix + 'm-' + parsed.margin.all);
        } else {
            if (parsed.margin.t) classes.push(prefix + 'mt-' + parsed.margin.t);
            if (parsed.margin.r) classes.push(prefix + 'mr-' + parsed.margin.r);
            if (parsed.margin.b) classes.push(prefix + 'mb-' + parsed.margin.b);
            if (parsed.margin.l) classes.push(prefix + 'ml-' + parsed.margin.l);
        }
    }

    // Typography
    if (parsed.fontSize) {
        classes.push(prefix + 'text-' + parsed.fontSize);
    }
    if (parsed.fontWeight) {
        classes.push(prefix + 'font-' + parsed.fontWeight);
    }
    if (parsed.fontFamily) {
        classes.push(prefix + 'font-' + parsed.fontFamily);
    }
    if (parsed.textAlign) {
        classes.push(prefix + 'text-' + parsed.textAlign);
    }
    if (parsed.textColor) {
        classes.push(prefix + 'text-' + parsed.textColor);
    }
    if (parsed.lineHeight) {
        classes.push(prefix + 'leading-' + parsed.lineHeight);
    }
    if (parsed.letterSpacing) {
        classes.push(prefix + 'tracking-' + parsed.letterSpacing);
    }
    if (parsed.textDecoration) {
        classes.push(prefix + parsed.textDecoration);
    }
    if (parsed.textTransform) {
        classes.push(prefix + parsed.textTransform);
    }

    // Appearance
    if (parsed.backgroundColor) {
        classes.push(prefix + 'bg-' + parsed.backgroundColor);
    }
    if (parsed.borderRadius) {
        if (parsed.borderRadius === 'default') {
            classes.push(prefix + 'rounded');
        } else {
            classes.push(prefix + 'rounded-' + parsed.borderRadius);
        }
    }
    if (parsed.borderWidth) {
        if (parsed.borderWidth === '1') {
            classes.push(prefix + 'border');
        } else {
            classes.push(prefix + 'border-' + parsed.borderWidth);
        }
    }
    if (parsed.opacity) {
        classes.push(prefix + 'opacity-' + parsed.opacity);
    }
    if (parsed.overflow) {
        classes.push(prefix + 'overflow-' + parsed.overflow);
    }

    // Other classes
    classes.push(...parsed.other);

    return classes.filter(Boolean).join(' ');
}

/**
 * Update a specific property in the parsed classes and return new className string
 */
export function updateClass(
    currentClasses: string,
    property: keyof ParsedClasses | string,
    value: string | undefined,
    breakpoint: Breakpoint = ''
): string {
    const parsed = parseClasses(currentClasses, '');

    // Handle nested properties like padding.t
    if (property.includes('.')) {
        const [parent, child] = property.split('.') as [keyof ParsedClasses, string];
        if (parent === 'padding' && parsed.padding) {
            (parsed.padding as any)[child] = value;
        } else if (parent === 'margin' && parsed.margin) {
            (parsed.margin as any)[child] = value;
        }
    } else {
        (parsed as any)[property] = value;
    }

    return buildClasses(parsed, breakpoint);
}

/**
 * Toggle a class in a className string
 */
export function toggleClass(currentClasses: string, className: string): string {
    const classes = currentClasses.split(/\s+/).filter(Boolean);
    const index = classes.indexOf(className);

    if (index >= 0) {
        classes.splice(index, 1);
    } else {
        classes.push(className);
    }

    return classes.join(' ');
}

/**
 * Add a class to a className string if it doesn't exist
 */
export function addClass(currentClasses: string, className: string): string {
    const classes = currentClasses.split(/\s+/).filter(Boolean);
    if (!classes.includes(className)) {
        classes.push(className);
    }
    return classes.join(' ');
}

/**
 * Remove a class from a className string
 */
export function removeClass(currentClasses: string, className: string): string {
    return currentClasses
        .split(/\s+/)
        .filter(c => c !== className)
        .join(' ');
}

/**
 * Replace classes matching a pattern with a new class
 */
export function replaceClassPattern(
    currentClasses: string,
    pattern: RegExp,
    newClass: string
): string {
    const classes = currentClasses.split(/\s+/).filter(Boolean);
    const filtered = classes.filter(c => !pattern.test(c));
    if (newClass) {
        filtered.push(newClass);
    }
    return filtered.join(' ');
}
