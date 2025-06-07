import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertyToJSONTask } from "../task/addPropertyToJSON";
import { NavigateURLTask } from "../task/navigateURL";

export async function NavigateURLExec(
  environment: ExecutionEnvironment<typeof NavigateURLTask>
): Promise<boolean> {
  try {
    const webPage = environment.getInput("Web Page");
    if (!webPage) {
      environment.log.error("Web page is not provided");
      return false;
    }
    const url = environment.getInput("URL");

    if (!url) {
      environment.log.error("URL is not provided");
      return false;
    }
    environment.getPage()!.goto(url);
    environment.log.info(`Visited ${url}`);
    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
