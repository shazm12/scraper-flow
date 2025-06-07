import { TaskType } from "@/types/task";
import { LaunchBrowserExecutor } from "./launchBrowserExec";
import { pageToHtmlExecutor } from "./pageToHTMLExec";
import { extractTextFromHTMLExecutor } from "./extractTextFromHTMLExec";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { fillInputExecutor } from "./fillInputExecutor";
import { clickElmentExecutor } from "./clickElementExec";
import { waitForElementExecutor } from "./WaitForElementExec";
import { deliverViaWebhookExecutor } from "./deliverViaWebhookExec";
import { extractDataFromAIExecutor } from "./extractDataFromAIExec";
import { readPropertyFromJSONExec } from "./readPropertyFromJSONExec";
import { addPropertyToJSONExec } from "./addPropertyToJSONExec";
import { NavigateURLExec } from "./navigateURLExec";
import { scrollToElementExec } from "./scrollToElementExec";

type ExecutorFn<T extends WorkflowTask>  = (environment: ExecutionEnvironment<T>) => Promise<boolean>

type RegistryType  ={
    [K in TaskType] : ExecutorFn<WorkflowTask & {type : K}>;
}

export const ExecutorRegistry: RegistryType = {
    LAUNCH_BROWSER: LaunchBrowserExecutor,
    PAGE_TO_HTML: pageToHtmlExecutor,
    EXTRACT_TEXT_FROM_HTML: extractTextFromHTMLExecutor,
    FILL_INPUT: fillInputExecutor,
    CLICK_ELEMENT: clickElmentExecutor,
    WAIT_FOR_ELEMENT: waitForElementExecutor,
    DELIVER_VIA_WEBHOOK: deliverViaWebhookExecutor,
    EXTRACT_DATA_WITH_AI: extractDataFromAIExecutor,
    READ_PROPERTY_FROM_JSON: readPropertyFromJSONExec,
    ADD_PROPERTY_TO_JSON: addPropertyToJSONExec,
    NAVIGATE_URL: NavigateURLExec,
    SCROLL_TO_ELEMENT: scrollToElementExec
}