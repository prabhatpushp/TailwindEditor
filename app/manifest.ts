import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Tailwind Editor — AI-Powered Visual Tailwind CSS Editor",
        short_name: "Tailwind Editor",
        description:
            "An open-source, AI-powered visual editor for Tailwind CSS. Design, build, and edit web interfaces with real-time preview, drag-and-drop blocks, and an integrated AI assistant.",
        start_url: "/",
        display: "standalone",
        background_color: "#0a0a0a",
        theme_color: "#d4622b",
        orientation: "landscape",
        categories: ["developer tools", "productivity", "utilities"],
        icons: [
            {
                src: "/favicon.ico",
                sizes: "48x48",
                type: "image/x-icon",
            },
            {
                src: "/logo-small.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/logo.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
        ],
    };
}
