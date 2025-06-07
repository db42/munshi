import React, { useState } from 'react';
import { JSONTree } from 'react-json-tree';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface JsonDataViewerProps {
  data: any;
  title?: string;
}

// Theme for the JSON tree - high contrast for better readability
const jsonTheme = {
  scheme: 'monokai',
  base00: '#ffffff', // background
  base01: '#f5f5f5',
  base02: '#e0e0e0',
  base03: '#cccccc',
  base04: '#999999',
  base05: '#333333', // main text color
  base06: '#222222',
  base07: '#111111',
  base08: '#e91e63', // red - strings
  base09: '#f57c00', // orange - numbers
  base0A: '#ffc107', // yellow - booleans
  base0B: '#4caf50', // green - symbols, keys
  base0C: '#00bcd4', // cyan - punctuation
  base0D: '#2196f3', // blue - functions
  base0E: '#9c27b0', // purple - keywords
  base0F: '#795548'  // brown - arrays, objects
};

export const JsonDataViewer: React.FC<JsonDataViewerProps> = ({ 
  data, 
  title = 'Parsed Data' 
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'raw'>('tree');
  
  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle expand all
  const handleExpandAll = () => {
    // Create paths for all nodes in the data
    const paths: string[] = [];
    
    const traverse = (obj: any, path: string[] = []) => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          const newPath = [...path, key];
          paths.push(newPath.join(','));
          traverse(obj[key], newPath);
        });
      }
    };
    
    traverse(data);
    setExpandedPaths(paths);
  };

  // Handle collapse all
  const handleCollapseAll = () => {
    setExpandedPaths([]);
  };

  // Filter data based on search term
  const filterData = (data: any): any => {
    if (!searchTerm) return data;
    
    const searchTermLower = searchTerm.toLowerCase();
    
    const filterObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }
      
      if (Array.isArray(obj)) {
        const filteredArray = obj
          .map(item => filterObject(item))
          .filter(item => item !== undefined);
        
        return filteredArray.length > 0 ? filteredArray : undefined;
      }
      
      const result: any = {};
      let hasMatch = false;
      
      Object.entries(obj).forEach(([key, value]) => {
        const keyMatches = key.toLowerCase().includes(searchTermLower);
        const valueMatches = 
          typeof value === 'string' && value.toLowerCase().includes(searchTermLower) ||
          typeof value === 'number' && value.toString().includes(searchTerm);
        
        if (keyMatches || valueMatches) {
          result[key] = value;
          hasMatch = true;
        } else if (typeof value === 'object' && value !== null) {
          const filteredValue = filterObject(value);
          if (filteredValue !== undefined) {
            result[key] = filteredValue;
            hasMatch = true;
          }
        }
      });
      
      return hasMatch ? result : undefined;
    };
    
    return filterObject(data) || {};
  };

  // Determine if we should show the filtered data
  const displayData = searchTerm ? filterData(data) : data;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 bg-gray-100">
        <h3 className="font-medium">{title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'tree' ? 'raw' : 'tree')}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            {viewMode === 'tree' ? 'View Raw' : 'View Tree'}
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>
      </CardHeader>
      
      {/* Search and controls */}
      <div className="bg-gray-50 px-4 py-2 border-b flex flex-wrap items-center gap-2">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Search in JSON..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExpandAll}
            className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Expand All
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Collapse All
          </button>
        </div>
      </div>
      
      {/* JSON content */}
      <CardContent className="p-0">
        <div className="p-4 overflow-auto bg-white" style={{ maxHeight: '70vh' }}>
          {viewMode === 'tree' ? (
            <JSONTree 
              data={displayData} 
              theme={jsonTheme}
              invertTheme={false}
              shouldExpandNodeInitially={(keyPath, data, level) => {
                // Expand first level by default
                if (level === 0) return true;
                
                // Otherwise check if this path is in expandedPaths
                return expandedPaths.includes(keyPath.join(','));
              }}
              hideRoot={false}
            />
          ) : (
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(displayData, null, 2)}
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JsonDataViewer; 