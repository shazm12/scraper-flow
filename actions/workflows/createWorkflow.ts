"use server";

import { CreateFlowNode } from "@/lib/helper/workflow/createFlowNode";
import { prisma } from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
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


    const initalFlow : {nodes: AppNode[], edges: Edge[] } = {
        nodes: [],
        edges: []
    }

    initalFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            defination: JSON.stringify(initalFlow),
            ...data,
        }
    });

    if(!result) {
        throw new Error("Failed To Create Workflow");
    }

    redirect(`/workflow/editor/${result.id}`);



}