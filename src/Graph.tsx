
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNode from './CustomNode';
import FilterControls from './FilterControls';
import useGraphData from './useGraphData';

// Define custom node types
const nodeTypes = {
  custom: CustomNode,
};

const FlowContent = () => {
  const { fitView } = useReactFlow();
  const { 
    visibleNodes, 
    visibleEdges, 
    createOnNodeClick, 
    onNodesChange, 
    activeFilter, 
    onFilterChange, 
    filterStats 
  } = useGraphData();
  
  const handleFitView = () => {
    fitView({ 
      padding: 0.2, 
      duration: 500,
      maxZoom: 1.5,
      minZoom: 0.1
    });
  };
  
  const onNodeClick = createOnNodeClick(handleFitView);

  return (
    <ReactFlow
      nodes={visibleNodes}
      edges={visibleEdges}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      onNodesChange={onNodesChange}
      nodesDraggable={true}
      nodesConnectable={false}
      elementsSelectable={true}
      fitView
      attributionPosition="bottom-left"
      proOptions={{ hideAttribution: true }}
    >
      <Background />
      <Panel position="top-left">
        <FilterControls
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          alertCount={filterStats.withAlerts}
          misconfigCount={filterStats.withMisconfigs}
          totalCount={filterStats.total}
        />
      </Panel>
      <Panel position="top-right">
        <Controls showInteractive={false} />
      </Panel>
      <MiniMap
          nodeStrokeColor={(n) => {
            switch (n.data?.type) {
              case 'cloud': return '#0ea5e9';
              case 'aws': return '#ff9500';
              case 'gcp': return '#4285f4';
              case 'saas': return '#10b981';
              case 'service': return '#6b7280';
              default: return '#94a3b8';
            }
          }}
          nodeColor={(n) => {
            switch (n.data?.type) {
              case 'cloud': return '#e0f2fe';
              case 'aws': return '#fed7aa';
              case 'gcp': return '#dbeafe';
              case 'saas': return '#d1fae5';
              case 'service': return '#f3f4f6';
              default: return '#f8fafc';
            }
          }}
          nodeBorderRadius={8}
        />
      </ReactFlow>
  );
};

const Graph = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative', overflow: 'visible' }}>
      <ReactFlowProvider>
        <FlowContent />
      </ReactFlowProvider>
    </div>
  );
};

export default Graph;