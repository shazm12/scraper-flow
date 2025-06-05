import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromHtmlTask } from "../task/extractTextFromHtml";
import * as cheerio from "cheerio";
import { WaitForElementTask } from "../task/waitForElement";

export async function waitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("selector");
    if (!selector) {
      environment.log.error("input->selector is not provided");
      return false;
    }

    const visbility = environment.getInput("visibility");
    if (!visbility) {
      environment.log.error("input->visibility is not provided");
      return false;
    }

    await environment.getPage()!.waitForSelector(selector, { visible: visbility === "visible", hidden: visbility === "hidden" });
    environment.log.info(`Element ${selector} became ${visbility}`);
    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
