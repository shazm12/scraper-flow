import { TaskType } from "@/types/task";
import { ExtractTextFromHtmlTask } from "./extractTextFromHtml";
import { LaunchBrowserTask } from "./launchBrowser";
import { PageToHtmlTask } from "./pageToHtml";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./fillInput";
import { ClickElementTask } from "./clickElement";
import { WaitForElementTask } from "./waitForElement";
import { DeliverViaWebhookTask } from "./deliverViaWebhook";
import { ExtractDataWithAITask } from "./extractDataWithAI";
import { ReadPropertyFromJSONTask } from "./readPropertyFromJSON";
import { AddPropertyToJSONTask } from "./addPropertyToJSON";
import { NavigateURLTask } from "./navigateURL";

type Registry = {
    [K in  TaskType]: WorkflowTask & {type: K }
}

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_HTML: ExtractTextFromHtmlTask,
    FILL_INPUT: FillInputTask,
    CLICK_ELEMENT: ClickElementTask,
    WAIT_FOR_ELEMENT: WaitForElementTask,
    DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
    EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
    READ_PROPERTY_FROM_JSON: ReadPropertyFromJSONTask,
    ADD_PROPERTY_TO_JSON: AddPropertyToJSONTask,
    NAVIGATE_URL: NavigateURLTask
};

