import { useState } from "react";
//import { useQuery } from "@tanstack/react-query";
//import { Input } from "../components/ui/input";
//import { Button } from "../components/ui/button";
//import { Card, CardContent } from "../components/ui/card";
//import { Search } from "lucide-react";

const ArrivalItem = ({ line, destination, time }) => (
  <div className="flex justify-between items-center">
    <div>
      <div className="font-medium">{line}</div>
      <div className="text-sm">{destination}</div>
    </div>
    <div className="text-right">
      <div className="text-2xl font-bold">{time}</div>
    </div>
  </div>
);


export default function LiveArrivals() {
  const [query, setQuery] = useState('');
  const [stationId, setStationId] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      // In a real app, this would call an API to search for stations
      // For now, we're just simulating it
      setTimeout(() => {
        setStationId('940GZZLUWLO'); // Example: Waterloo station
        setIsSearching(false);
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Live Arrivals</h1>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a station or stop"
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {stationId && (
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <h2 className="text-xl font-semibold mb-4">Arrivals at Waterloo</h2>
          <div className="space-y-3">
            {/* This would normally come from an API */}
            <ArrivalItem line="Bakerloo" destination="Elephant & Castle" time="2 min" />
            <ArrivalItem line="Jubilee" destination="Stratford" time="4 min" />
            <ArrivalItem line="Northern" destination="Morden via Bank" time="1 min" />
          </div>
        </div>
      )}
    </div>
  );
}