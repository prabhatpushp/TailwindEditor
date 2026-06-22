import { create } from 'zustand';
import { INITIAL_CODE } from './constants';
import { injectBuilderIds, removeBuilderIds } from './html-utils';

export interface ElementInfo {
    tagName: string;
    id?: string;
    className?: string;
    style?: string; // Inline styles
    xpath: string;
    builderId?: string; // Unique ID injected by builder for element identification
    outerHTML?: string;
    openingTag?: string;
    innerText?: string; // Direct text content of the element
    rect: { top: number; left: number; width: number; height: number };
    hierarchy: { tagName: string; rect: { top: number; left: number; width: number; height: number } }[];
}

export interface ElementPosition {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
}

// Tailwind responsive breakpoint type (null = full width, no breakpoint restriction)
export type Breakpoint = "" | "sm:" | "md:" | "lg:" | "xl:" | "2xl:";

interface EditorState {
    code: string; // Code WITH builder IDs
    setCode: (code: string, withBuilderIds?: boolean) => void;
    getCleanCode: () => string; // Get code WITHOUT builder IDs (for export/save)
    isLeftPanelOpen: boolean;
    toggleLeftPanel: () => void;
    isPropertiesPanelOpen: boolean;
    togglePropertiesPanel: () => void;
    isCodePanelOpen: boolean;
    toggleCodePanel: () => void;
    // Selection state
    hoveredElement: ElementInfo | null;
    setHoveredElement: (element: ElementInfo | null) => void;
    selectedElement: ElementInfo | null;
    setSelectedElement: (element: ElementInfo | null) => void;
    // Multi-selection support
    selectedElements: ElementInfo[];
    setSelectedElements: (elements: ElementInfo[]) => void;
    addToSelection: (element: ElementInfo) => void;
    removeFromSelection: (builderId: string) => void;
    toggleSelection: (element: ElementInfo) => void;
    clearSelection: () => void;
    iframeMode: 'edit' | 'preview';
    setIframeMode: (mode: 'edit' | 'preview') => void;
    // Element positions map (builderId -> position in original code)
    elementPositions: Map<string, ElementPosition>;
    setElementPositions: (positions: Map<string, ElementPosition>) => void;
    // Update element classes in code
    updateElementClasses: (builderId: string, newClasses: string) => void;
    // Update element text content in code
    updateElementText: (builderId: string, newText: string) => void;
    // Update element ID in code
    updateElementId: (builderId: string, newId: string) => void;
    // Update element style in code
    updateElementStyle: (builderId: string, newStyle: string) => void;
    // Track last class update for targeted iframe updates
    lastClassUpdate: { builderId: string; newClasses: string } | null;
    // Track last text update for targeted iframe updates
    lastTextUpdate: { builderId: string; newText: string } | null;
    // Track last ID update for targeted iframe updates
    lastIdUpdate: { builderId: string; newId: string } | null;
    // Track last style update for targeted iframe updates
    lastStyleUpdate: { builderId: string; newStyle: string } | null;
    // Clear all last update flags (call after processing targeted updates)
    clearLastUpdates: () => void;
    // Active responsive breakpoint for Tailwind classes (null = full width preview)
    activeBreakpoint: Breakpoint | null;
    setActiveBreakpoint: (breakpoint: Breakpoint | null) => void;
    // Track if AI is currently generating content
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean) => void;
}

// Initialize the code with builder IDs
const initializeCode = (code: string): { code: string; positions: Map<string, ElementPosition> } => {
    // Check if code already has builder IDs
    if (code.includes('data-builder-id=')) {
        return { code, positions: new Map() };
    }
    const { injectedHtml, positions } = injectBuilderIds(code);
    return { code: injectedHtml, positions };
};

const initialCodeResult = initializeCode(INITIAL_CODE);

