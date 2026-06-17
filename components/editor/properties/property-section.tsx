import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertySectionProps {
    title: string;
    children: React.ReactNode;
    rightElement?: React.ReactNode;
    titleSuffix?: React.ReactNode;
    defaultOpen?: boolean;
}

export function PropertySection({ title, children, rightElement, titleSuffix, defaultOpen = true }: PropertySectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-border/50 bg-card transition-colors">
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none group hover:bg-muted/5 transition-colors" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{title}</span>
                    {isOpen && titleSuffix && (
                        <div onClick={(e) => e.stopPropagation()} className="animate-in fade-in zoom-in-95 duration-200">
                            {titleSuffix}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {isOpen && rightElement && (
                        <div onClick={(e) => e.stopPropagation()} className="animate-in fade-in zoom-in-95 duration-200">
                            {rightElement}
                        </div>
                    )}
                    <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180 group-hover:text-foreground")} />
                </div>
            </div>
            <div className={cn("grid transition-[grid-template-rows] duration-300 ease-in-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                    <div className="px-4 pb-4 pt-1">{children}</div>
                </div>
            </div>
        </div>
    );
}
