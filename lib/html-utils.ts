import { ElementPosition } from './store';

/**
 * Injects data-builder-id attributes into HTML elements and tracks their positions.
 * Returns the modified HTML and a map of builderId -> position in original code.
 */
export function injectBuilderIds(html: string): {
    injectedHtml: string;
    positions: Map<string, ElementPosition>;
} {
    const positions = new Map<string, ElementPosition>();
    let idCounter = 0;

    // Split HTML into lines for position tracking
    const lines = html.split('\n');

    // Track line and column as we process
    let currentLine = 1;
    let currentColumn = 1;
    let processedLength = 0;

    // Function to get line and column from character index
    function getPosition(charIndex: number): { line: number; column: number } {
        let line = 1;
        let column = 1;
        let idx = 0;

        for (let i = 0; i < lines.length && idx <= charIndex; i++) {
            const lineLength = lines[i].length + 1; // +1 for newline
            if (idx + lineLength > charIndex) {
                line = i + 1;
                column = charIndex - idx + 1;
                break;
            }
            idx += lineLength;
        }

        return { line, column };
    }

    // Find matching closing tag position
    function findClosingTag(html: string, tagName: string, startIndex: number): number {
        const lowerTag = tagName.toLowerCase();
        let depth = 1;
        let i = startIndex;

        // Self-closing tags
        const selfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'link', 'meta', 'param', 'source', 'track', 'wbr'];
        if (selfClosing.includes(lowerTag)) {
            return startIndex;
        }

        while (i < html.length && depth > 0) {
            // Look for tags
            const nextOpen = html.indexOf('<', i);
            if (nextOpen === -1) break;

            // Check if it's a tag
            const tagEnd = html.indexOf('>', nextOpen);
            if (tagEnd === -1) break;

            const tagContent = html.substring(nextOpen + 1, tagEnd);
            const isClosing = tagContent.startsWith('/');
            const tagMatch = tagContent.match(/^\/?([a-zA-Z][a-zA-Z0-9-]*)/);

            if (tagMatch) {
                const matchedTag = tagMatch[1].toLowerCase();
                if (matchedTag === lowerTag) {
                    if (isClosing) {
                        depth--;
                        if (depth === 0) {
                            return tagEnd + 1;
                        }
                    } else if (!tagContent.endsWith('/')) {
                        // Not self-closing
                        depth++;
                    }
                }
            }

            i = tagEnd + 1;
        }

        return startIndex;
    }

    // Process HTML and inject IDs
    let result = '';
    let i = 0;

    // Tags to skip (script, style, etc. in head)
    const skipTags = ['script', 'style', 'link', 'meta', 'title', 'head', 'html', '!doctype'];

    while (i < html.length) {
        const tagStart = html.indexOf('<', i);

        if (tagStart === -1) {
            result += html.substring(i);
            break;
        }

        // Add content before tag
        result += html.substring(i, tagStart);

        // Find end of tag
        const tagEnd = html.indexOf('>', tagStart);
        if (tagEnd === -1) {
            result += html.substring(tagStart);
            break;
        }

        const fullTag = html.substring(tagStart, tagEnd + 1);
        const tagContent = html.substring(tagStart + 1, tagEnd);

        // Check if it's a closing tag or comment
        if (tagContent.startsWith('/') || tagContent.startsWith('!')) {
            result += fullTag;
            i = tagEnd + 1;
            continue;
        }

        // Extract tag name
        const tagMatch = tagContent.match(/^([a-zA-Z][a-zA-Z0-9-]*)/);
        if (!tagMatch) {
            result += fullTag;
            i = tagEnd + 1;
            continue;
        }

        const tagName = tagMatch[1].toLowerCase();

        // Skip certain tags
        if (skipTags.includes(tagName)) {
            result += fullTag;
            i = tagEnd + 1;
            continue;
        }

        // Generate unique ID
        const builderId = `__bid_${idCounter++}`;

        // Calculate positions in original HTML
        const startPos = getPosition(tagStart);

        // Find the closing tag to get end position
        const isSelfClosing = fullTag.endsWith('/>') ||
            ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
                'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(tagName);

        let endCharIndex;
        if (isSelfClosing) {
            endCharIndex = tagEnd;
        } else {
            endCharIndex = findClosingTag(html, tagName, tagEnd + 1);
        }

        const endPos = getPosition(endCharIndex);

        // Store position
        positions.set(builderId, {
            startLine: startPos.line,
            startColumn: startPos.column,
            endLine: endPos.line,
            endColumn: endPos.column
        });

        // Inject the data-builder-id attribute
        // Insert before the closing > or />
        let injectedTag;
        if (fullTag.endsWith('/>')) {
            injectedTag = fullTag.slice(0, -2) + ` data-builder-id="${builderId}" />`;
        } else {
            injectedTag = fullTag.slice(0, -1) + ` data-builder-id="${builderId}">`;
        }

        result += injectedTag;
        i = tagEnd + 1;
    }

    return { injectedHtml: result, positions };
}

/**
 * Removes all data-builder-id attributes from HTML.
 * Used when saving the code to keep only user's original content.
 */
export function removeBuilderIds(html: string): string {
    // Remove data-builder-id="..." attributes
    return html.replace(/\s*data-builder-id="[^"]*"/g, '');
}