export const useEditorStore = create<EditorState>((set, get) => ({
    code: initialCodeResult.code,
    setCode: (code, withBuilderIds = false) => {
        if (withBuilderIds) {
            // Code already has builder IDs (e.g., from internal updates)
            set({ code });
        } else {
            // New code without builder IDs - inject them
            const { injectedHtml, positions } = injectBuilderIds(code);
            set({ code: injectedHtml, elementPositions: positions });
        }
    },
    getCleanCode: () => {
        return removeBuilderIds(get().code);
    },
    isLeftPanelOpen: true,
    toggleLeftPanel: () => set((state) => ({ isLeftPanelOpen: !state.isLeftPanelOpen })),
    isPropertiesPanelOpen: true,
    togglePropertiesPanel: () => set((state) => ({ isPropertiesPanelOpen: !state.isPropertiesPanelOpen })),
    isCodePanelOpen: false,
    toggleCodePanel: () => set((state) => ({ isCodePanelOpen: !state.isCodePanelOpen })),
    // Selection state
    hoveredElement: null,
    setHoveredElement: (element) => set({ hoveredElement: element }),
    selectedElement: null,
    setSelectedElement: (element) => set({
        selectedElement: element,
        // Also update selectedElements to stay in sync
        selectedElements: element ? [element] : []
    }),
    // Multi-selection support
    selectedElements: [],
    setSelectedElements: (elements) => set({
        selectedElements: elements,
        selectedElement: elements.length > 0 ? elements[0] : null
    }),
    addToSelection: (element) => set((state) => {
        // Don't add if already selected
        if (state.selectedElements.some(e => e.builderId === element.builderId)) {
            return state;
        }
        const newElements = [...state.selectedElements, element];
        return {
            selectedElements: newElements,
            selectedElement: newElements[0]
        };
    }),
    removeFromSelection: (builderId) => set((state) => {
        const newElements = state.selectedElements.filter(e => e.builderId !== builderId);
        return {
            selectedElements: newElements,
            selectedElement: newElements.length > 0 ? newElements[0] : null
        };
    }),
    toggleSelection: (element) => set((state) => {
        const exists = state.selectedElements.some(e => e.builderId === element.builderId);
        const newElements = exists
            ? state.selectedElements.filter(e => e.builderId !== element.builderId)
            : [...state.selectedElements, element];
        return {
            selectedElements: newElements,
            selectedElement: newElements.length > 0 ? newElements[0] : null
        };
    }),
    clearSelection: () => set({ selectedElements: [], selectedElement: null }),
    iframeMode: 'edit',
    setIframeMode: (mode) => set({ iframeMode: mode }),
    // Element positions
    elementPositions: new Map(),
    setElementPositions: (positions) => set({ elementPositions: positions }),
    // Last class update for targeted iframe messages
    lastClassUpdate: null,
    // Last text update for targeted iframe messages
    lastTextUpdate: null,
    // Last ID update for targeted iframe messages
    lastIdUpdate: null,
    // Last style update for targeted iframe messages
    lastStyleUpdate: null,
    // Clear all last update flags
    clearLastUpdates: () => set({
        lastClassUpdate: null,
        lastTextUpdate: null,
        lastIdUpdate: null,
        lastStyleUpdate: null
    }),
    // Active responsive breakpoint (null = full width)
    activeBreakpoint: null,
    setActiveBreakpoint: (breakpoint) => set({ activeBreakpoint: breakpoint }),
    // Track if AI is currently generating content
    isGenerating: false,
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    // Update element classes in code
    updateElementClasses: (builderId, newClasses) => {
        const { code, selectedElement, selectedElements } = get();

        if (process.env.NODE_ENV === 'development') console.log('[Store] updateElementClasses called:', { builderId, newClasses });

        // Find the element with the given builderId in the code and update its class attribute
        const updatedCode = updateClassInHtml(code, builderId, newClasses);

        // Check if any change was made
        if (updatedCode === code) {
            if (process.env.NODE_ENV === 'development') console.warn('[Store] Warning: No changes made to code. BuilderId may not exist:', builderId);
        } else {
            if (process.env.NODE_ENV === 'development') console.log('[Store] Code updated successfully');
        }

        // Update the selected element's className
        const updatedSelectedElement = selectedElement?.builderId === builderId
            ? { ...selectedElement, className: newClasses }
            : selectedElement;

        // Update className in selectedElements array
        const updatedSelectedElements = selectedElements.map(el =>
            el.builderId === builderId ? { ...el, className: newClasses } : el
        );

        set({
            code: updatedCode,
            selectedElement: updatedSelectedElement,
            selectedElements: updatedSelectedElements,
            lastClassUpdate: { builderId, newClasses }
        });
    },
    // Update element text content in code
    updateElementText: (builderId, newText) => {
        const { code, selectedElement, selectedElements } = get();

        if (process.env.NODE_ENV === 'development') console.log('[Store] updateElementText called:', { builderId, newText });

        // Find the element with the given builderId in the code and update its text content
        const updatedCode = updateTextInHtml(code, builderId, newText);

        // Check if any change was made
        if (updatedCode === code) {
            if (process.env.NODE_ENV === 'development') console.warn('[Store] Warning: No changes made to code. BuilderId may not exist:', builderId);
        } else {
            if (process.env.NODE_ENV === 'development') console.log('[Store] Text updated successfully');
        }

        // Update the selected element's innerText
        const updatedSelectedElement = selectedElement?.builderId === builderId
            ? { ...selectedElement, innerText: newText }
            : selectedElement;

        // Update innerText in selectedElements array
        const updatedSelectedElements = selectedElements.map(el =>
            el.builderId === builderId ? { ...el, innerText: newText } : el
        );

        set({
            code: updatedCode,
            selectedElement: updatedSelectedElement,
            selectedElements: updatedSelectedElements,
            lastTextUpdate: { builderId, newText }
        });
    },
    // Update element ID in code
    updateElementId: (builderId, newId) => {
        const { code, selectedElement, selectedElements } = get();

        if (process.env.NODE_ENV === 'development') console.log('[Store] updateElementId called:', { builderId, newId });

        // Find the element with the given builderId in the code and update its id attribute
        const updatedCode = updateIdInHtml(code, builderId, newId);

        // Check if any change was made
        if (updatedCode === code) {
            if (process.env.NODE_ENV === 'development') console.warn('[Store] Warning: No changes made to code. BuilderId may not exist:', builderId);
        } else {
            if (process.env.NODE_ENV === 'development') console.log('[Store] ID updated successfully');
        }

        // Update the selected element's id
        const updatedSelectedElement = selectedElement?.builderId === builderId
            ? { ...selectedElement, id: newId }
            : selectedElement;

        // Update id in selectedElements array
        const updatedSelectedElements = selectedElements.map(el =>
            el.builderId === builderId ? { ...el, id: newId } : el
        );

        set({
            code: updatedCode,
            selectedElement: updatedSelectedElement,
            selectedElements: updatedSelectedElements,
            lastIdUpdate: { builderId, newId }
        });
    },
    // Update element style in code
    updateElementStyle: (builderId, newStyle) => {
        const { code, selectedElement, selectedElements } = get();

        if (process.env.NODE_ENV === 'development') console.log('[Store] updateElementStyle called:', { builderId, newStyle });

        // Find the element with the given builderId in the code and update its style attribute
        const updatedCode = updateStyleInHtml(code, builderId, newStyle);

        // Check if any change was made
        if (updatedCode === code) {
            if (process.env.NODE_ENV === 'development') console.warn('[Store] Warning: No changes made to code. BuilderId may not exist:', builderId);
        } else {
            if (process.env.NODE_ENV === 'development') console.log('[Store] Style updated successfully');
        }

        // Update the selected element's style
        const updatedSelectedElement = selectedElement?.builderId === builderId
            ? { ...selectedElement, style: newStyle }
            : selectedElement;

        // Update style in selectedElements array
        const updatedSelectedElements = selectedElements.map(el =>
            el.builderId === builderId ? { ...el, style: newStyle } : el
        );

        set({
            code: updatedCode,
            selectedElement: updatedSelectedElement,
            selectedElements: updatedSelectedElements,
            lastStyleUpdate: { builderId, newStyle }
        });
    }
}));

