import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStopPoints, fetchStopPointArrivals, type StopPoint, type Arrival } from "@/lib/tfl-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search, Bus, Train } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ArrivalDisplay extends Arrival {
  isLive: boolean;
}

export default function StopSearch() {
  const [query, setQuery] = useState("");
  const [selectedStop, setSelectedStop] = useState<StopPoint | null>(null);

  const { data: stops = [], isLoading: isSearching } = useQuery<StopPoint[]>({
    queryKey: ["/api/stops/search", query],
    enabled: query.length > 2,
  });

  const { data: arrivals = [], isLoading: isLoadingArrivals } = useQuery<Arrival[]>({
    queryKey: ["/api/stops", selectedStop?.naptanId, "arrivals"],
    enabled: !!selectedStop,
    refetchInterval: 30000,
  });

  const processedArrivals = arrivals.map((arrival) => ({
    ...arrival,
    isLive: arrival.timeToStation < 180 // Within 3 minutes
  }));

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by stop name or number (e.g., 'King's Cross' or 'Stop N')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.length > 2) {
              setSelectedStop(null);
            }
          }}
        />
      </div>

      {isSearching ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        stops.length > 0 && (
          <div className="space-y-2">
            {stops.map((stop) => (
              <Button
                key={stop.naptanId}
                variant="outline"
                className="w-full justify-start"
                onClick={() => setSelectedStop(stop)}
              >
                {stop.modes.includes("bus") ? (
                  <Bus className="h-4 w-4 mr-2" />
                ) : (
                  <Train className="h-4 w-4 mr-2" />
                )}
                {stop.commonName}
                {stop.stopLetter && (
                  <Badge variant="outline" className="ml-2">
                    Stop {stop.stopLetter}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        )
      )}

      {selectedStop && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedStop.modes.includes("bus") ? (
                <Bus className="h-5 w-5" />
              ) : (
                <Train className="h-5 w-5" />
              )}
              {selectedStop.commonName}
              {selectedStop.stopLetter && ` (Stop ${selectedStop.stopLetter})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingArrivals ? (
                [1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))
              ) : processedArrivals.length > 0 ? (
                processedArrivals.map((arrival) => (
                  <div
                    key={arrival.vehicleId}
                    className={cn(
                      "flex justify-between items-center p-3 rounded-lg",
                      arrival.isLive ? "bg-green-50 dark:bg-green-900/20" : "bg-accent"
                    )}
                  >
                    <div>
                      <p className="font-medium">{arrival.lineName}</p>
                      <p className="text-sm text-muted-foreground">
                        {arrival.modeName === "bus" ? "Bus" : "Train"}
                        {arrival.towards && ` • Towards ${arrival.towards}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {Math.floor(arrival.timeToStation / 60)}m
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(arrival.expectedArrival).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No arrivals found for this stop
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}