import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Bell, Bookmark, History, Settings, Star } from "lucide-react";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  
  const { data: pointsHistory } = useQuery({
    queryKey: ["/api/users", user?.id, "points/history"],
  });

  const { data: favorites } = useQuery({
    queryKey: ["/api/users", user?.id, "favorites"],
  });

  if (!user) return null;

  const progress = user.points % 100;
  const nextLevel = user.level + 1;
  const pointsToNextLevel = (nextLevel * 100) - user.points;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-2xl font-bold">{user.displayName}</h2>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level {user.level}</span>
                  <span>{pointsToNextLevel} points to Level {nextLevel}</span>
                </div>
                <Progress value={progress} />
              </div>

              <Button 
                variant="destructive" 
                className="w-full mt-6"
                onClick={() => logoutMutation.mutate()}
              >
                Logout
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {user.badges.map((badge: any) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center text-center p-2"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Star className="h-6 w-6" />
                    </div>
                    <p className="mt-2 text-sm font-medium">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {badge.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="activity">
            <TabsList>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pointsHistory?.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-4 bg-accent rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.reason}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="secondary">+{item.points}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5" />
                    Saved Stops
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {favorites?.map((favorite: any) => (
                      <div
                        key={favorite.id}
                        className="flex justify-between items-center p-4 bg-accent rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{favorite.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Stop ID: {favorite.stopId}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span className="font-medium">
                            Notifications
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts about service disruptions
                        </p>
                      </div>
                      <Switch
                        checked={user.notificationsEnabled}
                        onCheckedChange={(checked) => {
                          // Update user preferences
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
