"use client";
import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function SaveButton({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();

  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Flow Saved Sucessfully", { id: "save-workflow" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "save-workflow" });
    },
  });

  return (
    <Button
      disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefination = JSON.stringify(toObject());
        toast.loading("Saving workflow...", { id: "save-workflow" });
        saveMutation.mutate({
          id: workflowId,
          defination: workflowDefination,
        });
      }}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
}

export default SaveButton;
