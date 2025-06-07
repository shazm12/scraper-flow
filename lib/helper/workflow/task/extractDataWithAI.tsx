import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { BrainIcon, LucideProps, MousePointerClick } from "lucide-react";
import React from "react";

export const ExtractDataWithAITask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,
  label: "Extract Data with AI",
  icon: (props: LucideProps) => (
    <BrainIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 4,
  inputs: [
    {
      name: "Content",
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: false,
    },
    {
      name: "Prompt",
      type: TaskParamType.STRING,
      required: false,
      variant: "textarea"
    },
  ] as const,
  outputs: [
    {
      name: "Extracted Data",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
