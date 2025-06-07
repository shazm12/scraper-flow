import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromHtmlTask } from "../task/extractTextFromHtml";
import * as cheerio from "cheerio";
import { ClickElementTask } from "../task/clickElement";
import { ReadPropertyFromJSONTask } from "../task/readPropertyFromJSON";

export async function readPropertyFromJSONExec(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJSONTask>
): Promise<boolean> {
  try {
    const jsonString = environment.getInput("JSON");
    if (!jsonString) {
      environment.log.error("Json Object is not provided");
      return false;
    }   
    const propName = environment.getInput("Property Name");

    if (!propName) {
      environment.log.error("Property name is not provided");
      return false;
    }

    const jsonObj = JSON.parse(jsonString);
    const propValue = jsonObj[propName];

    if(propValue === undefined) {
      environment.log.error("Value not found in JSON Obj");
      return false;
    }
    environment.log.info("Value Extracted successfully");
    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
