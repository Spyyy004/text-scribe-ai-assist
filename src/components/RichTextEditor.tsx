
import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from './EditorToolbar';
import SelectionTooltip from './SelectionTooltip';
import { toast } from 'sonner';

interface RichTextEditorProps {
  onSelectionLinks: (links: Array<{ title: string; url: string }> | null) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ onSelectionLinks }) => {
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
    ],
    content: '<p>This is a new article. You can start editing it right away.</p><p>Use the sidebar to add tags, set a focus keyword, and customize your article\'s metadata.</p>',
    onSelectionUpdate: ({ editor }) => {
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
    },
  });

  // Hide tooltip when clicking outside the editor
  useEffect(() => {
    const handleClickOutside = () => {
      setSelectionPosition(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock API call for text rewriting
  const mockTextProcessing = async (text: string, operation: 'rewrite' | 'simplify') => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let result = text;
      
      if (operation === 'rewrite') {
        // Mock rewrite logic
        result = text
          .split(' ')
          .map(word => 
            word.length > 3 ? 
              word.charAt(0).toUpperCase() + word.slice(1) : 
              word
          )
          .join(' ');
      } else {
        // Mock simplify logic
        result = text
          .split('.')
          .map(sentence => sentence.trim())
          .filter(sentence => sentence.length > 0)
          .map(sentence => sentence.split(' ').slice(0, 8).join(' ') + '.')
          .join(' ');
      }
      
      return result;
    } finally {
      setIsProcessing(false);
    }
  };

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
      const rewrittenText = await mockTextProcessing(selectedText, 'rewrite');
      editor.chain().focus().deleteRange({ from, to }).insertContent(rewrittenText).run();
      setSelectionPosition(null);
      toast.success('Text rewritten successfully');
    } catch (error) {
      toast.error('Failed to rewrite text');
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
      const simplifiedText = await mockTextProcessing(selectedText, 'simplify');
      editor.chain().focus().deleteRange({ from, to }).insertContent(simplifiedText).run();
      setSelectionPosition(null);
      toast.success('Text simplified successfully');
    } catch (error) {
      toast.error('Failed to simplify text');
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
