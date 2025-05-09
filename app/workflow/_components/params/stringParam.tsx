import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ParamProps } from "@/types/task";
import React, { useEffect, useId, useState } from "react";

function StringParam({ param, value, updateNodeParamValue, disabled }: ParamProps) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  },[value]);

  let Component: any = Input;

  if(param?.variant === "textarea") {
    Component = Textarea;
  }

  const id = useId();


  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Component
        className="text-xs"
        id={id}
        disabled={disabled}
        value={internalValue}
        placeholder="Enter value..."
        onChange={(e: any) => setInternalValue(e.target.value)}
        onBlur={(e: any) => updateNodeParamValue(e.target.value)}
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
}

export default StringParam;
