import { TaskParamType, TaskType } from "@/types/task";
import { CodeIcon, LucideProps } from "lucide-react";


export const PageToHtmlTask = {
    type: TaskType.PAGE_TO_HTML,
    label: "Page To HTML",
    icon: (props: LucideProps) => ( <CodeIcon className="stroke-gray-400" {...props} /> ),
    isEntryPoint: false,
    inputs: [
        {
            name: "Web Page",
            type: TaskParamType.BROWSER_INSTANCE,
            required: true,
        },
    ],
    outputs:[
        {
            name: "Html",
            type: TaskParamType.STRING
        },
        {
            name: "Webpage",
            type: TaskParamType.BROWSER_INSTANCE
        }
    ]
}; 