
import React, { useState, useEffect, useCallback } from 'react';
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
  const [mouseUpHandled, setMouseUpHandled] = useState(false);

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
    onSelectionUpdate: ({ editor }) => {
      // We'll handle the selection display logic in the mouseup event instead
      // This prevents the tooltip from appearing during selection
    },
  });

  // Apply shimmer effect to processing text
  useEffect(() => {
    if (!editor || !processingRange) return;
    
    const { from, to } = processingRange;
    
    // Add a temporary shimmer class to the selected text
    const shimmerClass = 'shimmer-effect';
    
    const transaction = editor.state.tr;
    transaction.addMark(
      from,
      to,
      editor.schema.marks.textStyle.create({ class: shimmerClass })
    );
    
    editor.view.dispatch(transaction);
    
    return () => {
      if (editor && editor.isActive) {
        // Remove the shimmer effect when processing is done
        const removeTransaction = editor.state.tr;
        removeTransaction.removeMark(from, to, editor.schema.marks.textStyle);
        editor.view.dispatch(removeTransaction);
      }
    };
  }, [editor, processingRange, isProcessing]);

  // Show selection tooltip after mouse up (when selection is complete)
  useEffect(() => {
    const handleMouseUp = () => {
      if (!editor) return;
      
      // Small delay to ensure selection is complete
      setTimeout(() => {
        const { from, to } = editor.state.selection;
        
        if (from === to) {
          // No selection
          setSelectionPosition(null);
          return;
        }

        const view = editor.view;
        const { node } = view.domAtPos(from);
        
        if (node && node.nodeType === Node.TEXT_NODE && node.parentElement) {
          const domRect = node.parentElement.getBoundingClientRect();
          const editorRect = document.querySelector('.ProseMirror')?.getBoundingClientRect();
          
          if (editorRect) {
            setSelectionPosition({
              x: domRect.left + domRect.width / 2 - editorRect.left,
              y: domRect.top - editorRect.top
            });
          }
        }
      }, 50);
    };

    // Add mouseup event listener to the editor DOM element
    const editorElement = document.querySelector('.ProseMirror');
    if (editorElement) {
      editorElement.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [editor]);

  // Hide tooltip when clicking outside the editor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const editorElement = document.querySelector('.ProseMirror');
      if (editorElement && !editorElement.contains(event.target as Node)) {
        setSelectionPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock API call for finding related links
  const mockFindLinks = async (text: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock result
      return [
        { 
          title: 'The Comprehensive Guide to Text Editing',
          url: 'https://example.com/text-editing-guide' 
        },
        { 
          title: 'How AI Transforms Writing Experience',
          url: 'https://example.com/ai-writing-tools' 
        },
        { 
          title: 'Modern Interfaces for Content Creation',
          url: 'https://example.com/content-interfaces' 
        },
        { 
          title: 'Best Practices for Digital Content Creation',
          url: 'https://example.com/digital-content-best-practices' 
        }
      ];
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
    if (!editor) return;
    
    const selectedText = getSelectedText();
    if (!selectedText || selectedText.length < 5) {
      toast.error('Please select at least a few words to rewrite');
      return;
    }
    
    const { from, to } = editor.state.selection;
    
    try {
      setIsProcessing(true);
      setProcessingRange({ from, to });
      
      console.log("Calling processText with operation: rewrite");
      const rewrittenText = await processText(selectedText, 'rewrite');
      console.log("Received rewritten text:", rewrittenText);
      
      editor.chain().focus().deleteRange({ from, to }).insertContent(rewrittenText).run();
      setSelectionPosition(null);
      toast.success('Text rewritten successfully');
    } catch (error) {
      console.error("Error in handleRewrite:", error);
      toast.error('Failed to rewrite text');
    } finally {
      setIsProcessing(false);
      setProcessingRange(null);
    }
  };

  const handleSimplify = async () => {
    if (!editor) return;
    
    const selectedText = getSelectedText();
    if (!selectedText || selectedText.length < 10) {
      toast.error('Please select a longer text to simplify');
      return;
    }
    
    const { from, to } = editor.state.selection;
    
    try {
      setIsProcessing(true);
      setProcessingRange({ from, to });
      
      console.log("Calling processText with operation: simplify");
      const simplifiedText = await processText(selectedText, 'simplify');
      console.log("Received simplified text:", simplifiedText);
      
      editor.chain().focus().deleteRange({ from, to }).insertContent(simplifiedText).run();
      setSelectionPosition(null);
      toast.success('Text simplified successfully');
    } catch (error) {
      console.error("Error in handleSimplify:", error);
      toast.error('Failed to simplify text');
    } finally {
      setIsProcessing(false);
      setProcessingRange(null);
    }
  };

  const handleFindLinks = async () => {
    if (!editor) return;
    
    const selectedText = getSelectedText();
    if (!selectedText || selectedText.length < 10) {
      toast.error('Please select enough text to find relevant links');
      return;
    }
    
    try {
      const links = await mockFindLinks(selectedText);
      onSelectionLinks(links);
      setSelectionPosition(null);
      toast.success('Found related links');
    } catch (error) {
      toast.error('Failed to find related links');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      <div className="px-4 py-3 border-b">
        <EditorToolbar editor={editor} />
      </div>
      <div className="flex-1 overflow-auto relative">
        <EditorContent editor={editor} className="h-full" />
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
