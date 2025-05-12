import { useContext } from "react"
import { FLowValidationContext } from "../context/FlowValidationContext"

export default function useFlowValidation() {
    const context = useContext(FLowValidationContext);
    if(!context) {
        throw new Error("useFlowValidation is required to be used!");
    }
    return context;
}