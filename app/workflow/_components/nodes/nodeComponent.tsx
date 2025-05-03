import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./nodeCard";


const NodeComponent = memo((props: NodeProps) => {
    return <NodeCard nodeId={props.id}>
        App Node
    </NodeCard>
})

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";