import React, { useState } from 'react';
import { JSONTree } from 'react-json-tree';

interface JsonDataViewerProps {
  data: any;
  title?: string;
}

// Theme for the JSON tree
const jsonTheme = {
  scheme: 'monokai',
  base00: '#ffffff', // background
  base01: '#f5f5f5',
  base02: '#e0e0e0',
  base03: '#cccccc',
  base04: '#999999',
  base05: '#333333',
  base06: '#222222',
  base07: '#111111',
  base08: '#dc322f', // red
  base09: '#cb4b16', // orange
  base0A: '#b58900', // yellow
  base0B: '#2aa198', // green
  base0C: '#56b6c2', // cyan
  base0D: '#4078f2', // blue
  base0E: '#a626a4', // purple
  base0F: '#986801'  // brown
};

export const JsonDataViewer: React.FC<JsonDataViewerProps> = ({ 
  data, 
  title = 'Parsed Data' 
}) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 flex justify-between items-center border-b">
        <h3 className="font-medium">{title}</h3>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {copied ? 'Copied!' : 'Copy JSON'}
        </button>
      </div>
      <div className="p-4 overflow-auto bg-white" style={{ maxHeight: '500px' }}>
        <JSONTree 
          data={data} 
          theme={jsonTheme}
        />
      </div>
    </div>
  );
};

export default JsonDataViewer; 