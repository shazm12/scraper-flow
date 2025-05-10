import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps } from "lucide-react";


export const LaunchBrowserTask = {
    type: TaskType.LAUNCH_BROWSER,
    label: "Launch Browser",
    icon: (props: LucideProps) => ( <GlobeIcon className="stroke-gray-400" {...props} /> ),
    credits: 5,
    isEntryPoint: true,
    inputs: [
        {
            name: "Website URL",
            type: TaskParamType.STRING,
            helperText: "eg: https://google.com",
            required: true,
            hideHandle: true
        },
    ],
    outputs: [{ name: "Web Page", type: TaskParamType.BROWSER_INSTANCE }]

} satisfies WorkflowTask;