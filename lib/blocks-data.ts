// =============================================================================
// BLOCKS, SECTIONS, AND TEMPLATES DATA
// =============================================================================

export interface BlockItem {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string; // Lucide icon name
    preview: string; // Small preview HTML
    code: string; // Full HTML code to insert
}

export interface BlockCategory {
    id: string;
    name: string;
    icon: string;
    items: BlockItem[];
}

// =============================================================================
// BASIC BLOCKS - Small UI components
// =============================================================================

export const BASIC_BLOCKS: BlockItem[] = [
    {
        id: "btn-primary",
        name: "Primary Button",
        description: "A solid primary button",
        category: "buttons",
        icon: "Square",
        preview: `<button class="bg-gray-900 text-white px-4 py-2 rounded text-sm">Button</button>`,
        code: `<button class="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-lg transition-colors">Get Started</button>`,
    },
    {
        id: "btn-outline",
        name: "Outline Button",
        description: "A bordered outline button",
        category: "buttons",
        icon: "Square",
        preview: `<button class="border border-gray-300 px-4 py-2 rounded text-sm">Button</button>`,
        code: `<button class="border border-gray-300 hover:border-gray-900 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors">Learn More</button>`,
    },
    {
        id: "btn-ghost",
        name: "Ghost Button",
        description: "A transparent ghost button",
        category: "buttons",
        icon: "Square",
        preview: `<button class="text-gray-600 px-4 py-2 rounded text-sm hover:bg-gray-100">Button</button>`,
        code: `<button class="text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium px-6 py-3 rounded-lg transition-colors">Cancel</button>`,
    },
    {
        id: "heading-h1",
        name: "Heading H1",
        description: "Large main heading",
        category: "typography",
        icon: "Type",
        preview: `<h1 class="text-2xl font-bold">Heading</h1>`,
        code: `<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">Your Main Heading Here</h1>`,
    },
    {
        id: "heading-h2",
        name: "Heading H2",
        description: "Section heading",
        category: "typography",
        icon: "Type",
        preview: `<h2 class="text-xl font-semibold">Heading</h2>`,
        code: `<h2 class="text-3xl md:text-4xl font-bold text-gray-900">Section Heading</h2>`,
    },
    {
        id: "paragraph",
        name: "Paragraph",
        description: "Body text paragraph",
        category: "typography",
        icon: "AlignLeft",
        preview: `<p class="text-gray-600 text-sm">Lorem ipsum dolor sit amet...</p>`,
        code: `<p class="text-lg text-gray-600 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
    },
    {
        id: "badge",
        name: "Badge",
        description: "Small label badge",
        category: "elements",
        icon: "Tag",
        preview: `<span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">Badge</span>`,
        code: `<span class="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">New Feature</span>`,
    },
    {
        id: "avatar",
        name: "Avatar",
        description: "User avatar circle",
        category: "elements",
        icon: "User",
        preview: `<div class="w-10 h-10 bg-gray-200 rounded-full"></div>`,
        code: `<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">JD</div>`,
    },
    {
        id: "divider",
        name: "Divider",
        description: "Horizontal divider line",
        category: "elements",
        icon: "Minus",
        preview: `<div class="border-t border-gray-200 w-full"></div>`,
        code: `<div class="border-t border-gray-200 w-full my-8"></div>`,
    },
    {
        id: "icon-box",
        name: "Icon Box",
        description: "Icon in a styled box",
        category: "elements",
        icon: "Box",
        preview: `<div class="w-12 h-12 bg-gray-100 rounded-lg"></div>`,
        code: `<div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
    </svg>
</div>`,
    },
    {
        id: "input-text",
        name: "Text Input",
        description: "Basic text input field",
        category: "forms",
        icon: "TextCursor",
        preview: `<input type="text" placeholder="Enter text..." class="border rounded px-3 py-1 text-sm w-full">`,
        code: `<input type="text" placeholder="Enter your email" class="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow">`,
    },
    {
        id: "input-search",
        name: "Search Input",
        description: "Search input with icon",
        category: "forms",
        icon: "Search",
        preview: `<div class="relative"><input type="text" placeholder="Search..." class="border rounded px-3 py-1 text-sm w-full pl-8"><span class="absolute left-2 top-1.5 text-gray-400">🔍</span></div>`,
        code: `<div class="relative">
    <input type="text" placeholder="Search..." class="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
</div>`,
    },
];

