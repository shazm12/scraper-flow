"use client";
import { GetCreditsUsageInPeriod } from "@/actions/analytics/getCreditsUsageInPeriod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartColumnIcon, Layers2Icon } from "lucide-react";
import React from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof GetCreditsUsageInPeriod>>;

function CreditUsageChart({ data, title, description }: { data: ChartData, title: string, description:string }) {
  const chartConfig = {
    success: {
      label: "Successful Phase Credits",
      color: "hsl(var(--chart-2))",
    },
    failed: {
      label: "Failed Phase Credits",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ChartColumnIcon className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <BarChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Bar
              type={"bump"}
              radius={[0,0,4,4]}
              fill="var(--color-success)"
              fillOpacity={0.8}
              stroke="var(--color-success)"
              stackId={"a"}
              dataKey={"success"}
            />
            <Bar
              type={"bump"}
              radius={[4,4,0,0]}
              fill="var(--color-failed)"
              fillOpacity={0.8}
              stroke="var(--color-failed)"
              stackId={"a"}
              dataKey={"failed"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default CreditUsageChart;
