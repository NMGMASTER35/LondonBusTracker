import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search, Navigation } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchVehicleArrivals, type VehicleArrival } from "@/lib/tfl-api";
import TransportMap from "@/components/transport-map";

export default function LineInfo() {
  const [vehicleId, setVehicleId] = useState("");
  const [searchVehicle, setSearchVehicle] = useState("");

  const { data: vehicleArrivals = [], isLoading, error } = useQuery<VehicleArrival[]>({
    queryKey: ["/api/vehicles", searchVehicle, "arrivals"],
    enabled: !!searchVehicle,
    refetchInterval: 30000,
    queryFn: () => fetchVehicleArrivals(searchVehicle)
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Enter vehicle ID (e.g., LX58CFV)"
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && vehicleId.trim()) {
                      setSearchVehicle(vehicleId.trim());
                    }
                  }}
                />
              </div>
              <Button
                className="w-full sm:w-auto"
                variant="outline"
                onClick={() => vehicleId.trim() && setSearchVehicle(vehicleId.trim())}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Track
              </Button>
            </div>

            {isLoading ? (
              <Skeleton className="h-[250px] sm:h-[400px] w-full" />
            ) : error ? (
              <div className="text-center text-destructive p-4">
                Error loading vehicle data. Please try again.
              </div>
            ) : vehicleArrivals.length > 0 ? (
              <div className="space-y-4">
                <TransportMap
                  center={[51.5074, -0.1278]}
                  zoom={12}
                  markers={vehicleArrivals.map(arrival => ({
                    position: [51.5074, -0.1278], // Using default position since we don't have coordinates
                    popup: `${arrival.stationName} - ${arrival.lineName}`
                  }))}
                />
                <div className="space-y-2">
                  {vehicleArrivals.map((arrival) => (
                    <div
                      key={arrival.id}
                      className="flex flex-col sm:flex-row sm:justify-between gap-2 p-3 bg-accent rounded-lg"
                    >
                      <div>
                        <p className="font-medium line-clamp-1">
                          {arrival.stationName}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {arrival.lineName} • Towards: {arrival.destinationName}
                          {arrival.platformName && ` • Platform: ${arrival.platformName}`}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          Current Location: {arrival.currentLocation || "Unknown"}
                        </p>
                      </div>
                      <div className="text-left sm:text-right flex sm:block items-center justify-between mt-1 sm:mt-0">
                        <p className="font-bold text-lg">
                          {Math.floor(arrival.timeToStation / 60)}m
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(arrival.expectedArrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : searchVehicle ? (
              <div className="text-center text-muted-foreground">
                No vehicle found with registration {searchVehicle}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}