// =============================================================================
// SECTIONS - Larger page sections
// =============================================================================

export const SECTIONS: BlockItem[] = [
    {
        id: "hero-simple",
        name: "Simple Hero",
        description: "Clean centered hero section",
        category: "hero",
        icon: "Layout",
        preview: `<div class="bg-gray-50 p-4 text-center"><div class="w-24 h-4 bg-gray-200 mx-auto mb-2 rounded"></div><div class="w-32 h-3 bg-gray-100 mx-auto rounded"></div></div>`,
        code: `<section class="py-24 px-6">
    <div class="max-w-4xl mx-auto text-center">
        <span class="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium mb-6">New Release</span>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">Build amazing websites with ease</h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Create stunning, responsive websites without writing a single line of code. Our intuitive builder makes it simple.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-4 rounded-lg transition-colors">Get Started Free</button>
            <button class="border border-gray-300 hover:border-gray-900 text-gray-900 font-medium px-8 py-4 rounded-lg transition-colors">Watch Demo</button>
        </div>
    </div>
</section>`,
    },
    {
        id: "hero-split",
        name: "Split Hero",
        description: "Hero with image on side",
        category: "hero",
        icon: "LayoutGrid",
        preview: `<div class="bg-gray-50 p-4 flex gap-2"><div class="flex-1 space-y-1"><div class="w-full h-3 bg-gray-200 rounded"></div><div class="w-3/4 h-2 bg-gray-100 rounded"></div></div><div class="w-12 h-12 bg-gray-200 rounded"></div></div>`,
        code: `<section class="py-24 px-6">
    <div class="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
            <span class="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium">🚀 Launch Special</span>
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">The modern way to build products</h1>
            <p class="text-xl text-gray-600 leading-relaxed">Join thousands of teams who use our platform to ship products faster. No complexity, just results.</p>
            <div class="flex flex-wrap gap-4">
                <button class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">Start Building</button>
                <button class="text-gray-600 hover:text-gray-900 font-medium px-6 py-3 flex items-center gap-2">
                    <span>Learn more</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </div>
        <div class="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl"></div>
    </div>
</section>`,
    },
    {
        id: "features-grid",
        name: "Features Grid",
        description: "3-column feature cards",
        category: "features",
        icon: "Grid3X3",
        preview: `<div class="grid grid-cols-3 gap-2 p-2"><div class="bg-gray-100 rounded p-2 h-12"></div><div class="bg-gray-100 rounded p-2 h-12"></div><div class="bg-gray-100 rounded p-2 h-12"></div></div>`,
        code: `<section class="py-24 px-6 bg-gray-50">
    <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need</h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features to help you build, deploy, and scale your applications.</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
                <p class="text-gray-600">Optimized for speed with instant loading and smooth interactions.</p>
            </div>
            <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">Secure by Default</h3>
                <p class="text-gray-600">Enterprise-grade security with encryption and compliance built-in.</p>
            </div>
            <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">Flexible Layout</h3>
                <p class="text-gray-600">Customize every aspect with our drag-and-drop interface.</p>
            </div>
        </div>
    </div>
</section>`,
    },
    {
        id: "cta-simple",
        name: "Simple CTA",
        description: "Call to action banner",
        category: "cta",
        icon: "Megaphone",
        preview: `<div class="bg-gray-900 p-4 text-center rounded"><div class="w-20 h-3 bg-gray-700 mx-auto mb-2 rounded"></div><div class="w-12 h-2 bg-gray-600 mx-auto rounded"></div></div>`,
        code: `<section class="py-20 px-6 bg-gray-900">
    <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
        <p class="text-xl text-gray-400 mb-8">Join thousands of creators building amazing things.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-white hover:bg-gray-100 text-gray-900 font-medium px-8 py-4 rounded-lg transition-colors">Start Free Trial</button>
            <button class="border border-gray-600 hover:border-gray-400 text-white font-medium px-8 py-4 rounded-lg transition-colors">Contact Sales</button>
        </div>
    </div>
</section>`,
    },
    {
        id: "testimonials",
        name: "Testimonials",
        description: "Customer testimonials grid",
        category: "social-proof",
        icon: "Quote",
        preview: `<div class="grid grid-cols-2 gap-2 p-2"><div class="bg-gray-100 rounded p-2 h-16"></div><div class="bg-gray-100 rounded p-2 h-16"></div></div>`,
        code: `<section class="py-24 px-6">
    <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loved by thousands</h2>
            <p class="text-xl text-gray-600">See what our customers have to say</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div class="flex gap-1 mb-4">
                    <span class="text-yellow-400">★</span><span class="text-yellow-400">★</span><span class="text-yellow-400">★</span><span class="text-yellow-400">★</span><span class="text-yellow-400">★</span>
                </div>
                <p class="text-gray-600 mb-6">"This has completely transformed how we build websites. The speed and ease of use is unmatched."</p>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">JD</div>
                    <div>
                        <div class="font-semibold text-gray-900">John Doe</div>
                        <div class="text-sm text-gray-500">CEO at TechCorp</div>
                    </div>
                </div>
            </div>
            <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div class="flex gap-1 mb-4">
                    <span class="text-yellow-400">★</span><span class="text-yellow-400">★</span><span class="text-yellow-400">★</span><span class="text-yellow-400">★</span><span class="text-yellow-400">★</span>
                </div>
                <p class="text-gray-600 mb-6">"We shipped our landing page in just 2 hours. The templates are beautiful and easy to customize."</p>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">SM</div>
                    <div>
                        <div class="font-semibold text-gray-900">Sarah Miller</div>
                        <div class="text-sm text-gray-500">Designer at StartupXYZ</div>
                    </div>
                </div>
            </div>
            <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div class="flex gap-1 mb-4">
                    <span class="text-yellow-400">★</span><span class="text-yellow-400">★</span><span class="text-yellow-400">★</span><span class="text-yellow-400">★</span><span class="text-yellow-400">★</span>
                </div>
                <p class="text-gray-600 mb-6">"The best investment we made for our marketing team. No more waiting on developers!"</p>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">MJ</div>
                    <div>
                        <div class="font-semibold text-gray-900">Mike Johnson</div>
                        <div class="text-sm text-gray-500">Marketing Lead</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>`,
    },
    {
        id: "footer-simple",
        name: "Simple Footer",
        description: "Minimal footer with links",
        category: "footer",
        icon: "PanelBottom",
        preview: `<div class="bg-gray-100 p-2 flex justify-between text-xs"><div class="w-12 h-2 bg-gray-300 rounded"></div><div class="flex gap-2"><div class="w-8 h-2 bg-gray-200 rounded"></div><div class="w-8 h-2 bg-gray-200 rounded"></div></div></div>`,
        code: `<footer class="border-t border-gray-100 py-12 px-6">
    <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-4 gap-8 mb-12">
            <div class="md:col-span-1">
                <div class="text-2xl font-bold text-gray-900 mb-4">Brand</div>
                <p class="text-gray-600 text-sm">Making the web more beautiful, one page at a time.</p>
            </div>
            <div>
                <div class="font-semibold text-gray-900 mb-4">Product</div>
                <ul class="space-y-2 text-sm text-gray-600">
                    <li><a href="#" class="hover:text-gray-900">Features</a></li>
                    <li><a href="#" class="hover:text-gray-900">Pricing</a></li>
                    <li><a href="#" class="hover:text-gray-900">Templates</a></li>
                </ul>
            </div>
            <div>
                <div class="font-semibold text-gray-900 mb-4">Company</div>
                <ul class="space-y-2 text-sm text-gray-600">
                    <li><a href="#" class="hover:text-gray-900">About</a></li>
                    <li><a href="#" class="hover:text-gray-900">Blog</a></li>
                    <li><a href="#" class="hover:text-gray-900">Careers</a></li>
                </ul>
            </div>
            <div>
                <div class="font-semibold text-gray-900 mb-4">Legal</div>
                <ul class="space-y-2 text-sm text-gray-600">
                    <li><a href="#" class="hover:text-gray-900">Privacy</a></li>
                    <li><a href="#" class="hover:text-gray-900">Terms</a></li>
                </ul>
            </div>
        </div>
        <div class="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="text-sm text-gray-500">© 2024 Brand. All rights reserved.</div>
            <div class="flex gap-4">
                <a href="#" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                </a>
                <a href="#" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                </a>
            </div>
        </div>
    </div>
</footer>`,
    },
    {
        id: "navbar",
        name: "Navigation Bar",
        description: "Responsive navbar",
        category: "navigation",
        icon: "Menu",
        preview: `<div class="bg-white border-b p-2 flex justify-between items-center"><div class="w-16 h-4 bg-gray-200 rounded"></div><div class="flex gap-2"><div class="w-8 h-2 bg-gray-100 rounded"></div><div class="w-8 h-2 bg-gray-100 rounded"></div></div></div>`,
        code: `<nav class="border-b border-gray-100 bg-white sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="text-xl font-bold text-gray-900">Brand</div>
        <div class="hidden md:flex items-center gap-8">
            <a href="#" class="text-gray-600 hover:text-gray-900 text-sm font-medium">Features</a>
            <a href="#" class="text-gray-600 hover:text-gray-900 text-sm font-medium">Pricing</a>
            <a href="#" class="text-gray-600 hover:text-gray-900 text-sm font-medium">About</a>
            <a href="#" class="text-gray-600 hover:text-gray-900 text-sm font-medium">Contact</a>
        </div>
        <div class="flex items-center gap-4">
            <button class="text-gray-600 hover:text-gray-900 text-sm font-medium hidden md:block">Sign In</button>
            <button class="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">Get Started</button>
        </div>
    </div>
</nav>`,
    },
    {
        id: "pricing",
        name: "Pricing Cards",
        description: "Pricing comparison cards",
        category: "pricing",
        icon: "DollarSign",
        preview: `<div class="grid grid-cols-3 gap-2 p-2"><div class="bg-gray-100 rounded p-2 h-20"></div><div class="bg-gray-900 rounded p-2 h-20"></div><div class="bg-gray-100 rounded p-2 h-20"></div></div>`,
        code: `<section class="py-24 px-6">
    <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p class="text-xl text-gray-600">Choose the plan that works for you</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-2xl border border-gray-200">
                <div class="text-lg font-semibold text-gray-900 mb-2">Starter</div>
                <div class="text-4xl font-bold text-gray-900 mb-6">$9<span class="text-lg text-gray-500 font-normal">/mo</span></div>
                <ul class="space-y-3 mb-8">
                    <li class="flex items-center gap-2 text-gray-600"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>5 projects</li>
                    <li class="flex items-center gap-2 text-gray-600"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>10GB storage</li>
                    <li class="flex items-center gap-2 text-gray-600"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Email support</li>
                </ul>
                <button class="w-full border border-gray-300 hover:border-gray-900 text-gray-900 font-medium py-3 rounded-lg transition-colors">Get Started</button>
            </div>
            <div class="bg-gray-900 p-8 rounded-2xl relative">
                <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">Most Popular</span>
                <div class="text-lg font-semibold text-white mb-2">Pro</div>
                <div class="text-4xl font-bold text-white mb-6">$29<span class="text-lg text-gray-400 font-normal">/mo</span></div>
                <ul class="space-y-3 mb-8">
                    <li class="flex items-center gap-2 text-gray-300"><svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Unlimited projects</li>
                    <li class="flex items-center gap-2 text-gray-300"><svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>100GB storage</li>
                    <li class="flex items-center gap-2 text-gray-300"><svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Priority support</li>
                    <li class="flex items-center gap-2 text-gray-300"><svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Custom domain</li>
                </ul>
                <button class="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 rounded-lg transition-colors">Get Started</button>
            </div>
            <div class="bg-white p-8 rounded-2xl border border-gray-200">
                <div class="text-lg font-semibold text-gray-900 mb-2">Enterprise</div>
                <div class="text-4xl font-bold text-gray-900 mb-6">$99<span class="text-lg text-gray-500 font-normal">/mo</span></div>
                <ul class="space-y-3 mb-8">
                    <li class="flex items-center gap-2 text-gray-600"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Everything in Pro</li>
                    <li class="flex items-center gap-2 text-gray-600"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Unlimited storage</li>
                    <li class="flex items-center gap-2 text-gray-600"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>24/7 phone support</li>
                    <li class="flex items-center gap-2 text-gray-600"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>SSO & SAML</li>
                </ul>
                <button class="w-full border border-gray-300 hover:border-gray-900 text-gray-900 font-medium py-3 rounded-lg transition-colors">Contact Sales</button>
            </div>
        </div>
    </div>
</section>`,
    },
];

