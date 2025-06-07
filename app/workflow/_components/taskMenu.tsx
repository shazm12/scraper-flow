"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { TaskRegistry } from '@/lib/helper/workflow/task/registry';
import { TaskType } from '@/types/task';
import React from 'react'



function TaskMenu() {
  return (
    <aside className="w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto">
        <Accordion type="multiple" className="w-full" defaultValue={["extraction", "interactions","timing","results", "storage"]}>
            <AccordionItem value="extraction">
                <AccordionTrigger className="font-bold">Data Extraction</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                    <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
                    <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_HTML} />
                    <TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="interactions">
                <AccordionTrigger className="font-bold">User Interaction</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                    <TaskMenuBtn taskType={TaskType.FILL_INPUT} />    
                    <TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />                   
                    <TaskMenuBtn taskType={TaskType.NAVIGATE_URL} />                   
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="timing">
                <AccordionTrigger className="font-bold">Timing Controls</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                    <TaskMenuBtn taskType={TaskType.WAIT_FOR_ELEMENT} />    
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="storage">
                <AccordionTrigger className="font-bold">Data Storage</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                    <TaskMenuBtn taskType={TaskType.READ_PROPERTY_FROM_JSON} />    
                    <TaskMenuBtn taskType={TaskType.ADD_PROPERTY_TO_JSON} />    
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="results">
                <AccordionTrigger className="font-bold">Result Delivery</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                    <TaskMenuBtn taskType={TaskType.DELIVER_VIA_WEBHOOK} />    
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </aside>
  )
}

export default TaskMenu;


function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
    const task = TaskRegistry[taskType];

    const onDragStart = (event: React.DragEvent, type: TaskType) => {
        event.dataTransfer.setData("application/reactflow", type);
        event.dataTransfer.effectAllowed = "move";
    };


    return(
        <Button variant={"secondary"} className="flex justify-between items-center gap-2 border w-full" draggable onDragStart={(event) => onDragStart(event,taskType)}>
            <div className="flex gap-2 items-center">
                <task.icon size={20} />
                {task.label}
            </div>
        </Button>
    )
}