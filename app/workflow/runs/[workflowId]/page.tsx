import React, { Suspense } from "react";
import TopBar from "../../_components/topbar/topBar";
import GetWorkflowExecutions from "@/actions/workflows/getWorkflowExecutions";
import { InboxIcon, Loader2Icon } from "lucide-react";
import ExecutionsTable from "./_components/executionsTable";

export default function ExecutionPage({ params }: { params: { workflowId: string } }) {
  return (
    <div className="h-full w-full overflow-auto">
      <TopBar
        workflowId={params.workflowId}
        title="All Runs"
        subtitle="List of all your runs"
        hideButtons
      />
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Loader2Icon size={30} className="animate-spin stroke-primary" />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  );
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);
  if (!executions) return <div>No Data</div>;
  if(executions.length === 0) {
    return (
        <div className="container w-full py-8">
            <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
                <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center" >
                    <InboxIcon size={40} className="stroke-primary" />
                </div>
                <div className="flex flex-col gap-1 text-center">
                    <p className="font-bold">No runs have been triggered yet</p>
                    <p className="text-sm text-muted-foreground">You can trigger a new run from the editor page</p>
                </div>
            </div>
        </div>
    )
  }
  
  return(
  <ExecutionsTable workflowId={workflowId} initialData={executions} />
  );
}


