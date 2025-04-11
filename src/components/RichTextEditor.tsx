import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';

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
  const editorRef = useRef<HTMLDivElement>(null);
  const lastOperationRef = useRef<{from: number; to: number; timestamp: number} | null>(null);

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
    ],
    content: '<p>This is a new article. You can start editing it right away.</p><p>Use the sidebar to add tags, set a focus keyword, and customize your article\'s metadata.</p>',
  });

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
      
      // Prevent tooltip from immediately reappearing after an operation
      if (lastOperationRef.current) {
        const { from, to, timestamp } = lastOperationRef.current;
        const now = Date.now();
        
        // If we just performed an operation on this same selection within the last second
        const selection = editor.state.selection;
        if (selection && selection.from === from && selection.to === to && now - timestamp < 1000) {
          return;
        }
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
      const tooltipElement = document.querySelector('.selection-tooltip-container');

      // Check if the click target is outside both the editor and the tooltip
      if (editorElement && !editorElement.contains(event.target as Node) &&
          (!tooltipElement || !tooltipElement.contains(event.target as Node))) {
        setSelectionPosition(null);
      }
    };

    // Use mousedown to catch the click early
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock API call - unchanged
  const mockFindLinks = async (text: string) => {
    setIsProcessing(true);
    setProcessingRange(editor ? { from: editor.state.selection.from, to: editor.state.selection.to } : null);
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

  const handleRewrite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('handleRewrite called');
    if (!editor) return;

    const selectedText = getSelectedText();
    console.log('Selected text for rewrite:', selectedText);
    if (!selectedText || selectedText.trim().length < 5) {
      toast.error('Please select at least a few words to rewrite');
      return;
    }

    const { from, to } = editor.state.selection;

    try {
      // Record this operation to prevent immediate tooltip reappearance
      lastOperationRef.current = { from, to, timestamp: Date.now() };
      
      // Hide tooltip while processing
      setSelectionPosition(null);
      setIsProcessing(true);
      setProcessingRange({ from, to });

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
      // Record this operation to prevent immediate tooltip reappearance
      lastOperationRef.current = { from, to, timestamp: Date.now() };
      
      // Hide tooltip while processing
      setSelectionPosition(null);
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
    setProcessingRange({ from, to });

    try {
      // No need for toast.loading here as mockFindLinks sets isProcessing
      const links = await mockFindLinks(selectedText);
      onSelectionLinks(links);
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
    <div ref={editorRef} className="flex-1 flex flex-col h-full bg-white relative">
      <div className="px-4 py-3 border-b">
        <EditorToolbar editor={editor} />
      </div>
      <div className="flex-1 overflow-auto relative">
        <EditorContent editor={editor} className="h-full p-4" />
        <SelectionTooltip
          position={selectionPosition}
          onRewrite={handleRewrite}
          onSimplify={handleSimplify}
          onFindLinks={handleFindLinks}
          isLoading={isProcessing}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
