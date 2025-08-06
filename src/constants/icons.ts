/**
 * Icon mappings and configurations for different node types
 */

export const ICON_SIZE = {
  DEFAULT: 20,
  SMALL: 16,
  LARGE: 24,
} as const;

export const NODE_TYPES = {
  CLOUD: 'cloud',
  AWS: 'aws', 
  GCP: 'gcp',
  SAAS: 'saas',
  SERVICE: 'service',
  REGION: 'region',
  ZONE: 'zone',
  AVAILABILITY_ZONE: 'availability-zone',
  CONTAINER: 'container',
  FUNCTION: 'function',
  LAMBDA: 'lambda',
  SECURITY: 'security',
  NETWORK: 'network',
} as const;

export const SERVICE_KEYWORDS = {
  STORAGE: ['s3', 'storage', 'bucket'],
  DATABASE: ['rds', 'database', 'sql', 'mongo', 'redis', 'dynamodb'],
  COMPUTE: ['ec2', 'compute', 'vm', 'instance'],
  NETWORK: ['vpc', 'network', 'load', 'gateway'],
  FUNCTIONS: ['lambda', 'function', 'serverless'],
  CONTAINERS: ['docker', 'container', 'kubernetes', 'ecs'],
  FILES: ['file', 'directory', 'folder'],
  OFFICE: ['office', '365'],
  SECURITY: ['security', 'auth'],
} as const;

export const ROOT_NODE_ID = 'cloud';