import { useState, useRef, useEffect, useCallback } from "react";
import { FileCode, RotateCcw, Copy, RefreshCw, Check, Save, Flag, X, Undo2, Trash2, ExternalLink, Plus, Search } from "lucide-react";
import { cn, openInNewTab } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ToolbarButton } from "@/components/editor/toolbar-button";
import { INITIAL_CODE } from "@/lib/constants";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPortal } from "react-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

import { useEditorStore, ElementInfo } from "@/lib/store";
import { useEditorContext } from "@/lib/editor-context";
import { getAllBlocks, getAllSections, getAllTemplates, BlockItem } from "@/lib/blocks-data";

interface Checkpoint {
    id: number;
    title: string;
    code: string;
    timestamp: string;
}

// Generate the iframe injection script for element selection
// Uses direct element styling (outline) for zero-lag scroll tracking
const generateIframeScript = (mode: "edit" | "preview"): string => {
    return `
<style id="__builder-styles__">
    /* Selection styles applied directly to elements */
    .__builder-hover__ {
        outline: 2px solid #3b82f6 !important;
        outline-offset: -2px !important;
    }
    .__builder-hover-parent__ {
        outline: 2px dashed rgba(59, 130, 246, 0.5) !important;
        outline-offset: -2px !important;
    }
    .__builder-hover-grandparent__ {
        outline: 2px dashed rgba(59, 130, 246, 0.3) !important;
        outline-offset: -2px !important;
    }
    .__builder-selected__ {
        outline: 2px solid #f97316 !important;
        outline-offset: -2px !important;
        box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.2) !important;
    }
    
    /* Tag label that follows the element */
    .__builder-tag__ {
        position: absolute;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
        padding: 4px 10px;
        border-radius: 4px;
        color: white;
        white-space: nowrap;
        z-index: 999999;
        pointer-events: none;
        transform: translateY(-100%) translateY(-4px);
    }
    .__builder-tag__.hover {
        background: #3b82f6;
    }
    .__builder-tag__.selected {
        background: #f97316;
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 0;
        padding: 0;
        border-radius: 6px;
        overflow: hidden;
    }
    .__builder-tag__.selected .tag-name {
        padding: 6px 10px;
    }
    .__builder-tag__.selected .nav-btn {
        padding: 6px 8px;
        background: transparent;
        border: none;
        border-left: 1px solid #ea580c;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: opacity 0.15s, background 0.15s;
    }
    .__builder-tag__.selected .nav-btn:hover:not(.disabled) {
        background: #ea580c;
    }
    .__builder-tag__.selected .nav-btn.disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }
    
    /* Parent tag button */
    .__builder-parent-btn__ {
        position: absolute;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 11px;
        font-weight: 600;
        padding: 6px 10px;
        border-radius: 6px;
        background: #fb923c;
        color: white;
        border: none;
        cursor: pointer;
        z-index: 999999;
        transform: translateY(-100%) translateY(-4px);
        display: flex;
        align-items: center;
        gap: 4px;
        box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
    }
    .__builder-parent-btn__:hover {
        background: #f97316;
    }
    
    /* Bottom toolbar */
    .__builder-toolbar__ {
        position: absolute;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        flex-direction: column;
        gap: 8px;
        transform: translateY(8px);
    }
    .__builder-toolbar__ .btn-row {
        display: flex;
        gap: 6px;
    }
    .__builder-toolbar__ .action-btn {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f97316;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        transition: transform 0.1s, background 0.1s;
    }
    .__builder-toolbar__ .action-btn:hover {
        background: #ea580c;
        transform: scale(1.05);
    }
    
    /* Context Menu */
    .__builder-context-menu__ {
        position: fixed;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        z-index: 1000000;
        padding: 4px;
        min-width: 180px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        opacity: 0;
        animation: menu-fade-in 0.1s ease forwards;
    }
    @keyframes menu-fade-in {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    .__builder-context-menu__ button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        width: 100%;
        text-align: left;
        background: transparent;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        color: #334155;
        cursor: pointer;
        font-family: system-ui, -apple-system, sans-serif;
        transition: all 0.15s;
    }
    .__builder-context-menu__ button:hover:not(:disabled) {
        background: #eff6ff;
        color: #2563eb;
    }
    .__builder-context-menu__ button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
    .__builder-context-menu__ .menu-divider {
        height: 1px;
        background: #f1f5f9;
        margin: 2px 0;
    }
    .__builder-context-menu__ .menu-label {
        padding: 4px 10px;
        font-size: 10px;
        font-weight: 600;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    
    /* Drop indicator line during drag and drop */
    .__builder-drop-indicator__ {
        position: relative;
        width: 100%;
        height: 4px;
        background: #3b82f6;
        border-radius: 2px;
        margin: 8px 0;
        z-index: 999999;
        pointer-events: none;
        box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
        animation: pulse-glow 1.5s ease-in-out infinite;
    }
    .__builder-drop-indicator__::before,
    .__builder-drop-indicator__::after {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
        background: #3b82f6;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
    }
    .__builder-drop-indicator__::before {
        left: -6px;
    }
    .__builder-drop-indicator__::after {
        right: -6px;
    }
    @keyframes pulse-glow {
        0%, 100% { opacity: 1; box-shadow: 0 0 12px rgba(59, 130, 246, 0.6); }
        50% { opacity: 0.8; box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
    }
    
    /* Enhanced drop indicator line for element reordering */
    .__builder-drop-line__ {
        position: fixed;
        background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%);
        z-index: 999999;
        pointer-events: none;
        border-radius: 2px;
        box-shadow: 0 0 8px rgba(16, 185, 129, 0.6), 0 0 20px rgba(16, 185, 129, 0.3);
    }
    .__builder-drop-line__.horizontal {
        height: 4px;
        animation: builder-drop-line-pulse 1s ease-in-out infinite;
    }
    .__builder-drop-line__.vertical {
        width: 4px;
        animation: builder-drop-line-pulse 1s ease-in-out infinite;
    }
    .__builder-drop-line__::before,
    .__builder-drop-line__::after {
        content: '';
        position: absolute;
        width: 12px;
        height: 12px;
        background: #10b981;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .__builder-drop-line__.horizontal::before {
        left: -6px;
        top: 50%;
        transform: translateY(-50%);
    }
    .__builder-drop-line__.horizontal::after {
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
    }
    .__builder-drop-line__.vertical::before {
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
    }
    .__builder-drop-line__.vertical::after {
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
    }
    
    /* Inside container indicator for drop */
    .__builder-drop-inside__ {
        position: fixed;
        border: 3px dashed #10b981;
        background: rgba(16, 185, 129, 0.08);
        z-index: 999998;
        pointer-events: none;
        border-radius: 8px;
        animation: builder-drop-inside-pulse 1s ease-in-out infinite;
    }
    .__builder-drop-inside__::after {
        content: 'Drop inside';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #10b981;
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    @keyframes builder-drop-line-pulse {
        0%, 100% { opacity: 1; transform: scaleX(1); }
        50% { opacity: 0.8; }
    }
    @keyframes builder-drop-inside-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    /* Drag ghost - preview of element being dragged */
    .__builder-drag-ghost__ {
        position: fixed;
        pointer-events: none;
        z-index: 999999;
        opacity: 0.9;
        border-radius: 8px;
        box-shadow: 0 25px 50px rgba(0,0,0,0.25), 0 0 0 2px #3b82f6;
        transform: rotate(2deg) scale(1.02);
        transition: transform 0.1s ease;
        overflow: hidden;
        background: white;
    }
    
    /* Element being dragged */
    .__builder-dragging__ {
        opacity: 0.4 !important;
        outline: 2px dashed #94a3b8 !important;
        transform: scale(0.98);
    }
    
    /* Drop target highlight */
    .__builder-drop-target__ {
        outline: 2px solid #10b981 !important;
        outline-offset: 2px !important;
    }

    /* Blue theme for section dragging */
    .__builder-drop-line__.blue-theme {
        background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%);
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.3);
    }
    .__builder-drop-line__.blue-theme::before,
    .__builder-drop-line__.blue-theme::after {
        background: #3b82f6;
    }
    
    .__builder-drop-inside__.blue-theme {
        border-color: #3b82f6;
        background: rgba(59, 130, 246, 0.08);
    }
    .__builder-drop-inside__.blue-theme::after {
        background: #3b82f6;
    }

    
    ${
        mode === "edit"
            ? `
    body * {
        cursor: default !important;
    }
    .__builder-tag__, .__builder-parent-btn__, .__builder-toolbar__ *, .__builder-context-menu__ button {
        cursor: pointer !important;
    }

    `
            : ""
    }

</style>


<script>
(function() {
    const MODE = '${mode}';
    let currentHoveredElement = null;
    let currentSelectedElement = null;
    let tagLabel = null;
    let parentBtn = null;
    let toolbar = null;
    let contextMenu = null;
    
    // Drag and drop state (for blocks from panel)
    let dropIndicator = null;
    let currentDropTarget = null;
    let currentDropPosition = null;
    
    // Element reordering drag state
    let isDragging = false;
    let draggedElement = null;
    let dragStartPos = null;
    let dragGhost = null;
    let dragDropIndicator = null;
    
    // SVG icons
    const icons = {
        arrowUp: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
        arrowDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
        arrowLeft: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
        arrowRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
        plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
        refresh: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
        more: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
        trash: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>'
    };
    
    // Helper to get element xpath
    function getXPath(element) {
        if (!element) return '';
        if (element === document.body) return '/html/body';
        
        let path = '';
        let current = element;
        while (current && current !== document.body && current !== document.documentElement) {
            let tag = current.tagName.toLowerCase();
            let index = 1;
            let sibling = current.previousElementSibling;
            while (sibling) {
                if (sibling.tagName.toLowerCase() === tag) index++;
                sibling = sibling.previousElementSibling;
            }
            path = '/' + tag + '[' + index + ']' + path;
            current = current.parentElement;
        }
        return '/html/body' + path;
    }
    
    // Extract opening tag from element
    function getOpeningTag(element) {
        const html = element.outerHTML;
        // Match from < to the first > (opening tag only)
        const match = html.match(/^<[^>]+>/);
        return match ? match[0] : '<' + element.tagName.toLowerCase() + '>';
    }
    
    // Create element info object for postMessage
    function createElementInfo(element) {
        if (!element || element === document.documentElement || element === document) return null;
        
        // Get className and filter out builder-specific classes
        let className = typeof element.className === 'string' ? element.className : '';
        const builderClasses = ['__builder-hover__', '__builder-hover-parent__', '__builder-hover-grandparent__', '__builder-selected__'];
        className = className.split(' ').filter(c => c && !builderClasses.includes(c)).join(' ');
        
        // Get direct text content (without child element text)
        // This only gets direct text nodes, not text from child elements
        let directText = '';
        for (let node of element.childNodes) {
            if (node.nodeType === 3) { // Text node
                directText += node.textContent;
            }
        }
        directText = directText.trim();
        
        // If no direct text, try innerText for simple elements
        const hasChildElements = element.querySelector('*') !== null;
        const innerText = hasChildElements ? directText : element.innerText || directText;
        
        // Get inline style attribute
        const style = element.getAttribute('style') || undefined;
        
        return {
            tagName: element.tagName,
            id: element.id || undefined,
            className: className || undefined,
            style: style,
            xpath: getXPath(element),
            builderId: element.getAttribute('data-builder-id') || undefined,
            openingTag: getOpeningTag(element),
            innerText: innerText || undefined
        };
    }
    
    // Extract clean HTML from the document (without builder artifacts)
    function getCleanHtml() {
        // Clone the document to avoid modifying the live DOM
        const clone = document.documentElement.cloneNode(true);
        
        // Remove builder UI elements
        clone.querySelectorAll('.__builder-tag__, .__builder-parent-btn__, .__builder-toolbar__, .__builder-context-menu__, .__builder-drop-indicator__, .__builder-drop-line__, .__builder-drop-inside__, .__builder-drag-ghost__, #__builder-styles__, script').forEach(el => {

            // Only remove scripts that are builder-related (contain __builder or specific patterns)
            if (el.tagName === 'SCRIPT') {
                const content = el.textContent || '';
                if (content.includes('__builder') || content.includes('iframe-builder')) {
                    el.remove();
                }
            } else {
                el.remove();
            }
        });
        
        // Remove builder styles
        clone.querySelectorAll('style#__builder-styles__').forEach(el => el.remove());
        
        // Remove builder classes from all elements
        const builderClasses = [
            '__builder-hover__',
            '__builder-hover-parent__',
            '__builder-hover-grandparent__',
            '__builder-selected__',
            '__builder-dragging__',
            '__builder-drop-target__'
        ];
        clone.querySelectorAll('*').forEach(el => {
            builderClasses.forEach(cls => el.classList.remove(cls));
            // Remove data-has-hover-tag attribute
            el.removeAttribute('data-has-hover-tag');
            // Clean up empty class attributes
            if (el.getAttribute('class') === '') {
                el.removeAttribute('class');
            }
        });
        
        // Get the full HTML
        return '<!DOCTYPE html>\\n' + clone.outerHTML;
    }
    
    // Post message to parent
    function postToParent(type, data) {
        window.parent.postMessage({ source: 'iframe-builder', type, data }, '*');
    }
    
    // Check if element is a builder UI element
    function isBuilderElement(element) {
        if (!element) return false;
        return element.classList && (
            element.classList.contains('__builder-tag__') ||
            element.classList.contains('__builder-parent-btn__') ||
            element.classList.contains('__builder-toolbar__') ||
            element.classList.contains('__builder-context-menu__') ||
            element.classList.contains('__builder-drop-indicator__') ||
            element.classList.contains('__builder-drop-line__') ||
            element.classList.contains('__builder-drop-inside__') ||
            element.classList.contains('__builder-drag-ghost__') ||
            element.closest('.__builder-tag__') ||
            element.closest('.__builder-toolbar__') ||
            element.closest('.__builder-context-menu__')
        );
    }

    
    // Clear all builder classes from all elements
    function clearAllBuilderClasses() {
        const classes = [
            '__builder-hover__',
            '__builder-hover-parent__', 
            '__builder-hover-grandparent__',
            '__builder-selected__'
        ];
        classes.forEach(cls => {
            document.querySelectorAll('.' + cls).forEach(el => el.classList.remove(cls));
        });
    }
    
    // Check if element is a descendant of parent
    function isDescendant(parent, child) {
        if (!parent || !child) return false;
        let node = child.parentElement;
        while (node) {
            if (node === parent) return true;
            node = node.parentElement;
        }
        return false;
    }

    // Check if element is an empty container that can accept children
    function isEmptyContainer(el) {
        const containerTags = ['div', 'section', 'header', 'footer', 'main', 'aside', 'nav', 'article', 'ul', 'ol', 'form'];
        if (!containerTags.includes(el.tagName.toLowerCase())) return false;
        
        // Check if it has no element children (only text nodes or empty)
        // We only care about children that are part of the page, not builder UI
        const children = Array.from(el.children).filter(c => !isBuilderElement(c));
        return children.length === 0;
    }
    
    // Determine the parent's layout direction
    // Determine the parent's layout direction
    function getParentLayoutInfo(el) {
        // Check element's own characteristics first
        const elStyle = window.getComputedStyle(el);
        const elDisplay = elStyle.display;
        const isSelfInline = elDisplay.includes('inline') || elStyle.float !== 'none';
        
        const parent = el.parentElement;
        if (!parent) return { isHorizontal: isSelfInline, gap: 0, parent: null };
        
        const style = window.getComputedStyle(parent);
        const display = style.display;
        const flexDir = style.flexDirection;
        const isParentHorizontal = (display === 'flex' || display === 'inline-flex') && 
                             (flexDir === 'row' || flexDir === 'row-reverse');
        
        const isHorizontal = isSelfInline || isParentHorizontal;
        
        const gap = parseInt(style.gap) || parseInt(style.columnGap) || 0;
        
        return { isHorizontal, gap, parent };
    }

    // Calculate drop position based on mouse position
    function calculateDropPosition(mouseX, mouseY, target) {
        const rect = target.getBoundingClientRect();
        const { isHorizontal } = getParentLayoutInfo(target);
        
        // Check if target is an empty container - allow dropping inside
        if (isEmptyContainer(target)) {
            // Check if mouse is well within the container bounds
            const padding = 15;
            if (mouseX > rect.left + padding && mouseX < rect.right - padding &&
                mouseY > rect.top + padding && mouseY < rect.bottom - padding) {
                return 'inside';
            }
        }
        
        if (isHorizontal) {
            // Horizontal layout - left/right split
            const midX = rect.left + rect.width / 2;
            return mouseX < midX ? 'before' : 'after';
        } else {
            // Vertical layout - top/bottom split
            const midY = rect.top + rect.height / 2;
            return mouseY < midY ? 'before' : 'after';
        }
    }

    function removeDropIndicator() {
        if (dropIndicator && dropIndicator.parentNode) dropIndicator.remove();
        if (dragDropIndicator && dragDropIndicator.parentNode) dragDropIndicator.remove();
        
        // Aggressive cleanup using live collections
        const lines = document.getElementsByClassName('__builder-drop-line__');
        while (lines.length > 0) {
            lines[0].remove();
        }
        
        const boxes = document.getElementsByClassName('__builder-drop-inside__');
        while (boxes.length > 0) {
            boxes[0].remove();
        }
        
        document.querySelectorAll('.__builder-drop-target__').forEach(el => el.classList.remove('__builder-drop-target__'));
        
        dropIndicator = null;
        dragDropIndicator = null;
        currentDropTarget = null;
        currentDropPosition = null;
    }

    // Show the enhanced drop indicator at the correct position
    function showDropIndicatorEnhanced(target, position, x, y) {
        // Clear previous indicators
        removeDropIndicator();
        if (!target) return;
        
        const rect = target.getBoundingClientRect();
        const { isHorizontal, gap, parent } = getParentLayoutInfo(target);
        const isSection = draggedElement?.tagName === 'SECTION' || window._isDraggingSection;

        // For fixed position elements, we don't add scroll offsets
        
        if (position === 'inside') {
            // Show container highlight for "inside" drop
            dragDropIndicator = document.createElement('div');
            dragDropIndicator.className = '__builder-drop-inside__';
            if (isSection) {
                dragDropIndicator.classList.add('blue-theme');
            }
            dragDropIndicator.style.cssText = 'left:' + rect.left + 'px;top:' + rect.top + 'px;width:' + rect.width + 'px;height:' + rect.height + 'px;';
            document.body.appendChild(dragDropIndicator);
            target.classList.add('__builder-drop-target__');
        } else {
            // Show line indicator for before/after
            dragDropIndicator = document.createElement('div');
            dragDropIndicator.className = '__builder-drop-line__';
            if (isSection) {
                dragDropIndicator.classList.add('blue-theme');
            }
            
            if (isHorizontal) {
                // Vertical line for horizontal layouts
                dragDropIndicator.classList.add('vertical');
                const lineX = position === 'before' 
                    ? rect.left - (gap / 2) - 2
                    : rect.right + (gap / 2) - 2;
                dragDropIndicator.style.cssText = 'left:' + lineX + 'px;top:' + rect.top + 'px;height:' + rect.height + 'px;';
            } else {
                // Horizontal line for vertical layouts
                dragDropIndicator.classList.add('horizontal');
                const parentRect = parent ? parent.getBoundingClientRect() : rect;
                const lineY = position === 'before'
                    ? rect.top - (gap / 2) - 2
                    : rect.bottom + (gap / 2) - 2;
                // Line spans the parent width for better visibility
                // Ensure we handle non-element parents or root correctly
                const parentLeft = parent && parent !== document.body ? parentRect.left : rect.left;
                const parentWidth = parent && parent !== document.body ? parentRect.width : rect.width;
                
                dragDropIndicator.style.cssText = 'left:' + parentLeft + 'px;top:' + lineY + 'px;width:' + parentWidth + 'px;';
            }
            
            document.body.appendChild(dragDropIndicator);
            target.classList.add('__builder-drop-target__');
        }
        
        currentDropTarget = target;
        currentDropPosition = position;
    }

    // Remove UI elements - thorough cleanup
    function removeUI() {
        // Remove main UI elements
        if (tagLabel) { tagLabel.remove(); tagLabel = null; }
        if (parentBtn) { parentBtn.remove(); parentBtn = null; }
        if (parentBtn) { parentBtn.remove(); parentBtn = null; }
        if (toolbar) { toolbar.remove(); toolbar = null; }
        if (contextMenu) { contextMenu.remove(); contextMenu = null; }
        
        // Also remove any orphaned builder UI elements
        document.querySelectorAll('.__builder-tag__, .__builder-parent-btn__, .__builder-toolbar__, .__builder-context-menu__').forEach(el => {
            el.remove();
        });
        
        // Clean up hover tags stored on elements
        document.querySelectorAll('[data-has-hover-tag]').forEach(el => {
            if (el.__hoverTag) {
                el.__hoverTag.remove();
                delete el.__hoverTag;
            }
            el.removeAttribute('data-has-hover-tag');
        });
    }
    
    // Position element relative to target
    function positionElement(el, target, position) {
        const rect = target.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        
        if (position === 'top-left') {
            el.style.left = (rect.left + scrollX) + 'px';
            el.style.top = (rect.top + scrollY) + 'px';
        } else if (position === 'top-right') {
            el.style.left = (rect.left + scrollX + rect.width) + 'px';
            el.style.top = (rect.top + scrollY) + 'px';
        } else if (position === 'bottom-left') {
            el.style.left = (rect.left + scrollX) + 'px';
            el.style.top = (rect.bottom + scrollY) + 'px';
        }
    }
    
    // Apply hierarchy classes
    function applyHierarchyClasses(element, prefix) {
        let current = element.parentElement;
        let depth = 0;
        while (current && current !== document.body && current !== document.documentElement) {
            if (depth === 0) {
                current.classList.add(prefix + '-parent__');
            } else if (depth === 1) {
                current.classList.add(prefix + '-grandparent__');
            }
            // For deeper levels, we could add more classes if needed
            current = current.parentElement;
            depth++;
        }
    }
    
    // Update visual state
    function updateVisuals() {
        clearAllBuilderClasses();
        removeUI();
        
        if (MODE !== 'edit') return;
        
        // Apply selected element classes
        if (currentSelectedElement) {
            currentSelectedElement.classList.add('__builder-selected__');
            // No hierarchy classes for selected element - only show the selected element itself
            
            const parent = currentSelectedElement.parentElement;
            
            // Detect if parent uses row layout (flex-direction: row or inline elements)
            let isRowLayout = false;
            if (parent && parent !== document.body && parent !== document.documentElement) {
                const parentStyle = window.getComputedStyle(parent);
                const isFlexRow = parentStyle.display === 'flex' && 
                    (parentStyle.flexDirection === 'row' || parentStyle.flexDirection === 'row-reverse');
                const isInlineBlock = parentStyle.display === 'inline-block' || parentStyle.display === 'inline-flex';
                const isGrid = parentStyle.display === 'grid';
                // Check if grid has more columns than rows (rough heuristic for row-like layout)
                isRowLayout = isFlexRow || isInlineBlock;
            }
            
            // Check if element has previous/next siblings (skip builder UI elements)
            let prevSibling = currentSelectedElement.previousElementSibling;
            while (prevSibling && isBuilderElement(prevSibling)) {
                prevSibling = prevSibling.previousElementSibling;
            }
            let nextSibling = currentSelectedElement.nextElementSibling;
            while (nextSibling && isBuilderElement(nextSibling)) {
                nextSibling = nextSibling.nextElementSibling;
            }
            
            const hasPrev = !!prevSibling;
            const hasNext = !!nextSibling;
            
            // Choose appropriate icons based on layout
            const prevIcon = isRowLayout ? icons.arrowLeft : icons.arrowUp;
            const nextIcon = isRowLayout ? icons.arrowRight : icons.arrowDown;
            const prevTitle = isRowLayout ? 'Move left' : 'Move up';
            const nextTitle = isRowLayout ? 'Move right' : 'Move down';
            
            // Create tag label for selected
            tagLabel = document.createElement('div');
            tagLabel.className = '__builder-tag__ selected';
            tagLabel.innerHTML = \`
                <span class="tag-name">\${currentSelectedElement.tagName}</span>
                <button class="nav-btn\${!hasPrev ? ' disabled' : ''}" data-action="prev" title="\${prevTitle}" \${!hasPrev ? 'disabled' : ''}>\${prevIcon}</button>
                <button class="nav-btn\${!hasNext ? ' disabled' : ''}" data-action="next" title="\${nextTitle}" \${!hasNext ? 'disabled' : ''}>\${nextIcon}</button>
            \`;
            document.body.appendChild(tagLabel);
            positionElement(tagLabel, currentSelectedElement, 'top-left');
            
            // Add click handlers to nav buttons (move element)
            tagLabel.querySelectorAll('.nav-btn:not(.disabled)').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    moveElement(btn.dataset.action);
                });
            });
            
            // Create parent button if parent exists (parent was already declared above)
            if (parent && parent !== document.body && parent !== document.documentElement) {
                parentBtn = document.createElement('button');
                parentBtn.className = '__builder-parent-btn__';
                parentBtn.innerHTML = '↑ ' + parent.tagName;
                parentBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectParent();
                });
                document.body.appendChild(parentBtn);
                
                // Position next to tag label
                const tagRect = tagLabel.getBoundingClientRect();
                parentBtn.style.left = (tagRect.right + window.scrollX + 6) + 'px';
                parentBtn.style.top = (tagRect.top + window.scrollY) + 'px';
                parentBtn.style.transform = 'none';
            }
            
            // Create bottom toolbar
            toolbar = document.createElement('div');
            toolbar.className = '__builder-toolbar__';
            toolbar.innerHTML = \`
                <div class="btn-row">
                    <button class="action-btn" data-action="add" title="Add">\${icons.plus}</button>
                    <button class="action-btn" data-action="delete" title="Delete" style="background: #ef4444;">\${icons.trash}</button>
                </div>
            \`;
            document.body.appendChild(toolbar);
            positionElement(toolbar, currentSelectedElement, 'bottom-left');
            
            // Add click handlers
            toolbar.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    
                    if (action === 'add') {
                        showContextMenu(btn);
                    } else if (action === 'delete') {
                        deleteElement(currentSelectedElement);
                    } else {
                        postToParent('toolbar-action', { action });
                    }
                });
            });
        }
        
        // Apply hovered element classes (if different from selected)
        if (currentHoveredElement && currentHoveredElement !== currentSelectedElement) {
            currentHoveredElement.classList.add('__builder-hover__');
            applyHierarchyClasses(currentHoveredElement, '__builder-hover');
            
            // Create simple hover tag (only if not selected)
            if (!currentSelectedElement || currentHoveredElement !== currentSelectedElement) {
                const hoverTag = document.createElement('div');
                hoverTag.className = '__builder-tag__ hover';
                hoverTag.textContent = currentHoveredElement.tagName;
                if (currentHoveredElement.id) {
                    hoverTag.textContent += ' #' + currentHoveredElement.id;
                }
                document.body.appendChild(hoverTag);
                positionElement(hoverTag, currentHoveredElement, 'top-left');
                
                // Store reference so we can remove it, and mark element for cleanup
                currentHoveredElement.__hoverTag = hoverTag;
                currentHoveredElement.setAttribute('data-has-hover-tag', 'true');
            }
        }
    }
    
    // Select parent element
    function selectParent() {
        if (currentSelectedElement && currentSelectedElement.parentElement && 
            currentSelectedElement.parentElement !== document.body &&
            currentSelectedElement.parentElement !== document.documentElement) {
            currentSelectedElement = currentSelectedElement.parentElement;
            updateVisuals();
            postToParent('element-select', createElementInfo(currentSelectedElement));
        }
    }
    
    // Move element within its parent (reorder)
    function moveElement(direction) {
        if (!currentSelectedElement) return;
        
        const parent = currentSelectedElement.parentElement;
        if (!parent || parent === document.documentElement) return;

        
        // Determine if parent is row or column layout
        const parentStyle = window.getComputedStyle(parent);
        const isRow = parentStyle.display === 'flex' && 
                      (parentStyle.flexDirection === 'row' || parentStyle.flexDirection === 'row-reverse');
        const isGrid = parentStyle.display === 'grid';
        
        // For row layouts: left/right arrows move, for column: up/down
        // Since we only have left/right arrows, they work for both by moving prev/next
        
        let targetSibling;
        if (direction === 'prev') {
            // Move backward (left in row, up in column)
            targetSibling = currentSelectedElement.previousElementSibling;
            // Skip builder UI elements
            while (targetSibling && isBuilderElement(targetSibling)) {
                targetSibling = targetSibling.previousElementSibling;
            }
            if (targetSibling) {
                parent.insertBefore(currentSelectedElement, targetSibling);
            }
        } else {
            // Move forward (right in row, down in column)
            targetSibling = currentSelectedElement.nextElementSibling;
            // Skip builder UI elements
            while (targetSibling && isBuilderElement(targetSibling)) {
                targetSibling = targetSibling.nextElementSibling;
            }
            if (targetSibling) {
                // Insert after the sibling
                const afterSibling = targetSibling.nextElementSibling;
                if (afterSibling) {
                    parent.insertBefore(currentSelectedElement, afterSibling);
                } else {
                    parent.appendChild(currentSelectedElement);
                }
            }
        }
        
        // Update visuals and notify parent with updated HTML
        updateVisuals();
        postToParent('element-moved', {
            element: createElementInfo(currentSelectedElement),
            direction: direction,
            html: getCleanHtml()
        });
    }
    
    // Handle mouseover
    function handleMouseOver(e) {
        if (MODE !== 'edit') return;
        
        const target = e.target;
        if (isBuilderElement(target)) return;
        if (target === document.body || target === document.documentElement) return;
        if (target === currentHoveredElement) return;
        
        // Remove previous hover tag if exists
        if (currentHoveredElement && currentHoveredElement.__hoverTag) {
            currentHoveredElement.__hoverTag.remove();
            delete currentHoveredElement.__hoverTag;
        }
        
        currentHoveredElement = target;
        updateVisuals();
        postToParent('element-hover', createElementInfo(target));
    }
    
    // Handle mouseout
    function handleMouseOut(e) {
        if (MODE !== 'edit') return;
        if (isBuilderElement(e.relatedTarget)) return;
        
        // Check if we're leaving to body/html or outside
        if (!e.relatedTarget || e.relatedTarget === document.body || e.relatedTarget === document.documentElement) {
            if (currentHoveredElement && currentHoveredElement.__hoverTag) {
                currentHoveredElement.__hoverTag.remove();
                delete currentHoveredElement.__hoverTag;
            }
            currentHoveredElement = null;
            updateVisuals();
            postToParent('element-hover', null);
        }
    }
    
    // Handle click
    function handleClick(e) {
        if (MODE !== 'edit') return;
        
        const target = e.target;
        
        // Allow clicks on builder UI
        if (isBuilderElement(target)) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        // Click on body/html = deselect
        if (target === document.body || target === document.documentElement) {
            currentSelectedElement = null;
            updateVisuals();
            postToParent('element-select', null);
            return;
        }
        
        // Click on same element = deselect (toggle)
        if (target === currentSelectedElement) {
            currentSelectedElement = null;
            updateVisuals();
            postToParent('element-select', null);
            return;
        }
        
        // Select new element
        currentSelectedElement = target;
        updateVisuals();
        postToParent('element-select', createElementInfo(target));
    }
    
    // Handle keydown
    function handleKeyDown(e) {
        if (MODE !== 'edit') return;
        
        // Handle undo/redo shortcuts - forward to parent
        if ((e.ctrlKey || e.metaKey) && !e.altKey) {
            if (e.key === 'z' && !e.shiftKey) {
                // Ctrl+Z = Undo
                e.preventDefault();
                e.stopPropagation();
                postToParent('keyboard-shortcut', { action: 'undo' });
                return;
            }
            if (e.key === 'z' && e.shiftKey) {
                // Ctrl+Shift+Z = Redo
                e.preventDefault();
                e.stopPropagation();
                postToParent('keyboard-shortcut', { action: 'redo' });
                return;
            }
            if (e.key === 'y') {
                // Ctrl+Y = Redo
                e.preventDefault();
                e.stopPropagation();
                postToParent('keyboard-shortcut', { action: 'redo' });
                return;
            }
        }
        
        // Delete / Backspace
        if (currentSelectedElement && (e.key === 'Delete' || e.key === 'Backspace')) {
             // Don't delete if editing text
             if (currentSelectedElement.isContentEditable) return;
             
             e.preventDefault();
             e.stopPropagation();
             deleteElement(currentSelectedElement);
             return;
        }
        
        if (e.key === 'Escape' && currentSelectedElement) {
            // If element is in edit mode, exit it
            if (currentSelectedElement.contentEditable === 'true') {
                exitEditMode(currentSelectedElement);
                return;
            }
            currentSelectedElement = null;
            updateVisuals();
            postToParent('element-select', null);
        }
    }
    
    // Track element being edited
    let currentEditingElement = null;
    
    // Enter edit mode for text editing
    function enterEditMode(element) {
        if (!element || currentEditingElement === element) return;
        
        // Exit previous edit mode
        if (currentEditingElement) {
            exitEditMode(currentEditingElement);
        }
        
        // Check if element has child elements - don't allow editing containers
        const hasChildElements = element.querySelector('*') !== null;
        if (hasChildElements) {
            console.log('Element has children, cannot edit directly');
            return;
        }
        
        currentEditingElement = element;
        element.contentEditable = 'true';
        element.focus();
        
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Add blur handler to exit edit mode
        element.addEventListener('blur', handleEditBlur, { once: true });
    }
    
    // Exit edit mode
    function exitEditMode(element) {
        if (!element) return;
        
        element.contentEditable = 'false';
        
        // Notify parent of text change
        if (currentEditingElement === element) {
            postToParent('text-change', {
                builderId: element.getAttribute('data-builder-id'),
                newText: element.innerText,
                element: createElementInfo(element)
            });
            currentEditingElement = null;
        }
        
        // Clear selection
        window.getSelection().removeAllRanges();
    }
    
    // Handle blur when editing
    function handleEditBlur(e) {
        const element = e.target;
        exitEditMode(element);
    }
    
    // Handle double-click for inline editing
    function handleDoubleClick(e) {
        if (MODE !== 'edit') return;
        
        const target = e.target;
        if (isBuilderElement(target)) return;
        if (target === document.body || target === document.documentElement) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        // Enter edit mode
        enterEditMode(target);
    }
    
    // Handle keydown in edit mode
    function handleEditKeyDown(e) {
        if (!currentEditingElement) return;
        
        // Exit on Enter (except with Shift for new lines in multiline elements)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            exitEditMode(currentEditingElement);
        }
    }
    
    // Delete element
    function deleteElement(element) {
        if (!element) return;
        
        // Don't delete body/html
        if (element === document.body || element === document.documentElement) return;
        
        const parent = element.parentElement;
        element.remove();
        
        // Select parent
        if (parent && parent !== document.documentElement) {
            currentSelectedElement = parent === document.body ? null : parent;
            updateVisuals();
            postToParent('element-select', createElementInfo(currentSelectedElement));
        } else {
            currentSelectedElement = null;
            updateVisuals();
            postToParent('element-select', null);
        }
        
        // Notify parent of change
        postToParent('element-moved', { html: getCleanHtml() });
    }

    // Add event listeners
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('dblclick', handleDoubleClick, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keydown', handleEditKeyDown, true);
    
    // Update visuals on window resize and scroll to prevent bounding box distortion
    window.addEventListener('resize', () => {
        if (MODE === 'edit' && (currentSelectedElement || currentHoveredElement)) {
            requestAnimationFrame(updateVisuals);
        }
    });
    
    window.addEventListener('scroll', () => {
        if (MODE === 'edit' && (currentSelectedElement || currentHoveredElement)) {
            requestAnimationFrame(updateVisuals);
        }
    }, { passive: true });
    
    // Listen for messages from parent
    window.addEventListener('message', (event) => {
        const { type, value, builderId, newClasses, newText, newId, newStyle } = event.data || {};
        
        if (type === 'html-update') {
            document.open();
            document.write(value);
            document.close();
        }
        
        // Targeted class update - no document reload, no flashing
        if (type === 'update-element-class') {
            const element = document.querySelector('[data-builder-id="' + builderId + '"]');
            if (element) {
                element.className = newClasses;
                // Re-apply selection class if this is the selected element
                if (element === currentSelectedElement) {
                    element.classList.add('__builder-selected__');
                }
            }
        }
        
        // Targeted text update - no document reload, no flashing
        if (type === 'update-element-text') {
            const element = document.querySelector('[data-builder-id="' + builderId + '"]');
            if (element) {
                // Only update if element has no child elements
                const hasChildElements = element.querySelector('*') !== null;
                if (!hasChildElements) {
                    element.innerText = newText;
                }
                // Update selection info
                if (element === currentSelectedElement) {
                    postToParent('element-select', createElementInfo(element));
                }
            }
        }
        
        // Targeted ID update - no document reload, no flashing
        if (type === 'update-element-id') {
            const element = document.querySelector('[data-builder-id="' + builderId + '"]');
            if (element) {
                if (newId) {
                    element.id = newId;
                } else {
                    element.removeAttribute('id');
                }
                // Update selection info
                if (element === currentSelectedElement) {
                    postToParent('element-select', createElementInfo(element));
                }
            }
        }
        
        // Targeted style update - no document reload, no flashing
        if (type === 'update-element-style') {
            const element = document.querySelector('[data-builder-id="' + builderId + '"]');
            if (element) {
                if (newStyle) {
                    element.setAttribute('style', newStyle);
                } else {
                    element.removeAttribute('style');
                }
                // Update selection info
                if (element === currentSelectedElement) {
                    postToParent('element-select', createElementInfo(element));
                }
            }
        }
        
        if (type === 'deselect') {
            currentSelectedElement = null;
            currentHoveredElement = null;
            if (currentEditingElement) {
                exitEditMode(currentEditingElement);
            }
            updateVisuals();
        }
    });
    
    // Prevent drag in edit mode
    if (MODE === 'edit') {
        document.addEventListener('dragstart', (e) => e.preventDefault(), true);
    }

    // Context Menu Logic
    function showContextMenu(triggerBtn) {
        if (contextMenu) {
            contextMenu.remove();
            contextMenu = null;
            return;
        }

        if (!currentSelectedElement) return;

        contextMenu = document.createElement('div');
        contextMenu.className = '__builder-context-menu__';
        
        const parent = currentSelectedElement.parentElement;
        const isBody = currentSelectedElement === document.body;
        const isParentBody = parent === document.body;
        const hasParent = parent && !isParentBody && parent !== document.documentElement;
        
        // Helper to add button
        const addBtn = (label, targetId, position, isTopLevel = false) => {
            const btn = document.createElement('button');
            btn.innerHTML = label;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (contextMenu) {
                   contextMenu.remove();
                   contextMenu = null;
                }
                
                // Get rect for popup position
                const rect = currentSelectedElement.getBoundingClientRect();
                
                postToParent('show-blocks-popup', {
                    x: rect.left + rect.width / 2, // Center of element
                    y: rect.top,
                    targetId,
                    position,
                    isTopLevel
                });
            });
            contextMenu.appendChild(btn);
        };
        
        const addDivider = () => {
             const div = document.createElement('div');
             div.className = 'menu-divider';
             contextMenu.appendChild(div);
        }

        const currentId = currentSelectedElement.getAttribute('data-builder-id') || '';
        const parentId = parent ? parent.getAttribute('data-builder-id') || '' : '';

        // Sibling options (Before/After current)
        // If current is direct child of body, these are top-level insertions
        const isCurrentTopLevel = isParentBody;
        
        addBtn('Sibling Prev (Before)', currentId, 'before', isCurrentTopLevel);
        addBtn('Sibling Next (After)', currentId, 'after', isCurrentTopLevel);
        
        addDivider();
        
        // Parent options - only if parent is not body
        // if (hasParent && parentId) {
        //     addBtn('Parent Up (Before Parent)', parentId, 'before', false);
        //     addBtn('Parent Down (After Parent)', parentId, 'after', false);
        //      addDivider();
        // }
        
        // Child options
        // If current is body, these are top-level
        addBtn('First Child', currentId, 'prepend', isBody);
        addBtn('Last Child', currentId, 'append', isBody);
        
        document.body.appendChild(contextMenu);
        
        // Position menu next to toolbar but prevent overflow
        const rect = triggerBtn.getBoundingClientRect();
        const menuRect = contextMenu.getBoundingClientRect();
        
        let left = rect.right + 10;
        let top = rect.top;
        
        // If flows off right, show on left
        if (left + menuRect.width > window.innerWidth) {
            left = rect.left - menuRect.width - 10;
        }
        
        // If flows off bottom, move up
        if (top + menuRect.height > window.innerHeight) {
            top = window.innerHeight - menuRect.height - 10;
        }
        
        contextMenu.style.left = left + 'px';
        contextMenu.style.top = top + 'px';
        
        // Close on click outside
        const closeMenu = (e) => {
             if (contextMenu && !contextMenu.contains(e.target) && e.target !== triggerBtn) {
                 contextMenu.remove();
                 contextMenu = null;
                 document.removeEventListener('click', closeMenu);
             }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 0);
    }



    // Helper functions for drag and drop
    function createDropIndicator() {
        if (dropIndicator) return dropIndicator;
        dropIndicator = document.createElement('div');
        dropIndicator.className = '__builder-drop-indicator__';
        return dropIndicator;
    }
    

    
    function findDropTargetEnhanced(x, y, isSection) {
        const elements = document.elementsFromPoint(x, y);
        let validTarget = null;

        for (const el of elements) {
            if (isBuilderElement(el)) continue;
            
            // If dragging a section, apply restrictions
            if (isSection) {
                 // Prevent dropping inside another section (force sibling) is handled by position logic? 
                 // Actually we want to forbid the 'inside' position for sections
                 // But for finding target, let's just find the closest valid block-level element
                 
                 // If we are over a section, that's a valid target (to drop before/after)
                 // If we are over a div inside a section, the section is the structural parent usually
                 
                 const pSection = el.closest('section');
                 if (pSection) {
                     validTarget = pSection;
                     break;
                 }
                 
                 // Fallback to body direct children
                 if (el === document.body || el.parentElement === document.body) {
                     validTarget = el;
                     break;
                 }
            } else {
                // For regular blocks, we can drop anywhere
                if (el === document.body || el.hasAttribute('data-builder-id')) {
                    validTarget = el;
                    break;
                }
            }
        }
        
        if (!validTarget) {
            return { target: document.body, position: 'append' };
        }
        
        // Calculate position
        let position = calculateDropPosition(x, y, validTarget);
        
        // Enforce rules
        if (isSection && validTarget.tagName === 'SECTION' && position === 'inside') {
             // Force sibling
             const rect = validTarget.getBoundingClientRect();
             const { isHorizontal } = getParentLayoutInfo(validTarget);
             
             if (isHorizontal) {
                const midX = rect.left + rect.width / 2;
                position = x < midX ? 'before' : 'after';
             } else {
                const midY = rect.top + rect.height / 2;
                position = y < midY ? 'before' : 'after';
             }
        }
        
        return { target: validTarget, position };
    }
    
    function showDropIndicatorAt(target, position) {
        if (!target) return;
        
        const indicator = createDropIndicator();
        
        if (position === 'before') {
            target.parentNode.insertBefore(indicator, target);
        } else if (position === 'after') {
            if (target.nextSibling) {
                target.parentNode.insertBefore(indicator, target.nextSibling);
            } else {
                target.parentNode.appendChild(indicator);
            }
        } else if (position === 'append') {
            target.appendChild(indicator);
        }
        
        currentDropTarget = target;
        currentDropPosition = position;
    }

    // Ensure all elements have builder IDs
    function ensureBuilderIds(element) {
        if (!element || element.nodeType !== 1) return;
        
        // Add ID if missing
        if (!element.getAttribute('data-builder-id')) {
            element.setAttribute('data-builder-id', 'new-' + Math.random().toString(36).substr(2, 9));
        }
        
        // Recursive for children
        Array.from(element.children).forEach(child => ensureBuilderIds(child));
    }

    // Drag implementation for element reordering
    document.addEventListener('mousedown', function(e) {
        if (MODE !== 'edit') return;
        if (isBuilderElement(e.target)) return;
        if (e.button !== 0) return; // Only left click
        
        // Don't start drag if clicking on content editable or inputs
        if (e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        const target = e.target.closest('[data-builder-id]');
        if (!target) return;
        
        // Don't drag if body or html
        if (target === document.body || target === document.documentElement) return;
        
        dragStartPos = { x: e.clientX, y: e.clientY };
        draggedElement = target;
    }, true);
    
    let lastDragUpdate = 0;
    
    document.addEventListener('mousemove', function(e) {
        // Safety: End drag if button released outside
        if (isDragging && e.buttons === 0) {
            isDragging = false;
            draggedElement = null;
            dragStartPos = null;
            if (dragGhost) {
                dragGhost.remove();
                dragGhost = null;
            }
            removeDropIndicator();
            return;
        }

        // If dragging, handle drag logic
        if (isDragging && draggedElement) {
             e.preventDefault();
             e.stopPropagation();
             
             // Move ghost (Always, for smoothness)
             if (dragGhost) {
                 dragGhost.style.left = e.clientX + 'px';
                 dragGhost.style.top = e.clientY + 'px';
             }
             
             // Throttle heavy layout logic (30ms = ~33fps)
             const now = Date.now();
             if (now - lastDragUpdate < 30) return;
             lastDragUpdate = now;
             
            const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
            
            let dropTarget = null;
            for (const el of elementsAtPoint) {
                if (el === draggedElement) continue;
                if (isBuilderElement(el)) continue;
                if (isDescendant(draggedElement, el)) continue;
                
                // If dragging a section, prevent dropping into other sections or their descendants
                if (draggedElement.tagName === 'SECTION') {
                    // Skip if element is a descendant of a section
                    const parentSection = el.closest('section');
                    if (parentSection && parentSection !== el) {
                        continue;
                    }
                }
                
                // Allow dropping on body or other builder elements
                if (el === document.body || el.hasAttribute('data-builder-id')) {
                    dropTarget = el;
                    break;
                }
            }
            
            if (dropTarget) {
                 let position = calculateDropPosition(e.clientX, e.clientY, dropTarget);
                 
                 // If dragging a section and target is a section, prevent 'inside' drop
                 // Force before/after instead
                 if (draggedElement.tagName === 'SECTION' && dropTarget.tagName === 'SECTION' && position === 'inside') {
                     const rect = dropTarget.getBoundingClientRect();
                     const { isHorizontal } = getParentLayoutInfo(dropTarget);
                     if (isHorizontal) {
                        const midX = rect.left + rect.width / 2;
                        position = e.clientX < midX ? 'before' : 'after';
                     } else {
                        const midY = rect.top + rect.height / 2;
                        position = e.clientY < midY ? 'before' : 'after';
                     }
                 }
                 
                 // Optimization: Only update DOM if changed
                 if (dropTarget !== currentDropTarget || position !== currentDropPosition) {
                     showDropIndicatorEnhanced(dropTarget, position, e.clientX, e.clientY);
                 }
            } else {
                if (currentDropTarget) removeDropIndicator();
            }
            return;
        }

        
        // Check if we should start dragging (threshold)
        if (!isDragging && draggedElement && dragStartPos) {
            const dx = e.clientX - dragStartPos.x;
            const dy = e.clientY - dragStartPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Start dragging after 5px movement
            if (distance > 5) {
                isDragging = true;
                
                // Create ghost
                const rect = draggedElement.getBoundingClientRect();
                dragGhost = draggedElement.cloneNode(true);
                dragGhost.className = '__builder-drag-ghost__';
                dragGhost.removeAttribute('data-builder-id');
                
                // Remove builder classes from ghost children
                dragGhost.querySelectorAll('[class*="__builder-"]').forEach(el => {
                    el.className = el.className.split(' ').filter(c => !c.startsWith('__builder-')).join(' ');
                });
                
                dragGhost.style.width = rect.width + 'px';
                dragGhost.style.height = rect.height + 'px';
                dragGhost.style.left = rect.left + 'px';
                dragGhost.style.top = rect.top + 'px';
                
                document.body.appendChild(dragGhost);
                
                // Mark original
                draggedElement.classList.add('__builder-dragging__');
                
                // Clear hover/selection UI
                removeUI();
                clearAllBuilderClasses();
            }
        }
    }, true);
    
    document.addEventListener('mouseup', function(e) {
        if (isDragging && draggedElement && currentDropTarget && currentDropPosition) {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                // Perform the move
                const target = currentDropTarget;
                const element = draggedElement;
                const position = currentDropPosition;
                
                // Validate move is safe
                // We only need to ensure we aren't dropping the element into itself or its descendants
                if (!element.contains(target)) {
                    if (position === 'before') {
                        target.parentNode.insertBefore(element, target);
                    } else if (position === 'after') {
                        if (target.nextSibling) {
                            target.parentNode.insertBefore(element, target.nextSibling);
                        } else {
                            target.parentNode.appendChild(element);
                        }
                    } else if (position === 'inside') {
                        target.appendChild(element);
                    }
                    
                    // Notify parent
                    postToParent('element-moved', { html: getCleanHtml() });
                    
                    // Reselect the moved element after a brief delay
                    setTimeout(() => {
                        currentSelectedElement = element;
                        updateVisuals();
                        postToParent('element-select', createElementInfo(element));
                    }, 50);
                } else {
                    console.warn('Invalid drop target');
                }
            } catch (err) {
                console.error('Drop failed:', err);
            }
        }

        
        // Cleanup
        if (draggedElement) {
            draggedElement.classList.remove('__builder-dragging__');
        }
        if (dragGhost) {
            dragGhost.remove();
            dragGhost = null;
        }
        
        isDragging = false;
        draggedElement = null;
        dragStartPos = null;
        removeDropIndicator();
        
    }, true);

    // Listen for drag events from parent

    // Listen for drag events from parent
    window.addEventListener('message', (event) => {
        if (!event.data) return;
        
        const { type, data } = event.data;
        
        if (type === 'insert-block') {
             const { code, targetId, position } = data;
             const target = document.querySelector('[data-builder-id="' + targetId + '"]');
             
             if (target && code) {
                 const temp = document.createElement('div');
                 temp.innerHTML = code;
                 const elements = Array.from(temp.children);
                 
                 if (elements.length > 0) {
                     elements.forEach(el => {
                         // Recursively add builder IDs to the element and all its children
                         ensureBuilderIds(el);
                         
                         if (position === 'before') {
                             target.parentNode.insertBefore(el, target);
                         } else if (position === 'after') {
                             if (target.nextSibling) {
                                target.parentNode.insertBefore(el, target.nextSibling);
                             } else {
                                target.parentNode.appendChild(el);
                             }
                         } else if (position === 'prepend') {
                             if (target.firstChild) {
                                 target.insertBefore(el, target.firstChild);
                             } else {
                                 target.appendChild(el);
                             }
                         } else if (position === 'append') {
                             target.appendChild(el);
                         }
                     });
                     
                     postToParent('element-moved', { html: getCleanHtml() });
                 }
             }
        }

        
        if (type === 'drag-over') {
            // Calculate drop position based on cursor X, Y
            const dropInfo = findDropTargetEnhanced(data.x, data.y, data.isSection);
            if (dropInfo) {
                // Apply blue theme for sections if needed
                if (data.isSection && !dropIndicator?.classList.contains('blue-theme')) {
                     // We can't easily add class here without modifying showDropIndicatorEnhanced, 
                     // but showDropIndicatorEnhanced uses global draggedElement which is null for sidebar drag
                     // So we might need to pass isSection to showDropIndicatorEnhanced?
                     
                     // Helper hack: set a global flag
                     window._isDraggingSection = true;
                } else if (!data.isSection) {
                    window._isDraggingSection = false;
                }
                
                showDropIndicatorEnhanced(dropInfo.target, dropInfo.position, data.x, data.y);
                
                // Manually apply blue theme if needed (since showDropIndicatorEnhanced might rely on draggedElement)
                if (data.isSection) {
                    const line = document.querySelector('.__builder-drop-line__');
                    if (line) line.classList.add('blue-theme');
                    const inside = document.querySelector('.__builder-drop-inside__');
                    if (inside) inside.classList.add('blue-theme');
                }
            }
        }
        
        if (type === 'drag-leave' || type === 'drag-end') {
            removeDropIndicator();
        }
        
        if (type === 'drop-block') {
            // Insert the block at the current drop position
            if (currentDropTarget && currentDropPosition && data.code) {
                // Create a temporary container to parse the HTML
                const temp = document.createElement('div');
                temp.innerHTML = data.code;
                
                // Get the actual elements to insert
                const elements = Array.from(temp.children);
                
                if (elements.length > 0) {
                    elements.forEach(el => {
                        // Recursively add builder IDs to the element and all its children
                        ensureBuilderIds(el);

                        if (currentDropPosition === 'before') {
                            currentDropTarget.parentNode.insertBefore(el, currentDropTarget);
                        } else if (currentDropPosition === 'after') {
                            if (currentDropTarget.nextSibling) {
                                currentDropTarget.parentNode.insertBefore(el, currentDropTarget.nextSibling);
                            } else {
                                currentDropTarget.parentNode.appendChild(el);
                            }
                        } else if (currentDropPosition === 'append') {
                            currentDropTarget.appendChild(el);
                        }
                    });
                    
                    // Notify parent of the updated HTML
                    postToParent('element-moved', { html: getCleanHtml() });
                }
            }
            
            removeDropIndicator();
        }
    });
})();

</script>
`;
};

