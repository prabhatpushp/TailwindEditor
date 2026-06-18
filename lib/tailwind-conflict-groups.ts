/**
 * Tailwind CSS Conflict Groups Registry
 *
 * Maps each CSS property (or logical grouping) to a RegExp that matches ALL valid
 * Tailwind CSS utility classes for that property. This enables precise find-and-replace
 * when changing properties, preventing duplicate or conflicting classes.
 *
 * ADDING NEW PROPERTIES:
 * 1. Add a regex entry to CONFLICT_GROUPS below
 * 2. Use the key name when calling updateClasses() in the design panel
 *
 * REGEX CONVENTIONS:
 * - All regexes match the BASE utility only (without breakpoint/pseudo prefixes)
 * - Arbitrary values are matched with \[.+\] or more specific patterns
 * - Negative value prefixes (e.g., -mt-4) are handled with -? optional prefix
 * - Color utilities use explicit Tailwind color name lists for precision
 */

// ─── Color Pattern Helpers ──────────────────────────────────────────────────

/** Standard Tailwind CSS color scale names */
const TW_COLORS = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

/** Color keywords (non-scale colors) */
const TW_COLOR_KEYWORDS = 'inherit|current|transparent|black|white';

/**
 * Build a regex pattern string that matches any Tailwind color value.
 * Matches: inherit, transparent, black, red-500, red-500/50, [#hex], [rgb(...)], etc.
 */
function colorPattern(): string {
  return `(${TW_COLOR_KEYWORDS}|(${TW_COLORS})(-\\d+)?(\\/[\\d.]+)?|\\[[#a-zA-Z][^\\]]*\\])`;
}

// ─── Conflict Groups Registry ───────────────────────────────────────────────

