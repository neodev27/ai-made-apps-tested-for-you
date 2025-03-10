import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Settings } from "@shared/schema";

interface PrayerTimesResponse {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
}

const PRAYER_NAMES: Record<string, string> = {
  Fajr: "İmsak",
  Sunrise: "Güneş",
  Dhuhr: "Öğle",
  Asr: "İkindi",
  Maghrib: "Akşam",
  Isha: "Yatsı"
};

export default function NamazTimes({ city }: { city: string }) {
  const { data: settings } = useQuery<Settings>({ 
    queryKey: ["/api/settings"] 
  });

  const { data, isLoading } = useQuery<PrayerTimesResponse>({
    queryKey: [`/api/namaz-times/${settings?.city || city}`],
    enabled: !!(settings?.city || city)
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Namaz Vakitleri</h2>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data?.timings) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Namaz Vakitleri</h2>
      <div className="space-y-2">
        {Object.entries(PRAYER_NAMES).map(([key, name]) => (
          <div key={key} className="flex justify-between">
            <span>{name}</span>
            <span>{data.timings[key as keyof typeof data.timings]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}