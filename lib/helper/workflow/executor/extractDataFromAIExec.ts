import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "../task/extractDataWithAI";
import { prisma } from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";

export async function extractDataFromAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credential = environment.getInput("Credentials");
    if (!credential) {
      environment.log.error("credential is not provided");
      return false;
    }

    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("prompt is not provided");
      return false;
    }

    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("content is not provided");
      return false;
    }

    // Get credentials from DB
    const credentialData = await prisma.credential.findUnique({
      where: {
        id: credential,
      },
    });

    if (!credentialData) {
      environment.log.error("credential not found");
      return false;
    }

    const plainCredentialValue = symmetricDecrypt(credentialData.value);

    if (!plainCredentialValue) {
      environment.log.error("Could not decrypt credentials");
      return false;
    }

    const mockExtractedData = {
      userNameSelector: "username",
      passwordSelector: "password",
      loginSelector: "body > div > form > input.btn.btn-primary"
    };

    environment.setOutput(
      "Extracted Data",
      JSON.stringify(mockExtractedData, null, 4)
    );

    environment.log.info("Text Extracted  successfully");
    return true;
  } catch (error: any) {
    environment.log.error(error);
    return false;
  }
}
