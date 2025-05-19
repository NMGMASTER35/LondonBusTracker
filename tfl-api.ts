import { apiRequest } from "./queryClient";

export interface LineStatus {
  id: string;
  name: string;
  modeName: string;
  lineStatuses: Array<{
    statusSeverity: number;
    statusSeverityDescription: string;
    reason?: string;
  }>;
}

export interface Arrival {
  vehicleId: string;
  stationName: string;
  lineId: string;
  lineName: string;
  platformName: string;
  expectedArrival: string;
  timeToStation: number;
  modeName: string;
}

export interface StopPoint {
  naptanId: string;
  commonName: string;
  stopLetter?: string;
  modes: string[];
  lat: number;
  lon: number;
}

export interface VehicleArrival {
  id: string;
  vehicleId: string;
  stationName: string;
  lineName: string;
  platformName?: string;
  destinationName: string;
  currentLocation: string;
  timeToStation: number;
  expectedArrival: string;
}

export async function fetchLineStatuses(): Promise<LineStatus[]> {
  const res = await apiRequest("GET", "/api/lines/status");
  return res.json();
}

export async function fetchStopPoints(query: string): Promise<StopPoint[]> {
  const res = await apiRequest("GET", `/api/stops/search?query=${encodeURIComponent(query)}`);
  return res.json();
}

export async function fetchStopPointArrivals(naptanId: string): Promise<Arrival[]> {
  const res = await apiRequest("GET", `/api/stops/${naptanId}/arrivals`);
  return res.json();
}

export async function fetchLineArrivals(lineId: string): Promise<Arrival[]> {
  const res = await apiRequest("GET", `/api/lines/${lineId}/arrivals`);
  return res.json();
}

export async function fetchVehicleArrivals(vehicleId: string): Promise<VehicleArrival[]> {
  if (!vehicleId) return [];

  try {
    const response = await fetch(`/api/vehicles/${encodeURIComponent(vehicleId)}/arrivals`);

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle arrivals: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching vehicle arrivals:", error);
    throw error;
  }
}

export async function fetchJourneyPlan(from: string, to: string): Promise<any> {
  const response = await fetch(`/api/journey?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  return response.json();
}