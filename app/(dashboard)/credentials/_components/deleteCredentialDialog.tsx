"use client";

import { DeleteCredential } from '@/actions/credentials/deleteCredential';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { XIcon } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';

interface Props {
    name: string;
}

function DeleteCredentialDialog({ name }: Props) {
    
    const [confirmText, setConfirmText] = useState("");
    const [open , setOpen ] = useState(false);
    const deleteMutation = useMutation({
        mutationFn: DeleteCredential,
        onSuccess: () => {
            toast.success("Credential deleted sucessfully", { id: name });
            setConfirmText("");
        },
        onError: () => {
            toast.error("Something went wrong!", { id: name });
        }

    })
    return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
            <Button variant={"destructive"} size={"icon"}>
                <XIcon size={18} />
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    If you delete this credential, you will not be able to recover it.
                </AlertDialogTitle>
                <AlertDialogDescription>
                    <p>If you are sure, enter , <b>{name}</b> to confirm:</p>
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
                    disabled={confirmText !== name || deleteMutation.isPending}
                    onClick={(e) => {
                        e.stopPropagation();
                        toast.loading("Deleting credential...", { id: name });
                        deleteMutation.mutate(name);
                    }}
                >
                    Delete
                </AlertDialogAction>  
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCredentialDialog;