// =============================================================================
// TEMPLATES - Full page templates
// =============================================================================

export const TEMPLATES: BlockItem[] = [
    {
        id: "landing-saas",
        name: "SaaS Landing",
        description: "Complete SaaS landing page",
        category: "landing",
        icon: "Rocket",
        preview: `<div class="bg-gray-50 p-2 space-y-2"><div class="bg-white border h-4 rounded"></div><div class="bg-gray-100 h-12 rounded"></div><div class="grid grid-cols-3 gap-1 h-8"><div class="bg-gray-200 rounded"></div><div class="bg-gray-200 rounded"></div><div class="bg-gray-200 rounded"></div></div></div>`,
        code: `<!-- SaaS Landing Page Template -->
<!-- Navbar -->
<nav class="border-b border-gray-100 bg-white sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="text-xl font-bold text-gray-900">SaaSify</div>
        <div class="hidden md:flex items-center gap-8">
            <a href="#features" class="text-gray-600 hover:text-gray-900 text-sm font-medium">Features</a>
            <a href="#pricing" class="text-gray-600 hover:text-gray-900 text-sm font-medium">Pricing</a>
            <a href="#testimonials" class="text-gray-600 hover:text-gray-900 text-sm font-medium">Testimonials</a>
        </div>
        <div class="flex items-center gap-4">
            <button class="text-gray-600 hover:text-gray-900 text-sm font-medium hidden md:block">Sign In</button>
            <button class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">Start Free</button>
        </div>
    </div>
</nav>

<!-- Hero -->
<section class="py-24 px-6">
    <div class="max-w-4xl mx-auto text-center">
        <span class="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium mb-6">🚀 Now in Public Beta</span>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">The modern platform for building products</h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Ship faster with our all-in-one platform. From idea to production in minutes, not months.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg transition-colors">Get Started Free</button>
            <button class="border border-gray-300 hover:border-gray-900 text-gray-900 font-medium px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                Watch Demo
            </button>
        </div>
        <div class="mt-12 text-sm text-gray-500">No credit card required · Free 14-day trial</div>
    </div>
</section>

<!-- Logos -->
<section class="border-y border-gray-100 py-12">
    <div class="max-w-6xl mx-auto px-6">
        <div class="text-center text-sm text-gray-500 mb-8">Trusted by innovative companies worldwide</div>
        <div class="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div class="w-24 h-8 bg-gray-200 rounded"></div>
            <div class="w-24 h-8 bg-gray-200 rounded"></div>
            <div class="w-24 h-8 bg-gray-200 rounded"></div>
            <div class="w-24 h-8 bg-gray-200 rounded"></div>
            <div class="w-24 h-8 bg-gray-200 rounded"></div>
        </div>
    </div>
</section>

<!-- Features -->
<section id="features" class="py-24 px-6 bg-gray-50">
    <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features that help you build, deploy, and scale.</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
                <p class="text-gray-600">Optimized for speed with instant loading and smooth interactions across all devices.</p>
            </div>
            <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">Secure by Default</h3>
                <p class="text-gray-600">Enterprise-grade security with encryption and compliance built-in from day one.</p>
            </div>
            <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">Flexible Layout</h3>
                <p class="text-gray-600">Customize every aspect with our intuitive drag-and-drop interface.</p>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="py-20 px-6 bg-blue-600">
    <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Ready to transform your workflow?</h2>
        <p class="text-xl text-blue-100 mb-8">Join thousands of teams already using SaaSify.</p>
        <button class="bg-white hover:bg-gray-100 text-blue-600 font-medium px-8 py-4 rounded-lg transition-colors">Start Your Free Trial</button>
    </div>
</section>

<!-- Footer -->
<footer class="border-t border-gray-100 py-12 px-6 bg-white">
    <div class="max-w-6xl mx-auto text-center">
        <div class="text-xl font-bold text-gray-900 mb-4">SaaSify</div>
        <div class="text-sm text-gray-500">© 2024 SaaSify. All rights reserved.</div>
    </div>
</footer>`,
    },
];

