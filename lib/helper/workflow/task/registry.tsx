import { ExtractTextFromHtml } from "./extractTextFromHtml";
import { LaunchBrowserTask } from "./launchBrowser";
import { PageToHtmlTask } from "./pageToHtml";

export const TaskRegistry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_HTML: ExtractTextFromHtml
};

