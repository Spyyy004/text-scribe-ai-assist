
import React, { useState } from 'react';
import { Sparkles, FileText, ArrowUp, ArrowDown, ListIcon, Table, ChevronDown, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SelectionTooltipProps {
  onRewrite: () => void;
  onSimplify: () => void;
  onFindLinks: () => void;
  position: { x: number; y: number } | null;
  isLoading: boolean;
}

const SelectionTooltip: React.FC<SelectionTooltipProps> = ({
  onRewrite,
  onSimplify,
  onFindLinks,
  position,
  isLoading
}) => {
  const [isRewriteOpen, setIsRewriteOpen] = useState(false);
  
  if (!position) return null;

  return (
    <div 
      className="absolute bg-white shadow-lg rounded-md border border-gray-200 z-10 overflow-visible"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y - 40}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="flex items-center gap-2 p-1">
        {/* Rewrite dropdown */}
        <DropdownMenu open={isRewriteOpen} onOpenChange={setIsRewriteOpen}>
          <DropdownMenuTrigger asChild>
            <button 
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded hover:bg-gray-100 text-sm font-medium",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>Rewrite</span>
              <ChevronDown className="h-3.5 w-3.5 ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onSimplify} disabled={isLoading}>
                <FileText className="h-4 w-4 mr-2" />
                <span>Simplify</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onRewrite} disabled={isLoading}>
                <PenLine className="h-4 w-4 mr-2" />
                <span>Re-write</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled={isLoading}>
                <ArrowUp className="h-4 w-4 mr-2" />
                <span>Make Longer</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled={isLoading}>
                <ArrowDown className="h-4 w-4 mr-2" />
                <span>Make Shorter</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled={isLoading}>
                <ListIcon className="h-4 w-4 mr-2" />
                <span>Make List</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled={isLoading}>
                <Table className="h-4 w-4 mr-2" />
                <span>Make Table</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add Keywords button */}
        <button 
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded hover:bg-gray-100 text-sm font-medium",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          disabled={isLoading}
        >
          <span>Add Keywords</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        {/* Add Links button */}
        <button 
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded hover:bg-gray-100 text-sm font-medium",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          onClick={onFindLinks}
          disabled={isLoading}
        >
          <span>Add Links</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* AI Assistant Input */}
      <div className="mx-2 mb-2 mt-1">
        <div className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-gray-500 text-sm">Ask AI to edit or generate</span>
          </div>
          <span className="text-xs text-gray-400">⌘+/</span>
        </div>
      </div>
    </div>
  );
};

export default SelectionTooltip;
