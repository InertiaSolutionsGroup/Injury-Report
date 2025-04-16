import React from 'react';

interface MemoContentProps {
  content: string;
}

const MemoContent: React.FC<MemoContentProps> = ({ content }) => {
  // In the real app, you might use a markdown renderer here
  return (
    <div className="prose prose-sm max-w-none text-gray-900">
      {content}
    </div>
  );
};

export default MemoContent;
