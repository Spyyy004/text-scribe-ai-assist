import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Using cn for cleaner classes

interface TextConfirmationBoxProps {
  // originalText prop is not used in the rendering, removed unless needed elsewhere
  processedText: string;
  onAccept: () => void;
  onDiscard: () => void;
  position: { x: number; y: number; right?: number } | null;
}

const TextConfirmationBox: React.FC<TextConfirmationBoxProps> = ({
  processedText,
  onAccept,
  onDiscard,
  position,
}) => {
  if (!position) return null;

  // Styling based on position (no changes needed here)
  const isNearRightEdge = position.right !== undefined && position.right < 300;
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: isNearRightEdge ? 'translateX(-100%)' : 'translateX(-50%)',
    zIndex: 50,
    maxWidth: '90vw', // Keep max width constraint
    minWidth: '250px', // Adjust min width if needed
    width: 'auto',
  };

  return (
    <div
      style={positionStyle}
      // Container: Increased rounding, adjusted shadow and border
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Layout: Flex row, items centered vertically, space between text and buttons */}
      <div className="flex items-center justify-between gap-4 p-3"> {/* Adjusted padding */}

        {/* Processed Text: Takes available space, truncates if needed */}
        <div className="flex-grow text-sm text-gray-800 mr-2 truncate"> {/* Adjusted text size/color */}
          {processedText}
        </div>

        {/* Button Group: Doesn't shrink, fixed gap */}
        <div className="flex items-center flex-shrink-0 gap-2">

          {/* Discard Button: Outlined style, purple, adjusted padding/rounding */}
          <button
            className={cn(
              "flex items-center justify-center whitespace-nowrap", // Prevent wrapping
              "text-indigo-600 border border-indigo-500 rounded-lg", // Target colors, more rounding
              "px-3 py-1.5", // Adjusted padding
              "text-sm font-medium", // Font size/weight
              "hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition-colors duration-150" // Interaction states
            )}
            onClick={onDiscard}
          >
            {/* Filled Trash Icon */}
            <Trash2 className="h-4 w-4 mr-1.5 text-indigo-600" fill="currentColor"/>
            Discard
          </button>

          {/* Accept Button: Solid style, purple, adjusted padding/rounding */}
          <button
             className={cn(
              "flex items-center justify-center whitespace-nowrap", // Prevent wrapping
              "bg-indigo-600 text-white rounded-lg", // Target colors, more rounding
              "px-3 py-1.5", // Adjusted padding
              "text-sm font-medium", // Font size/weight
              "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors duration-150" // Interaction states
             )}
            onClick={onAccept}
          >
            <Check className="h-4 w-4 mr-1.5" /> {/* White check */}
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextConfirmationBox;