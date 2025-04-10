
import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface EditorHeaderProps {
  title: string;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ title }) => {
  return (
    <div className="px-6 py-4 border-b flex items-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
    </div>
  );
};

export default EditorHeader;
