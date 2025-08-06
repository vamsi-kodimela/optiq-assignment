/**
 * Core node and edge type definitions for the cloud infrastructure graph
 */

export interface NodeData {
  id: string;
  label: string;
  type: string;
  alerts: number;
  misconfigs: number;
  children?: string[];
}

export interface EdgeData {
  source: string;
  target: string;
}

export type FilterType = 'all' | 'alerts' | 'misconfigurations';

export interface CustomNodeData {
  label: string;
  alerts: number;
  misconfigs: number;
  type: string;
  children?: string[];
  activeFilter?: FilterType;
}

export interface CustomNodeProps {
  data: CustomNodeData;
  id: string;
}

export interface FilterControlsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  alertCount: number;
  misconfigCount: number;
  totalCount: number;
}

export interface FilterStats {
  total: number;
  withAlerts: number;
  withMisconfigs: number;
}