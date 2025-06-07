"use client";
import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParamProps } from "@/types/task";
import { SelectLabel } from "@radix-ui/react-select";
import { useQuery } from "@tanstack/react-query";
import React, { useId } from "react";



function CredentialParam({ param, updateNodeParamValue, value }: ParamProps) {
  const id = useId();
  const query = useQuery({
    queryKey: ["credentials-for-user"],
    queryFn: () => GetCredentialsForUser(),
    refetchInterval: 1000,
  })
  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select onValueChange={value => updateNodeParamValue(value)} defaultValue={value}>
        <SelectTrigger className="w=full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Credentials</SelectLabel>
            {query.data?.map((cred) => (
              <SelectItem key={cred.id} value={cred.id}>
                {cred.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default CredentialParam;
