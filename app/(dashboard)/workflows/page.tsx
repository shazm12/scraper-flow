import { GetWorkflowsForUser } from '@/actions/workflows/getWorkflowsWithUser';
import { Skeleton } from '@/components/ui/skeleton';
import React, { Suspense } from 'react'
import {Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InboxIcon } from 'lucide-react';
import CreateWorkflowDialog from './_components/createWorkflowDialog';
import WorkflowCard from './_components/WorkflowCard';

function WorkflowPage() {
  return (
    <div className="flex-1 flex flex-col h-full">
        <div className="flex justify-between">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold">Workflows</h1>
                <p className="text-muted-foreground">Manage your workflows</p>
            </div>
            <CreateWorkflowDialog />
        </div>
        <div className="h-full py-6">
            <Suspense fallback={<UserWorkflowSkeleton />}>
                <UserWorkflows />
            </Suspense>
        </div>

      
    </div>
  );
}

function UserWorkflowSkeleton () {
    return (
        <div className="space-y-2">
            {
                [1,2,3,4].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                ))
            }
        </div>
    )
}


async function UserWorkflows() {
    
    const workflows = await GetWorkflowsForUser();

    if(!workflows) {
       return ( 
       <Alert variant={"destructive"}>
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle> 
        <AlertDescription>Something Went Wrong</AlertDescription>
       </Alert>
    );
    }

    if(workflows.length === 0) {
        return <div className="flex flex-col gap-4 h-full items-center justify-center">
            <div className="rounded-full bg-ascent w-20 h-20 flex items-center justify-center">
                <InboxIcon size={40} className="stroke-primary" />
            </div>
            <div className="flex- flex-col gap-1 text-center">
                <p className="font-bold">No workflow created yet</p>
                <p className="text-sm text-muted-foreground">Click the button below to create your first workflow</p>
            </div>
            <CreateWorkflowDialog triggerText="Create your first workflow" />
        </div>
    }

    return (<div className="grid grid-cols-1">
       {workflows.map((workflow,idx) =>(
            <WorkflowCard key={idx} workflow={workflow} />
       ))}
    </div>);
}






export default WorkflowPage;
