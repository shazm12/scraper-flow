import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromHtmlTask } from "../task/extractTextFromHtml";
import * as cheerio from "cheerio";

export async function extractTextFromHTMLExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromHtmlTask>
): Promise<boolean> {
  const selector = environment.getInput("selector");
  if (!selector) {
    environment.log.error("selector is not provided");
    return false;
  }

  const html = environment.getInput("Html");

  if (!html) {
    environment.log.error("Html could not be extracted!");
    return false;
  }

  try {
    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      environment.log.error("Element is not provided");
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      environment.log.error("Text could not be extracted!");
      return false;
    }
    environment.setOutput("Extracted Text", extractedText);
    environment.log.info("Text Extracted  successfully");
    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
