import { LucideProps } from "lucide-react"
import { TaskParam, TaskType } from "./task"
import { AppNode } from "./appNode";

export enum WorkflowStatus {
    DRAFT="DRAFT",
    PUBLISHED="PUBLISHED"
}

export type WorkflowTask = {
    label: string;
    icon: React.FC<LucideProps>;
    type: TaskType;
    isEntryPoint?: boolean;
    inputs: TaskParam[];
    outputs: TaskParam[];
    credits: number;

}


export type WorkflowExecutionPLanPhase = {
    phase: number;
    nodes: AppNode[];
};


export type WorkflowExecutionPlan = WorkflowExecutionPLanPhase[];

export enum ExecutionStatus {
    PENDING="PENDING",
    RUNNING="RUNNING",
    COMPLETED="COMPLETED",
    FAILED="FAILED"
}

export enum WorkflowExecutionTrigger {
    MANUAL="MANUAL",
    CRON="CRON"
}

export enum WorkflowExecutionStatus {
    PENDING="PENDING",
    RUNNING="RUNNING",
    COMPLETED="COMPLETED",
    FAILED="FAILED"
}

export enum ExecutionPhaseStatus {
    CREATED="CREATED",
    PENDING="PENDING",
    RUNNING="RUNNING",
    COMPLETED="COMPLETED",
    FAILED="FAILED"
}


