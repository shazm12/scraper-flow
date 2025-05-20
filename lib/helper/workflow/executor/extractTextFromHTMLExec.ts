import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "../../waitFor";
import { ExtractTextFromHtmlTask } from "../task/extractTextFromHtml";
import * as cheerio from "cheerio";

export async function extractTextFromHTMLExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromHtmlTask>
): Promise<boolean> {
  const selector = environment.getInput("selector");
  if(!selector) {
    return false;
  }

  const html = environment.getInput("Html");

  const $ = cheerio.load(html);
  const element = $(selector);

  if(!element) {
    console.error("Element not found");
    return false;
  }

  const extractedText = $.text(element);
  if(!extractedText) {
    console.error("Element has no text");
    return false;
  }

  environment.setOutput("Extracted Text",extractedText);


  if(!html) {
    return false;
  }



  try {
    await waitFor(3000);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
