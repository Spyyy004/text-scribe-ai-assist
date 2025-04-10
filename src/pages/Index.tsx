
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import EditorHeader from '@/components/EditorHeader';
import RichTextEditor from '@/components/RichTextEditor';
import EditorSidebar from '@/components/EditorSidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Download, HelpCircle, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [relatedLinks, setRelatedLinks] = useState<Array<{ title: string; url: string }> | null>(null);

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col h-screen">
            <div className="border-b flex items-center justify-between px-6 py-2">
              <EditorHeader title="New Article" />
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    <div className="h-5 w-5 rounded-full bg-amber-400 flex items-center justify-center text-xs text-white font-bold">
                      40
                    </div>
                    <span className="text-purple-600 font-medium text-sm ml-1">Upgrade</span>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-600">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-600">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-600">
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
              <RichTextEditor onSelectionLinks={setRelatedLinks} />
              <EditorSidebar relatedLinks={relatedLinks} />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
