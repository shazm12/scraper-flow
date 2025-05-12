import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./nodeCard";
import NodeHeader from "./nodeHeader";
import { AppNodeData } from "@/types/appNode";
import { TaskRegistry } from "@/lib/helper/workflow/task/registry";
import NodeInputs, { NodeInput } from "./nodeInputs";
import { NodeOutput, NodeOutputs } from "./nodeOutputs";
import { Badge } from "@/components/ui/badge";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

const NodeComponent = memo((props: NodeProps) => {
    const nodeData = props.data as AppNodeData;

    const task = TaskRegistry[nodeData.type];

    return <NodeCard nodeId={props.id} isSelected={props.selected}>
        {DEV_MODE && <Badge>DEV:{props.id}</Badge>}
       <NodeHeader taskType={nodeData.type} nodeId={props.id} />
       <NodeInputs>
            {task.inputs.map((input, idx) => (
                <NodeInput key={input.name} input={input} nodeId={props.id} />
            ))}
       </NodeInputs>
       <NodeOutputs>
            {task.outputs.map((output, idx) => (
                <NodeOutput key={idx} output={output} />
            ))}
       </NodeOutputs>
    </NodeCard>
})

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";