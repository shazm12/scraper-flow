import { TaskParamType, TaskType } from '@/types/task';
import { LucideProps, TextIcon } from 'lucide-react';
import React from 'react'

export const ExtractTextFromHtml = {
    type: TaskType.EXTRACT_TEXT_FROM_HTML,
    label: "Extract Text From HTML",
    icon: (props: LucideProps) => ( <TextIcon className="stroke-rose-400" {...props} /> ),
    isEntryPoint: false,
    inputs: [
        {
            name: "Html",
            type: TaskParamType.STRING,
            required: true,
            variant: "textarea"
        },
        {
            name: "selector",
            type: TaskParamType.STRING,
            required: true,
        },
    ],
    outputs: [{ 
        name: "Extracted Text", 
        type: TaskParamType.STRING 
    }]
};
