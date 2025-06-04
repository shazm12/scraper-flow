import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { EyeIcon, LucideProps, MousePointerClick } from "lucide-react";
import React from "react";

export const WaitForElementTask = {
  type: TaskType.WAIT_FOR_ELEMENT,
  label: "Wait for Element",
  icon: (props: LucideProps) => (
    <EyeIcon className="stroke-amber-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Webpage",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true
    },
    {
      name: "selector",
      type: TaskParamType.STRING,
      required: false,
    },
      {
      name: "visibility",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "Visible", value:"visible" },
        { label: "Hidden", value:"hidden" },
      ]
    },
  ] as const,
  outputs: [
    {
      name: "Webpage",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
} satisfies WorkflowTask;
