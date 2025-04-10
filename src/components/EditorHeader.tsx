
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface EditorHeaderProps {
  title: string;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b">
      <Button variant="ghost" size="icon" className="text-gray-500">
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Back</span>
      </Button>
      <h1 className="text-xl font-medium">{title}</h1>
    </div>
  );
};

export default EditorHeader;
