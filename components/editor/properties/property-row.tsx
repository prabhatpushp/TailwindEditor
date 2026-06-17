import React from "react";
import { cn } from "@/lib/utils";

interface PropertyRowProps {
    label: string;
    children: React.ReactNode;
    className?: string;
}

export function PropertyRow({ label, children, className }: PropertyRowProps) {
    return (
        <div className={cn("flex items-center justify-between h-7", className)}>
            <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
            <div className="w-[120px] flex justify-end">{children}</div>
        </div>
    );
}
