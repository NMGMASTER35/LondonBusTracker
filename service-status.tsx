import ServiceStatusCard from "@/components/service-status-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchLineStatuses = async () => {
  const response = await fetch('/api/lines/status');
  if (!response.ok) {
    throw new Error('Failed to fetch line status');
  }
  return response.json();
};

export default function ServiceStatus() {
  const { data: lineStatuses, isLoading, error } = useQuery({
    queryKey: ['lineStatuses'],
    queryFn: fetchLineStatuses,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Service Status</h1>
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Service Status</h1>
        <div className="p-4 text-red-600 bg-red-50 rounded-md">
          Error loading service status. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Service Status</h1>
      <p className="text-gray-600">Current status of London transport services</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lineStatuses && lineStatuses.map((line: any) => (
          <ServiceStatusCard 
            key={line.id}
            name={line.name}
            status={line.lineStatuses[0]?.statusSeverityDescription || 'Good Service'}
            color={line.lineColour || '#333333'}
          />
        ))}
      </div>
    </div>
  );
}