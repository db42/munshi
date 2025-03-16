import React, { useState, useEffect } from 'react';

interface TextViewerProps {
  fileUrl: string;
}

export const TextViewer: React.FC<TextViewerProps> = ({ fileUrl }) => {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchText = async () => {
      try {
        setLoading(true);
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }
        const textContent = await response.text();
        setText(textContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load file');
        console.error('Error loading text file:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchText();
  }, [fileUrl]);

  if (loading) {
    return <div className="p-4 text-center">Loading text file...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="font-mono text-sm whitespace-pre-wrap bg-white p-4 border rounded overflow-auto" style={{ maxHeight: '70vh' }}>
      {text}
    </div>
  );
};

export default TextViewer; 