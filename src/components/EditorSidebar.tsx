import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Import Tooltip components
import {
  Info,             // For Tags info icon
  Image,            // For Featured Image button
  Send,             // For Publish button
  Download,         // For Download icon button
  Copy,             // For Copy/Preview icon button (or use FileDigit, Square)
  MoreHorizontal,   // For More options icon button
} from 'lucide-react';
import { cn } from '@/lib/utils'; // For conditional classes

// Removed relatedLinks from props as it's not shown in the target UI
interface EditorSidebarProps {}

const EditorSidebar: React.FC<EditorSidebarProps> = () => {
  // State for the selected tab (assuming only Details is implemented for now)
  const [activeTab, setActiveTab] = useState('Details');
  // State for form elements
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [metaDescription, setMetaDescription] = useState('');

  // Dummy options for the Select component
  const tagOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'react', label: 'React' },
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
  ];

  return (
    // Sidebar container: Ensure it fills height and has structure for bottom bar
    <div className="w-80 border-l bg-gray-50 flex flex-col h-full"> {/* Changed bg color slightly */}

      {/* Top Tabs Navigation */}
      <div className="px-4 py-0 border-b bg-white sticky top-0 z-10"> {/* Reduced py */}
        <nav className="flex space-x-4 text-sm">
          {['Details', 'Analytics', 'AI Assistant', 'Info'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-1 pt-3 pb-2 border-b-2 font-medium focus:outline-none", // Added focus style base
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600' // Active state
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300' // Inactive state
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Scrollable Content Area */}
      <div className="p-5 space-y-6 flex-1 overflow-y-auto"> {/* Adjusted padding */}

        {/* --- Details Tab Content --- */}
        {activeTab === 'Details' && (
          <>
            {/* Tags Section */}
            <div>
              <div className="flex items-center mb-2">
                <label htmlFor="tags-select" className="text-sm font-medium text-gray-800">Tags</label> {/* Darker label */}
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1.5 text-gray-400 hover:text-gray-600">
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <p>Add relevant tags to categorize your article.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {/* Shadcn Select Component */}
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger id="tags-select" className="w-full bg-white text-gray-600"> {/* White bg, adjust text color */}
                  <SelectValue placeholder="Create or select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {tagOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                  {/* Add option for creating new tags if needed */}
                </SelectContent>
              </Select>
            </div>

            {/* Meta Description Section */}
            <div>
              <label htmlFor="meta-description" className="block text-sm font-medium text-gray-800 mb-2">Meta Description</label>
              <Textarea
                id="meta-description"
                placeholder="Add a description for SEO (max 160 characters)" // More specific placeholder
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="resize-none h-28 bg-white rounded-md" // Ensure white bg, adjust rounding/height
                maxLength={160} // Good practice for meta descriptions
              />
            </div>

            {/* Featured Image Section */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Featured Image</label>
              <Button
                variant="outline" // Use outline variant for the border style
                className="w-auto bg-white text-gray-700 border-gray-300 hover:bg-gray-50" // Specific styling
                onClick={() => console.log('Add thumbnail clicked')} // Placeholder action
              >
                <Image className="h-4 w-4 mr-2 text-gray-500" /> {/* Icon */}
                Add thumbnail
              </Button>
            </div>
          </>
        )}

        {/* Placeholder for other tab content */}
        {activeTab === 'Analytics' && <p className="text-gray-500">Analytics content goes here...</p>}
        {activeTab === 'AI Assistant' && <p className="text-gray-500">AI Assistant content goes here...</p>}
        {activeTab === 'Info' && <p className="text-gray-500">Info content goes here...</p>}

      </div>

      {/* Bottom Action Bar */}
      <div className="px-4 py-3 border-t bg-white mt-auto"> {/* Ensure it's at the bottom */}
        <div className="flex justify-between items-center">
          {/* Primary Publish Button */}
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-5 py-2" // Adjusted padding/rounding
            onClick={() => console.log('Publish clicked')} // Placeholder action
          >
            <Send className="h-4 w-4 mr-2 -ml-1" /> {/* Adjusted margin */}
            Publish Article
          </Button>

          {/* Secondary Icon Buttons */}
          <div className="flex items-center space-x-2">
            <TooltipProvider delayDuration={100}>
              {/* Download Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                   <Button variant="outline" size="icon" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-100">
                     <Download className="h-4 w-4" />
                   </Button>
                </TooltipTrigger>
                <TooltipContent side="top"><p>Download</p></TooltipContent>
              </Tooltip>

              {/* Copy/Preview Button */}
              <Tooltip>
                 <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-100">
                      <Copy className="h-4 w-4" /> {/* Or other relevant icon */}
                    </Button>
                 </TooltipTrigger>
                 <TooltipContent side="top"><p>Copy Link / Preview</p></TooltipContent>
              </Tooltip>

              {/* More Options Button */}
              <Tooltip>
                 <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                 </TooltipTrigger>
                 <TooltipContent side="top"><p>More options</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;