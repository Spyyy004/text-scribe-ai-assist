
import React from 'react';
import { Wand2, Lightbulb, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  if (!position) return null;

  return (
    <div 
      className="absolute bg-white shadow-lg rounded-md border border-gray-200 p-1 flex items-center gap-1 animate-fade-in z-10"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y - 40}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <button
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-700",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
        onClick={onRewrite}
        disabled={isLoading}
      >
        <Wand2 className="h-3.5 w-3.5" />
        <span>Rewrite</span>
      </button>
      <button
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-700",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
        onClick={onSimplify}
        disabled={isLoading}
      >
        <Lightbulb className="h-3.5 w-3.5" />
        <span>Simplify</span>
      </button>
      <button
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-700",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
        onClick={onFindLinks}
        disabled={isLoading}
      >
        <Search className="h-3.5 w-3.5" />
        <span>Find Links</span>
      </button>
    </div>
  );
};

export default SelectionTooltip;
