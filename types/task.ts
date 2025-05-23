export enum TaskType {
    LAUNCH_BROWSER="LAUNCH_BROWSER",
    PAGE_TO_HTML="PAGE_TO_HTML",
    EXTRACT_TEXT_FROM_HTML="EXTRACT_TEXT_FROM_HTML"
}

export enum TaskParamType {
    STRING="STRING",
    BROWSER_INSTANCE="BROWSER_INSTANCE"
}


export interface TaskParam {
    name: string;
    type: TaskParamType;
    helperText?: string;
    required?: boolean;
    hideHandle?: boolean;
    [key: string]: any;
}

export interface ParamProps {
    param: TaskParam;
    value: string;
    updateNodeParamValue: (newValue: string) => void;
    disabled?: boolean
}

export type AppNodeMissingInputs = {
    nodeId: string;
    inputs: string[]
};
