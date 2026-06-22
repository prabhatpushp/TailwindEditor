import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// =============================================================================
// SEO Configuration
// =============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tailwindeditor.com";
const SITE_NAME = "Tailwind Editor";
const SITE_DESCRIPTION =
    "An open-source, AI-powered visual editor for Tailwind CSS. Design, build, and edit web interfaces with real-time preview, drag-and-drop blocks, and an integrated AI assistant.";

export const metadata: Metadata = {
    // ─── Core ─────────────────────────────────────────────────────────────
    title: {
        default: "Tailwind Editor — AI-Powered Visual Tailwind CSS Editor",
        template: "%s | Tailwind Editor",
    },
    description: SITE_DESCRIPTION,
    keywords: [
        "tailwind css",
        "tailwind editor",
        "visual editor",
        "css editor",
        "tailwind builder",
        "ai web builder",
        "drag and drop",
        "web design tool",
        "tailwind css editor online",
        "open source",
        "code editor",
        "html editor",
        "nextjs",
        "react",
    ],
    authors: [{ name: "Prabhat Pushp", url: "https://github.com/prabhatpushp" }],
    creator: "Prabhat Pushp",
    publisher: "Tailwind Editor",

    // ─── Canonical & Alternate ────────────────────────────────────────────
    metadataBase: new URL(SITE_URL),
    alternates: {
        canonical: "/",
    },

    // ─── Open Graph (Facebook, LinkedIn, Discord, etc.) ───────────────────
    openGraph: {
        type: "website",
        locale: "en_US",
        url: SITE_URL,
        siteName: SITE_NAME,
        title: "Tailwind Editor — AI-Powered Visual Tailwind CSS Editor",
        description: SITE_DESCRIPTION,
        images: [
            {
                url: "/images/og-image.webp",
                width: 1200,
                height: 630,
                alt: "Tailwind Editor — AI-Powered Visual Tailwind CSS Editor",
                type: "image/png",
            },
        ],
    },

    // ─── Twitter Card ─────────────────────────────────────────────────────
    twitter: {
        card: "summary_large_image",
        title: "Tailwind Editor — AI-Powered Visual Tailwind CSS Editor",
        description: SITE_DESCRIPTION,
        images: ["/images/og-image.webp"],
        creator: "@prabhatpushp",
    },

    // ─── Robots & Indexing ────────────────────────────────────────────────
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    // ─── App & Icons ──────────────────────────────────────────────────────
    applicationName: SITE_NAME,
    category: "developer tools",
    classification: "Web Development Tool",
    icons: {
        icon: "/favicon.ico",
        apple: "/logo-small.png",
    },
};

// =============================================================================
// JSON-LD Structured Data (Schema.org)
// =============================================================================

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires a modern web browser with JavaScript enabled (Chrome, Firefox, Safari, Edge)",
    softwareRequirements: "Internet connection required",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
    },
    author: {
        "@type": "Person",
        name: "Prabhat Pushp",
        url: "https://github.com/prabhatpushp",
    },
    sourceOrganization: {
        "@type": "Organization",
        name: "Tailwind Editor",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        sameAs: ["https://github.com/prabhatpushp/tailwindeditor"],
    },
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    isAccessibleForFree: true,
    softwareVersion: "1.0.0",
    downloadUrl: "https://github.com/prabhatpushp/tailwindeditor",
    installUrl: SITE_URL,
    releaseNotes: "https://github.com/prabhatpushp/tailwindeditor/releases",
    programmingLanguage: ["TypeScript", "JavaScript", "HTML", "CSS"],
    keywords: "tailwind css, visual editor, ai, web builder, code editor, open source, drag and drop, tailwind builder",
    screenshot: `${SITE_URL}/images/og-image.webp`,
    featureList: [
        "Visual drag-and-drop interface for building web layouts without writing code",
        "AI-powered code generation using Google Gemini for instant component creation",
        "Real-time preview with full Tailwind CSS support and responsive breakpoints",
        "Integrated Monaco code editor with Emmet abbreviation support",
        "Responsive breakpoint preview to test designs across device sizes",
        "Dark and light theme support for comfortable editing",
        "One-click HTML import and export for seamless workflow integration",
        "Tailwind CSS property editing panel with visual controls for spacing, typography, colors, and more",
    ],
    // Uncomment and populate when user reviews/ratings are available:
    // aggregateRating: {
    //     "@type": "AggregateRating",
    //     ratingValue: "4.8",
    //     ratingCount: "50",
    //     bestRating: "5",
    //     worstRating: "1",
    // },
};

const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
    publisher: {
        "@type": "Person",
        name: "Prabhat Pushp",
        url: "https://github.com/prabhatpushp",
    },
};

// FAQ Schema — critical for GEO/AEO (AI engines like Gemini, ChatGPT, Perplexity)
const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What is Tailwind Editor?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Tailwind Editor is an open-source, AI-powered visual editor for Tailwind CSS. It allows developers and designers to build, design, and edit web interfaces using a drag-and-drop interface with real-time preview, an integrated AI assistant powered by Google Gemini, and a full-featured Monaco code editor.",
            },
        },
        {
            "@type": "Question",
            name: "Is Tailwind Editor free and open source?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, Tailwind Editor is completely free to use and is open source under the Apache 2.0 license. The source code is available on GitHub at github.com/prabhatpushp/tailwindeditor.",
            },
        },
        {
            "@type": "Question",
            name: "Does Tailwind Editor support AI code generation?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, Tailwind Editor includes an integrated AI assistant powered by Google Gemini. You can describe what you want to build in natural language and the AI will generate the corresponding HTML and Tailwind CSS code instantly.",
            },
        },
        {
            "@type": "Question",
            name: "What technologies does Tailwind Editor use?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Tailwind Editor is built with Next.js, React, TypeScript, and Tailwind CSS. It uses the Monaco editor (the same editor that powers VS Code) for code editing, and Google Gemini for AI-powered code generation.",
            },
        },
        {
            "@type": "Question",
            name: "Can I export code from Tailwind Editor?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, Tailwind Editor supports one-click HTML export. You can design your interface visually and then export the clean HTML with Tailwind CSS classes to use in your own projects.",
            },
        },
        {
            "@type": "Question",
            name: "Does Tailwind Editor work on mobile devices?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Tailwind Editor is optimized for desktop browsers to provide the best creative experience. The editor requires a larger screen for the multi-panel layout including the visual canvas, code editor, and properties panel.",
            },
        },
    ],
};

// =============================================================================
// Root Layout
// =============================================================================

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <head>
                {/* JSON-LD Structured Data */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
                {/* Preconnect hints for external resources */}
                <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
            </head>
            <body className="antialiased">
                <ThemeProvider defaultTheme="light" attribute="class" disableTransitionOnChange>
                    {children}
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