export const CONFLICT_GROUPS: Record<string, RegExp> = {

  // ═══════════════════════════════════════════════════════════════════════════
  // LAYOUT & POSITIONING
  // ═══════════════════════════════════════════════════════════════════════════

  /** position: static | relative | absolute | fixed | sticky */
  position: /^(static|relative|absolute|fixed|sticky)$/,

  /** display: block | inline | flex | grid | hidden | etc. */
  display: /^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|contents|hidden|table|table-row|table-cell|table-caption|table-column|table-column-group|table-footer-group|table-header-group|table-row-group|flow-root|list-item)$/,

  /** float: float-right | float-left | float-none | etc. */
  float: /^float-(start|end|right|left|none)$/,

  /** clear: clear-left | clear-right | clear-both | etc. */
  clear: /^clear-(start|end|right|left|both|none)$/,

  /** isolation: isolate | isolation-auto */
  isolation: /^(isolate|isolation-auto)$/,

  /** object-fit: object-contain | object-cover | etc. */
  objectFit: /^object-(contain|cover|fill|none|scale-down)$/,

  /** object-position: object-center | object-top | etc. */
  objectPosition: /^object-(bottom|center|left|left-bottom|left-top|right|right-bottom|right-top|top|\[.+\])$/,

  /** overflow: overflow-auto | overflow-hidden | etc. */
  overflow: /^overflow-(auto|hidden|clip|visible|scroll)$/,

  /** overflow-x */
  overflowX: /^overflow-x-(auto|hidden|clip|visible|scroll)$/,

  /** overflow-y */
  overflowY: /^overflow-y-(auto|hidden|clip|visible|scroll)$/,

  /** overscroll-behavior */
  overscrollBehavior: /^overscroll-(auto|contain|none)$/,

  /** visibility: visible | invisible | collapse */
  visibility: /^(visible|invisible|collapse)$/,

  /** z-index: z-0 | z-10 | z-auto | z-[99] | etc. */
  zIndex: /^-?z-(\d+|auto|\[.+\])$/,

  /** box-sizing: box-border | box-content */
  boxSizing: /^box-(border|content)$/,

  /** aspect-ratio: aspect-auto | aspect-square | aspect-video | aspect-[...] */
  aspectRatio: /^aspect-(auto|square|video|\[.+\])$/,

  /** columns: columns-1 | columns-auto | etc. */
  columns: /^columns-(.+)$/,

  /** break-before */
  breakBefore: /^break-before-(auto|avoid|all|avoid-page|page|left|right|column)$/,

  /** break-inside */
  breakInside: /^break-inside-(auto|avoid|avoid-page|avoid-column)$/,

  /** break-after */
  breakAfter: /^break-after-(auto|avoid|all|avoid-page|page|left|right|column)$/,

  /** box-decoration-break */
  boxDecorationBreak: /^box-decoration-(clone|slice)$/,

  // ── Inset / Position offsets ──────────────────────────────────────────────

  /** top: top-0 | top-px | top-[10px] | -top-4 | etc. */
  top: /^-?top-(.+)$/,

  /** right */
  right: /^-?right-(.+)$/,

  /** bottom */
  bottom: /^-?bottom-(.+)$/,

  /** left */
  left: /^-?left-(.+)$/,

  /** inset (all sides) */
  inset: /^-?inset-(.+)$/,

  /** inset-x (left + right) */
  insetX: /^-?inset-x-(.+)$/,

  /** inset-y (top + bottom) */
  insetY: /^-?inset-y-(.+)$/,

  // ═══════════════════════════════════════════════════════════════════════════
  // FLEXBOX & GRID
  // ═══════════════════════════════════════════════════════════════════════════

  /** flex-direction: flex-row | flex-col | flex-row-reverse | flex-col-reverse */
  flexDirection: /^flex-(row|row-reverse|col|col-reverse)$/,

  /** flex-wrap: flex-wrap | flex-nowrap | flex-wrap-reverse */
  flexWrap: /^flex-(wrap|wrap-reverse|nowrap)$/,

  /** flex shorthand: flex-1 | flex-auto | flex-initial | flex-none | flex-[...] */
  flex: /^flex-(1|auto|initial|none|\[.+\])$/,

  /** flex-grow: grow | grow-0 | grow-[...] */
  flexGrow: /^grow(-0|-\[.+\])?$/,

  /** flex-shrink: shrink | shrink-0 | shrink-[...] */
  flexShrink: /^shrink(-0|-\[.+\])?$/,

  /** flex-basis: basis-0 | basis-1 | basis-auto | basis-full | basis-[...] */
  flexBasis: /^basis-(.+)$/,

  /** justify-content: justify-start | justify-center | justify-between | etc. */
  justifyContent: /^justify-(start|end|center|between|around|evenly|stretch|normal)$/,

  /** justify-items */
  justifyItems: /^justify-items-(start|end|center|stretch|auto)$/,

  /** justify-self */
  justifySelf: /^justify-self-(auto|start|end|center|stretch)$/,

  /** align-items: items-start | items-center | items-stretch | etc. */
  alignItems: /^items-(start|end|center|stretch|baseline)$/,

  /** align-content */
  alignContent: /^content-(start|end|center|between|around|evenly|stretch|normal|baseline)$/,

  /** align-self */
  alignSelf: /^self-(auto|start|end|center|stretch|baseline)$/,

  /** place-content */
  placeContent: /^place-content-(start|end|center|between|around|evenly|stretch|baseline)$/,

  /** place-items */
  placeItems: /^place-items-(start|end|center|stretch|baseline|auto)$/,

  /** place-self */
  placeSelf: /^place-self-(auto|start|end|center|stretch)$/,

  /** gap (all): gap-0 | gap-4 | gap-px | gap-[20px] | etc. */
  gap: /^gap-(.+)$/,

  /** gap-x */
  gapX: /^gap-x-(.+)$/,

  /** gap-y */
  gapY: /^gap-y-(.+)$/,

  /** grid-template-columns: grid-cols-1 | grid-cols-none | grid-cols-subgrid | grid-cols-[...] */
  gridCols: /^grid-cols-(.+)$/,

  /** grid-template-rows: grid-rows-1 | grid-rows-none | grid-rows-subgrid | grid-rows-[...] */
  gridRows: /^grid-rows-(.+)$/,

  /** grid-auto-flow: grid-flow-row | grid-flow-col | grid-flow-dense | etc. */
  gridAutoFlow: /^grid-flow-(row|col|dense|row-dense|col-dense)$/,

  /** grid-auto-columns: auto-cols-auto | auto-cols-min | auto-cols-max | etc. */
  gridAutoCols: /^auto-cols-(auto|min|max|fr|\[.+\])$/,

  /** grid-auto-rows */
  gridAutoRows: /^auto-rows-(auto|min|max|fr|\[.+\])$/,

  /** grid-column span/start/end: col-auto | col-span-1 | col-span-full | col-[...] */
  gridColSpan: /^col-(auto|span-\d+|span-full|\[.+\])$/,

  /** grid-column-start */
  gridColStart: /^col-start-(.+)$/,

  /** grid-column-end */
  gridColEnd: /^col-end-(.+)$/,

  /** grid-row span/start/end */
  gridRowSpan: /^row-(auto|span-\d+|span-full|\[.+\])$/,

  /** grid-row-start */
  gridRowStart: /^row-start-(.+)$/,

  /** grid-row-end */
  gridRowEnd: /^row-end-(.+)$/,

  /** order: order-1 | order-first | order-last | order-none | -order-1 */
  order: /^-?order-(.+)$/,

  // ═══════════════════════════════════════════════════════════════════════════
  // SIZING
  // ═══════════════════════════════════════════════════════════════════════════

  /** width: w-0 | w-full | w-screen | w-auto | w-1/2 | w-[500px] | etc. */
  width: /^w-(.+)$/,

  /** height: h-0 | h-full | h-screen | h-auto | h-[500px] | etc. */
  height: /^h-(.+)$/,

  /** min-width: min-w-0 | min-w-full | min-w-[200px] | etc. */
  minWidth: /^min-w-(.+)$/,

  /** max-width: max-w-none | max-w-sm | max-w-screen-xl | max-w-[600px] | etc. */
  maxWidth: /^max-w-(.+)$/,

  /** min-height */
  minHeight: /^min-h-(.+)$/,

  /** max-height */
  maxHeight: /^max-h-(.+)$/,

  /** size (w + h shorthand in v4): size-0 | size-full | size-[100px] | etc. */
  size: /^size-(.+)$/,

  // ═══════════════════════════════════════════════════════════════════════════
  // SPACING
  // ═══════════════════════════════════════════════════════════════════════════

  /** padding (all sides): p-0 | p-4 | p-px | p-[20px] | etc. */
  paddingAll: /^p-(.+)$/,

  /** padding-x (left + right): px-0 | px-4 | etc. */
  paddingX: /^px-(.+)$/,

  /** padding-y (top + bottom): py-0 | py-4 | etc. */
  paddingY: /^py-(.+)$/,

  /** padding-top: pt-0 | pt-4 | pt-[10px] | etc. */
  paddingTop: /^pt-(.+)$/,

  /** padding-right */
  paddingRight: /^pr-(.+)$/,

  /** padding-bottom */
  paddingBottom: /^pb-(.+)$/,

  /** padding-left */
  paddingLeft: /^pl-(.+)$/,

  /** margin (all sides): m-0 | m-4 | m-auto | m-[20px] | -m-4 | etc. */
  marginAll: /^-?m-(.+)$/,

  /** margin-x (left + right) */
  marginX: /^-?mx-(.+)$/,

  /** margin-y (top + bottom) */
  marginY: /^-?my-(.+)$/,

  /** margin-top: mt-0 | mt-4 | mt-auto | -mt-4 | mt-[10px] | etc. */
  marginTop: /^-?mt-(.+)$/,

  /** margin-right */
  marginRight: /^-?mr-(.+)$/,

  /** margin-bottom */
  marginBottom: /^-?mb-(.+)$/,

  /** margin-left */
  marginLeft: /^-?ml-(.+)$/,

  /** space-x (space between children, horizontal) */
  spaceX: /^-?space-x-(.+)$/,

  /** space-y (space between children, vertical) */
  spaceY: /^-?space-y-(.+)$/,

  // ═══════════════════════════════════════════════════════════════════════════
  // TYPOGRAPHY
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * font-family: font-sans | font-serif | font-mono | font-[...]
   * NOTE: Separated from fontWeight to prevent conflicts (both use font- prefix)
   */
  fontFamily: /^font-(sans|serif|mono|\[.+\])$/,

  /**
   * font-size: text-xs | text-sm | text-base | text-lg | text-xl | text-2xl...9xl | text-[14px]
   * Arbitrary values starting with a digit are treated as sizes.
   * NOTE: Separated from textColor and textAlign to prevent conflicts (all use text- prefix)
   */
  fontSize: /^text-(xs|sm|base|lg|xl|[2-9]xl|\[\d[^\]]*\])$/,

  /**
   * font-weight: font-thin | font-normal | font-bold | font-[900] | etc.
   * NOTE: Separated from fontFamily to prevent conflicts (both use font- prefix)
   */
  fontWeight: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\[\d+\])$/,

  /** font-style: italic | not-italic */
  fontStyle: /^(italic|not-italic)$/,

  /** font-smoothing: antialiased | subpixel-antialiased */
  fontSmoothing: /^(antialiased|subpixel-antialiased)$/,

  /**
   * text-align: text-left | text-center | text-right | text-justify | text-start | text-end
   * NOTE: Separated from fontSize and textColor (all use text- prefix)
   */
  textAlign: /^text-(left|center|right|justify|start|end)$/,

  /**
   * text-color: text-red-500 | text-black | text-[#hex] | text-[rgb(...)] | text-primary (custom)
   * Uses negative lookaheads to exclude font-size tokens, alignment tokens, and text-wrap tokens.
   * Arbitrary values starting with a digit (e.g., text-[20px]) are excluded (treated as fontSize).
   */
  textColor: /^text-(?!(xs|sm|base|lg|xl|[2-9]xl|left|center|right|justify|start|end|wrap|nowrap|balance|pretty|ellipsis|clip)$)(?!\[\d).+$/,

  /** text-decoration: underline | overline | line-through | no-underline */
  textDecoration: /^(underline|overline|line-through|no-underline)$/,

  /** text-decoration-color: decoration-red-500 | decoration-[#hex] | etc. */
  textDecorationColor: new RegExp(`^decoration-${colorPattern()}$`),

  /** text-decoration-style: decoration-solid | decoration-double | etc. */
  textDecorationStyle: /^decoration-(solid|double|dotted|dashed|wavy)$/,

  /** text-decoration-thickness: decoration-auto | decoration-from-font | decoration-0 | etc. */
  textDecorationThickness: /^decoration-(auto|from-font|0|1|2|4|8|\[.+\])$/,

  /** text-underline-offset: underline-offset-auto | underline-offset-0 | etc. */
  textUnderlineOffset: /^underline-offset-(auto|0|1|2|4|8|\[.+\])$/,

  /** text-transform: uppercase | lowercase | capitalize | normal-case */
  textTransform: /^(uppercase|lowercase|capitalize|normal-case)$/,

  /** text-overflow: truncate | text-ellipsis | text-clip */
  textOverflow: /^(truncate|text-ellipsis|text-clip)$/,

  /** text-wrap (v4): text-wrap | text-nowrap | text-balance | text-pretty */
  textWrap: /^text-(wrap|nowrap|balance|pretty)$/,

  /** text-indent: indent-0 | indent-px | indent-[2em] | etc. */
  textIndent: /^-?indent-(.+)$/,

  /** vertical-align: align-baseline | align-top | align-middle | etc. */
  verticalAlign: /^align-(baseline|top|middle|bottom|text-top|text-bottom|sub|super|\[.+\])$/,

  /** whitespace: whitespace-normal | whitespace-nowrap | whitespace-pre | etc. */
  whitespace: /^whitespace-(normal|nowrap|pre|pre-line|pre-wrap|break-spaces)$/,

  /** word-break: break-normal | break-words | break-all | break-keep */
  wordBreak: /^(break-normal|break-words|break-all|break-keep)$/,

  /** hyphens: hyphens-none | hyphens-manual | hyphens-auto */
  hyphens: /^hyphens-(none|manual|auto)$/,

  /** line-height: leading-none | leading-tight | leading-[1.5] | etc. */
  lineHeight: /^leading-(.+)$/,

  /** letter-spacing: tracking-tighter | tracking-normal | tracking-[0.05em] | etc. */
  letterSpacing: /^tracking-(.+)$/,

  /** list-style-type: list-none | list-disc | list-decimal | list-[...] */
  listStyleType: /^list-(none|disc|decimal|\[.+\])$/,

  /** list-style-position: list-inside | list-outside */
  listStylePosition: /^list-(inside|outside)$/,

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKGROUNDS
  // ═══════════════════════════════════════════════════════════════════════════

  /** background-color: bg-red-500 | bg-transparent | bg-[#hex] | etc. */
  backgroundColor: new RegExp(`^bg-${colorPattern()}$`),

  /** background-gradient direction: bg-gradient-to-r | bg-gradient-to-t | etc. */
  bgGradient: /^bg-gradient-to-(t|tr|r|br|b|bl|l|tl)$/,

  /** gradient-from: from-red-500 | from-transparent | from-[#hex] | etc. */
  gradientFrom: new RegExp(`^from-${colorPattern()}$`),

  /** gradient-via */
  gradientVia: new RegExp(`^via-${colorPattern()}$`),

  /** gradient-to */
  gradientTo: new RegExp(`^to-${colorPattern()}$`),

  /** background-size: bg-auto | bg-cover | bg-contain | bg-[...] */
  bgSize: /^bg-(auto|cover|contain|\[.+\])$/,

  /** background-position: bg-bottom | bg-center | bg-top | etc. */
  bgPosition: /^bg-(bottom|center|left|left-bottom|left-top|right|right-bottom|right-top|top|\[.+\])$/,

  /** background-repeat: bg-repeat | bg-no-repeat | bg-repeat-x | etc. */
  bgRepeat: /^bg-(repeat|no-repeat|repeat-x|repeat-y|repeat-round|repeat-space)$/,

  /** background-attachment: bg-fixed | bg-local | bg-scroll */
  bgAttachment: /^bg-(fixed|local|scroll)$/,

  /** background-clip: bg-clip-border | bg-clip-padding | bg-clip-content | bg-clip-text */
  bgClip: /^bg-clip-(border|padding|content|text)$/,

  /** background-origin: bg-origin-border | bg-origin-padding | bg-origin-content */
  bgOrigin: /^bg-origin-(border|padding|content)$/,

  // ═══════════════════════════════════════════════════════════════════════════
  // BORDERS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * border-width: border | border-0 | border-2 | border-4 | border-8 | border-[3px]
   * Also matches side-specific: border-t | border-r-2 | border-x-4 | etc.
   * Does NOT match border-red-500 (color) or border-solid (style).
   */
  borderWidth: /^border(-[trblxy])?(-\d+|-\[.+\])?$/,

  /**
   * border-color: border-red-500 | border-transparent | border-[#hex] | etc.
   * Uses explicit color matching to avoid conflicts with borderWidth and borderStyle.
   */
  borderColor: new RegExp(`^border-${colorPattern()}$`),

  /** border-style: border-solid | border-dashed | border-dotted | border-double | border-hidden | border-none */
  borderStyle: /^border-(solid|dashed|dotted|double|hidden|none)$/,

  /** border-collapse: border-collapse | border-separate */
  borderCollapse: /^border-(collapse|separate)$/,

  /**
   * border-radius: rounded | rounded-sm | rounded-lg | rounded-full | rounded-none
   * Also matches side-specific: rounded-t-lg | rounded-tl-xl | rounded-br-[5px] | etc.
   * Side specifiers: t, r, b, l, tl, tr, bl, br, s, e, ss, se, es, ee
   */
  borderRadius: /^rounded(-(t|r|b|l|tl|tr|bl|br|s|e|ss|se|es|ee))?(-(none|sm|md|lg|xl|2xl|3xl|full|\[.+\]))?$/,

  // ── Ring ──────────────────────────────────────────────────────────────────

  /** ring-width: ring | ring-0 | ring-1 | ring-2 | ring-4 | ring-8 | ring-[3px] */
  ringWidth: /^ring(-\d+|-\[.+\])?$/,

  /** ring-color: ring-red-500 | ring-transparent | ring-[#hex] | etc. */
  ringColor: new RegExp(`^ring-${colorPattern()}$`),

  /** ring-offset-width: ring-offset-0 | ring-offset-1 | ring-offset-2 | etc. */
  ringOffsetWidth: /^ring-offset-(\d+|\[.+\])$/,

  /** ring-offset-color: ring-offset-red-500 | etc. */
  ringOffsetColor: new RegExp(`^ring-offset-${colorPattern()}$`),

  /** ring-inset: ring-inset */
  ringInset: /^ring-inset$/,

  // ── Outline ───────────────────────────────────────────────────────────────

  /** outline-width: outline-0 | outline-1 | outline-2 | outline-4 | outline-8 | outline-[...] */
  outlineWidth: /^outline-(\d+|\[.+\])$/,

  /** outline-color */
  outlineColor: new RegExp(`^outline-${colorPattern()}$`),

  /** outline-style: outline | outline-none | outline-dashed | outline-dotted | outline-double */
  outlineStyle: /^outline(-none|-dashed|-dotted|-double)?$/,

  /** outline-offset: outline-offset-0 | outline-offset-2 | -outline-offset-2 | etc. */
  outlineOffset: /^-?outline-offset-(\d+|\[.+\])$/,

  // ── Divide ────────────────────────────────────────────────────────────────

  /** divide-width: divide-x | divide-y | divide-x-2 | divide-y-reverse | etc. */
  divideWidth: /^divide-(x|y)(-\d+|-reverse|-\[.+\])?$/,

  /** divide-color */
  divideColor: new RegExp(`^divide-${colorPattern()}$`),

  /** divide-style: divide-solid | divide-dashed | divide-dotted | divide-double | divide-none */
  divideStyle: /^divide-(solid|dashed|dotted|double|none)$/,

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFECTS & FILTERS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * box-shadow: shadow | shadow-sm | shadow-md | shadow-lg | shadow-xl | shadow-2xl
   *             shadow-inner | shadow-none | shadow-[...]
   * Does NOT match shadow color (e.g., shadow-red-500).
   */
  boxShadow: /^shadow(-sm|-md|-lg|-xl|-2xl|-inner|-none|-\[.+\])?$/,

  /** shadow-color: shadow-red-500 | shadow-[#hex] | etc. */
  shadowColor: new RegExp(`^shadow-${colorPattern()}$`),

  /** opacity: opacity-0 | opacity-50 | opacity-100 | opacity-[0.5] | etc. */
  opacity: /^opacity-(\d+|\[.+\])$/,

  /** mix-blend-mode: mix-blend-normal | mix-blend-multiply | etc. */
  mixBlendMode: /^mix-blend-(normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity|plus-darker|plus-lighter)$/,

  /** background-blend-mode: bg-blend-normal | bg-blend-multiply | etc. */
  bgBlendMode: /^bg-blend-(normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity)$/,

  // ── Filter ────────────────────────────────────────────────────────────────

  /** blur: blur | blur-none | blur-sm | blur-md | blur-lg | blur-xl | blur-2xl | blur-3xl | blur-[...] */
  blur: /^blur(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-\[.+\])?$/,

  /** brightness: brightness-0 | brightness-50 | brightness-100 | brightness-200 | brightness-[...] */
  brightness: /^brightness-(\d+|\[.+\])$/,

  /** contrast: contrast-0 | contrast-50 | contrast-100 | contrast-200 | contrast-[...] */
  contrast: /^contrast-(\d+|\[.+\])$/,

  /** saturate: saturate-0 | saturate-50 | saturate-100 | saturate-200 | saturate-[...] */
  saturate: /^saturate-(\d+|\[.+\])$/,

  /** hue-rotate: hue-rotate-0 | hue-rotate-15 | hue-rotate-180 | -hue-rotate-60 | etc. */
  hueRotate: /^-?hue-rotate-(\d+|\[.+\])$/,

  /** grayscale: grayscale | grayscale-0 */
  grayscale: /^grayscale(-0)?$/,

  /** invert: invert | invert-0 */
  invert: /^invert(-0)?$/,

  /** sepia: sepia | sepia-0 */
  sepia: /^sepia(-0)?$/,

  /** drop-shadow: drop-shadow | drop-shadow-sm | drop-shadow-md | etc. */
  dropShadow: /^drop-shadow(-sm|-md|-lg|-xl|-2xl|-none|-\[.+\])?$/,

  // ── Backdrop Filter ───────────────────────────────────────────────────────

  /** backdrop-blur: backdrop-blur | backdrop-blur-sm | backdrop-blur-md | etc. */
  backdropBlur: /^backdrop-blur(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-\[.+\])?$/,

  /** backdrop-brightness */
  backdropBrightness: /^backdrop-brightness-(\d+|\[.+\])$/,

  /** backdrop-contrast */
  backdropContrast: /^backdrop-contrast-(\d+|\[.+\])$/,

  /** backdrop-grayscale */
  backdropGrayscale: /^backdrop-grayscale(-0)?$/,

  /** backdrop-hue-rotate */
  backdropHueRotate: /^-?backdrop-hue-rotate-(\d+|\[.+\])$/,

  /** backdrop-invert */
  backdropInvert: /^backdrop-invert(-0)?$/,

  /** backdrop-opacity */
  backdropOpacity: /^backdrop-opacity-(\d+|\[.+\])$/,

  /** backdrop-saturate */
  backdropSaturate: /^backdrop-saturate-(\d+|\[.+\])$/,

  /** backdrop-sepia */
  backdropSepia: /^backdrop-sepia(-0)?$/,

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSFORMS
  // ═══════════════════════════════════════════════════════════════════════════

  /** translate-x: translate-x-0 | translate-x-4 | -translate-x-4 | translate-x-full | translate-x-[10px] */
  translateX: /^-?translate-x-(.+)$/,

  /** translate-y */
  translateY: /^-?translate-y-(.+)$/,

  /** rotate: rotate-0 | rotate-45 | rotate-90 | -rotate-45 | rotate-[30deg] | etc. */
  rotate: /^-?rotate-(.+)$/,

  /** scale (uniform): scale-0 | scale-50 | scale-100 | scale-150 | scale-[1.5] | etc. */
  scale: /^scale-(\d+|\[.+\])$/,

  /** scale-x */
  scaleX: /^scale-x-(\d+|\[.+\])$/,

  /** scale-y */
  scaleY: /^scale-y-(\d+|\[.+\])$/,

  /** skew-x: skew-x-0 | skew-x-3 | skew-x-12 | -skew-x-6 | skew-x-[17deg] */
  skewX: /^-?skew-x-(.+)$/,

  /** skew-y */
  skewY: /^-?skew-y-(.+)$/,

  /** transform-origin: origin-center | origin-top | origin-top-right | etc. */
  transformOrigin: /^origin-(center|top|top-right|right|bottom-right|bottom|bottom-left|left|top-left|\[.+\])$/,

  /** backface-visibility: backface-visible | backface-hidden */
  backfaceVisibility: /^backface-(visible|hidden)$/,

  // ── 3D Transforms (arbitrary value classes) ───────────────────────────────

  /** perspective: [perspective:500px] | [perspective:1000px] | etc. */
  perspective: /^\[perspective:.+\]$/,

  /** transform-style: [transform-style:preserve-3d] | [transform-style:flat] */
  transformStyle: /^\[transform-style:.+\]$/,

  /** 3D rotate-x: [transform:rotateX(45deg)] | etc. */
  rotateX3d: /^\[transform:rotateX\(.+\)\]$/,

  /** 3D rotate-y: [transform:rotateY(45deg)] | etc. */
  rotateY3d: /^\[transform:rotateY\(.+\)\]$/,

  /** 3D rotate-z: [transform:rotateZ(45deg)] | etc. */
  rotateZ3d: /^\[transform:rotateZ\(.+\)\]$/,

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSITIONS & ANIMATION
  // ═══════════════════════════════════════════════════════════════════════════

  /** transition-property: transition | transition-none | transition-all | transition-colors | etc. */
  transitionProperty: /^transition(-none|-all|-colors|-opacity|-shadow|-transform)?$/,

  /** transition-duration: duration-75 | duration-100 | duration-[2s] | etc. */
  transitionDuration: /^duration-(\d+|\[.+\])$/,

  /** transition-timing-function: ease-linear | ease-in | ease-out | ease-in-out | ease-[...] */
  transitionTimingFunction: /^ease-(linear|in|out|in-out|\[.+\])$/,

  /** transition-delay: delay-75 | delay-100 | delay-[2s] | etc. */
  transitionDelay: /^delay-(\d+|\[.+\])$/,

  /** animation: animate-none | animate-spin | animate-ping | animate-pulse | animate-bounce | animate-[...] */
  animation: /^animate-(none|spin|ping|pulse|bounce|\[.+\])$/,

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERACTIVITY
  // ═══════════════════════════════════════════════════════════════════════════

  /** cursor: cursor-auto | cursor-default | cursor-pointer | cursor-wait | etc. Also matches arbitrary values. */
  cursor: /^cursor-(auto|default|pointer|wait|text|move|help|not-allowed|none|context-menu|progress|cell|crosshair|vertical-text|alias|copy|no-drop|grab|grabbing|all-scroll|col-resize|row-resize|n-resize|e-resize|s-resize|w-resize|ne-resize|nw-resize|se-resize|sw-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|zoom-in|zoom-out|\[.+\])$/,

  /** user-select: select-none | select-text | select-all | select-auto */
  userSelect: /^select-(none|text|all|auto)$/,

  /** pointer-events: pointer-events-none | pointer-events-auto */
  pointerEvents: /^pointer-events-(none|auto)$/,

  /** resize: resize | resize-none | resize-x | resize-y */
  resize: /^resize(-none|-x|-y)?$/,

  /** scroll-behavior: scroll-auto | scroll-smooth */
  scrollBehavior: /^scroll-(auto|smooth)$/,

  /** touch-action: touch-auto | touch-none | touch-pan-x | etc. */
  touchAction: /^touch-(auto|none|pan-x|pan-left|pan-right|pan-y|pan-up|pan-down|pinch-zoom|manipulation)$/,

  /** appearance: appearance-none | appearance-auto */
  appearance: /^appearance-(none|auto)$/,

  /** will-change: will-change-auto | will-change-scroll | will-change-contents | etc. */
  willChange: /^will-change-(auto|scroll|contents|transform|\[.+\])$/,

  // ═══════════════════════════════════════════════════════════════════════════
  // TABLES
  // ═══════════════════════════════════════════════════════════════════════════

  /** table-layout: table-auto | table-fixed */
  tableLayout: /^table-(auto|fixed)$/,

  /** caption-side: caption-top | caption-bottom */
  captionSide: /^caption-(top|bottom)$/,

  // ═══════════════════════════════════════════════════════════════════════════
  // ACCESSIBILITY
  // ═══════════════════════════════════════════════════════════════════════════

  /** screen-reader-only: sr-only | not-sr-only */
  srOnly: /^(sr-only|not-sr-only)$/,

  /** forced-color-adjust: forced-color-adjust-auto | forced-color-adjust-none */
  forcedColorAdjust: /^forced-color-adjust-(auto|none)$/,
};


