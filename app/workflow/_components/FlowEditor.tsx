"use client";
import { Workflow } from "@prisma/client";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect } from "react";

import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "@/lib/helper/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import NodeComponent from "./nodes/nodeComponent";
import { AppNode } from "@/types/appNode";
import DeleteableEdge from "./edges/deleteableEdge";
import { TaskRegistry } from "@/lib/helper/workflow/task/registry";

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
  default: DeleteableEdge
}


const snapGrid: [number, number] = [50, 50];

const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodeChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const taskType = event.dataTransfer.getData("application/reactflow");

      if (typeof taskType === undefined || !taskType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = CreateFlowNode(taskType as TaskType, position);

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, screenToFlowPosition]
  );

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({...connection, animated: true},eds));
    if(!connection.targetHandle) return;

    const node = nodes.find(node => node.id === connection.target);
    if(!node) return;

    const nodeInputs = node.data.inputs;
    updateNodeData(node.id, {
      inputs: {
          ...nodeInputs,
        [connection.targetHandle] : ""
      }
    });
  },[nodes, setEdges, updateNodeData]);


  const isValidConnection = useCallback((connection: Edge | Connection) => {
    // No-self connection allowed
    if (connection.source === connection.target) {
      return false;
    }
  
    // Find nodes
    const source = nodes.find(node => node.id === connection.source);
    const target = nodes.find(node => node.id === connection.target);    
      
    if (!source?.data?.type || !target?.data?.type) {
      console.log("Invalid Connection: source or target node not found or missing type");
      return false;
    }
  
    const sourceTask = TaskRegistry[source.data.type];
    const targetTask = TaskRegistry[target.data.type];
    
    // Check if handles exist
    if (!connection.sourceHandle || !connection.targetHandle) {
      return false;
    }
  
    const output = sourceTask.outputs.find((o) => o.name === connection.sourceHandle);
    const input = targetTask.inputs.find((i) => i.name === connection.targetHandle);
  
    if (!input || !output) {
      return false; // Handle not found
    }

    if (input?.type == output?.type) {
      return false; // Handle not found
    }

    const hasCycle = (node: AppNode, visited = new Set()) => {
      if(visited.has(node.id)) return false;
      visited.add(node.id);

      for(const outgoer of getOutgoers(node, nodes, edges)) {
        if(outgoer.id === connection.source) return true;
        if(hasCycle(outgoer,visited)) return true;
      }
    }

    const detectedCycle = hasCycle(target);
    
    return !detectedCycle;


  }, [edges, nodes]);


  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.defination);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {}
  }, [workflow.defination, setNodes, setEdges, setViewport]);

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgeChange}
        onNodesChange={onNodeChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