// =============================================================================
// BLOCK CATEGORIES
// =============================================================================

export const BLOCK_CATEGORIES: BlockCategory[] = [
    {
        id: "buttons",
        name: "Buttons",
        icon: "Square",
        items: BASIC_BLOCKS.filter(b => b.category === "buttons"),
    },
    {
        id: "typography",
        name: "Typography",
        icon: "Type",
        items: BASIC_BLOCKS.filter(b => b.category === "typography"),
    },
    {
        id: "elements",
        name: "Elements",
        icon: "Shapes",
        items: BASIC_BLOCKS.filter(b => b.category === "elements"),
    },
    {
        id: "forms",
        name: "Forms",
        icon: "FormInput",
        items: BASIC_BLOCKS.filter(b => b.category === "forms"),
    },
];

export const SECTION_CATEGORIES: BlockCategory[] = [
    {
        id: "hero",
        name: "Hero",
        icon: "Layout",
        items: SECTIONS.filter(b => b.category === "hero"),
    },
    {
        id: "features",
        name: "Features",
        icon: "Grid3X3",
        items: SECTIONS.filter(b => b.category === "features"),
    },
    {
        id: "cta",
        name: "CTA",
        icon: "Megaphone",
        items: SECTIONS.filter(b => b.category === "cta"),
    },
    {
        id: "social-proof",
        name: "Testimonials",
        icon: "Quote",
        items: SECTIONS.filter(b => b.category === "social-proof"),
    },
    {
        id: "pricing",
        name: "Pricing",
        icon: "DollarSign",
        items: SECTIONS.filter(b => b.category === "pricing"),
    },
    {
        id: "navigation",
        name: "Navigation",
        icon: "Menu",
        items: SECTIONS.filter(b => b.category === "navigation"),
    },
    {
        id: "footer",
        name: "Footer",
        icon: "PanelBottom",
        items: SECTIONS.filter(b => b.category === "footer"),
    },
];

export const TEMPLATE_CATEGORIES: BlockCategory[] = [
    {
        id: "landing",
        name: "Landing Pages",
        icon: "Rocket",
        items: TEMPLATES.filter(b => b.category === "landing"),
    },
];

// Get all blocks
export const getAllBlocks = () => [...BASIC_BLOCKS];
export const getAllSections = () => [...SECTIONS];
export const getAllTemplates = () => [...TEMPLATES];
