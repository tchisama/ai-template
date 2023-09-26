// CodeContainer.tsx
import React, { useRef } from 'react';

interface CodeContainerProps {
  code: string;
}

const CodeContainer: React.FC<CodeContainerProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={containerRef}>
      <div dangerouslySetInnerHTML={{ __html: code }} />
    </div>
  );
};

export default CodeContainer;
