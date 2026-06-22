"use client";

import { Monitor } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the desktop editor so it doesn't load on mobile
const DesktopEditor = dynamic(() => import("@/components/editor/desktop-editor"), {
    ssr: false,
});

export default function Page() {
    const [isMounted, setIsMounted] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkIsDesktop();
        window.addEventListener("resize", checkIsDesktop);

        // Suppress Monaco Editor cancelation unhandled promise rejections
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            if (event.reason && event.reason.type === "cancelation" && event.reason.msg === "operation is manually canceled") {
                event.preventDefault();
            }
        };
        window.addEventListener("unhandledrejection", handleUnhandledRejection);

        return () => {
            window.removeEventListener("resize", checkIsDesktop);
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
    }, []);

    // During SSR and initial mount, we render a placeholder to prevent hydration mismatch
    if (!isMounted) {
        return <div className="h-screen w-screen bg-background" aria-hidden="true" />;
    }

    if (!isDesktop) {
        return (
            <main className="flex h-screen w-screen flex-col items-center justify-center bg-background p-6 text-center relative overflow-hidden" aria-label="Mobile notice">
                {/* Visually-hidden H1 for SEO */}
                <h1 className="sr-only">Tailwind Editor — AI-Powered Visual Tailwind CSS Editor</h1>

                {/* Background ambient gradients */}
                <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-primary/20 rounded-full blur-[80px]" aria-hidden="true" />
                <div className="absolute bottom-[20%] right-[20%] w-72 h-72 bg-blue-500/20 rounded-full blur-[80px]" aria-hidden="true" />
                
                {/* Glassmorphic Card */}
                <section className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 dark:border-white/5 bg-background/40 backdrop-blur-2xl p-8 shadow-2xl flex flex-col items-center ring-1 ring-border/50">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20 shadow-[0_0_25px_rgba(var(--primary),0.2)]">
                        <Monitor className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3 tracking-tight text-foreground">Desktop Only</h2>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                        This AI Editor is optimized for larger screens to provide the best creative experience. Please open it on a desktop browser to continue.
                    </p>
                </section>
            </main>
        );
    }

    return (
        <>
            {/* Visually-hidden H1 for SEO */}
            <h1 className="sr-only">Tailwind Editor — AI-Powered Visual Tailwind CSS Editor</h1>
            <DesktopEditor />
        </>
    );
}
