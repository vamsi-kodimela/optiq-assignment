import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  AlertTriangle, 
  SlidersVertical, 
  Cloud, 
  Database, 
  HardDrive, 
  Globe, 
  Server 
} from 'lucide-react';

interface CustomNodeData {
  label: string;
  alerts: number;
  misconfigs: number;
  type: string;
  children?: string[];
  activeFilter?: 'all' | 'alerts' | 'misconfigurations';
}

interface CustomNodeProps {
  data: CustomNodeData;
}

const getNodeIcon = (type: string, label: string) => {
  const iconProps = { size: 20, className: "node-icon" };
  
  switch (type) {
    case 'cloud':
      return <Cloud {...iconProps} />;
    case 'aws':
      return <Server {...iconProps} />;
    case 'gcp':
      return <Globe {...iconProps} />;
    case 'saas':
      return <Cloud {...iconProps} />;
    case 'service':
      // Use different icons based on service name
      if (label.toLowerCase().includes('s3')) {
        return <HardDrive {...iconProps} />;
      } else if (label.toLowerCase().includes('rds')) {
        return <Database {...iconProps} />;
      }
      return <Server {...iconProps} />;
    default:
      return <Server {...iconProps} />;
  }
};

const CustomNode = memo(({ data }: CustomNodeProps) => {
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
            {getNodeIcon(data.type, data.label)}
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
      
      {/* Floating badges - show based on active filter */}
      {data.alerts > 0 && (data.activeFilter === 'all' || data.activeFilter === 'alerts') && (
        <div className="floating-badge alerts-badge" title={`${data.alerts} alerts`}>
          <AlertTriangle size={10} />
          <span>{data.alerts}</span>
        </div>
      )}
      
      {data.misconfigs > 0 && (data.activeFilter === 'all' || data.activeFilter === 'misconfigurations') && (
        <div className="floating-badge misconfigs-badge" title={`${data.misconfigs} misconfigurations`}>
          <SlidersVertical size={10} />
          <span>{data.misconfigs}</span>
        </div>
      )}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;