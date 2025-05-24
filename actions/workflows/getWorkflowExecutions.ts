"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function GetWorkflowExecutions(workflowId: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return prisma.workflowExecution.findMany({
    where: { workflowId, userId },
    orderBy: {
      createdAt: "desc",
    },
  });
}