/**
 * Updates the class/className attribute of an element with the given builderId in HTML code
 */
function updateClassInHtml(html: string, builderId: string, newClasses: string): string {
    // Escape special regex characters in builderId
    const escapedId = builderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Find the complete opening tag that contains this data-builder-id
    const tagPattern = new RegExp(
        `(<[a-zA-Z][a-zA-Z0-9]*[^>]*data-builder-id="${escapedId}"[^>]*>)`,
        'g'
    );

    return html.replace(tagPattern, (fullTag) => {
        // Check if this is JSX (uses className) or HTML (uses class)
        const isJsx = fullTag.includes('className=') || html.includes('React') || html.includes('jsx');
        const classAttr = isJsx ? 'className' : 'class';

        // Pattern to match existing class/className attribute with value
        const existingClassPattern = new RegExp(`\\s${classAttr}=["']([^"']*)["']`);

        if (existingClassPattern.test(fullTag)) {
            // Replace existing class value
            return fullTag.replace(existingClassPattern, ` ${classAttr}="${newClasses}"`);
        } else {
            // Add new class attribute after the opening < and tag name
            // Find the position after the tag name
            const tagNameMatch = fullTag.match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
            if (tagNameMatch) {
                const tagName = tagNameMatch[0]; // e.g., "<div"
                return fullTag.replace(tagName, `${tagName} ${classAttr}="${newClasses}"`);
            }
        }
        return fullTag;
    });
}

/**
 * Updates the text content of an element with the given builderId in HTML code.
 * This function handles both simple text content and preserves child elements.
 */
