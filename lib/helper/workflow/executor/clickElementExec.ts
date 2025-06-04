import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromHtmlTask } from "../task/extractTextFromHtml";
import * as cheerio from "cheerio";
import { ClickElementTask } from "../task/clickElement";

export async function clickElmentExecutor(
  environment: ExecutionEnvironment<typeof ClickElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("selector");
    if (!selector) {
      environment.log.error("selector is not provided");
      return false;
    }

    await environment.getPage()!.click(selector);
    environment.log.info("Text Extracted  successfully");
    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
