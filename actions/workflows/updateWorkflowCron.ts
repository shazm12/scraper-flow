"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CronExpressionParser } from "cron-parser";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    const interval = CronExpressionParser.parse(cron, { tz: "UTC" });
    await prisma.workflow.update({
      where: { id, userId },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (err) {
    console.error("Invalid Cron Expression");
    throw new Error("Invalid Cron Expression");
  }
  revalidatePath("/workflows");
}