function updateTextInHtml(html: string, builderId: string, newText: string): string {
    // Escape special regex characters in builderId
    const escapedId = builderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // This is a tricky operation - we need to find the complete element (opening + content + closing)
    // and only update the text content while preserving any child elements

    // Pattern to find complete element with data-builder-id
    // This regex captures: opening tag, content (including nested elements), closing tag
    const tagNamePattern = new RegExp(`<([a-zA-Z][a-zA-Z0-9]*)[^>]*data-builder-id="${escapedId}"[^>]*>`);
    const tagMatch = html.match(tagNamePattern);

    if (!tagMatch) return html;

    const tagName = tagMatch[1];
    const openingTagIndex = html.indexOf(tagMatch[0]);

    if (openingTagIndex === -1) return html;

    // For self-closing tags, we can't update text content
    if (tagMatch[0].endsWith('/>')) return html;

    // Find the matching closing tag
    const closingTag = `</${tagName}>`;
    let depth = 1;
    let searchStart = openingTagIndex + tagMatch[0].length;
    let closingTagIndex = -1;

    // Simple approach: find first closing tag of same name after opening tag
    // This works for most cases but may not handle all nested cases perfectly
    const sameTagOpenPattern = new RegExp(`<${tagName}(?:\\s|>)`, 'gi');
    const sameTagClosePattern = new RegExp(`</${tagName}>`, 'gi');

    // Find the correct closing tag by counting depth
    let pos = searchStart;
    while (pos < html.length && depth > 0) {
        const remainingHtml = html.substring(pos);

        const nextOpen = remainingHtml.search(sameTagOpenPattern);
        const nextClose = remainingHtml.search(sameTagClosePattern);

        if (nextClose === -1) break; // No closing tag found

        if (nextOpen !== -1 && nextOpen < nextClose) {
            // Found another opening tag before closing
            depth++;
            pos += nextOpen + 1;
        } else {
            // Found closing tag
            depth--;
            if (depth === 0) {
                closingTagIndex = pos + nextClose;
            } else {
                pos += nextClose + closingTag.length;
            }
        }
    }

    if (closingTagIndex === -1) return html;

    // Get the content between opening and closing tags
    const openingTagEnd = openingTagIndex + tagMatch[0].length;
    const currentContent = html.substring(openingTagEnd, closingTagIndex);

    // Check if there are child elements in the content
    const hasChildElements = /<[a-zA-Z][^>]*>/.test(currentContent);

    if (hasChildElements) {
        // If there are child elements, we can't simply replace the text
        // For now, log a warning and return unchanged
        console.warn('[updateTextInHtml] Element has child elements, skipping text update to preserve structure');
        return html;
    }

    // Replace the content with the new text
    const newHtml = html.substring(0, openingTagEnd) + newText + html.substring(closingTagIndex);
    return newHtml;
}

/**
 * Updates the id attribute of an element with the given builderId in HTML code
 */
function updateIdInHtml(html: string, builderId: string, newId: string): string {
    // Escape special regex characters in builderId
    const escapedId = builderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Find the complete opening tag that contains this data-builder-id
    const tagPattern = new RegExp(
        `(<[a-zA-Z][a-zA-Z0-9]*[^>]*data-builder-id="${escapedId}"[^>]*>)`,
        'g'
    );

    return html.replace(tagPattern, (fullTag) => {
        // Pattern to match existing id attribute with value
        const existingIdPattern = /\sid=["']([^"']*)["']/;

        if (newId) {
            // We want to set an ID
            if (existingIdPattern.test(fullTag)) {
                // Replace existing id value
                return fullTag.replace(existingIdPattern, ` id="${newId}"`);
            } else {
                // Add new id attribute after the opening < and tag name
                const tagNameMatch = fullTag.match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
                if (tagNameMatch) {
                    const tagName = tagNameMatch[0]; // e.g., "<div"
                    return fullTag.replace(tagName, `${tagName} id="${newId}"`);
                }
            }
        } else {
            // Empty ID - remove the id attribute
            if (existingIdPattern.test(fullTag)) {
                return fullTag.replace(existingIdPattern, '');
            }
        }
        return fullTag;
    });
}

/**
 * Updates the style attribute of an element with the given builderId in HTML code
 */
function updateStyleInHtml(html: string, builderId: string, newStyle: string): string {
    // Escape special regex characters in builderId
    const escapedId = builderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Find the complete opening tag that contains this data-builder-id
    const tagPattern = new RegExp(
        `(<[a-zA-Z][a-zA-Z0-9]*[^>]*data-builder-id="${escapedId}"[^>]*>)`,
        'g'
    );

    return html.replace(tagPattern, (fullTag) => {
        // Pattern to match existing style attribute with value
        const existingStylePattern = /\sstyle=["']([^"']*)["']/;

        if (newStyle) {
            // We want to set a style
            if (existingStylePattern.test(fullTag)) {
                // Replace existing style value
                return fullTag.replace(existingStylePattern, ` style="${newStyle}"`);
            } else {
                // Add new style attribute after the opening < and tag name
                const tagNameMatch = fullTag.match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
                if (tagNameMatch) {
                    const tagName = tagNameMatch[0]; // e.g., "<div"
                    return fullTag.replace(tagName, `${tagName} style="${newStyle}"`);
                }
            }
        } else {
            // Empty style - remove the style attribute
            if (existingStylePattern.test(fullTag)) {
                return fullTag.replace(existingStylePattern, '');
            }
        }
        return fullTag;
    });
}