// ─── Utility Functions ──────────────────────────────────────────────────────

/**
 * Extract the modifier chain (breakpoints + pseudo-selectors) and the base utility
 * from a Tailwind CSS class string.
 *
 * Correctly handles colons inside arbitrary values like `text-[color:red]`.
 *
 * @example
 *   extractModifierAndBase("text-red-500")         → { modifier: "",           base: "text-red-500" }
 *   extractModifierAndBase("hover:text-red-500")   → { modifier: "hover:",     base: "text-red-500" }
 *   extractModifierAndBase("sm:hover:bg-blue-500") → { modifier: "sm:hover:",  base: "bg-blue-500" }
 *   extractModifierAndBase("text-[color:red]")     → { modifier: "",           base: "text-[color:red]" }
 */
export function extractModifierAndBase(cls: string): { modifier: string; base: string } {
  let bracketDepth = 0;
  let lastModifierColon = -1;

  for (let i = 0; i < cls.length; i++) {
    const ch = cls[i];
    if (ch === '[') bracketDepth++;
    else if (ch === ']') bracketDepth--;
    else if (ch === ':' && bracketDepth === 0) {
      lastModifierColon = i;
    }
  }

  if (lastModifierColon === -1) {
    return { modifier: '', base: cls };
  }

  return {
    modifier: cls.substring(0, lastModifierColon + 1),
    base: cls.substring(lastModifierColon + 1),
  };
}

