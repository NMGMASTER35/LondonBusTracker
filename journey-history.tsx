import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Bus, Train, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function JourneyHistory() {
  const { data: pointsHistory, isLoading } = useQuery({
    queryKey: ["/api/users/1/points/history"],
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Journey History & Points</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : pointsHistory?.length > 0 ? (
            <div className="space-y-4">
              {pointsHistory.map((history) => (
                <div
                  key={history.id}
                  className="flex items-center justify-between p-4 bg-accent rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {history.reason.includes("bus") ? (
                      <Bus className="h-6 w-6" />
                    ) : (
                      <Train className="h-6 w-6" />
                    )}
                    <div>
                      <p className="font-medium">{history.reason}</p>
                      <p className="text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {new Date(history.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      +{history.points}
                    </p>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No journey history available yet. Start using TfL services to earn points!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
