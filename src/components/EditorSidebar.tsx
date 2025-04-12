
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface EditorSidebarProps {
  relatedLinks: Array<{ title: string; url: string }> | null;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ relatedLinks }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const handleAddTag = () => {
    if (inputTag.trim() && !tags.includes(inputTag.trim())) {
      setTags([...tags, inputTag.trim()]);
      setInputTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSaveMeta = () => {
    toast.success('Metadata saved');
  };

  return (
    <div className="w-80 border-l bg-sidebar flex flex-col h-full overflow-auto">
      <div className="px-4 py-3 border-b bg-white sticky top-0 z-10">
        <nav className="flex space-x-4 text-sm">
          <button className="px-1 py-2 border-b-2 border-primary font-medium text-primary">
            Details
          </button>
          <button className="px-1 py-2 text-gray-500 hover:text-gray-900">
            Analytics
          </button>
          <button className="px-1 py-2 text-gray-500 hover:text-gray-900">
            Assistant
          </button>
          <button className="px-1 py-2 text-gray-500 hover:text-gray-900">
            Info
          </button>
        </nav>
      </div>

      <div className="p-4 space-y-6 flex-1">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <div key={tag} className="flex items-center bg-gray-100 rounded-full pl-3 pr-1.5 py-1 text-sm">
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 rounded-full p-0.5 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag}</span>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Create or select a tag"
              value={inputTag}
              onChange={(e) => setInputTag(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button size="icon" onClick={handleAddTag}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Tag</span>
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Meta Description</h3>
          <Textarea
            placeholder="Add a description for SEO"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="resize-none h-24"
          />
        </div>

        {relatedLinks && relatedLinks.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Related Links</h3>
            <div className="space-y-2">
              {relatedLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  <div className="font-medium mb-1 text-blue-600">{link.title}</div>
                  <div className="text-xs text-gray-500 truncate">{link.url}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <Button onClick={handleSaveMeta}>Save Metadata</Button>
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
