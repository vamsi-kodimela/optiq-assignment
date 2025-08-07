/**
 * Custom hook for managing graph data, layout, and filtering logic
 */

import { useState, useMemo, useCallback } from 'react';
import type { Node, Edge, NodeChange, OnNodesChange } from 'reactflow';
import { MarkerType, applyNodeChanges } from 'reactflow';
import dagre from 'dagre';

import { initialData } from '../data/initialData';
import type { FilterType, CustomNodeData, FilterStats, NodeData, EdgeData } from '../types';

export interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

const useGraphData = () => {
  // State for all nodes and edges (source of truth)
  const [allNodes, setAllNodes] = useState<NodeData[]>(initialData.nodes);
  const [allEdges, setAllEdges] = useState<EdgeData[]>(initialData.edges);
  
  // State for collapsed node IDs
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<string[]>([]);
  
  // State for positioned nodes (includes user dragging)
  const [positionedNodes, setPositionedNodes] = useState<Node<CustomNodeData>[]>([]);
  
  // State for active filter
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Generate initial layout using dagre
  const initialLayoutedNodes = useMemo(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'LR', nodesep: 100, ranksep: 150 });

    // Add nodes to dagre graph
    allNodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 200, height: 80 });
    });

    // Add edges to dagre graph
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
  }, [allNodes, allEdges, positionedNodes.length, activeFilter]);

  // Generate edges with styling
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

  // Handle node position changes (dragging)
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

    // Find all nodes that should be hidden due to collapsed parents
    collapsedNodeIds.forEach(findHiddenNodes);

    // Filter out hidden nodes
    const visibleNodes = filteredNodes.filter(node => !hiddenNodeIds.has(node.id));

    // Filter edges to only show connections between visible nodes
    const visibleNodeIds = new Set(visibleNodes.map(node => node.id));
    const visibleEdges = layoutedEdges.filter(edge => 
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );

    return { visibleNodes, visibleEdges };
  }, [positionedNodes, initialLayoutedNodes, layoutedEdges, collapsedNodeIds, allNodes, filterNodes, activeFilter]);

  // Create node click handler
  const createOnNodeClick = useCallback((fitViewFn?: () => void) => {
    return (_event: React.MouseEvent, node: Node<CustomNodeData>) => {
      if (node.data.children && node.data.children.length > 0) {
        setCollapsedNodeIds(prev => {
          const newCollapsedIds = prev.includes(node.id)
            ? prev.filter(id => id !== node.id)
            : [...prev, node.id];
          
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
  const filterStats: FilterStats = useMemo(() => {
    const currentNodes = positionedNodes.length > 0 ? positionedNodes : initialLayoutedNodes;
    
    return {
      total: currentNodes.length,
      withAlerts: currentNodes.filter(node => node.data.alerts > 0).length,
      withMisconfigs: currentNodes.filter(node => node.data.misconfigs > 0).length
    };
  }, [positionedNodes, initialLayoutedNodes]);

  // Handle filter change
  const handleFilterChange = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
  }, []);

  // Handle data updates from editor
  const updateGraphData = useCallback((newData: GraphData) => {
    setAllNodes(newData.nodes);
    setAllEdges(newData.edges);
    // Reset positioned nodes to trigger re-layout
    setPositionedNodes([]);
    // Reset collapsed state when data changes
    setCollapsedNodeIds([]);
  }, []);

  // Reset to initial data
  const resetGraphData = useCallback(() => {
    setAllNodes(initialData.nodes);
    setAllEdges(initialData.edges);
    setPositionedNodes([]);
    setCollapsedNodeIds([]);
    setActiveFilter('all');
  }, []);

  // Get current graph data
  const getCurrentGraphData = useCallback((): GraphData => ({
    nodes: allNodes,
    edges: allEdges,
  }), [allNodes, allEdges]);

  return {
    visibleNodes,
    visibleEdges,
    createOnNodeClick,
    onNodesChange,
    activeFilter,
    onFilterChange: handleFilterChange,
    filterStats,
    updateGraphData,
    resetGraphData,
    getCurrentGraphData,
  };
};

export default useGraphData;