"use server";

import { ExecuteWorkflow } from "@/lib/helper/workflow/executeWorkflow";
import { FlowToExecutionPlan } from "@/lib/helper/workflow/executionPlan";
import { TaskRegistry } from "@/lib/helper/workflow/task/registry";
import { prisma } from "@/lib/prisma";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function RunWorkFlow(form: {
  workflowId: string;
  flowDefination?: string;
}) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const { workflowId, flowDefination } = form;
  if (!workflowId) {
    throw new Error("workflowId is requied");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });

  if (!workflow) {
    throw new Error("Flow Defination is not defined!");
  }

  let executionPlan: WorkflowExecutionPlan;
  if (!flowDefination) {
    throw new Error("Workflow Defination is undefined");
  }

  const flow = JSON.parse(flowDefination);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (!result.executionPlan) {
    throw new Error("No execution plan generated");
  }

  executionPlan = result.executionPlan;

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      workflowDefination: flowDefination,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Workflow Execution could not be created");
  }

  ExecuteWorkflow(execution.id); // run in background

  redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}



