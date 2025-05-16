import { getWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import TopBar from "@/app/workflow/_components/topbar/topBar";
import { auth } from "@clerk/nextjs/server";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";
import ExecutionViewer from "./_components/executionViewer";

function ExecutionViewerPage({
  params,
}: {
  params: { workflowId: string; executionId: string };
}) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <TopBar
        workflowId={params.workflowId}
        title="Workflow Run Details"
        subtitle={`Run ID: ${params.executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense fallback={
          <div className="flex w-full justify-center items-center">
            <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
          </div>
        }>
          <ExectionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  );
}

async function ExectionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {

  const {userId} = auth();
  if(!userId) {
    return <div>Unauthenticated</div>;
  }


  const workflowExecution = await getWorkflowExecutionWithPhases(executionId);
  if(!workflowExecution) {
    return <div>Not Found</div>;
  }


  return (
    <ExecutionViewer initialData={workflowExecution} />
  );
}

export default ExecutionViewerPage;
