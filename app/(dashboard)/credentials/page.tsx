import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldIcon, ShieldOffIcon } from "lucide-react";
import React, { Suspense } from "react";
import CreateCredentialsDialog from "./_components/createCredentialDialog";

function CredentialsPage() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        <CreateCredentialsDialog triggerText="Create your first credential"/>
      </div>

      <div className="h-full py-6 space-y-8">
        <Alert>
          <ShieldIcon className="h-4 w-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>
            All information is securely encrypted, ensuring you data is safe
          </AlertDescription>
        </Alert>

        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  );
}

export default CredentialsPage;

async function UserCredentials() {
  const credentials = await GetCredentialsForUser();

  if (!credentials) {
    return <div>Something went wrong</div>;
  }

  if (credentials.length == 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center">
            <ShieldOffIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-bold">No Credentials created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first crednetial
            </p>
          </div>
        </div>
        <CreateCredentialsDialog triggerText="Create your first credential"/>
      </Card>
    );
  }

  return <div></div>;
}
