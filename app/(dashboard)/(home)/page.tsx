import { GetPeriods } from "@/actions/analytics/getPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "./_components/periodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStatsCardValues } from "@/actions/analytics/getStatsCardValues";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import StatsCard from "./_components/statsCard";
import { GetWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStatus";
import ExecutionStatusChart from "./_components/executionStatusChart";
import { GetCreditsUsageInPeriod } from "@/actions/analytics/getCreditsUsageInPeriod";
import CreditUsageChart from "../billing/_components/creditUsageChart";

function HomePage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) {
  const currentDate = new Date();
  const { month, year } = searchParams;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-8 flex flex-col gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>        
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>        
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditsUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
}

async function PeriodSelectorWrapper({ selectedPeriod }: { selectedPeriod: Period }) {
  const periods = await GetPeriods();
  return <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />;
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetStatsCardValues(selectedPeriod);
  return(
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow Execution"
        value={data.worflowExecutions}
        icon={CirclePlayIcon}
      />      
      <StatsCard
        title="Phases Execution"
        value={data.phaseExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits Consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
      
    </div>
  );
}

async function StatsExecutionStatus({ selectedPeriod }: {selectedPeriod: Period}) {

  const data = await GetWorkflowExecutionStats(selectedPeriod);

  return <ExecutionStatusChart data={data} />;

}

async function CreditsUsageInPeriod({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetCreditsUsageInPeriod(selectedPeriod);
  return <CreditUsageChart data={data} title="Daily credits spent" description="Daily credits consumed in selected phase" />;
}



function StatsCardSkeleton() {
  return(
  <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
    {
      [1,2,3].map((i) => (
        <Skeleton key={i} className="w-full min-h-[120px]" />
      ))
    }
  </div>)
}

export default HomePage;


