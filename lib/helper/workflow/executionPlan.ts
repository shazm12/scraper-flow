import { AppNode } from "@/types/appNode";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPLanPhase,
} from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";
import { AppNodeMissingInputs } from "@/types/task";

export enum FlowToExecutionPlanValidationError {
  "NO_ENTRY_POINT",
  "INVALID_INPUTS",
}

type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanValidationError;
    invalidElements?: AppNodeMissingInputs[];
  };
};

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType {
  const entryPointNode = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  const inputsWithErrors: AppNodeMissingInputs[] = [];
  const planned = new Set<string>();

  if (!entryPointNode) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT,
      },
    };
  }

  const invalidInputs = getInvalidInputs(entryPointNode, edges, planned);

  if (invalidInputs.length > 0) {
    inputsWithErrors.push({
      nodeId: entryPointNode.id,
      inputs: invalidInputs,
    });
  }

  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPointNode],
    },
  ];

  planned.add(entryPointNode.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPLanPhase = { phase, nodes: [] };
    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        // Node already added in execution plan
        continue;
      }
      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      if (invalidInputs.length > 0) {
        const incommers = getIncomers(currentNode, nodes, edges);
        if (incommers.every((incomer) => planned.has(incomer.id))) {
          // If all the incommers are planned and there are still invalid inputs, this means that the input still
          // has invalid inputs, hence error

          console.error("Invalid Inputs", currentNode.id, invalidInputs);
          inputsWithErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs,
          });
        } else {
          continue;
        }
      }
      nextPhase.nodes.push(currentNode);
    }
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }

  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
        invalidElements: inputsWithErrors,
      },
    };
  }

  return { executionPlan };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];
  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;
    if (inputValueProvided) {
      continue;
    }

    // If value is not provided by user, then check if output from incoming
    // node is linked to current input
    const incomingEdges = edges.filter((edge) => edge.target === node.id);

    const inputLinkedWithOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );

    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputLinkedWithOutput &&
      planned.has(inputLinkedWithOutput.source);

    if (requiredInputProvidedByVisitedOutput) {
      // input is required and a valid output is provided by the incoming node from planned
      continue;
    } else if (!input.required) {
      if (!inputLinkedWithOutput) continue;
      if (inputLinkedWithOutput && planned.has(inputLinkedWithOutput.source)) {
        // The output is providing a value
        continue;
      }
    }

    invalidInputs.push(input.name);
  }

  return invalidInputs;
}

// had to write this as server action is not able to import this function from react-flow lib
function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
  if (!node.id) {
    return [];
  }

  const incomersid = new Set();

  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incomersid.add(edge.source);
    }
  });

  return nodes.filter((n) => incomersid.has(n.id));
}
