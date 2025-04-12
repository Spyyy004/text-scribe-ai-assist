
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import EditorHeader from '@/components/EditorHeader';
import RichTextEditor from '@/components/RichTextEditor';
import EditorSidebar from '@/components/EditorSidebar';
import { AppSidebar } from '@/components/AppSidebar';

const Index = () => {
  const [relatedLinks, setRelatedLinks] = useState<Array<{ title: string; url: string }> | null>(null);

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col h-screen">
            <EditorHeader title="New Article" />
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
