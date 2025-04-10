
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Image, Info } from 'lucide-react';
import { toast } from 'sonner';

interface EditorSidebarProps {
  relatedLinks: Array<{ title: string; url: string }> | null;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ relatedLinks }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [activeTab, setActiveTab] = useState('details');

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
        <div className="flex space-x-4 text-sm">
          <button 
            className={`px-1 py-2 ${activeTab === 'details' ? 'border-b-2 border-purple-600 font-medium text-purple-600' : 'text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button 
            className={`px-1 py-2 ${activeTab === 'analytics' ? 'border-b-2 border-purple-600 font-medium text-purple-600' : 'text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button 
            className={`px-1 py-2 ${activeTab === 'assistant' ? 'border-b-2 border-purple-600 font-medium text-purple-600' : 'text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('assistant')}
          >
            AI Assistant
          </button>
          <button 
            className={`px-1 py-2 ${activeTab === 'info' ? 'border-b-2 border-purple-600 font-medium text-purple-600' : 'text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('info')}
          >
            Info
          </button>
        </div>
      </div>

      {activeTab === 'details' && (
        <div className="p-4 space-y-6 flex-1">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium flex items-center gap-1">
                Tags
                <Info className="h-4 w-4 text-gray-400" />
              </h3>
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
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Create or select a tag"
                  value={inputTag}
                  onChange={(e) => setInputTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pr-8"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
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

          <div>
            <h3 className="text-sm font-medium mb-2">Featured Image</h3>
            <button className="flex items-center gap-2 text-sm border rounded-md px-3 py-2 hover:bg-gray-50">
              <Image className="h-4 w-4" />
              Add thumbnail
            </button>
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

          <div className="fixed bottom-4 right-4">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center gap-2">
              <span>Publish Article</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorSidebar;
