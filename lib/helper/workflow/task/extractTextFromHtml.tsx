import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, TextIcon } from "lucide-react";
import React from "react";

export const ExtractTextFromHtmlTask = {
  type: TaskType.EXTRACT_TEXT_FROM_HTML,
  label: "Extract Text From HTML",
  icon: (props: LucideProps) => (
    <TextIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "selector",
      type: TaskParamType.STRING,
      required: false,
    },
  ] as const,
  outputs: [
    {
      name: "Extracted Text",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
