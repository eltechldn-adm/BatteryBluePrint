import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  ariaLabel?: string;
}

export function Tooltip({ content, children, ariaLabel }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="relative inline-flex items-center group">
      <button
        type="button"
        className="inline-flex items-center justify-center w-4 h-4 ml-1 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-full"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(!isVisible);
        }}
        aria-label={ariaLabel || "More information"}
      >
        {children || <Info className="w-3.5 h-3.5" />}
      </button>
      
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 left-6 top-1/2 -translate-y-1/2",
            "w-64 p-3 text-xs leading-relaxed",
            "bg-popover text-popover-foreground",
            "border border-border rounded-lg shadow-lg",
            "pointer-events-none",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-left-2"
          )}
          role="tooltip"
        >
          {content}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-popover" />
        </div>
      )}
    </div>
  );
}
