import { useQuery } from "@tanstack/react-query";
import { Cloud, Sun, CloudRain, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Settings } from "@shared/schema";

interface WeatherResponse {
  weather: Array<{ main: string; description: string }>;
  main: { temp: number };
}

export default function Weather() {
  const { data: settings } = useQuery<Settings>({ 
    queryKey: ["/api/settings"] 
  });

  const { data: weather, isLoading } = useQuery<WeatherResponse>({
    queryKey: [`/api/weather/${settings?.city || "istanbul"}`],
    enabled: !!settings?.city
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 bg-card px-3 py-1 rounded-lg">
        <Loader2 className="h-5 w-5 animate-spin" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }

  if (!weather) return null;

  const getIcon = (condition: string) => {
    switch (condition) {
      case "Clear":
        return <Sun className="h-5 w-5" />;
      case "Rain":
        return <CloudRain className="h-5 w-5" />;
      default:
        return <Cloud className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex items-center gap-2 bg-card px-3 py-1 rounded-lg">
      {getIcon(weather.weather[0].main)}
      <span>{Math.round(weather.main.temp)}°C</span>
    </div>
  );
}