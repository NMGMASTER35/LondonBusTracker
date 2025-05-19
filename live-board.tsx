import { useQuery } from "@tanstack/react-query";
import { fetchLineArrivals, type Arrival } from "@/lib/tfl-api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LiveBoardProps {
  lineId: string;
  stationName?: string;
}

export default function LiveBoard({ lineId, stationName }: LiveBoardProps) {
  const { data: arrivals, isLoading } = useQuery({
    queryKey: ["/api/lines", lineId, "arrivals"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredArrivals = stationName
    ? arrivals?.filter((a: Arrival) => a.stationName === stationName)
    : arrivals;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{stationName || lineId} Live Arrivals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredArrivals?.slice(0, 5).map((arrival: Arrival) => (
            <div
              key={arrival.vehicleId}
              className="flex justify-between items-center p-3 bg-accent rounded-lg"
            >
              <div>
                <p className="font-medium">{arrival.platformName}</p>
                <p className="text-sm text-muted-foreground">
                  {arrival.lineName} Line
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
