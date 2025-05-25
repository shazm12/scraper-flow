import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/pageToHtml";

export async function pageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    environment.setOutput("Html", html);
    environment.log.info("Page retreived successfully");
    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
