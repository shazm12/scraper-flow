import { TaskParamType, TaskType } from "@/types/task";
import { GlobeIcon, LucideProps } from "lucide-react";


export const LaunchBrowserTask = {
    type: TaskType.LAUNCH_BROWSER,
    label: "Launch Browser",
    icon: (props: LucideProps) => ( <GlobeIcon className="stoke-gray-400" {...props} /> ),
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
};