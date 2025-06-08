import ReactCountUpWrapper from '@/components/reactCountUpWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import React from 'react'

interface Props {
    title: string;
    value: number;
    icon: LucideIcon
}

function StatsCard(props: Props) {
  return (
    <Card className="relative overflow-hidden h-full">
        <CardHeader className="flex pb-2">
            <CardTitle>
                {props.title}
                <props.icon className="text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10" size={120} />
            </CardTitle>
            <CardContent>
                <div className="text-2xl font-bold text-primary">
                    <ReactCountUpWrapper value={props.value} />
                </div>
            </CardContent>
        </CardHeader>
      
    </Card>
  )
}

export default StatsCard;
