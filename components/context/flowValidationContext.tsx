import { AppNodeMissingInputs } from "@/types/task"
import React, { createContext, Dispatch, SetStateAction, useState } from "react";

type FlowValidationContextType = {
    invalidInputs: AppNodeMissingInputs[];
    setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
    clearErrors(): void
};


export const FLowValidationContext = createContext<FlowValidationContextType | null>(null);

export function FlowValidationContextProvider({ children }: { children: React.ReactNode }) {
    
    const [invalidInputs, setInvalidInputs ] = useState<AppNodeMissingInputs[]>([]);
    
    const clearErrors = () => {
        setInvalidInputs([]);
    }
    
    return <FLowValidationContext.Provider value={{invalidInputs ,setInvalidInputs, clearErrors }}>
        { children }
    </FLowValidationContext.Provider>
}