import { prisma } from "@/lib/prisma";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { revalidatePath } from "next/cache";
import "server-only";
import { waitFor } from "../waitFor";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { TaskParamType, TaskType } from "@/types/task";
import { ExecutorRegistry } from "./executor/executorRegistry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "./task/launchBrowser";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "@/lib/log";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  // Setup Execution Environment

  const environment: Environment = { phases: {} };

  const edge = JSON.parse(execution.workflowDefination).edges as Edge[];

  await initializeWorkflowExecution(executionId, execution.workflowId);
  await initializePhaseStatuses(execution);

  let executionFailed = false;
  let creditsConsumed = 0;

  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(phase, environment, edge);
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  //finalize execution
  await finalizeWorkflowExection(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );

  await cleanUpEnvironment(environment);
  revalidatePath("/workflows/runs");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
    },
  });
}

async function initializePhaseStatuses(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExection(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((err) => {
      // ignore
      // means we  have triggered other runs while the
      // an execution was running
    });
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[]
) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  const LogCollector = createLogCollector();

  setupEnvironmentForPhase(node, environment, edges);

  // Update Phase status
  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;
  console.log(
    `Executing phase:${phase.name} with ${creditsRequired} credits required`
  );

  await waitFor(2000);

  const success = await executePhase(phase, node, environment, LogCollector);

  const outputs = environment.phases[node.id].outputs;

  await finalizePhase(phase.id, success, outputs, LogCollector);

  return { success };
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: any,
  LogCollector: LogCollector
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;
  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      logs: {
        createMany: {
          data: LogCollector.getAll().map((log) => ({
            message: log.message,
            timestamp: log.timestamp,
            logLevel: log.level,
          })),
        },
      },
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  LogCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    return false;
  }

  const executionEnvironment: ExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment, LogCollector);

  return await runFn(executionEnvironment);
}

async function setupEnvironmentForPhase(
  node: AppNode,
  environment: Environment,
  edges: Edge[]
) {
  environment.phases[node.id] = { inputs: {}, outputs: {} };
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.target === input.name
    );
    if (!connectedEdge) {
      console.error("Missing edge for input ", input.name, node.id);
    }

    const outputValue =
      environment.phases[connectedEdge?.source!].outputs[
        connectedEdge?.sourceHandle!
      ];
    environment.phases[node.id].inputs[input.name] = outputValue;
  }

  //Get input value from output in the environment
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  LogCollector: LogCollector
): ExecutionEnvironment<any> {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),
    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),
    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value;
    },
    log: LogCollector,
  };
}

async function cleanUpEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser
      .close()
      .catch((err) => console.error("Cannot close browser, reason: ", err));
  }
}
