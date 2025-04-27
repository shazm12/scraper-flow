"use server";

import { prisma } from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";


export async function CreateWorkflow(form: createWorkflowSchemaType) {
    const {success, data} = createWorkflowSchema.safeParse(form);
    if(!success) {
        throw new Error("Invalid Form Data");
    }

    const { userId } = auth();
    if(!userId) {
        throw new Error("Unauthenticated");
    }

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            defination: "TODO",
            ...data,
        }
    });

    if(!result) {
        throw new Error("Failed To Create Workflow");
    }

    redirect(`/workflow/editor/${result.id}`);



}