/**
 * Initial data configuration for the cloud infrastructure graph
 */

import type { NodeData, EdgeData } from '../types';

export type { NodeData, EdgeData };

export const initialData = {
  nodes: [
    { 
      id: "cloud", 
      label: "Cloud", 
      type: "cloud", 
      alerts: 253, 
      misconfigs: 18, 
      children: ["aws1", "aws2", "gcp", "saas"] 
    },
    { 
      id: "aws1", 
      label: "AWS 1", 
      type: "aws", 
      alerts: 84, 
      misconfigs: 3, 
      children: ["s3"] 
    },
    { 
      id: "aws2", 
      label: "AWS 2", 
      type: "aws", 
      alerts: 124, 
      misconfigs: 4, 
      children: ["rds"] 
    },
    { 
      id: "gcp", 
      label: "GCP", 
      type: "gcp", 
      alerts: 28, 
      misconfigs: 9 
    },
    { 
      id: "saas", 
      label: "SaaS", 
      type: "saas", 
      alerts: 123, 
      misconfigs: 5 
    },
    { 
      id: "s3", 
      label: "S3", 
      type: "service", 
      alerts: 66, 
      misconfigs: 3 
    },
    { 
      id: "rds", 
      label: "RDS", 
      type: "service", 
      alerts: 68, 
      misconfigs: 1 
    }
  ] as NodeData[],
  edges: [
    { source: "cloud", target: "aws1" },
    { source: "cloud", target: "aws2" },
    { source: "cloud", target: "gcp" },
    { source: "cloud", target: "saas" },
    { source: "aws1", target: "s3" },
    { source: "aws2", target: "rds" }
  ] as EdgeData[]
};