import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";

interface PointsDisplayProps {
  userId: number;
}

export default function PointsDisplay({ userId }: PointsDisplayProps) {
  const { data: pointsData } = useQuery({
    queryKey: ["/api/users", userId, "points"],
  });

  const { data: history } = useQuery({
    queryKey: ["/api/users", userId, "points/history"],
  });

  const nextTier = Math.ceil(pointsData?.points / 100) * 100;
  const progress = (pointsData?.points % 100) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Points Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                {pointsData?.points || 0} points
              </span>
              <span className="text-sm text-muted-foreground">
                Next tier: {nextTier}
              </span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Activity</h4>
            {history?.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm"
              >
                <span>{item.reason}</span>
                <span className="font-medium">+{item.points}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
