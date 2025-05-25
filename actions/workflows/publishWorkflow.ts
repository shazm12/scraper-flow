"use server";

import { FlowToExecutionPlan } from "@/lib/helper/workflow/executionPlan";
import { CalculateWorkflowCost } from "@/lib/helper/workflow/helpers";
import { prisma } from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function PublishWorkflow({
  id,
  flowDefination,
}: {
  id: string;
  flowDefination: string;
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow Not Found");
  }

  if(workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow already published");
  }

  const flow = JSON.parse(flowDefination);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if(result.error) {
    throw new Error("Flow is not valid");
  }

  if(!result.executionPlan) {
    throw new Error("Execution plan could not be generated");
  }


  const creditsCost = CalculateWorkflowCost(flow.nodes);

  await prisma.workflow.update({
    where: { id, userId},
    data: {
      defination: flowDefination,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost: creditsCost,
      status: WorkflowStatus.PUBLISHED
    }
  });

  revalidatePath(`/workflow/editor/${id}`);

}
