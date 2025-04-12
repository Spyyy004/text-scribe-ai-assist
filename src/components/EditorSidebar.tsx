
import React, { useState } from 'react';
import { ChevronDown, Info, Download, Copy, MoreVertical, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface EditorSidebarProps {
  relatedLinks?: Array<{ title: string; url: string }> | null;
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

  const handleSaveMeta = () => {
    toast.success('Metadata saved');
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col h-full overflow-auto">
      {/* Tab Navigation */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <nav className="flex text-sm">
          <button className="px-1 py-2 border-b-2 border-indigo-600 font-medium text-black mr-6">
            Details
          </button>
          <button className="px-1 py-2 text-gray-500 hover:text-gray-900 mr-6">
            Analytics
          </button>
          <button className="px-1 py-2 text-gray-500 hover:text-gray-900 mr-6">
            AI Assistant
          </button>
          <button className="px-1 py-2 text-gray-500 hover:text-gray-900">
            Info
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-6 flex-1">
        {/* Tags Section */}
        <div>
          <div className="flex items-center mb-2">
            <h3 className="text-base font-medium">Tags</h3>
            <Info className="h-4 w-4 ml-2 text-gray-400" />
          </div>
          
          {/* Tag Selection Dropdown */}
          <div className="relative">
            <div className="flex items-center">
              <Input 
                type="text" 
                placeholder="Create or select a tag" 
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pr-8 rounded-md border-gray-300 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Meta Description */}
        <div>
          <h3 className="text-base font-medium mb-2">Meta Description</h3>
          <Textarea
            placeholder="Add a description for SEO"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="resize-none h-[150px] rounded-md border-gray-300 focus:border-indigo-500"
          />
        </div>

        {/* Featured Image */}
        <div>
          <h3 className="text-base font-medium mb-2">Featured Image</h3>
          <div className="border border-gray-300 rounded-md p-3 inline-flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
            <ImageIcon className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700">Add thumbnail</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 flex justify-between items-center">
        {/* Publish Button */}
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-45">
            <path d="M14.5 1.5L6.5 9.5M14.5 1.5L10.5 14.5L6.5 9.5M14.5 1.5L1.5 5.5L6.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Publish Article
        </Button>
        
        {/* Secondary Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="rounded-md h-10 w-10 border-gray-300">
            <Download className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-md h-10 w-10 border-gray-300">
            <Copy className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-md h-10 w-10 border-gray-300">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
