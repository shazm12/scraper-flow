import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskRegistry } from '@/lib/helper/workflow/task/registry';
import { TaskType } from '@/types/task';
import { CoinsIcon, GripVerticalIcon } from 'lucide-react';
import React from 'react'

function NodeHeader({ taskType }: { taskType: TaskType }) {
  const task = TaskRegistry[taskType];
    return (
    <div className="flex items-center justify-around gap-2 p-2">
        <task.icon size={16} />
        <p className="text-xs font-bold uppercase text-muted-foreground">
            {task.label}
        </p>
        <div className="flex gap-1 items-center">
            {task.isEntryPoint && <Badge>Entry Point</Badge>}
            <Badge className="gap-2 flex items-center text-xs">
                <CoinsIcon size={16} />
                TODO
            </Badge>
            <Button variant={"ghost"} size={"icon"} className="drag-handle cursor-grab">
                <GripVerticalIcon />
            </Button>
        </div>
      
    </div>
  )
}

export default NodeHeader;