// Inject script into HTML
const injectMessageListener = (html: string, mode: "edit" | "preview"): string => {
    const script = generateIframeScript(mode);

    if (html.includes("</body>")) {
        return html.replace("</body>", `${script}</body>`);
    } else if (html.includes("</html>")) {
        return html.replace("</html>", `${script}</html>`);
    } else {
        return `${html}${script}`;
    }
};

export function IframePanel() {
    const {
        code,
        setCode,
        getCleanCode,
        lastClassUpdate,
        lastTextUpdate,
        lastIdUpdate,
        lastStyleUpdate,
        clearLastUpdates,
        updateElementText,
        hoveredElement,
        setHoveredElement,
        selectedElement,
        setSelectedElement,
        setElementPositions,
        activeBreakpoint,
    } = useEditorStore();

    const { undo, redo } = useEditorContext();

    const [isSaving, setIsSaving] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [mode, setMode] = useState<"edit" | "preview">("edit");

    // Drag and drop state
    const [isDragOver, setIsDragOver] = useState(false);
    const [isGlobalDragging, setIsGlobalDragging] = useState(false); // Track if any drag is happening
    const [draggedBlock, setDraggedBlock] = useState<BlockItem | null>(null);

    // Blocks popup state (for + icon insertion)
    const [showBlocksPopup, setShowBlocksPopup] = useState(false);
    const [blocksPopupPos, setBlocksPopupPos] = useState({ top: 0, left: 0 });
    const [blocksPopupTab, setBlocksPopupTab] = useState<string>("block");
    const [insertPosition, setInsertPosition] = useState<{ type: string; selector: string; isTopLevel?: boolean } | null>(null);
    const [blocksSearchQuery, setBlocksSearchQuery] = useState("");

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const iframeContainerRef = useRef<HTMLDivElement>(null);
    const blocksPopupRef = useRef<HTMLDivElement>(null);
    const addBlockBtnRef = useRef<HTMLButtonElement>(null);

    // Close blocks popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                showBlocksPopup &&
                blocksPopupRef.current &&
                !blocksPopupRef.current.contains(event.target as Node) &&
                (!addBlockBtnRef.current || !addBlockBtnRef.current.contains(event.target as Node))
            ) {
                setShowBlocksPopup(false);
                setBlocksSearchQuery("");
            }
        };

        if (showBlocksPopup) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showBlocksPopup]);

    // Global drag listener - detect when dragging starts from blocks panel
    useEffect(() => {
        const handleDragStart = (e: DragEvent) => {
            // Check if this is a block drag (has our data)
            if (e.dataTransfer?.types.includes("application/json")) {
                setIsGlobalDragging(true);
            }
        };

        const handleDragEnd = () => {
            setIsGlobalDragging(false);
            setIsDragOver(false);

            // Send drag-end message to iframe to clean up drop indicator
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                    {
                        type: "drag-end",
                        data: {},
                    },
                    "*"
                );
            }
        };

        window.addEventListener("dragstart", handleDragStart);
        window.addEventListener("dragend", handleDragEnd);

        return () => {
            window.removeEventListener("dragstart", handleDragStart);
            window.removeEventListener("dragend", handleDragEnd);
        };
    }, []);

    // Breakpoint widths for responsive preview (Tailwind breakpoints)
    // null = full width mode (no breakpoint restriction)
    const breakpointWidths: Record<string, string> = {
        "": "375px", // Mobile (base) - iPhone SE width
        "sm:": "640px", // Small
        "md:": "768px", // Medium
        "lg:": "1024px", // Large
        "xl:": "1280px", // Extra Large
        "2xl:": "1536px", // 2XL
    };

    // null means full width (no breakpoint selected)
    const iframeWidth = activeBreakpoint === null ? "100%" : breakpointWidths[activeBreakpoint] || "100%";

    // Checkpoint State
    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [showCheckpoints, setShowCheckpoints] = useState(false);
    const [newCheckpointTitle, setNewCheckpointTitle] = useState("");
    const [checkpointPos, setCheckpointPos] = useState({ top: 0, left: 0 });

    const checkpointBtnRef = useRef<HTMLDivElement>(null);

    // Prepare HTML for iframe - code already has builder IDs, just inject the script
    const prepareHtmlForIframe = useCallback((html: string, currentMode: "edit" | "preview") => {
        // Code already has builder IDs from the store
        // Just inject the builder script
        return injectMessageListener(html, currentMode);
    }, []);

    const [srcDoc, setSrcDoc] = useState(() => prepareHtmlForIframe(code, mode));
    const srcDocCodeRef = useRef<string>(code);

    // Update srcDoc when refresh or mode changes
    useEffect(() => {
        setSrcDoc(prepareHtmlForIframe(code, mode));
        srcDocCodeRef.current = code;
        setHoveredElement(null);
        setSelectedElement(null);
    }, [refreshKey, mode, prepareHtmlForIframe]);

    // Send updates via postMessage for streaming (full document updates)
    useEffect(() => {
        if (code === srcDocCodeRef.current) return;

        // Check if this is a class-only update (handled separately for no-flash update)
        if (lastClassUpdate) {
            // For class updates, we use targeted update instead of full reload
            srcDocCodeRef.current = code;
            return;
        }

        // Check if this is a text-only update (handled separately for no-flash update)
        if (lastTextUpdate) {
            // For text updates, we use targeted update instead of full reload
            srcDocCodeRef.current = code;
            return;
        }

        // Check if this is an ID-only update (handled separately for no-flash update)
        if (lastIdUpdate) {
            // For ID updates, we use targeted update instead of full reload
            srcDocCodeRef.current = code;
            return;
        }

        // Check if this is a style-only update (handled separately for no-flash update)
        if (lastStyleUpdate) {
            // For style updates, we use targeted update instead of full reload
            srcDocCodeRef.current = code;
            return;
        }

        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                {
                    type: "html-update",
                    value: prepareHtmlForIframe(code, mode),
                },
                "*"
            );
            // Update ref to prevent feedback loop
            srcDocCodeRef.current = code;
        }
    }, [code, mode, prepareHtmlForIframe, lastClassUpdate, lastTextUpdate, lastIdUpdate, lastStyleUpdate]);

    // Send targeted class updates to iframe (no document reload, no flashing)
    useEffect(() => {
        if (!lastClassUpdate) return;

        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                {
                    type: "update-element-class",
                    builderId: lastClassUpdate.builderId,
                    newClasses: lastClassUpdate.newClasses,
                },
                "*"
            );
            // Update srcDocCodeRef to keep it in sync
            srcDocCodeRef.current = code;
            // Clear the update flag so code editor changes work again
            clearLastUpdates();
        }
    }, [lastClassUpdate, code, clearLastUpdates]);

    // Send targeted text updates to iframe (no document reload, no flashing)
    useEffect(() => {
        if (!lastTextUpdate) return;

        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                {
                    type: "update-element-text",
                    builderId: lastTextUpdate.builderId,
                    newText: lastTextUpdate.newText,
                },
                "*"
            );
            // Update srcDocCodeRef to keep it in sync
            srcDocCodeRef.current = code;
            // Clear the update flag so code editor changes work again
            clearLastUpdates();
        }
    }, [lastTextUpdate, code, clearLastUpdates]);

    // Send targeted ID updates to iframe (no document reload, no flashing)
    useEffect(() => {
        if (!lastIdUpdate) return;

        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                {
                    type: "update-element-id",
                    builderId: lastIdUpdate.builderId,
                    newId: lastIdUpdate.newId,
                },
                "*"
            );
            // Update srcDocCodeRef to keep it in sync
            srcDocCodeRef.current = code;
            // Clear the update flag so code editor changes work again
            clearLastUpdates();
        }
    }, [lastIdUpdate, code, clearLastUpdates]);

    // Send targeted style updates to iframe (no document reload, no flashing)
    useEffect(() => {
        if (!lastStyleUpdate) return;

        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                {
                    type: "update-element-style",
                    builderId: lastStyleUpdate.builderId,
                    newStyle: lastStyleUpdate.newStyle,
                },
                "*"
            );
            // Update srcDocCodeRef to keep it in sync
            srcDocCodeRef.current = code;
            // Clear the update flag so code editor changes work again
            clearLastUpdates();
        }
    }, [lastStyleUpdate, code, clearLastUpdates]);

    // Show blocks popup at position - defined before message listener that uses it
    const showBlocksPopupAt = useCallback((x: number, y: number, position?: { type: string; selector: string; isTopLevel?: boolean }, initialTab?: string) => {
        const POPUP_WIDTH = 320;
        const POPUP_HEIGHT = 400;

        let left = x;
        let top = y;

        if (left + POPUP_WIDTH > window.innerWidth) left = window.innerWidth - POPUP_WIDTH - 10;
        if (top + POPUP_HEIGHT > window.innerHeight) top = window.innerHeight - POPUP_HEIGHT - 10;
        if (left < 10) left = 10;
        if (top < 10) top = 10;

        setBlocksPopupPos({ top, left });
        setInsertPosition(position || null);

        // If top level, force section or template, default to section
        if (position?.isTopLevel) {
            setBlocksPopupTab(initialTab === "template" ? "template" : "section");
        } else if (initialTab) {
            setBlocksPopupTab(initialTab);
        }

        setShowBlocksPopup(true);
    }, []);

    // Listen for messages from iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.source !== "iframe-builder") return;

            const { type, data } = event.data;

            if (type === "element-hover") {
                setHoveredElement(data as ElementInfo | null);
            }

            if (type === "element-select") {
                setSelectedElement(data as ElementInfo | null);
                // Close popup if user clicks anywhere in the iframe
                setShowBlocksPopup(false);
                setBlocksSearchQuery("");
            }

            if (type === "element-moved") {
                // Update the code store with the new HTML from the iframe
                // The HTML already has builder IDs, so pass true to prevent re-injection
                if (data?.html) {
                    setCode(data.html, true);
                    // Update the srcDocCodeRef to prevent a feedback loop
                    srcDocCodeRef.current = data.html;
                }
            }

            if (type === "text-change") {
                // Handle text changes from inline editing in iframe
                if (data?.builderId && data?.newText !== undefined) {
                    updateElementText(data.builderId, data.newText);
                    // Update srcDocCodeRef to prevent a feedback loop
                    srcDocCodeRef.current = code;
                }
            }

            if (type === "keyboard-shortcut") {
                // Handle keyboard shortcuts forwarded from iframe
                if (data?.action === "undo") {
                    undo();
                } else if (data?.action === "redo") {
                    redo();
                }
            }

            if (type === "toolbar-action") {
                console.log("Toolbar action:", data?.action);
            }

            if (type === "show-blocks-popup") {
                // Show blocks popup at the specified position
                // Convert iframe coordinates to window coordinates
                const iframeRect = iframeRef.current?.getBoundingClientRect();
                if (iframeRect && data) {
                    const x = iframeRect.left + (data.x || 0);
                    const y = iframeRect.top + (data.y || 0);

                    // Construct insert position info
                    let posObj: { type: string; selector: string; isTopLevel?: boolean } = { type: "append", selector: "body", isTopLevel: false };

                    if (data.targetId && data.position) {
                        // New context menu based insertion
                        posObj = {
                            type: data.position,
                            selector: data.targetId,
                            isTopLevel: data.isTopLevel || false,
                        };
                    } else if (data.insertPosition === "prepend") {
                        posObj = { type: "prepend", selector: "body" };
                    } else if (data.insertPosition === "append" || data.append) {
                        posObj = { type: "append", selector: "body" };
                    } else if (data.insertAfter) {
                        posObj = { type: "after", selector: data.insertAfter };
                    }

                    showBlocksPopupAt(x, y, posObj, data.initialTab);
                }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [setHoveredElement, setSelectedElement, setCode, updateElementText, code, undo, redo, showBlocksPopupAt]);

    const handleCopy = () => {
        navigator.clipboard.writeText(getCleanCode());
    };

    const handleOpenInNewTab = () => {
        openInNewTab(getCleanCode());
    };

    const handleSave = async () => {
        setIsSaving(true);
        const cleanCode = getCleanCode();

        try {
            if ("showSaveFilePicker" in window) {
                const handle = await (window as any).showSaveFilePicker({
                    suggestedName: "index.html",
                    types: [{ description: "HTML File", accept: { "text/html": [".html"] } }],
                });
                const writable = await handle.createWritable();
                await writable.write(cleanCode);
                await writable.close();
            } else {
                throw new Error("File System Access API not supported");
            }
        } catch (err: any) {
            if (err.name !== "AbortError") {
                const blob = new Blob([cleanCode], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "index.html";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } finally {
            setTimeout(() => setIsSaving(false), 1000);
        }
    };

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    // Checkpoint Handlers
    const createCheckpoint = () => {
        if (!newCheckpointTitle.trim()) return;
        const newCheckpoint: Checkpoint = {
            id: Date.now(),
            title: newCheckpointTitle,
            code: code,
            timestamp: new Date().toLocaleTimeString(),
        };
        setCheckpoints([newCheckpoint, ...checkpoints]);
        setNewCheckpointTitle("");
    };

    const restoreCheckpoint = (checkpoint: Checkpoint) => {
        if (confirm(`Restore checkpoint "${checkpoint.title}"? Current changes will be lost.`)) {
            setCode(checkpoint.code);
            setShowCheckpoints(false);
        }
    };

    const deleteCheckpoint = (id: number) => {
        setCheckpoints(checkpoints.filter((cp) => cp.id !== id));
    };

    const toggleCheckpointsPopup = () => {
        if (!showCheckpoints && checkpointBtnRef.current) {
            const rect = checkpointBtnRef.current.getBoundingClientRect();
            let top = rect.bottom + 6;
            let left = rect.left;

            const POPUP_WIDTH = 300;
            const POPUP_HEIGHT = 300;

            if (left + POPUP_WIDTH > window.innerWidth) left = window.innerWidth - POPUP_WIDTH - 10;
            if (top + POPUP_HEIGHT > window.innerHeight) top = rect.top - POPUP_HEIGHT - 10;
            if (left < 0) left = 10;

            setCheckpointPos({ top, left });
        }
        setShowCheckpoints(!showCheckpoints);
    };

    // ===== DRAG AND DROP HANDLERS =====

    // Store the dragged block data
    const draggedBlockDataRef = useRef<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
        e.dataTransfer.dropEffect = "copy";

        // Calculate Y position relative to the iframe
        const iframeRect = iframeRef.current?.getBoundingClientRect();
        if (iframeRect && iframeRef.current?.contentWindow) {
            // Perform x/y calculation
            const relativeY = e.clientY - iframeRect.top;
            const relativeX = e.clientX - iframeRect.left;

            // Check for section type
            const isSection = e.dataTransfer.types.includes("application/x-ai-editor-section") || e.dataTransfer.types.includes("application/x-ai-editor-template");

            // Send drag-over message to iframe
            iframeRef.current.contentWindow.postMessage(
                {
                    type: "drag-over",
                    data: { x: relativeX, y: relativeY, isSection },
                },
                "*"
            );
        }
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = iframeContainerRef.current?.getBoundingClientRect();
        if (rect) {
            const { clientX, clientY } = e;
            if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
                setIsDragOver(false);

                // Send drag-leave message to iframe
                if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(
                        {
                            type: "drag-leave",
                            data: {},
                        },
                        "*"
                    );
                }
            }
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        setIsGlobalDragging(false);

        try {
            const data = e.dataTransfer.getData("application/json");
            if (!data) return;

            const blockData = JSON.parse(data);
            if (blockData.type === "block" && blockData.code) {
                // Send drop-block message to iframe to insert at the drop position
                if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(
                        {
                            type: "drop-block",
                            data: { code: blockData.code },
                        },
                        "*"
                    );
                }
            }
        } catch (err) {
            console.error("Failed to parse dropped block data:", err);
        }
    }, []);

    const insertBlockIntoCode = useCallback(
        (blockCode: string, targetSelector: string, position: "before" | "after" | "append" | "prepend") => {
            let newCode = code;

            if (targetSelector === "body" && position === "append") {
                if (newCode.includes("</body>")) {
                    newCode = newCode.replace("</body>", `\n${blockCode}\n</body>`);
                } else if (newCode.includes("</html>")) {
                    newCode = newCode.replace("</html>", `\n${blockCode}\n</html>`);
                } else {
                    newCode = newCode + `\n${blockCode}`;
                }
            } else if (targetSelector === "body" && position === "prepend") {
                const bodyMatch = newCode.match(/<body[^>]*>/i);
                if (bodyMatch) {
                    newCode = newCode.replace(bodyMatch[0], `${bodyMatch[0]}\n${blockCode}\n`);
                }
            }

            setCode(newCode);
            setRefreshKey((prev) => prev + 1);
        },
        [code, setCode]
    );

    const handleBlockSelect = useCallback(
        (block: BlockItem) => {
            if (insertPosition) {
                // Use new insert-block message instead of local string replace
                if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(
                        {
                            type: "insert-block",
                            data: {
                                code: block.code,
                                targetId: insertPosition.selector,
                                position: insertPosition.type,
                            },
                        },
                        "*"
                    );
                }
            } else {
                insertBlockIntoCode(block.code, "body", "append");
            }
            setShowBlocksPopup(false);
            setBlocksSearchQuery("");
            setInsertPosition(null);
        },
        [insertPosition, insertBlockIntoCode]
    );

    const getFilteredBlocks = useCallback(() => {
        let items: BlockItem[] = [];

        if (blocksPopupTab === "section") {
            items = getAllSections();
        } else if (blocksPopupTab === "template") {
            items = getAllTemplates();
        } else {
            items = getAllBlocks();
        }

        if (!blocksSearchQuery) return items;
        return items.filter((item) => item.name.toLowerCase().includes(blocksSearchQuery.toLowerCase()) || item.description.toLowerCase().includes(blocksSearchQuery.toLowerCase()));
    }, [blocksSearchQuery, blocksPopupTab]);

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden relative">
            {/* Toolbar */}
            <div className="h-10 border-b border-border flex items-center justify-between px-3 bg-card shrink-0 select-none z-20 relative">
                {/* LEFT: Tabs */}
                <div className="flex items-center gap-2">
                    <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="h-7">
                        <TabsList className="h-7 p-0.5 bg-muted/50 border border-border/40">
                            <TabsTrigger value="edit" className="h-6 px-3 text-[10px] data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer">
                                Edit
                            </TabsTrigger>
                            <TabsTrigger value="preview" className="h-6 px-3 text-[10px] data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer">
                                Preview
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {mode === "edit" && (
                        <Button
                            ref={addBlockBtnRef}
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1.5 cursor-pointer"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                showBlocksPopupAt(rect.left, rect.bottom + 8);
                            }}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Block
                        </Button>
                    )}
                </div>

                {/* CENTER: Title */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-mono">index.html</span>
                </div>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-1">
                    <div ref={checkpointBtnRef} className="flex">
                        <ToolbarButton icon={Flag} tooltip="Checkpoints" onClick={toggleCheckpointsPopup} isActive={showCheckpoints} />
                    </div>

                    {showCheckpoints &&
                        createPortal(
                            <div
                                className="fixed z-50 w-72 border rounded-lg shadow-xl flex flex-col animate-in fade-in zoom-in-95 duration-100 bg-popover border-border text-popover-foreground"
                                style={{ top: checkpointPos.top, left: checkpointPos.left }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-3 border-b border-border flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold flex items-center gap-1.5">
                                            <Flag className="w-3.5 h-3.5 text-orange-500" />
                                            Checkpoints
                                        </span>
                                        <button onClick={() => setShowCheckpoints(false)} className="hover:text-foreground cursor-pointer text-muted-foreground">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <input
                                            value={newCheckpointTitle}
                                            onChange={(e) => setNewCheckpointTitle(e.target.value)}
                                            placeholder="Checkpoint name..."
                                            className="flex-1 h-7 text-xs border-transparent rounded px-2 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-muted/50 text-foreground placeholder-muted-foreground"
                                            onKeyDown={(e) => e.key === "Enter" && createCheckpoint()}
                                        />
                                        <button
                                            onClick={createCheckpoint}
                                            disabled={!newCheckpointTitle.trim()}
                                            className="h-7 px-2.5 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 text-xs font-medium cursor-pointer"
                                        >
                                            <Save className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-60 overflow-y-auto p-1 text-xs">
                                    {checkpoints.length === 0 ? (
                                        <div className="py-8 text-center text-[11px] text-muted-foreground">No checkpoints saved yet.</div>
                                    ) : (
                                        <div className="flex flex-col gap-0.5">
                                            {checkpoints.map((cp) => (
                                                <div key={cp.id} className="flex items-center justify-between p-2 rounded group transition-colors hover:bg-muted">
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-medium truncate text-foreground">{cp.title}</span>
                                                        <span className="text-[10px] text-muted-foreground">{cp.timestamp}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => restoreCheckpoint(cp)}
                                                            className="p-1 rounded hover:text-orange-500 cursor-pointer hover:bg-background text-muted-foreground"
                                                            title="Restore"
                                                        >
                                                            <Undo2 className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteCheckpoint(cp.id)}
                                                            className="p-1 rounded hover:text-red-500 cursor-pointer hover:bg-background text-muted-foreground"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>,
                            document.body
                        )}

                    <div className="h-4 w-px bg-border mx-1" />

                    <ToolbarButton icon={ExternalLink} tooltip="Open in New Tab" onClick={handleOpenInNewTab} />
                    <ToolbarButton icon={FileCode} tooltip="File Settings" />
                    <ToolbarButton icon={RotateCcw} tooltip="Reset Code" onClick={() => setCode(INITIAL_CODE)} />
                    <ToolbarButton icon={Copy} tooltip="Copy to Clipboard" onClick={handleCopy} />
                    <ToolbarButton icon={RefreshCw} tooltip="Refresh Preview" onClick={handleRefresh} />

                    <Button size="sm" className={cn("h-7 text-xs gap-1.5 ml-2 transition-all cursor-pointer", isSaving ? "bg-green-600 hover:bg-green-700" : "")} onClick={handleSave}>
                        {isSaving ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                        {isSaving ? "Saved" : "Save"}
                    </Button>
                </div>
            </div>

            {/* Iframe content */}
            <div ref={iframeContainerRef} className="flex-1 bg-muted/50 relative w-full h-full flex items-start justify-center overflow-auto p-4">
                <div className="bg-white h-full shadow-lg transition-all duration-300 ease-in-out relative" style={{ width: iframeWidth, maxWidth: "100%" }}>
                    <iframe
                        ref={iframeRef}
                        key={refreshKey}
                        className="w-full h-full border-none bg-white block"
                        title="preview"
                        srcDoc={srcDoc}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-downloads"
                    />

                    {/* Drag overlay - transparent overlay to capture drag events */}
                    {isGlobalDragging && (
                        <div className="absolute inset-0 z-20" style={{ cursor: isDragOver ? "copy" : "default" }} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} />
                    )}
                </div>
            </div>

            {/* Blocks Popup */}
            {showBlocksPopup &&
                createPortal(
                    <div
                        ref={blocksPopupRef}
                        className="fixed z-50 w-80 border rounded-xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-100 bg-popover border-border text-popover-foreground overflow-hidden"
                        style={{ top: blocksPopupPos.top, left: blocksPopupPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-3 border-b border-border bg-muted/30">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold flex items-center gap-1.5 capitalize">
                                    <Plus className="w-3.5 h-3.5 text-primary" />
                                    Insert {blocksPopupTab}
                                </span>
                                <button
                                    onClick={() => {
                                        setShowBlocksPopup(false);
                                        setBlocksSearchQuery("");
                                    }}
                                    className="hover:text-foreground cursor-pointer text-muted-foreground"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-1 mb-2 p-0.5 bg-muted/50 rounded-lg">
                                {["block", "section", "template"].map((type) => {
                                    if (type === "block" && insertPosition?.isTopLevel) return null;
                                    return (
                                        <button
                                            key={type}
                                            onClick={() => setBlocksPopupTab(type)}
                                            className={cn(
                                                "flex-1 text-[10px] py-1 rounded-md transition-colors capitalize",
                                                blocksPopupTab === type ? "bg-background shadow-sm text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {type}s
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                                <Input
                                    placeholder="Search blocks..."
                                    className="h-8 pl-8 text-xs bg-background border-input shadow-none"
                                    value={blocksSearchQuery}
                                    onChange={(e) => setBlocksSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Blocks Grid */}
                        <div className="max-h-72 overflow-y-auto custom-scrollbar">
                            <div className="p-2 grid grid-cols-2 gap-2">
                                {getFilteredBlocks().map((block) => (
                                    <button
                                        key={block.id}
                                        onClick={() => handleBlockSelect(block)}
                                        className="text-left p-3 rounded-lg border border-border/50 hover:border-primary hover:bg-primary/5 transition-all group cursor-pointer"
                                    >
                                        <div
                                            className="bg-muted/30 rounded-md p-2 mb-2 min-h-[40px] max-h-[60px] flex items-center justify-center overflow-hidden pointer-events-none select-none text-[8px]"
                                            dangerouslySetInnerHTML={{ __html: block.preview }}
                                        />
                                        <div className="text-[10px] font-medium text-foreground truncate group-hover:text-primary">{block.name}</div>
                                    </button>
                                ))}
                            </div>
                            {getFilteredBlocks().length === 0 && <div className="p-8 text-center text-xs text-muted-foreground">No blocks found</div>}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}
