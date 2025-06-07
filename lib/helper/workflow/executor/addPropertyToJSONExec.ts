import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertyToJSONTask } from "../task/addPropertyToJSON";

export async function addPropertyToJSONExec(
  environment: ExecutionEnvironment<typeof AddPropertyToJSONTask>
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

    const propValue = environment.getInput("Property Value");

    if (!propValue) {
      environment.log.error("Property value is not provided");
      return false;
    }
    const jsonObj = JSON.parse(jsonString);
    jsonObj[propName] = propValue;
    environment.setOutput("Updated JSON", jsonObj);
    environment.log.info("Property Key and Value Added to JSON successfully");
    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
