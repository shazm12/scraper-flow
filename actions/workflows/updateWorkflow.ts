"use server";

import { prisma } from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflow({ id, defination }: { id:string , defination: string}) {
    const { userId } = auth();

    if(!userId) {
        throw new Error("Unauthenticated");
    }

    const workflow = await prisma.workflow.findUnique({
        where : {
            id,
            userId
        }
    });

    if(!workflow) {
        throw new Error("Workflow Not Found");
    }

    if(workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error("Workflow is not in draft");
    }

    await prisma.workflow.update({
        data: {
            defination,
        },
        where: {
            id,
            userId
        }
    });

    revalidatePath("/workflows");
}