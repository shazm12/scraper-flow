import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "../../waitFor";

export async function extractTextFromHTMLExecutor(
  environment: ExecutionEnvironment<any>
): Promise<boolean> {
  const websiteUrl = environment.getInput("Website URL");

  try {
    await waitFor(3000);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
