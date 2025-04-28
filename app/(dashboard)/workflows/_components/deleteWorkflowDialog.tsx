"use client";

import { deleteWorkflow } from '@/actions/workflows/deleteWorkflow';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { toast } from 'sonner';

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    workflowName: string;
    workflowId: string;
}

function DeleteWorkflowDialog({open, setOpen, workflowName, workflowId }: Props) {
    
    const [confirmText, setConfirmText] = useState("");
    const deleteMutation = useMutation({
        mutationFn: deleteWorkflow,
        onSuccess: () => {
            toast.success("Workflow Deleted", { id: workflowId });
            setConfirmText("");
        },
        onError: () => {
            toast.error("Something went wrong!", { id: workflowId });
        }

    })
    return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    <p>If you are sure, enter , <b>{workflowName}</b> to confirm:</p>
                    <Input
                        className="w-full my-4"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                    />
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmText("")}>
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                    disabled={confirmText !== workflowName || deleteMutation.isPending}
                    onClick={(e) => {
                        e.stopPropagation();
                        toast.loading("Deleting Workflow...", { id: workflowId });
                        deleteMutation.mutate(workflowId);
                    }}
                >
                    Delete
                </AlertDialogAction>  
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteWorkflowDialog;
