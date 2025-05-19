import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJourneyPlan } from "@/lib/tfl-api";

export default function JourneyPlanner() {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [searchParams, setSearchParams] = useState<{ from: string; to: string } | null>(null);

  const { data: journey, isLoading } = useQuery({
    queryKey: ["/api/journey", searchParams?.from, searchParams?.to],
    enabled: !!searchParams,
  });

  const handleSearch = () => {
    if (fromLocation && toLocation) {
      setSearchParams({ from: fromLocation, to: toLocation });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Journey Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="From (postcode, stop or street)"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="To (postcode, stop or street)"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                />
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleSearch}
              disabled={!fromLocation || !toLocation}
            >
              Plan Journey
            </Button>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : journey?.journeys ? (
              <div className="space-y-4">
                {journey.journeys.map((j: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            Duration: {Math.round(j.duration / 60)} mins
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(j.startDateTime).toLocaleTimeString()} -{" "}
                            {new Date(j.arrivalDateTime).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {j.legs.length} changes
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        {j.legs.map((leg: any, legIndex: number) => (
                          <div key={legIndex} className="text-sm">
                            <span className="font-medium">{leg.mode.name}</span>:{" "}
                            {leg.instruction.summary}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchParams ? (
              <p className="text-center text-muted-foreground">
                No journey options found. Please try different locations.
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
