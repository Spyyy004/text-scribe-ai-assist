
import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  ChevronDown,
  ArrowDown,
  ArrowUp,
  List as ListIcon,
  Table2,
  Pencil,
  Link as LinkIcon,
  Loader2, // Loading spinner icon
  X,        // Close/Cancel icon
  ArrowLeft // Back icon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the structure for fetched links
interface FoundLink {
  title: string;
  url: string;
}

// Updated Props:
// - Add onApplyLink
// - Modify onFindLinks to return the links instead of handling them externally
// - Add isFetchingLinks specifically for the link finding process
interface SelectionTooltipProps {
  onRewrite: (e: React.MouseEvent) => void;
  onSimplify: () => void;
  onMakeLonger: () => void;
  onMakeShorter: () => void;
  onMakeList: () => void;
  onMakeTable: () => void;
  onFindLinks: () => Promise<FoundLink[] | null>; // Tells parent to fetch and return links
  onApplyLink: (url: string, title?: string) => void; // Tells parent to apply the link
  position: { x: number; y: number; right?: number } | null;
  isLoading: boolean; // General loading state for non-link operations
  // Optional: Add prop for Add Keywords action
  // onAddKeywords: () => void;
}

const SelectionTooltip: React.FC<SelectionTooltipProps> = ({
  onRewrite,
  onSimplify,
  onMakeLonger,
  onMakeShorter,
  onMakeList,
  onMakeTable,
  onFindLinks, // Function prop to trigger link fetching in parent
  onApplyLink, // Function prop to apply link in parent
  position,
  isLoading // General loading for AI actions
}) => {
  const [isRewriteDropdownOpen, setIsRewriteDropdownOpen] = useState(false);
  const [mode, setMode] = useState<'default' | 'findingLinks' | 'showingLinks' | 'errorLinks'>('default');
  const [foundLinks, setFoundLinks] = useState<FoundLink[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset state when tooltip appears/disappears
  useEffect(() => {
    if (!position) {
        setMode('default');
        setFoundLinks([]);
        setErrorMessage(null);
        setIsRewriteDropdownOpen(false); // Also reset dropdown state
    }
  }, [position]);

  if (!position) return null;

  const handleFindLinksClick = async () => {
    setMode('findingLinks'); // Show loading state
    setErrorMessage(null);
    setFoundLinks([]);
    try {
      const links = await onFindLinks(); // Call parent fetch function
      if (links && links.length > 0) {
        setFoundLinks(links);
        setMode('showingLinks');
      } else {
        setErrorMessage("No relevant links found.");
        setMode('errorLinks');
      }
    } catch (error) {
      console.error("Error finding links:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch links.");
      setMode('errorLinks');
    }
  };

  const handleApplyLinkClick = (url: string, title?: string) => {
    onApplyLink(url, title); // Tell parent to apply the link
    // Don't reset states here - parent will hide the tooltip
  };

  const handleBackOrCancel = () => {
    setMode('default');
    setFoundLinks([]);
    setErrorMessage(null);
  };

  // --- Positioning & Styling ---
  const isNearRightEdge = position.right !== undefined && position.right < 300; // Adjusted threshold maybe needed
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: isNearRightEdge ? 'translateX(-100%)' : 'translateX(-50%)',
    zIndex: 50,
    // Allow width to adjust, but set a max-width
    width: 'auto',
    maxWidth: '90vw', // Prevent excessive width
  };

  // --- Render Logic ---
  const renderDefaultToolbar = () => (
    <>
      <div className="flex items-center space-x-1 bg-white rounded-lg shadow-md p-1.5 border border-gray-200">
        {/* Rewrite dropdown button */}
        <DropdownMenu open={isRewriteDropdownOpen} onOpenChange={setIsRewriteDropdownOpen}>
          <DropdownMenuTrigger asChild disabled={isLoading || mode === 'findingLinks'}>
            <button className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-gray-100 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              (isLoading || mode === 'findingLinks') && "opacity-50 cursor-not-allowed"
            )}>
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Rewrite</span>
              <ChevronDown className="h-3 w-3 ml-0.5 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
             className="bg-white rounded-md shadow-lg border border-gray-200 p-1 min-w-[180px]"
             onClick={(e) => e.stopPropagation()}
             onCloseAutoFocus={(e) => e.preventDefault()}
           >
            {/* Simplify Item */}
            <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 text-sm cursor-pointer focus:bg-gray-100 focus:text-accent-foreground"
                disabled={isLoading || mode === 'findingLinks'}
                onClick={() => { if (!isLoading && mode !== 'findingLinks') { onSimplify(); setIsRewriteDropdownOpen(false); } }}
                aria-disabled={isLoading || mode === 'findingLinks'}
            >
              <FileText className="h-4 w-4 text-gray-500" /> Simplify
            </DropdownMenuItem>
            {/* Re-write Item */}
            <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 text-sm cursor-pointer focus:bg-gray-100 focus:text-accent-foreground"
                disabled={isLoading || mode === 'findingLinks'}
                onClick={(e) => { if (!isLoading && mode !== 'findingLinks') { onRewrite(e); setIsRewriteDropdownOpen(false); } }}
                aria-disabled={isLoading || mode === 'findingLinks'}
            >
                <Pencil className="h-4 w-4 text-gray-500" /> Re-write
            </DropdownMenuItem>
            {/* Make Longer Item */}
             <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 text-sm cursor-pointer focus:bg-gray-100 focus:text-accent-foreground"
                disabled={isLoading || mode === 'findingLinks'}
                onClick={() => { if (!isLoading && mode !== 'findingLinks') { onMakeLonger(); setIsRewriteDropdownOpen(false); } }}
                aria-disabled={isLoading || mode === 'findingLinks'}
             >
                <ArrowDown className="h-4 w-4 text-gray-500" /> Make Longer
             </DropdownMenuItem>
             {/* Make Shorter Item */}
             <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 text-sm cursor-pointer focus:bg-gray-100 focus:text-accent-foreground"
                disabled={isLoading || mode === 'findingLinks'}
                onClick={() => { if (!isLoading && mode !== 'findingLinks') { onMakeShorter(); setIsRewriteDropdownOpen(false); } }}
                aria-disabled={isLoading || mode === 'findingLinks'}
            >
                <ArrowUp className="h-4 w-4 text-gray-500" /> Make Shorter
            </DropdownMenuItem>
            {/* Make List Item */}
            <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 text-sm cursor-pointer focus:bg-gray-100 focus:text-accent-foreground"
                disabled={isLoading || mode === 'findingLinks'}
                onClick={() => { if (!isLoading && mode !== 'findingLinks') { onMakeList(); setIsRewriteDropdownOpen(false); } }}
                aria-disabled={isLoading || mode === 'findingLinks'}
            >
                <ListIcon className="h-4 w-4 text-gray-500" /> Make List
            </DropdownMenuItem>
            {/* Make Table Item */}
            <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 text-sm cursor-pointer focus:bg-gray-100 focus:text-accent-foreground"
                disabled={isLoading || mode === 'findingLinks'}
                onClick={() => { if (!isLoading && mode !== 'findingLinks') { onMakeTable(); setIsRewriteDropdownOpen(false); } }}
                aria-disabled={isLoading || mode === 'findingLinks'}
            >
                <Table2 className="h-4 w-4 text-gray-500" /> Make Table
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add Keywords Button (Placeholder) */}
        <button className={cn("flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-gray-100 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 opacity-50 cursor-not-allowed")} disabled={true || isLoading || mode === 'findingLinks'} onClick={() => console.log('Add Keywords clicked')}>
          <span>Add Keywords</span>
          <ChevronDown className="h-3 w-3 ml-0.5 text-gray-500" />
        </button>

        {/* Add Links Button */}
        <button className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-gray-100 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            (isLoading || mode === 'findingLinks') && "opacity-50 cursor-not-allowed"
          )}
          disabled={isLoading || mode === 'findingLinks'}
          onClick={handleFindLinksClick} // Trigger link finding
        >
          <LinkIcon className="h-4 w-4 text-blue-500" />
          <span>Add Links</span>
        </button>
      </div>

      {/* AI Command Input - Only in default mode */}
      <div className="mt-2 w-full max-w-xs">
        <div className="relative flex items-center bg-white rounded-lg shadow-md border border-purple-300 focus-within:ring-2 focus-within:ring-purple-400 focus-within:ring-offset-1">
          <Sparkles className="absolute left-2.5 h-4 w-4 text-purple-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Ask AI to edit or generate"
            className="flex-1 pl-9 pr-16 py-2 text-sm rounded-lg border-0 focus:outline-none focus:ring-0 bg-transparent"
            disabled={isLoading || mode === 'findingLinks'}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 pointer-events-none">
            ⌘+/
          </div>
        </div>
      </div>
    </>
  );

  const renderFindingLinks = () => (
    <div className="flex items-center justify-center gap-2 bg-white rounded-lg shadow-md p-3 border border-gray-200 text-sm text-gray-600 min-w-[150px]">
      <Loader2 className="h-4 w-4 animate-spin" />
      Finding links...
    </div>
  );

  const renderShowingLinks = () => (
     <div className="flex flex-col bg-white rounded-lg shadow-md p-2 border border-gray-200 max-w-sm max-h-[250px] overflow-y-auto">
       <div className="flex justify-between items-center px-2 pb-1.5 border-b mb-1">
            <span className="text-sm font-medium text-gray-700">Select a link to apply</span>
            <button onClick={handleBackOrCancel} className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4"/>
            </button>
       </div>
       <div className="flex flex-col gap-0.5">
         {foundLinks.map((link, index) => (
           <button
             key={index}
             onClick={() => handleApplyLinkClick(link.url, link.title)}
             className="flex flex-col text-left px-2 py-1.5 rounded hover:bg-blue-50 cursor-pointer w-full"
           >
             <span className="text-sm font-medium text-blue-700 truncate">{link.title || link.url}</span>
             <span className="text-xs text-gray-500 truncate">{link.url}</span>
           </button>
         ))}
       </div>
     </div>
  );

  const renderErrorLinks = () => (
     <div className="flex flex-col items-start gap-2 bg-white rounded-lg shadow-md p-3 border border-red-300 text-sm text-red-700 min-w-[200px]">
         <div className="flex justify-between items-center w-full">
            <span className="font-medium">Error</span>
             <button onClick={handleBackOrCancel} className="p-1 rounded hover:bg-red-100 text-red-600 hover:text-red-800">
                <X className="h-4 w-4"/>
            </button>
         </div>
       <p>{errorMessage || "An unknown error occurred."}</p>
     </div>
  );


  return (
    <div
        className="selection-tooltip-container flex flex-col items-center"
        style={positionStyle}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
    >
      {mode === 'default' && renderDefaultToolbar()}
      {mode === 'findingLinks' && renderFindingLinks()}
      {mode === 'showingLinks' && renderShowingLinks()}
      {mode === 'errorLinks' && renderErrorLinks()}
    </div>
  );
};

export default SelectionTooltip;
