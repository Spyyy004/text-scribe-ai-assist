import React, { useState, useEffect, useCallback, useRef } from 'react'; // Added useRef
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
// Ensure TextStyle is imported if using it for shimmer, otherwise remove shimmer effect
// import TextStyle from '@tiptap/extension-text-style'; // Might be needed
// import { Mark } from '@tiptap/pm/model'; // Might be needed for class attribute

import EditorToolbar from './EditorToolbar';
import SelectionTooltip from './SelectionTooltip';
import { toast } from 'sonner';
import { processText } from '@/services/openAiService';

interface RichTextEditorProps {
  onSelectionLinks: (links: Array<{ title: string; url: string }> | null) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ onSelectionLinks }) => {
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingRange, setProcessingRange] = useState<{ from: number; to: number } | null>(null);
  // Removed mouseUpHandled as it wasn't used effectively
  const editorRef = useRef<HTMLDivElement>(null); // Ref for the editor container

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
      TextAlign.configure({
        types: ['paragraph', 'heading'],
        alignments: ['left', 'center', 'right'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      // TextStyle, // Add TextStyle if you implement the shimmer effect
    ],
    content: '<p>This is a new article. You can start editing it right away.</p><p>Use the sidebar to add tags, set a focus keyword, and customize your article\'s metadata.</p>',
    // onSelectionUpdate removed as mouseup handles it
  });

  // --- Shimmer Effect ---
  // Note: Applying classes via marks like this often requires the TextStyle extension
  // and potentially custom mark rendering. This might be complex. A simpler approach
  // might be to apply a class to the editor container while processing.
  // Commenting out the effect for now as it needs TextStyle setup.
  /*
  useEffect(() => {
    if (!editor?.isActive || !editor.schema.marks.textStyle) {
        console.warn("TextStyle extension not available for shimmer effect.");
        return;
    };
    if (!processingRange || !isProcessing) return;

    const { from, to } = processingRange;
    const shimmerClass = 'shimmer-effect'; // Ensure this CSS class is defined

    console.log(`Applying shimmer from ${from} to ${to}`);
    const transaction = editor.state.tr;
    // Check if textStyle mark exists before creating
    if (editor.schema.marks.textStyle) {
        const mark = editor.schema.marks.textStyle.create({ class: shimmerClass });
        transaction.addMark(from, to, mark);
        editor.view.dispatch(transaction);
    }


    return () => {
      // Ensure editor and mark type exist before removing
      if (editor?.isActive && editor.schema.marks.textStyle && processingRange) {
        console.log(`Removing shimmer from ${processingRange.from} to ${processingRange.to}`);
        const removeTransaction = editor.state.tr;
        // Ensure the mark type exists before trying to remove it
        const markType = editor.schema.marks.textStyle;
        if(markType) {
             removeTransaction.removeMark(processingRange.from, processingRange.to, markType);
             // It might be safer to remove *any* mark with the class if the specific instance is tricky
             // removeTransaction.removeMark(processingRange.from, processingRange.to, null); // Removes all marks - maybe too broad
             // Filter marks to remove only the shimmer one if needed
        }
        editor.view.dispatch(removeTransaction);
      }
    };
  }, [editor, processingRange, isProcessing]);
  */


  // Show selection tooltip after mouse up
  useEffect(() => {
    const editorElement = editorRef.current?.querySelector('.ProseMirror');
    if (!editorElement || !editor) return;

    const handleMouseUp = (event: MouseEvent) => {
        // Don't show tooltip if the mouseup is on the tooltip itself
        const tooltipElement = document.querySelector('.selection-tooltip-container');
        if (tooltipElement && tooltipElement.contains(event.target as Node)) {
            return;
        }

        // Use requestAnimationFrame to ensure selection state is updated
        requestAnimationFrame(() => {
            if (!editor.isActive) return; // Check if editor is still active

            const { from, to, empty } = editor.state.selection;

            if (empty) {
                // Only hide if the mouse didn't land on the tooltip
                 if (!tooltipElement || !tooltipElement.contains(event.target as Node)) {
                     setSelectionPosition(null);
                 }
                return;
            }

            // Calculate position based on the start of the selection
            const startPos = editor.view.coordsAtPos(from);
            const editorRect = editorElement.getBoundingClientRect();

            setSelectionPosition({
                x: startPos.left - editorRect.left,
                y: startPos.top - editorRect.top,
            });
        });
    };


    editorElement.addEventListener('mouseup', handleMouseUp);

    return () => {
      editorElement.removeEventListener('mouseup', handleMouseUp);
    };
  }, [editor]); // Re-run if editor instance changes


  // Hide tooltip when clicking outside editor AND outside tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const editorElement = editorRef.current?.querySelector('.ProseMirror');
      const tooltipElement = document.querySelector('.selection-tooltip-container'); // Use the class added

      // Check if the click target is outside both the editor and the tooltip
      if ( editorElement && !editorElement.contains(event.target as Node) &&
           (!tooltipElement || !tooltipElement.contains(event.target as Node)) // Check tooltip only if it exists
         ) {
           setSelectionPosition(null);
      }
    };

    // Use mousedown to catch the click early
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // No dependencies needed here

  // Mock API call - unchanged
  const mockFindLinks = async (text: string) => {
    setIsProcessing(true);
    setProcessingRange(editor ? { from: editor.state.selection.from, to: editor.state.selection.to } : null); // Capture range
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return [ /* ... links ... */ ];
    } finally {
      setIsProcessing(false);
      setProcessingRange(null);
    }
  };

  const getSelectedText = useCallback(() => {
    if (!editor) return '';
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, ' ');
  }, [editor]);

  const handleRewrite = async () => {
    console.log('handleRewrite called'); // This should now log
    if (!editor) return;

    const selectedText = getSelectedText();
    console.log('Selected text for rewrite:', selectedText);
    if (!selectedText || selectedText.trim().length < 5) {
      toast.error('Please select at least a few words to rewrite');
      return;
    }

    const { from, to } = editor.state.selection;

    try {
      setIsProcessing(true);
      setProcessingRange({ from, to }); // Set range *before* API call

      toast.loading('Rewriting text...');
      const rewrittenText = await processText(selectedText, 'rewrite');
      console.log('Received rewritten text:', rewrittenText);

       // Check if editor is still active/mounted before updating
       if (editor.isActive) {
          editor.chain().focus().deleteRange({ from, to }).insertContent(rewrittenText).run();
       }
      setSelectionPosition(null); // Hide tooltip after action
      toast.dismiss(); // Dismiss loading toast
      toast.success('Text rewritten successfully');
    } catch (error) {
      console.error("Error in handleRewrite:", error);
      toast.dismiss();
      toast.error('Failed to rewrite text: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsProcessing(false);
      setProcessingRange(null); // Clear range after processing
    }
  };

  const handleSimplify = async () => {
    console.log('handleSimplify called');
    if (!editor) return;

    const selectedText = getSelectedText();
    console.log('Selected text for simplify:', selectedText);
    if (!selectedText || selectedText.trim().length < 10) {
      toast.error('Please select a longer text to simplify');
      return;
    }

    const { from, to } = editor.state.selection;

    try {
      setIsProcessing(true);
      setProcessingRange({ from, to });

      toast.loading('Simplifying text...');
      const simplifiedText = await processText(selectedText, 'simplify');
      console.log('Received simplified text:', simplifiedText);

      if (editor.isActive) {
        editor.chain().focus().deleteRange({ from, to }).insertContent(simplifiedText).run();
      }
      setSelectionPosition(null);
      toast.dismiss();
      toast.success('Text simplified successfully');
    } catch (error) {
      console.error("Error in handleSimplify:", error);
      toast.dismiss();
      toast.error('Failed to simplify text: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsProcessing(false);
      setProcessingRange(null);
    }
  };

  const handleFindLinks = async () => {
     console.log('handleFindLinks called');
    if (!editor) return;

    const selectedText = getSelectedText();
     console.log('Selected text for links:', selectedText);
    if (!selectedText || selectedText.trim().length < 10) {
      toast.error('Please select enough text to find relevant links');
      return;
    }

    // Capture range before async operation
    const { from, to } = editor.state.selection;
    setProcessingRange({ from, to }); // Use processingRange for shimmer effect if needed

    try {
      // No need for toast.loading here as mockFindLinks sets isProcessing
      const links = await mockFindLinks(selectedText); // This already sets isProcessing
      onSelectionLinks(links);
      setSelectionPosition(null);
      toast.success('Found related links');
    } catch (error) {
      console.error("Error finding links:", error);
      toast.error('Failed to find related links');
      // Ensure processing state is reset even on error if mockFindLinks doesn't handle it
      setIsProcessing(false);
      setProcessingRange(null);
    }
    // `finally` block in mockFindLinks handles resetting isProcessing/processingRange
  };

  return (
    // Add ref to the outer container
    <div ref={editorRef} className="flex-1 flex flex-col h-full bg-white relative">
      <div className="px-4 py-3 border-b">
        <EditorToolbar editor={editor} />
      </div>
      <div className="flex-1 overflow-auto relative"> {/* This inner div helps contain the absolutely positioned tooltip */}
        <EditorContent editor={editor} className="h-full p-4" /> {/* Added padding for aesthetics */}
        <SelectionTooltip
          position={selectionPosition}
          onRewrite={handleRewrite} // <-- FIX: Pass the actual handler
          onSimplify={handleSimplify}
          onFindLinks={handleFindLinks}
          isLoading={isProcessing} // <-- FIX: Use the state variable
        />
      </div>
    </div>
  );
};

export default RichTextEditor;