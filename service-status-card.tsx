import { useQuery } from "@tanstack/react-query";
import { fetchLineStatuses, type LineStatus } from "@/lib/tfl-api";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ServiceStatusCardProps {
  mode?: "tube" | "dlr" | "overground" | "bus";
}

export default function ServiceStatusCard({ mode }: ServiceStatusCardProps) {
  const [routeFilter, setRouteFilter] = useState("");

  const { data: statuses, isLoading } = useQuery<LineStatus[]>({
    queryKey: ["/api/lines/status"],
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 bg-accent animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  const filteredStatuses = statuses?.filter((line) => {
    if (mode === "bus") {
      const routeNumber = parseInt(line.id);
      if (routeFilter) {
        return line.modeName === "bus" && line.id.includes(routeFilter);
      }
      return line.modeName === "bus";
    }
    return line.modeName === (mode || line.modeName);
  });

  return (
    <div className="space-y-4">
      {mode === "bus" && (
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Filter bus routes (e.g., 25)"
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
          />
        </div>
      )}

      {filteredStatuses?.map((line) => (
        <Alert
          key={line.id}
          variant={line.lineStatuses[0].statusSeverity === 10 ? "default" : "destructive"}
        >
          <div className="flex items-center gap-2">
            {line.lineStatuses[0].statusSeverity === 10 ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{line.name}</AlertTitle>
          </div>
          <AlertDescription>
            {line.lineStatuses[0].statusSeverityDescription}
            {line.lineStatuses[0].reason && (
              <span className="block mt-1 text-sm">
                {line.lineStatuses[0].reason}
              </span>
            )}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}