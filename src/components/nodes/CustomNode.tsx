/**
 * Custom node component for the cloud infrastructure graph
 */

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { AlertTriangle, SlidersVertical } from 'lucide-react';

import { getNodeIcon } from '../../utils/iconResolver';
import type { CustomNodeProps } from '../../types';

const CustomNode = memo(({ data, id }: CustomNodeProps) => {
  const hasChildren = data.children && data.children.length > 0;

  return (
    <div className="node-wrapper">
      <div 
        className="custom-node" 
        data-type={data.type}
        title={`${data.label} - ${data.alerts} alerts, ${data.misconfigs} misconfigurations`}
      >
        <Handle 
          type="target" 
          position={Position.Left} 
          style={{ opacity: 0, pointerEvents: 'none' }}
        />
        
        <div className="node-content">
          <div className="node-icon-container">
            {getNodeIcon(data.type, data.label, id)}
          </div>
          
          {hasChildren && (
            <div className="collapse-indicator" title="Click to expand/collapse">
            </div>
          )}
        </div>
        
        <Handle 
          type="source" 
          position={Position.Right} 
          style={{ opacity: 0, pointerEvents: 'none' }}
        />
      </div>
      
      {/* Combined floating badge */}
      {((data.alerts > 0 && (data.activeFilter === 'all' || data.activeFilter === 'alerts')) ||
        (data.misconfigs > 0 && (data.activeFilter === 'all' || data.activeFilter === 'misconfigurations'))) && (
        <div 
          className="floating-badge combined-badge" 
          title={`${data.alerts} alerts, ${data.misconfigs} misconfigurations`}
        >
          {/* Show alerts section if applicable */}
          {data.alerts > 0 && (data.activeFilter === 'all' || data.activeFilter === 'alerts') && (
            <>
              <AlertTriangle size={10} />
              <span>{data.alerts}</span>
            </>
          )}
          
          {/* Show separator if both sections are visible */}
          {data.alerts > 0 && data.misconfigs > 0 && data.activeFilter === 'all' && (
            <span className="badge-separator">|</span>
          )}
          
          {/* Show misconfigs section if applicable */}
          {data.misconfigs > 0 && (data.activeFilter === 'all' || data.activeFilter === 'misconfigurations') && (
            <>
              <SlidersVertical size={10} />
              <span>{data.misconfigs}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;