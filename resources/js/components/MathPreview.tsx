import { useEffect, useRef } from 'react';

interface MathPreviewProps {
  content: string;
  className?: string;
}

const MathPreview = ({ content, className = '' }: MathPreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current && content) {
      previewRef.current.innerHTML = content;
      
      // Re-render MathJax when content changes
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([previewRef.current]).catch((err: any) => {
          console.error('MathJax typeset error:', err);
        });
      }
    }
  }, [content]);

  return (
    <div 
      ref={previewRef} 
      className={`math-preview ${className}`}
    />
  );
};

export default MathPreview;