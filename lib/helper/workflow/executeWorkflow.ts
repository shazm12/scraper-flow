import { prisma } from "@/lib/prisma";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";
import "server-only";


export async function ExecutionFlow(executionId: string) {
    const execution = await prisma.workflowExecution.findUnique({
        where: {
            id: executionId
        },
        include: { workflow: true, phases: true}
    });

    if(!execution) {
        throw new Error("Execution not found");
    }

    // Setup Execution Environment

    const environment  = { phases: {}};

    await initializeWorkflowExecution(executionId, execution.workflowId);
    await initializePhaseStatuses(execution);

    let executionFailed = false;
    let creditsConsumed = 0;

    for(const phase of execution.phases) {
        //execute phase
    }

    //finalize execution
    await finalizeWorkflowExection(executionId, execution.workflowId, executionFailed, creditsConsumed);
    //clear up environment


    revalidatePath("/workflows/runs");

}

async function initializeWorkflowExecution(executionId: string, workflowId: string) {
    await prisma.workflowExecution.update({
        where: {
            id: executionId
        },
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING
        }
    });

    await prisma.workflow.update({
        where: {
            id: workflowId,
        },
        data: {
            lastRunAt: new Date(),
            lastRunStatus: WorkflowExecutionStatus.RUNNING,
            lastRunId: executionId
        }
    });
}


async function initializePhaseStatuses(execution: any){
    await prisma.executionPhase.updateMany({
        where: {
            id: {
                in: execution.phases.map((phase:any ) => phase.id)
            },
        },
        data: {
            status: ExecutionPhaseStatus.PENDING
        }
    })
}

async function finalizeWorkflowExection(executionId: string, workflowId: string, executionFailed: boolean, creditsConsumed: number) {
    
    const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED;

    await prisma.workflowExecution.update({
        where: {id : executionId},
        data: {
            status: finalStatus,
            completedAt: new Date(),
            creditsConsumed,            
        }
    });

    await prisma.workflow.update({
        where: {
            id: workflowId,
            lastRunId: executionId
        },
        data: {
            lastRunStatus: finalStatus
        }
    })
    .catch((err) => {
        // ignore 
        // means we  have triggered other runs while the 
        // an execution was running
    })
}