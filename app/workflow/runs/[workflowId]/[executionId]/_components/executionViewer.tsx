"use client";
import { getWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, CircleDashedIcon, ClockIcon, CoinsIcon, LucideIcon, WorkflowIcon } from "lucide-react";
import React, { ReactNode } from "react";

type ExecutionData = Awaited<ReturnType<typeof getWorkflowExecutionWithPhases>>;

function ExecutionViewer({ initialData }: { initialData: ExecutionData }) {
  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => getWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });
  return (
    <div className="flex w-full h-full">
      <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
        <div className="py-4 px-2">
          <ExecutionLabel
            Icon={CircleDashedIcon}
            label="Status"
            value={query?.data?.status}
          />
          <ExecutionLabel
            Icon={CalendarIcon}
            label="Started At"
            value={
              <span className="lowercase">
                {query?.data?.startedAt
                  ? formatDistanceToNow(new Date(query?.data?.startedAt), {
                      addSuffix: true,
                    })
                  : "-"}
              </span>
            }
          />
          <ExecutionLabel
            Icon={ClockIcon}
            label="Duration"
            value={"TODO"}
          />
          <ExecutionLabel
            Icon={CoinsIcon}
            label="Credits Consumed"
            value={"TODO"}
          />
        </div>
        <Separator />
        <div className="flex justify-center items-center py-2 px-4">
            <div className="text-muted-foreground flex items-center gap-2">
                <WorkflowIcon size={20} className="stroke-muted-foreground" />
                <span className="font-semibold">
                    Phases
                </span>
            </div>
        </div>
        <Separator />
        <div className="overflow-auto h-full px-2 py-4">
            {query?.data?.phases.map((phase,index) => (
                <Button key={phase.id} variant={"ghost"} className="w-full justify-between">
                  <div className="flex items-center gap -2">
                      <p className="font-semibold">{phase.name}</p>
                      <Badge variant={"outline"}>
                        {index + 1 }
                      </Badge>
                  </div>
                </Button>
            ))}
        </div>
      </aside>
    </div>
  );
}

function ExecutionLabel({
  Icon,
  label,
  value,
}: {
  Icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon size={20} className="stroke-muted-foreground" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex gap-2 items-center">
        {value}
      </div>
    </div>
  );
}

export default ExecutionViewer;
