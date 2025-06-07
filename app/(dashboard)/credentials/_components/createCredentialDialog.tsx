"use client";
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, ShieldEllipsisIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCredentialsSchema, createCredentialsSchemaType  } from '@/schema/credential';
import { CreateCredential } from '@/actions/credentials/createCredential';

function CreateCredentialsDialog({triggerText}:{triggerText?: string}) {

    const [open, setOpen] = useState(false);
    
    const form = useForm<createCredentialsSchemaType>({
        resolver: zodResolver(createCredentialsSchema),
        defaultValues: {}
    });


    const { mutate, isPending } = useMutation({
        mutationFn: CreateCredential,
        onSuccess: () => {
            toast.success("Credential Created", { id: "create-credential" });
            form.reset();
            setOpen(false);
            
        },
        onError: () => {
            toast.error("Failed to create Credential",{ id: "create-credential"});
        }
    })

    const onSubmit = useCallback((
        values: createCredentialsSchemaType
    ) => {
        toast.loading("Creating Credential...", { id:"create-credential" });
        mutate(values);
    },[mutate]);
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{triggerText ?? "Create Credential"}</Button>
            </DialogTrigger>
            <DialogContent className="px-0">
                <CustomDialogHeader icon={ShieldEllipsisIcon} title="Create Credential" />
                <div className="p-6">
                    <Form {...form}>
                        <form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-1 items-center">
                                            Name
                                            <p className="text-xs text-primary">(required)</p>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter a unique and description name for the credential
                                            This name will be used to identify the credential
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-1 items-center">
                                            Value
                                            <p className="text-xs text-primary">(required)</p>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea className="resize-none" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                           Enter the value associated with this credential
                                           <br /> This value will be safely encrypted and stored
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isPending}> 
                                {!isPending && "Proceed"} 
                                {isPending && <Loader2 className='animate-spin' />}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCredentialsDialog;
