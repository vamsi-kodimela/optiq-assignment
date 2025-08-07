/**
 * Initial data configuration for the cloud infrastructure graph
 */

import type { NodeData, EdgeData } from '../types';

export type { NodeData, EdgeData };

export const initialData = {
  nodes: [
    { 
      id: "cloud", 
      label: "Multi-Cloud Infrastructure", 
      type: "cloud", 
      alerts: 385, 
      misconfigs: 32, 
      children: ["aws1", "aws2", "gcp", "saas"] 
    },
    
    // AWS Production Environment
    { 
      id: "aws1", 
      label: "AWS Production", 
      type: "aws", 
      alerts: 167, 
      misconfigs: 8, 
      children: ["s3-prod", "ec2-web", "lambda-api", "cloudfront"] 
    },
    { 
      id: "s3-prod", 
      label: "S3 Production", 
      type: "service", 
      alerts: 42, 
      misconfigs: 2 
    },
    { 
      id: "ec2-web", 
      label: "EC2 Web Servers", 
      type: "service", 
      alerts: 58, 
      misconfigs: 3 
    },
    { 
      id: "lambda-api", 
      label: "Lambda API", 
      type: "service", 
      alerts: 23, 
      misconfigs: 1 
    },
    { 
      id: "cloudfront", 
      label: "CloudFront CDN", 
      type: "service", 
      alerts: 44, 
      misconfigs: 2 
    },
    
    // AWS Staging Environment
    { 
      id: "aws2", 
      label: "AWS Staging", 
      type: "aws", 
      alerts: 142, 
      misconfigs: 7, 
      children: ["rds-staging", "vpc-staging", "ecs-staging", "elasticache"] 
    },
    { 
      id: "rds-staging", 
      label: "RDS Staging", 
      type: "service", 
      alerts: 35, 
      misconfigs: 2 
    },
    { 
      id: "vpc-staging", 
      label: "VPC Network", 
      type: "service", 
      alerts: 28, 
      misconfigs: 1 
    },
    { 
      id: "ecs-staging", 
      label: "ECS Containers", 
      type: "service", 
      alerts: 49, 
      misconfigs: 3 
    },
    { 
      id: "elasticache", 
      label: "ElastiCache", 
      type: "service", 
      alerts: 30, 
      misconfigs: 1 
    },
    
    // GCP Analytics Platform
    { 
      id: "gcp", 
      label: "GCP Analytics", 
      type: "gcp", 
      alerts: 89, 
      misconfigs: 9, 
      children: ["bigquery", "dataflow", "cloud-storage", "pubsub", "cloud-sql"] 
    },
    { 
      id: "bigquery", 
      label: "BigQuery", 
      type: "service", 
      alerts: 15, 
      misconfigs: 2 
    },
    { 
      id: "dataflow", 
      label: "Dataflow", 
      type: "service", 
      alerts: 22, 
      misconfigs: 1 
    },
    { 
      id: "cloud-storage", 
      label: "Cloud Storage", 
      type: "service", 
      alerts: 31, 
      misconfigs: 3 
    },
    { 
      id: "pubsub", 
      label: "Pub/Sub", 
      type: "service", 
      alerts: 12, 
      misconfigs: 1 
    },
    { 
      id: "cloud-sql", 
      label: "Cloud SQL", 
      type: "service", 
      alerts: 9, 
      misconfigs: 2 
    },
    
    // SaaS Applications (leaf node - no children)
    { 
      id: "saas", 
      label: "SaaS Applications", 
      type: "saas", 
      alerts: 87, 
      misconfigs: 8 
    }
  ] as NodeData[],
  edges: [
    // Top level connections
    { source: "cloud", target: "aws1" },
    { source: "cloud", target: "aws2" },
    { source: "cloud", target: "gcp" },
    { source: "cloud", target: "saas" },
    
    // AWS Production connections
    { source: "aws1", target: "s3-prod" },
    { source: "aws1", target: "ec2-web" },
    { source: "aws1", target: "lambda-api" },
    { source: "aws1", target: "cloudfront" },
    
    // AWS Staging connections
    { source: "aws2", target: "rds-staging" },
    { source: "aws2", target: "vpc-staging" },
    { source: "aws2", target: "ecs-staging" },
    { source: "aws2", target: "elasticache" },
    
    // GCP Analytics connections
    { source: "gcp", target: "bigquery" },
    { source: "gcp", target: "dataflow" },
    { source: "gcp", target: "cloud-storage" },
    { source: "gcp", target: "pubsub" },
    { source: "gcp", target: "cloud-sql" }
  ] as EdgeData[]
};