/**
 * Remove all classes matching a conflict group regex from the class list,
 * respecting the active breakpoint/modifier context.
 *
 * Only removes classes whose modifier chain exactly matches the target context:
 * - If activeBreakpoint is set (e.g., "md:"): only removes classes prefixed with "md:"
 * - If activeBreakpoint is null/empty: only removes classes with NO modifier (base classes)
 *
 * This ensures pseudo-selectors (hover:, focus:, etc.) and other breakpoints
 * are never accidentally removed.
 */
function removeMatchingClasses(
  classes: string[],
  regex: RegExp,
  activeBreakpoint: string | null
): string[] {
  return classes.filter((cls) => {
    const { modifier, base } = extractModifierAndBase(cls);

    // Only consider removing if the modifier matches our editing context
    if (activeBreakpoint) {
      // Editing a specific breakpoint: only remove classes with THIS exact breakpoint/modifier
      if (modifier !== activeBreakpoint) return true; // Keep — different modifier context
    } else {
      // Editing base styles (no breakpoint): only remove unmodified (base) classes
      if (modifier !== '') return true; // Keep — has modifier, we're editing base
    }

    // Check if the base utility matches the conflict group regex
    return !regex.test(base);
  });
}

/**
 * Replace classes matching one or more conflict groups with a new class.
 *
 * This is the main API for the property editor. It:
 * 1. Removes all existing classes matching the specified conflict group(s)
 *    (within the current breakpoint/modifier context)
 * 2. Adds the new class (with appropriate breakpoint prefix)
 *
 * @param currentClasses - The full current class string
 * @param conflictGroupKeys - One or more conflict group key(s) to match against
 * @param newClass - The new class to add (WITHOUT breakpoint prefix). Pass "" to only remove.
 * @param activeBreakpoint - Current breakpoint being edited (e.g., "sm:", "md:") or null for base
 * @returns The updated class string with conflicts resolved
 *
 * @example
 *   // Change position from relative to absolute
 *   replaceConflictingClasses("relative p-4 text-sm", "position", "absolute", null)
 *   // → "p-4 text-sm absolute"
 *
 *   // Change font-weight without affecting font-family
 *   replaceConflictingClasses("font-sans font-bold text-lg", "fontWeight", "font-normal", null)
 *   // → "font-sans text-lg font-normal"
 *
 *   // Change md: breakpoint text-color without affecting base or sm:
 *   replaceConflictingClasses("text-red-500 sm:text-blue-500 md:text-green-500", "textColor", "text-purple-500", "md:")
 *   // → "text-red-500 sm:text-blue-500 md:text-purple-500"
 */
export function replaceConflictingClasses(
  currentClasses: string,
  conflictGroupKeys: string | string[],
  newClass: string,
  activeBreakpoint: string | null
): string {
  const keys = Array.isArray(conflictGroupKeys) ? conflictGroupKeys : [conflictGroupKeys];
  let classes = currentClasses.split(/\s+/).filter(Boolean);

  // Remove classes for each conflict group
  for (const key of keys) {
    const regex = CONFLICT_GROUPS[key];
    if (!regex) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[tailwind-conflict-groups] Unknown conflict group: "${key}". Skipping removal.`);
      }
      continue;
    }
    classes = removeMatchingClasses(classes, regex, activeBreakpoint);
  }

  // Add the new class with the appropriate breakpoint prefix
  if (newClass) {
    const fullClass = activeBreakpoint ? `${activeBreakpoint}${newClass}` : newClass;
    classes.push(fullClass);
  }

  return classes.join(' ');
}
