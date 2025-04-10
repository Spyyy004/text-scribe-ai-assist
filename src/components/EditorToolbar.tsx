
import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  AlignLeft, 
  Link,
  Type, 
  Image,
  RotateCcw,
  RotateCw  
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  editor: Editor | null;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center bg-black rounded-md p-1 space-x-1">
      <div className="flex space-x-1 items-center">
        <button
          type="button"
          className="p-2 rounded hover:bg-gray-700 transition-colors text-white"
          title="Heading 2"
        >
          <span className="font-semibold">H2</span>
        </button>
        <button
          type="button"
          className="p-2 rounded hover:bg-gray-700 transition-colors text-white"
          title="Heading 3"
        >
          <span className="font-semibold">H3</span>
        </button>
      </div>
      
      <span className="h-5 w-px bg-gray-600"></span>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "p-2 rounded hover:bg-gray-700 transition-colors text-white",
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
          "p-2 rounded hover:bg-gray-700 transition-colors text-white",
          editor.isActive('italic') ? 'bg-gray-700' : ''
        )}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      
      <span className="h-5 w-px bg-gray-600"></span>
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "p-2 rounded hover:bg-gray-700 transition-colors text-white",
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
          "p-2 rounded hover:bg-gray-700 transition-colors text-white",
          editor.isActive('orderedList') ? 'bg-gray-700' : ''
        )}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      
      <span className="h-5 w-px bg-gray-600"></span>
      
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('URL:');
          if (url) {
            editor.commands.setLink({ href: url });
          }
        }}
        className={cn(
          "p-2 rounded hover:bg-gray-700 transition-colors text-white",
          editor.isActive('link') ? 'bg-gray-700' : ''
        )}
        title="Link"
      >
        <Link className="h-4 w-4" />
      </button>
      
      <button
        type="button"
        className="p-2 rounded hover:bg-gray-700 transition-colors text-white"
        title="Image"
      >
        <Image className="h-4 w-4" />
      </button>
      
      <div className="ml-auto flex items-center space-x-1">
        <button
          type="button"
          className="p-2 rounded hover:bg-gray-700 transition-colors text-white"
          title="Undo"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="p-2 rounded hover:bg-gray-700 transition-colors text-white"
          title="Redo"
        >
          <RotateCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
