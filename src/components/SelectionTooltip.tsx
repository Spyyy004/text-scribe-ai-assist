
import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Link as LinkIcon,
  ChevronDown,
  ArrowDown,
  ArrowUp,
  ListIcon,
  Table2,
  Pencil
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SelectionTooltipProps {
  onRewrite: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
  const [isOpen, setIsOpen] = useState(false);
  
  if (!position) return null;

  // Define additional actions that would be implemented later
  const handleMakeLonger = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Make Longer clicked');
    // Implementation would go here
  };

  const handleMakeShorter = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Make Shorter clicked');
    // Implementation would go here
  };

  const handleMakeList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Make List clicked');
    // Implementation would go here
  };

  const handleMakeTable = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Make Table clicked');
    // Implementation would go here
  };
  
  return (
    <div className="absolute z-50 selection-tooltip-container" style={{
      left: `${position.x}px`,
      top: `${position.y - 50}px`, 
      transform: 'translateX(-50%)'
    }}>
      {/* Main toolbar with buttons and dropdowns */}
      <div className="flex items-center space-x-2 bg-white rounded-lg shadow-md p-2">
        {/* Rewrite dropdown button */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <button 
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-100 text-sm",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Rewrite</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="bg-white rounded-md shadow-lg border border-gray-200 p-1 min-w-[200px]" 
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem 
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onSimplify();
              }}
            >
              <FileText className="h-4 w-4 text-gray-500" />
              <span>Simplify</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onRewrite(e as any);
              }}
            >
              <Pencil className="h-4 w-4 text-gray-500" />
              <span>Re-write</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
              onClick={handleMakeLonger}
            >
              <ArrowDown className="h-4 w-4 text-gray-500" />
              <span>Make Longer</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
              onClick={handleMakeShorter}
            >
              <ArrowUp className="h-4 w-4 text-gray-500" />
              <span>Make Shorter</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
              onClick={handleMakeList}
            >
              <ListIcon className="h-4 w-4 text-gray-500" />
              <span>Make List</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
              onClick={handleMakeTable}
            >
              <Table2 className="h-4 w-4 text-gray-500" />
              <span>Make Table</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add Keywords Button */}
        <button
          className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-100 text-sm"
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Add Keywords clicked');
          }}
        >
          <span>Add Keywords</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </button>

        {/* Add Links Button */}
        <button
          className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-100 text-sm"
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            onFindLinks();
          }}
        >
          <span>Add Links</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </button>
      </div>
      
      {/* AI Command Input - Below the toolbar */}
      <div className="mt-2 w-full">
        <div className="relative flex items-center border border-purple-300 bg-white rounded-lg shadow-md">
          <Sparkles className="absolute left-3 h-4 w-4 text-purple-500" />
          <input
            type="text"
            placeholder="Ask AI to edit or generate"
            className="flex-1 pl-10 pr-10 py-3 text-sm rounded-lg border-0 focus:outline-none focus:ring-0"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
          <div className="absolute right-3 text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
            ⌘+/
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionTooltip;
