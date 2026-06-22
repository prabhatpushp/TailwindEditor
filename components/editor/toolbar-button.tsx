import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface ToolbarButtonProps {
    icon: LucideIcon;
    tooltip: string;
    onClick?: () => void;
    isActive?: boolean;
    disabled?: boolean;
    className?: string;
    iconClassName?: string;
}

export function ToolbarButton({ icon: Icon, tooltip, onClick, isActive, disabled, className, iconClassName }: ToolbarButtonProps) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0} disableHoverableContent>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className={cn("h-7 w-7 cursor-pointer", isActive && "bg-muted text-foreground", className)} onClick={onClick} disabled={disabled} aria-label={tooltip}>
                        <Icon className={cn("w-3.5 h-3.5", iconClassName)} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
