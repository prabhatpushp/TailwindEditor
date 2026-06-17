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
                url: "/images/og-image.png",
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
        images: ["/images/og-image.png"],
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

    // ─── Misc ─────────────────────────────────────────────────────────────
    other: {
        "google-site-verification": "", // Add your Google Search Console verification code
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
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
    author: {
        "@type": "Person",
        name: "Prabhat Pushp",
        url: "https://github.com/prabhatpushp",
    },
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    isAccessibleForFree: true,
    softwareVersion: "1.0.0",
    programmingLanguage: ["TypeScript", "JavaScript", "HTML", "CSS"],
    keywords: "tailwind css, visual editor, ai, web builder, code editor, open source",
    screenshot: `${SITE_URL}/images/og-image.png`,
    featureList: [
        "Visual drag-and-drop editor",
        "AI-powered code generation with Google Gemini",
        "Real-time preview with Tailwind CSS",
        "Monaco code editor with Emmet support",
        "Responsive breakpoint preview",
        "Dark and light theme support",
        "HTML import and export",
        "Tailwind CSS property editing panel",
    ],
};

const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
        "@type": "Person",
        name: "Prabhat Pushp",
        url: "https://github.com/prabhatpushp",
    },
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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
                />
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
