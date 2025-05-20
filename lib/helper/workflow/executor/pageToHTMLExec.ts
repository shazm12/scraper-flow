import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "../../waitFor";
import { PageToHtmlTask } from "../task/pageToHtml";


export async function pageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    environment.setOutput("Html", html);
    await waitFor(3000);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
