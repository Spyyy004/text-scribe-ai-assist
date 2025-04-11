import React from 'react';
import {
  Sparkles,
  FileText,
  Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectionTooltipProps {
  onRewrite: (e: React.MouseEvent<HTMLButtonElement>) => void; // Keep event type consistent
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
  if (!position) return null;

  return (
    <div
      // Add a specific class here
      className="absolute bg-white shadow-md rounded-md border border-gray-200 z-50 flex flex-col gap-1 p-2 w-max selection-tooltip-container"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 50}px`, // Adjust vertical offset as needed
        transform: 'translateX(-50%)'
      }}
    >
      {/* Re-write */}
      <button
        onClick={(e) => {
          console.log('🔥 Rewriting button clicked...');
          e.stopPropagation(); // Prevent event from bubbling further up if needed
          onRewrite(e);        // Call the passed handler
        }}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 text-sm",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
      >
        <Sparkles className="h-4 w-4 text-purple-500" />
        Rewrite
      </button>

      {/* Simplify */}
      <button
        onClick={(e) => { // Add event propagation stop here too for consistency
          console.log('🧠 Simplifying button clicked...');
          e.stopPropagation();
          onSimplify();
        }}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 text-sm",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
      >
        <FileText className="h-4 w-4 text-blue-500" />
        Simplify
      </button>

      {/* Find Links */}
      <button
        onClick={(e) => { // Add event propagation stop here too for consistency
          console.log('🔗 Finding links button clicked...');
          e.stopPropagation();
          onFindLinks();
        }}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 text-sm",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
      >
        <LinkIcon className="h-4 w-4 text-green-500" />
        Find Links
      </button>
    </div>
  );
};

export default SelectionTooltip;