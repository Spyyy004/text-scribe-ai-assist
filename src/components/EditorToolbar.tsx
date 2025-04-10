
import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, List, ListOrdered, AlignLeft, Link } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  editor: Editor | null;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center bg-editor-toolbar text-editor-toolbarText rounded-md p-1 space-x-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "p-2 rounded hover:bg-gray-700 transition-colors",
          editor.isActive('bold') ? 'bg-gray-700' : ''
        )}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "p-2 rounded hover:bg-gray-700 transition-colors",
          editor.isActive('italic') ? 'bg-gray-700' : ''
        )}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "p-2 rounded hover:bg-gray-700 transition-colors",
          editor.isActive('bulletList') ? 'bg-gray-700' : ''
        )}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "p-2 rounded hover:bg-gray-700 transition-colors",
          editor.isActive('orderedList') ? 'bg-gray-700' : ''
        )}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={cn(
          "p-2 rounded hover:bg-gray-700 transition-colors",
          editor.isActive({ textAlign: 'left' }) ? 'bg-gray-700' : ''
        )}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('URL:');
          if (url) {
            editor.commands.setLink({ href: url });
          }
        }}
        className={cn(
          "p-2 rounded hover:bg-gray-700 transition-colors",
          editor.isActive('link') ? 'bg-gray-700' : ''
        )}
        title="Link"
      >
        <Link className="h-4 w-4" />
      </button>
    </div>
  );
};

export default EditorToolbar;
