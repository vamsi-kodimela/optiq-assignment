/**
 * Icon resolution utility for dynamic node icon selection
 */

import { 
  Cloud, 
  Database, 
  HardDrive, 
  Globe, 
  Server,
  Box,
  Folder,
  Shield,
  Zap,
  Network,
  MonitorSpeaker,
  Brain
} from 'lucide-react';

import { ICON_SIZE, NODE_TYPES, SERVICE_KEYWORDS, ROOT_NODE_ID } from '../constants/icons';

// Logo components
const AwsLogo = ({ size = ICON_SIZE.DEFAULT, className = "" }) => (
  <img
    src="/assets/logos/aws-logo.svg"
    alt="AWS"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain' }}
  />
);

const GcpLogo = ({ size = ICON_SIZE.DEFAULT, className = "" }) => (
  <img
    src="/assets/logos/gcp-logo.svg"
    alt="GCP"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain' }}
  />
);

interface IconProps {
  size?: number;
  className?: string;
}

/**
 * Resolves the appropriate icon based on node type, label, and ID
 */
export const getNodeIcon = (type: string, label: string, nodeId?: string): JSX.Element => {
  const iconProps: IconProps = { size: ICON_SIZE.DEFAULT, className: "node-icon" };
  const labelLower = label.toLowerCase();
  
  // Root node gets brain icon
  if (nodeId === ROOT_NODE_ID || (type === NODE_TYPES.CLOUD && labelLower === 'cloud')) {
    return <Brain {...iconProps} />;
  }
  
  switch (type) {
    case NODE_TYPES.CLOUD:
      return <Cloud {...iconProps} />;
    
    case NODE_TYPES.AWS:
      return <AwsLogo {...iconProps} />;
    
    case NODE_TYPES.GCP:
      return <GcpLogo {...iconProps} />;
    
    case NODE_TYPES.SAAS:
      return getSaaSIcon(labelLower, iconProps);
    
    case NODE_TYPES.SERVICE:
      return getServiceIcon(labelLower, iconProps);
    
    case NODE_TYPES.REGION:
      return <Globe {...iconProps} />;
    
    case NODE_TYPES.ZONE:
    case NODE_TYPES.AVAILABILITY_ZONE:
      return <Network {...iconProps} />;
    
    case NODE_TYPES.CONTAINER:
      return <Box {...iconProps} />;
    
    case NODE_TYPES.FUNCTION:
    case NODE_TYPES.LAMBDA:
      return <Zap {...iconProps} />;
    
    case NODE_TYPES.SECURITY:
      return <Shield {...iconProps} />;
    
    case NODE_TYPES.NETWORK:
      return <Network {...iconProps} />;
    
    default:
      return getDefaultIcon(labelLower, iconProps);
  }
};

/**
 * Get icon for SaaS applications
 */
const getSaaSIcon = (labelLower: string, iconProps: IconProps): JSX.Element => {
  if (SERVICE_KEYWORDS.OFFICE.some(keyword => labelLower.includes(keyword))) {
    return <MonitorSpeaker {...iconProps} />;
  }
  if (SERVICE_KEYWORDS.SECURITY.some(keyword => labelLower.includes(keyword))) {
    return <Shield {...iconProps} />;
  }
  return <Box {...iconProps} />;
};

/**
 * Get icon for various services based on keywords
 */
const getServiceIcon = (labelLower: string, iconProps: IconProps): JSX.Element => {
  // Storage services
  if (SERVICE_KEYWORDS.STORAGE.some(keyword => labelLower.includes(keyword))) {
    return <HardDrive {...iconProps} />;
  }
  
  // Database services
  if (SERVICE_KEYWORDS.DATABASE.some(keyword => labelLower.includes(keyword))) {
    return <Database {...iconProps} />;
  }
  
  // Compute services
  if (SERVICE_KEYWORDS.COMPUTE.some(keyword => labelLower.includes(keyword))) {
    return <Server {...iconProps} />;
  }
  
  // Networking services
  if (SERVICE_KEYWORDS.NETWORK.some(keyword => labelLower.includes(keyword))) {
    return <Network {...iconProps} />;
  }
  
  // Lambda/Functions
  if (SERVICE_KEYWORDS.FUNCTIONS.some(keyword => labelLower.includes(keyword))) {
    return <Zap {...iconProps} />;
  }
  
  // Container services
  if (SERVICE_KEYWORDS.CONTAINERS.some(keyword => labelLower.includes(keyword))) {
    return <Box {...iconProps} />;
  }
  
  // File/Directory services
  if (SERVICE_KEYWORDS.FILES.some(keyword => labelLower.includes(keyword))) {
    return <Folder {...iconProps} />;
  }
  
  // Default service icon
  return <Server {...iconProps} />;
};

/**
 * Get default icon based on label patterns
 */
const getDefaultIcon = (labelLower: string, iconProps: IconProps): JSX.Element => {
  if (labelLower.includes('cloud')) {
    return <Cloud {...iconProps} />;
  }
  if (labelLower.includes('database') || labelLower.includes('db')) {
    return <Database {...iconProps} />;
  }
  if (labelLower.includes('storage')) {
    return <HardDrive {...iconProps} />;
  }
  if (labelLower.includes('network')) {
    return <Network {...iconProps} />;
  }
  return <Server {...iconProps} />;
};