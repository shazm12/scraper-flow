import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/fillInput";
import { TaskRegistry } from "../task/registry";

export async function fillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if(!selector) {
      environment.log.error("input->selector not defined");
    }
    const value = environment.getInput("Value");
    if(!selector) {
      environment.log.error("input->value not defined");
    }
    await environment.getPage()!.type(selector,value);
    environment.log.info(`Successfully entered input`);
    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
