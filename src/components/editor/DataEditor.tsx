/**
 * Data editor component for editing graph data via JSON textarea
 */

import { useState, useCallback } from 'react';
import type { NodeData, EdgeData } from '../../types';

export interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

export interface DataEditorProps {
  data: GraphData;
  onDataChange: (newData: GraphData) => void;
  onReset: () => void;
}

const DataEditor = ({ data, onDataChange, onReset }: DataEditorProps) => {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(data, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setJsonText(newText);
    
    try {
      const parsed = JSON.parse(newText);
      
      // Validate structure
      if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
        throw new Error('Data must contain a "nodes" array');
      }
      
      if (!parsed.edges || !Array.isArray(parsed.edges)) {
        throw new Error('Data must contain an "edges" array');
      }
      
      // Validate nodes
      parsed.nodes.forEach((node: any, index: number) => {
        if (!node.id || typeof node.id !== 'string') {
          throw new Error(`Node ${index}: "id" is required and must be a string`);
        }
        if (!node.label || typeof node.label !== 'string') {
          throw new Error(`Node ${index}: "label" is required and must be a string`);
        }
        if (!node.type || typeof node.type !== 'string') {
          throw new Error(`Node ${index}: "type" is required and must be a string`);
        }
        if (typeof node.alerts !== 'number' || node.alerts < 0) {
          throw new Error(`Node ${index}: "alerts" must be a non-negative number`);
        }
        if (typeof node.misconfigs !== 'number' || node.misconfigs < 0) {
          throw new Error(`Node ${index}: "misconfigs" must be a non-negative number`);
        }
        if (node.children && !Array.isArray(node.children)) {
          throw new Error(`Node ${index}: "children" must be an array if provided`);
        }
      });
      
      // Validate edges
      parsed.edges.forEach((edge: any, index: number) => {
        if (!edge.source || typeof edge.source !== 'string') {
          throw new Error(`Edge ${index}: "source" is required and must be a string`);
        }
        if (!edge.target || typeof edge.target !== 'string') {
          throw new Error(`Edge ${index}: "target" is required and must be a string`);
        }
      });
      
      setError(null);
      onDataChange(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  }, [onDataChange]);

  const handleApply = useCallback(() => {
    if (!error) {
      try {
        const parsed = JSON.parse(jsonText);
        onDataChange(parsed);
      } catch (err) {
        setError('Invalid JSON format');
      }
    }
  }, [jsonText, error, onDataChange]);

  const handleReset = useCallback(() => {
    onReset();
    setError(null);
  }, [onReset]);

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      setError(null);
    } catch (err) {
      setError('Cannot format invalid JSON');
    }
  }, [jsonText]);

  return (
    <div className="data-editor">
      <div className="data-editor-header">
        <button 
          className="editor-toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
          <span className="toggle-label">Graph Data Editor</span>
        </button>
        {isExpanded && (
          <div className="editor-actions">
            <button 
              className="editor-button format-button"
              onClick={handleFormat}
              disabled={!!error}
            >
              Format JSON
            </button>
            <button 
              className="editor-button apply-button"
              onClick={handleApply}
              disabled={!!error}
            >
              Apply Changes
            </button>
            <button 
              className="editor-button reset-button"
              onClick={handleReset}
            >
              Reset to Default
            </button>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="data-editor-content">
          {error && (
            <div className="editor-error">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
            </div>
          )}
          
          <textarea
            className={`data-textarea ${error ? 'has-error' : ''}`}
            value={jsonText}
            onChange={handleTextChange}
            placeholder="Enter graph data as JSON..."
            rows={20}
            cols={50}
            spellCheck={false}
          />
          
          <div className="editor-help">
            <details className="help-details">
              <summary>Data Format Help</summary>
              <div className="help-content">
                <p><strong>Required structure:</strong></p>
                <pre className="help-code">{`{
  "nodes": [
    {
      "id": "string",
      "label": "string", 
      "type": "string",
      "alerts": number,
      "misconfigs": number,
      "children": ["string"] // optional
    }
  ],
  "edges": [
    {
      "source": "string",
      "target": "string"
    }
  ]
}`}</pre>
                <p><strong>Valid node types:</strong> cloud, aws, gcp, saas, service</p>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEditor;
