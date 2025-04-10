
import React, { useState } from 'react';
import EditorHeader from '@/components/EditorHeader';
import RichTextEditor from '@/components/RichTextEditor';
import EditorSidebar from '@/components/EditorSidebar';

const Index = () => {
  const [relatedLinks, setRelatedLinks] = useState<Array<{ title: string; url: string }> | null>(null);

  return (
    <div className="flex flex-col h-screen">
      <EditorHeader title="New Article" />
      <div className="flex-1 flex overflow-hidden">
        <RichTextEditor onSelectionLinks={setRelatedLinks} />
        <EditorSidebar relatedLinks={relatedLinks} />
      </div>
    </div>
  );
};

export default Index;
