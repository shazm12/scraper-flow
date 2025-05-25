"use client";

import { PublishWorkflow } from "@/actions/workflows/publishWorkflow";
import { RunWorkFlow } from "@/actions/workflows/runWorkFlow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon, UploadIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function PublishButton({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();

  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow Published", { id: workflowId });
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId });
    },
  });

  return (
    <Button
      variant={"outline"}
      disabled={mutation.isPending}
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate();
        if (!plan) {
          // Client Side Validation
          return;
        }
        toast.loading("Publishing Workflow...", { id: workflowId });
        mutation.mutate({
          id: workflowId,
          flowDefination: JSON.stringify(toObject()),
        });
      }}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      Publish
    </Button>
  );
}

export default PublishButton;
