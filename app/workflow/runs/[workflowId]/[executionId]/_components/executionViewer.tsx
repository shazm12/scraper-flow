"use client";
import { getWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DatesToDurationString } from "@/lib/helper/dates";
import { GetPhasesTotalCost } from "@/lib/helper/phases";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";
import React, { ReactNode, useState } from "react";

type ExecutionData = Awaited<ReturnType<typeof getWorkflowExecutionWithPhases>>;

function ExecutionViewer({ initialData }: { initialData: ExecutionData }) {
  const [selectedPhase, setSelectedPhase ] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => getWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  const duration = DatesToDurationString(
    query?.data?.completedAt,
    query?.data?.startedAt
  );

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: selectedPhase !== null,
    queryFn: () => GetWorkflowPhaseDetails(selectedPhase!)
  })

  const creditsConsumed = GetPhasesTotalCost(query?.data?.phases || []);
  
  const isRunning = query?.data?.status === WorkflowExecutionStatus.RUNNING;
  
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
          <ExecutionLabel Icon={ClockIcon} label="Duration" value={duration ? duration: <Loader2Icon className="animate-spin" size={20} />} />
          <ExecutionLabel
            Icon={CoinsIcon}
            label="Credits Consumed"
            value={creditsConsumed}
          />
        </div>
        <Separator />
        <div className="flex justify-center items-center py-2 px-4">
          <div className="text-muted-foreground flex items-center gap-2">
            <WorkflowIcon size={20} className="stroke-muted-foreground" />
            <span className="font-semibold">Phases</span>
          </div>
        </div>
        <Separator />
        <div className="overflow-auto h-full px-2 py-4">
          {query?.data?.phases.map((phase, index) => (
            <Button
              key={phase.id}
              variant={selectedPhase === phase.id ? "secondary" : "ghost"}
              className="w-full justify-between"
              onClick={() => {
                if(isRunning) return;
                setSelectedPhase(phase.id)
              }}
            >
              <div className="flex items-center gap -2">
                <p className="font-semibold">{phase.name}</p>
                <Badge variant={"outline"}>{index + 1}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{phase.status}</p>
              </div>
            </Button>
          ))}

        </div>
      </aside>
      <div className="flex w-full h-full">
        
      </div>
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
