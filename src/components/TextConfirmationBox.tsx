
import React from 'react';
import { Check, Trash2 } from 'lucide-react';

interface TextConfirmationBoxProps {
  originalText: string;
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

  // Styling based on position
  const isNearRightEdge = position.right !== undefined && position.right < 300;
  
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: isNearRightEdge ? 'translateX(-100%)' : 'translateX(-50%)',
    zIndex: 50,
    maxWidth: '90vw',
    minWidth: '280px',
    width: 'auto',
  };

  return (
    <div 
      style={positionStyle} 
      className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="p-4">
        <div className="text-base text-gray-800 mb-2 overflow-y-auto max-h-40">
          {processedText}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button 
            className="flex items-center text-indigo-700 border border-indigo-700 rounded-md px-4 py-2 hover:bg-indigo-50"
            onClick={onDiscard}
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Discard
          </button>
          <button 
            className="flex items-center bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700"
            onClick={onAccept}
          >
            <Check className="h-5 w-5 mr-2" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextConfirmationBox;
