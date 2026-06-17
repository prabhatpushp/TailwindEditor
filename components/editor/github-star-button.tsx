"use client";
import React, { useState, useEffect } from "react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const EXPIRY_TIME = 30 * 24 * 60 * 60 * 1000; // 7 days

export const GitHubButton = () => {
    const [hasClicked, setHasClicked] = useState(true); // default true for SSR

    useEffect(() => {
        const stored = localStorage.getItem("github-star-clicked");
        if (stored) {
            try {
                const data = JSON.parse(stored);
                if (Date.now() - data.timestamp < EXPIRY_TIME) {
                    setHasClicked(true);
                    return;
                }
            } catch (e) {}
        }
        setHasClicked(false);
    }, []);

    const handleClick = () => {
        localStorage.setItem("github-star-clicked", JSON.stringify({ timestamp: Date.now() }));
        setHasClicked(true);
    };

    return (
        <div className="flex justify-center">
            <Tooltip>
                <TooltipTrigger asChild>
                    <a href="https://github.com/prabhatpushp/tailwindeditor" target="_blank" rel="noreferrer" onClick={handleClick}>
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                                "h-8 px-3 text-xs flex gap-1.5 cursor-pointer rounded-md group transition-all duration-300",
                                !hasClicked && "animate-attention",
                                "hover:bg-primary/5 hover:border-primary/30 hover:shadow-sm",
                            )}
                        >
                            <Github className={cn("w-3.5 h-3.5 transition-transform duration-300", !hasClicked && "animate-attention-icon", "group-hover:scale-110 group-hover:-rotate-3")} />
                            <span>GitHub</span>
                        </Button>
                    </a>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={10}>
                    <p>Star on GitHub</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
};
