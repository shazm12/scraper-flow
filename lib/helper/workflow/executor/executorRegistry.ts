import { TaskType } from "@/types/task";
import { LaunchBrowserExecutor } from "./launchBrowserExec";
import { pageToHtmlExecutor } from "./pageToHTMLExec";
import { extractTextFromHTMLExecutor } from "./extractTextFromHTMLExec";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { fillInputExecutor } from "./fillInputExecutor";
import { clickElmentExecutor } from "./clickELementExec";

type ExecutorFn<T extends WorkflowTask>  = (environment: ExecutionEnvironment<T>) => Promise<boolean>

type RegistryType  ={
    [K in TaskType] : ExecutorFn<WorkflowTask & {type : K}>;
}

export const ExecutorRegistry: RegistryType = {
    LAUNCH_BROWSER: LaunchBrowserExecutor,
    PAGE_TO_HTML: pageToHtmlExecutor,
    EXTRACT_TEXT_FROM_HTML: extractTextFromHTMLExecutor,
    FILL_INPUT: fillInputExecutor,
    CLICK_ELEMENT: clickElmentExecutor
}