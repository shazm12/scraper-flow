import { ExecutionEnvironment } from "@/types/executor";
import { ScrollToElementTask } from "../task/scrollToElement";

export async function scrollToElementExec(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
  try {
    const webPage = environment.getInput("Web Page");
    if (!webPage) {
      environment.log.error("Web Page is not provided");
      return false;
    }

    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Selector is not provided");
      return false;
    }

    await environment.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error("Element not found");
      }

      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top });
    }, selector);

    environment.log.info("Scrolled to Element Successfully");
    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
