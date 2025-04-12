
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { openAiService } from '@/services/openAiService';
import EditorToolbar from './EditorToolbar';
import SelectionTooltip from './SelectionTooltip';

// Define an interface for the editor props
interface RichTextEditorProps {
  onSelectionLinks?: (links: Array<{ title: string; url: string }> | null) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ onSelectionLinks }) => {
  // State for selection tooltip
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Refs
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const blockTooltipRef = useRef<boolean>(false);
  const lastOperationRef = useRef<string | null>(null);

  // Initialize the editor with plugins
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      Link.configure({
        openOnClick: false,
        validate: href => /^https?:\/\//.test(href),
      }),
    ],
    content: '<p>Welcome to your content editor! Select text to see formatting options.</p>',
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from === to || blockTooltipRef.current) return;
      
      const text = editor.state.doc.textBetween(from, to, ' ');
      if (!text.trim()) return;
      
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      if (rect.width > 0 && rect.height > 0) {
        const editorRect = editorContainerRef.current?.getBoundingClientRect() || { top: 0, left: 0 };
        
        setSelectedText(text);
        setTooltipPosition({
          x: rect.left + rect.width / 2 - editorRect.left,
          y: rect.top - editorRect.top - 10
        });
        setShowTooltip(true);
      }
    },
    onBlur: () => {
      // Don't hide tooltip immediately, let click events process first
      setTimeout(() => {
        if (!blockTooltipRef.current) {
          setShowTooltip(false);
        }
      }, 100);
    },
  });

  // Helper to handle text operations like rewrite, simplify, etc.
  const handleTextOperation = async (operation: string) => {
    if (!editor || !selectedText || isProcessing) return;
    
    try {
      blockTooltipRef.current = true;
      setIsProcessing(true);
      lastOperationRef.current = operation;
      
      const { from, to } = editor.state.selection;
      
      // Call the AI service
      const result = await openAiService.processText(selectedText, operation);
      
      // Only replace if we have a result and editor is still active
      if (result && editor) {
        editor.chain().focus().deleteRange({ from, to }).insertContent(result).run();
      }
      
      // Reset states
      setShowTooltip(false);
      setSelectedText('');
      
    } catch (error) {
      console.error('Error processing text:', error);
    } finally {
      setIsProcessing(false);
      // Delay resetting blockTooltip to prevent immediate reappearance
      setTimeout(() => {
        blockTooltipRef.current = false;
      }, 100);
    }
  };

  // Handle adding link functionality
  const handleAddLink = useCallback(() => {
    if (!editor) return;
    
    const url = window.prompt('URL');
    
    if (url) {
      blockTooltipRef.current = true;
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      
      // Generate some related links for the sidebar
      if (selectedText && onSelectionLinks) {
        const fakeSimilarLinks = [
          { title: `Learn more about ${selectedText}`, url: `https://example.com/learn/${encodeURIComponent(selectedText)}` },
          { title: `${selectedText} documentation`, url: `https://docs.example.com/${encodeURIComponent(selectedText)}` },
          { title: `${selectedText} tutorials`, url: `https://tutorials.example.com/${encodeURIComponent(selectedText)}` },
        ];
        onSelectionLinks(fakeSimilarLinks);
      }
      
      setShowTooltip(false);
      setTimeout(() => {
        blockTooltipRef.current = false;
      }, 100);
    }
  }, [editor, selectedText, onSelectionLinks]);

  // Reset tooltip when clicking on the editor
  useEffect(() => {
    const handleMouseDown = () => {
      if (!blockTooltipRef.current) {
        setShowTooltip(false);
      }
    };

    const editorElement = editorContainerRef.current;
    if (editorElement) {
      editorElement.addEventListener('mousedown', handleMouseDown);
      return () => {
        editorElement.removeEventListener('mousedown', handleMouseDown);
      };
    }
  }, []);

  // Clean up selection when operation completes
  useEffect(() => {
    if (!isProcessing && lastOperationRef.current) {
      lastOperationRef.current = null;
    }
  }, [isProcessing]);

  return (
    <div className="relative flex-1 overflow-auto bg-white" ref={editorContainerRef}>
      <EditorToolbar editor={editor} />
      
      <div className="p-4 prose max-w-none w-full mx-auto">
        <EditorContent editor={editor} />
      </div>
      
      {showTooltip && !isProcessing && (
        <SelectionTooltip
          position={tooltipPosition}
          onClose={() => setShowTooltip(false)}
          onRewrite={() => handleTextOperation('rewrite')}
          onSimplify={() => handleTextOperation('simplify')}
          onExpand={() => handleTextOperation('expand')}
          onAddLink={handleAddLink}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
