import puppeteer from "puppeteer";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/launchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website URL");
    const browser = await puppeteer.launch({
      headless: true,
    });
    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.log.info("Browser started successfully");
    environment.setPage(page);
    environment.log.info(`Opened page at: ${websiteUrl}`);
    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
