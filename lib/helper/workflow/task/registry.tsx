import { TaskType } from "@/types/task";
import { ExtractTextFromHtmlTask } from "./extractTextFromHtml";
import { LaunchBrowserTask } from "./launchBrowser";
import { PageToHtmlTask } from "./pageToHtml";
import { WorkflowTask } from "@/types/workflow";

type Registry = {
    [K in  TaskType]: WorkflowTask & {type: K }
}

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_HTML: ExtractTextFromHtmlTask
};

