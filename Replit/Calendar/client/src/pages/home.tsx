import { useState } from "react";
import CalendarView from "@/components/calendar/calendar-view";
import Pomodoro from "@/components/pomodoro";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: settings } = useQuery({ 
    queryKey: ["/api/settings"]
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <CalendarView />
      </div>

      <div className="space-y-6">
        <Card className="p-4">
          <Pomodoro />
        </Card>
      </div>
    </div>
  );
}