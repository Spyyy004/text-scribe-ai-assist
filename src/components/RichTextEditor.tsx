import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import EditorToolbar from './EditorToolbar';
import SelectionTooltip from './SelectionTooltip';
import TextConfirmationBox from './TextConfirmationBox';
import { toast } from 'sonner';
import { processText, TextOperation } from '@/services/openAiService';

interface FoundLink {
  title: string;
  url: string;
}

interface RichTextEditorProps {
  onSelectionLinks?: (links: FoundLink[] | null) => void;
}

interface TooltipPosition { x: number; y: number; right?: number; }
interface LastOperation { from: number; to: number; timestamp: number; }
interface PendingChange {
  originalText: string;
  processedText: string;
  from: number;
  to: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ onSelectionLinks }) => {
  const [selectionPosition, setSelectionPosition] = useState<TooltipPosition | null>(null);
  const [confirmationPosition, setConfirmationPosition] = useState<TooltipPosition | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFindingLinks, setIsFindingLinks] = useState(false);
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const lastOperationRef = useRef<LastOperation | null>(null);
  const blockTooltipRef = useRef<boolean>(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your article...' }),
      TextAlign.configure({ types: ['paragraph', 'heading'], alignments: ['left', 'center', 'right'] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          title: null,
          target: '_blank',
          rel: 'noopener noreferrer nofollow',
        },
      }),
    ],
    content: '<p>Example: Select text like Tiptap editor and click Add Links.</p>',
  });

  useEffect(() => {
       const editorElement = editorRef.current?.querySelector('.ProseMirror');
       if (!editorElement || !editor) return;

       const calculatePosition = () => {
           if (!editor.isActive || editor.state.selection.empty) {
             const tooltipElement = document.querySelector('.selection-tooltip-container');
             const isPointerOverTooltip = tooltipElement?.matches(':hover');
             if (!isPointerOverTooltip) { setSelectionPosition(null); }
             return;
           }
           
           // Skip if tooltip is blocked
           if (blockTooltipRef.current) return;
           
           const { from, to } = editor.state.selection;
           
           // Check for last operation to avoid immediate reappearance after operations
           if (lastOperationRef.current) {
               const { from: lastFrom, to: lastTo, timestamp } = lastOperationRef.current;
               // Only block the tooltip if it's at the exact same position as last operation
               // and it's a fresh operation (less than 500ms old)
               if (from === lastFrom && to === lastTo && Date.now() - timestamp < 500) {
                   return;
               }
           }

           const view = editor.view;
           const startCoords = view.coordsAtPos(from);
           const endCoords = view.coordsAtPos(to);
           const editorRect = editorElement.getBoundingClientRect();
           const selectionMidX = (startCoords.left + endCoords.right) / 2;
           const positionX = selectionMidX - editorRect.left;
           const positionY = startCoords.bottom - editorRect.top + 8;
           const positionRight = editorRect.right - selectionMidX;
           setSelectionPosition({ x: positionX, y: positionY, right: positionRight });
        };

       const handleMouseUp = (event: MouseEvent) => {
           const tooltipElement = document.querySelector('.selection-tooltip-container');
           if (tooltipElement && tooltipElement.contains(event.target as Node)) { return; }
           
           // If tooltip is currently blocked, unblock it on fresh mouse selection
           if (blockTooltipRef.current) {
               blockTooltipRef.current = false;
           }
           
           setTimeout(calculatePosition, 50);
       };
       
       const handleSelectionUpdate = () => {
           // Always allow recalculation on selection update
           // But don't immediately reset blockTooltip since this might be triggered
           // as part of an operation completion
           setTimeout(calculatePosition, 100);
       };

       editorElement.addEventListener('mouseup', handleMouseUp);
       editor.on('selectionUpdate', handleSelectionUpdate);
       return () => {
           editorElement.removeEventListener('mouseup', handleMouseUp);
           editor.off('selectionUpdate', handleSelectionUpdate);
       };
  }, [editor]);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          const editorElement = editorRef.current;
          const tooltipElement = document.querySelector('.selection-tooltip-container');
          const confirmationElement = document.querySelector('.text-confirmation-box');
          const target = event.target as Node;
          
          if (editorElement && !editorElement.contains(target) && 
              (!tooltipElement || !tooltipElement.contains(target)) &&
              (!confirmationElement || !confirmationElement.contains(target))) {
             setSelectionPosition(null);
             // Don't auto-hide confirmation box when clicking outside
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const processAndShowConfirmation = async (
      command: TextOperation,
      loadingMessage: string,
      errorMessage: string
  ) => {
     if (!editor || isProcessing || isFindingLinks) return;
     const selectedText = getSelectedText();
     const minLength = (command === 'simplify' || command === 'makeShorter') ? 10 : 5;
     if (!selectedText || selectedText.trim().length < minLength) {
       toast.error('Please select a longer text to process.');
       return;
     }

     const { from, to } = editor.state.selection;
     lastOperationRef.current = { from, to, timestamp: Date.now() };
     
     // Temporarily block the tooltip from reappearing right away
     blockTooltipRef.current = true;
     
     // Save the position for confirmation box before hiding tooltip
     const currentPos = { ...selectionPosition! };
     setSelectionPosition(null);
     setIsProcessing(true);
     const toastId = toast.loading(loadingMessage);

     try {
        const resultText = await processText(selectedText, command);
        toast.dismiss(toastId);
        
        // Instead of directly replacing, show confirmation box
        setPendingChange({
          originalText: selectedText,
          processedText: resultText,
          from,
          to
        });
        setConfirmationPosition(currentPos);
     } catch (error) {
        console.error('Error processing text:', error);
        toast.error(errorMessage, { id: toastId });
        setPendingChange(null);
        setConfirmationPosition(null);
     } finally {
        setIsProcessing(false);
        // Unblock tooltip after a delay but don't clear last operation yet
        setTimeout(() => {
            blockTooltipRef.current = false;
        }, 600);
     }
  };

  const handleAcceptChange = () => {
    if (!editor || !pendingChange) return;
    
    const { processedText, from, to } = pendingChange;
    
    // Apply the change
    editor.chain()
      .focus()
      .deleteRange({ from, to })
      .insertContent(processedText)
      .run();
      
    // Clean up
    setPendingChange(null);
    setConfirmationPosition(null);
    
    // Clear last operation reference after a delay
    setTimeout(() => {
      lastOperationRef.current = null;
    }, 600);
    
    toast.success('Changes applied successfully');
  };
  
  const handleDiscardChange = () => {
    // Just clean up without applying changes
    setPendingChange(null);
    setConfirmationPosition(null);
    
    // Clear last operation reference after a delay
    setTimeout(() => {
      lastOperationRef.current = null;
    }, 600);
    
    toast.info('Changes discarded');
  };

  const getSelectedText = useCallback(() => {
      if (!editor) return '';
      const { from, to } = editor.state.selection;
      return editor.state.doc.textBetween(from, to, ' ');
  }, [editor]);
  
  const handleRewrite = async () => {
    await processAndShowConfirmation('rewrite', 'Rewriting...', 'Rewrite failed');
  };
  
  const handleSimplify = async () => {
    await processAndShowConfirmation('simplify', 'Simplifying...', 'Simplify failed');
  };
  
  const handleMakeLonger = async () => {
    await processAndShowConfirmation('makeLonger', 'Expanding...', 'Expand failed');
  };
  
  const handleMakeShorter = async () => {
    await processAndShowConfirmation('makeShorter', 'Shortening...', 'Shorten failed');
  };
  
  const handleMakeList = async () => {
    await processAndShowConfirmation('makeList', 'Creating list...', 'List creation failed');
  };
  
  const handleMakeTable = async () => {
    await processAndShowConfirmation('makeTable', 'Creating table...', 'Table creation failed');
  };

  const fetchAndReturnLinks = async (): Promise<FoundLink[] | null> => {
    if (!editor || isFindingLinks || isProcessing) return null;

    const selectedText = getSelectedText();
    if (!selectedText || selectedText.trim().length < 5) { // Reduced length check for link context
      toast.error('Please select some text to find links for.');
      return null; // Return null to indicate failure/cancellation
    }

    // No need to hide tooltip here, tooltip manages its own loading state
    setIsFindingLinks(true); // Set specific loading state
    // Don't show separate toast, tooltip shows loading

    try {
        // Simulate API call - Replace with your actual link finding logic
        console.log("Finding links for:", selectedText);
        await new Promise(resolve => setTimeout(resolve, 1800)); // Simulate network delay
        // Mock result - Generate some plausible links based on selection
        const mockLinks: FoundLink[] = [
             { title: `About "${selectedText.substring(0, 15)}..."`, url: `https://example.com/search?q=${encodeURIComponent(selectedText)}` },
             { title: `Wikipedia: ${selectedText}`, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(selectedText.replace(/\s+/g, '_'))}` },
             { title: `Tiptap Documentation`, url: `https://tiptap.dev/` },
        ].filter(link => link.title.length > 5); // Basic filter

        // Optionally pass to sidebar/external handler if needed
        if (onSelectionLinks) {
            onSelectionLinks(mockLinks.length > 0 ? mockLinks : null);
        }

        return mockLinks; // Return the found links

    } catch (error) {
        console.error("Error finding links:", error);
        toast.error(`Failed to find links: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return null; // Return null on error
    } finally {
        setIsFindingLinks(false); // Clear specific loading state
        // Don't block tooltip here as we want to show the link results
    }
  };

  const handleApplyLink = (url: string, title?: string) => {
    if (!editor || !editor.isActive) return;

    const { from, to } = editor.state.selection; // Get selection at the moment of application

    if (from === to) {
        console.warn("Cannot apply link to empty selection.");
        return; // Cannot apply link to cursor
    }

    console.log(`Applying link: URL=${url}, Title=${title}`);

    // Record operation to prevent immediate tooltip reappearance
    lastOperationRef.current = { from, to, timestamp: Date.now() };
    // Block tooltip from reappearing right away
    blockTooltipRef.current = true;

    editor.chain()
      .focus() // Ensure editor has focus
      .extendMarkRange('link') // Extend selection to cover any existing link marks
      .setLink({ href: url, title: title || null }) // Set the link with optional title
      .run();

    // Hide the tooltip since an action was completed
    setSelectionPosition(null);
    
    // Unblock tooltip after a delay
    setTimeout(() => {
        blockTooltipRef.current = false;
        lastOperationRef.current = null;
    }, 600);
  };

  return (
    <div ref={editorRef} className="flex-1 flex flex-col h-full bg-white relative">
      <div className="px-4 py-3 border-b sticky top-0 bg-white z-10">
         {editor && <EditorToolbar editor={editor} />}
      </div>

      <div className="flex-1 overflow-auto relative px-4 md:px-6 lg:px-8 py-4">
        <EditorContent editor={editor} className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none h-full" />
         
         {editor && selectionPosition && (
            <SelectionTooltip
                position={selectionPosition}
                onRewrite={handleRewrite}
                onSimplify={handleSimplify}
                onMakeLonger={handleMakeLonger}
                onMakeShorter={handleMakeShorter}
                onMakeList={handleMakeList}
                onMakeTable={handleMakeTable}
                onFindLinks={fetchAndReturnLinks}
                onApplyLink={handleApplyLink}
                isLoading={isProcessing}
            />
         )}
         
         {pendingChange && confirmationPosition && (
           <div className="text-confirmation-box">
             <TextConfirmationBox
               originalText={pendingChange.originalText}
               processedText={pendingChange.processedText}
               position={confirmationPosition}
               onAccept={handleAcceptChange}
               onDiscard={handleDiscardChange}
             />
           </div>
         )}
      </div>
    </div>
  );
};

export default RichTextEditor;
