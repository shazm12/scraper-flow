import { AppNode } from "@/types/appNode";
import { WorkflowExecutionPlan, WorkflowExecutionPLanPhase } from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";


type FlowToExecutionPlanType = {
    executionPlan?: WorkflowExecutionPlan;
}

export function FlowToExecutionPlan(nodes: AppNode[], edges: Edge[]): FlowToExecutionPlanType {


    const entryPointNode = nodes.find((node) => TaskRegistry[node.data.type].isEntryPoint);

    const planned = new Set<string>();

    if(!entryPointNode) {
        throw new Error("No Entrypoint");
    }

    const executionPlan : WorkflowExecutionPlan = [
        {
            phase: 1,
            nodes : [entryPointNode]
        }
    ];

    for( let phase = 2; phase < nodes.length || (planned.size < nodes.length) ; phase++) {
        const nextPhase : WorkflowExecutionPLanPhase = { phase, nodes: []};
        for(const currentNode of nodes) {
            if(planned.has(currentNode.id)) {
                // Node already added in executio plan
                continue;
            }
            const invalidInputs = getInvalidInputs(currentNode, edges, planned);
            if(invalidInputs.length > 0) {
                const incommers = getIncomers(currentNode, nodes, edges);
                if(incommers.every(incomer => planned.has(incomer.id))) {
                    // If all the incommers are planned and there are still invalid inputs, this means that the input still
                    // has invalid inputs, hence error

                    console.error("Invalid Inputs", currentNode.id, invalidInputs);
                    throw new Error("Invalid Inputs");
                }
                else {
                    continue;
                }
            }
            nextPhase.nodes.push(currentNode);
            planned.add(currentNode.id);
        }   

    }

    return  { executionPlan };

}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
    const invalidInputs = [];
    const inputs = TaskRegistry[node.data.type].inputs;

    for(const input of inputs) {
        const inputValue = node.data.inputs[input.name];
        const inputValueProvided = inputValue?.length > 0;
        if(inputValueProvided) {
            continue;
        }
        
        // If value is not provided by user, then check if output from incoming
        // node is linked to current input
        const incomingEdges = edges.filter((edge) => edge.target === node.id);

        const inputLinkedWithOutput = incomingEdges.find((edge) => edge.targetHandle === input.name);

        const requiredInputProvidedByVisitedOutput = input.required && inputLinkedWithOutput && planned.has(inputLinkedWithOutput.source);

        if(requiredInputProvidedByVisitedOutput) {
            // input is required and a valid output is provided by the incoming node from planned
            continue;
        }

        else if(!input.required){
            if(!inputLinkedWithOutput) continue;
            if(inputLinkedWithOutput && planned.has(inputLinkedWithOutput.source)) {
                // The output is providing a value
                continue;
            }
        }

        invalidInputs.push(input.name);

    }

    return invalidInputs;

}