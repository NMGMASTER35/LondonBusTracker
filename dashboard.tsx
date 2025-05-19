import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Welcome {user?.displayName || 'User'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your dashboard where you can track transport information.</p>
        </CardContent>
      </Card>
      {/* Additional dashboard cards can be added here */}
    </div>
  );
}