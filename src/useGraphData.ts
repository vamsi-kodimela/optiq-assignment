import { useState, useMemo, useCallback } from 'react';
import type { Node, Edge, NodeChange, OnNodesChange } from 'reactflow';
import { MarkerType, applyNodeChanges } from 'reactflow';
import dagre from 'dagre';
import { initialData, type NodeData } from './initial-data';

export type FilterType = 'all' | 'alerts' | 'misconfigurations';

interface CustomNodeData {
  label: string;
  alerts: number;
  misconfigs: number;
  type: string;
  children?: string[];
  activeFilter?: FilterType;
}

const useGraphData = () => {
  // State for all nodes and edges (source of truth)
  const [allNodes] = useState<NodeData[]>(initialData.nodes);
  const [allEdges] = useState(initialData.edges);
  
  // State for collapsed node IDs
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<string[]>([]);
  
  // State for positioned nodes (includes user dragging)
  const [positionedNodes, setPositionedNodes] = useState<Node<CustomNodeData>[]>([]);
  
  // State for filter
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Generate initial layout using dagre (computed once)
  const initialLayoutedNodes = useMemo(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'LR', nodesep: 100, ranksep: 150 });

    // Add nodes to dagre
    allNodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 200, height: 80 });
    });

    // Add edges to dagre
    allEdges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    // Apply layout
    dagre.layout(dagreGraph);

    // Convert to ReactFlow nodes with positions
    const layouted = allNodes.map((node): Node<CustomNodeData> => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        id: node.id,
        type: 'custom',
        position: {
          x: nodeWithPosition.x - nodeWithPosition.width / 2,
          y: nodeWithPosition.y - nodeWithPosition.height / 2,
        },
        data: {
          label: node.label,
          alerts: node.alerts,
          misconfigs: node.misconfigs,
          type: node.type,
          children: node.children,
          activeFilter,
        },
        draggable: true,
      };
    });

    // Initialize positioned nodes if not already set
    if (positionedNodes.length === 0) {
      setTimeout(() => setPositionedNodes(layouted), 0);
    }

    return layouted;
  }, [allNodes, allEdges, positionedNodes.length]);

  // Convert edges to ReactFlow format
  const layoutedEdges = useMemo((): Edge[] => {
    return allEdges.map((edge, index) => ({
      id: `e${index}`,
      source: edge.source,
      target: edge.target,
      type: 'default',
      animated: true,
      style: {
        strokeDasharray: '8,4',
        strokeWidth: 2,
        stroke: '#94a3b8',
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#94a3b8',
        width: 12,
        height: 12,
      },
    }));
  }, [allEdges]);

  // Handle node position changes from dragging
  const onNodesChange: OnNodesChange = useCallback((changes: NodeChange[]) => {
    setPositionedNodes((nodes) => applyNodeChanges(changes, nodes));
  }, []);

  // Filter nodes based on active filter
  const filterNodes = useCallback((nodes: Node<CustomNodeData>[]) => {
    if (activeFilter === 'all') return nodes;
    
    return nodes.filter(node => {
      if (activeFilter === 'alerts') {
        return node.data.alerts > 0;
      } else if (activeFilter === 'misconfigurations') {
        return node.data.misconfigs > 0;
      }
      return true;
    });
  }, [activeFilter]);

  // Calculate visible nodes and edges based on collapsed state and filters
  const { visibleNodes, visibleEdges } = useMemo(() => {
    // Use positioned nodes if available, otherwise use initial layout
    const currentNodes = positionedNodes.length > 0 ? positionedNodes : initialLayoutedNodes;
    
    // Update all nodes with current activeFilter
    const nodesWithFilter = currentNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        activeFilter,
      },
    }));
    
    // Apply filter first
    const filteredNodes = filterNodes(nodesWithFilter);
    
    // Get all hidden node IDs (children of collapsed nodes)
    const hiddenNodeIds = new Set<string>();
    
    const findHiddenNodes = (nodeId: string) => {
      const node = allNodes.find(n => n.id === nodeId);
      if (node?.children) {
        node.children.forEach(childId => {
          hiddenNodeIds.add(childId);
          findHiddenNodes(childId); // Recursively hide grandchildren
        });
      }
    };

    collapsedNodeIds.forEach(findHiddenNodes);

    // Filter visible nodes (both filter and collapse states)
    const visibleNodes = filteredNodes.filter(node => !hiddenNodeIds.has(node.id));

    // Filter visible edges (both source and target must be visible)
    const visibleNodeIds = new Set(visibleNodes.map(node => node.id));
    const visibleEdges = layoutedEdges.filter(edge => 
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );

    return { visibleNodes, visibleEdges };
  }, [positionedNodes, initialLayoutedNodes, layoutedEdges, collapsedNodeIds, allNodes, filterNodes]);

  // Handle node click for collapse/expand
  const createOnNodeClick = useCallback((fitViewFn?: () => void) => {
    return (_event: React.MouseEvent, node: Node<CustomNodeData>) => {
      // Only handle nodes that have children
      if (node.data.children && node.data.children.length > 0) {
        setCollapsedNodeIds(prev => {
          const newCollapsedIds = prev.includes(node.id)
            ? prev.filter(id => id !== node.id) // Remove from collapsed (expand)
            : [...prev, node.id]; // Add to collapsed (collapse)
          
          // Auto-fit the view after state change
          if (fitViewFn) {
            setTimeout(() => {
              fitViewFn();
            }, 50);
          }
          
          return newCollapsedIds;
        });
      }
    };
  }, []);

  // Calculate filter statistics
  const filterStats = useMemo(() => {
    const currentNodes = positionedNodes.length > 0 ? positionedNodes : initialLayoutedNodes;
    
    return {
      total: currentNodes.length,
      withAlerts: currentNodes.filter(node => node.data.alerts > 0).length,
      withMisconfigs: currentNodes.filter(node => node.data.misconfigs > 0).length
    };
  }, [positionedNodes, initialLayoutedNodes]);

  // Handle filter changes
  const handleFilterChange = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
  }, []);

  return {
    visibleNodes,
    visibleEdges,
    createOnNodeClick,
    onNodesChange,
    activeFilter,
    onFilterChange: handleFilterChange,
    filterStats,
  };
};

export default useGraphData;