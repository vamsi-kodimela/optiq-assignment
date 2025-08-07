/**
 * Main graph component that renders the cloud infrastructure visualization
 */

import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

import CustomNode from "../nodes/CustomNode";
import FilterControls from "../controls/FilterControls";
import DataEditor from "../editor/DataEditor";
import useGraphData from "../../hooks/useGraphData";

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
    filterStats,
    updateGraphData,
    resetGraphData,
    getCurrentGraphData,
  } = useGraphData();

  const handleFitView = () => {
    fitView({
      padding: 0.2,
      duration: 500,
      maxZoom: 1.5,
      minZoom: 0.1,
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
      <Panel position="bottom-left">
        <DataEditor
          data={getCurrentGraphData()}
          onDataChange={updateGraphData}
          onReset={resetGraphData}
        />
      </Panel>
    </ReactFlow>
  );
};

const Graph = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        position: "relative",
        overflow: "visible",
      }}
    >
      <ReactFlowProvider>
        <FlowContent />
      </ReactFlowProvider>
    </div>
  );
};

export default Graph;
