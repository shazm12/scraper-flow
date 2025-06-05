import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromHtmlTask } from "../task/extractTextFromHtml";
import * as cheerio from "cheerio";
import { ClickElementTask } from "../task/clickElement";
import { DeliverViaWebhookTask } from "../task/deliverViaWebhook";

export async function deliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  try {
    const targetUrl = environment.getInput("Target URL");
    if (!targetUrl) {
      environment.log.error("selector is not provided");
      return false;
    }

    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("selector is not provided");
      return false;
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const statusCode = response.status;

    if (statusCode !== 200) {
      environment.log.error(
        `Error: Received status code ${statusCode} from response`
      );
      return false;
    }
    environment.log.info("Request to webhook sent successfully");
    const responseBody = await response.json();
    environment.log.info(JSON.stringify(responseBody, null, 4));
    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
