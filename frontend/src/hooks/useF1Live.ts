import { useState, useEffect } from 'react';

export interface DriverLocation {
  driver_number: number;
  x: number;
  y: number;
  z: number;
  date: string;
}

export function useF1Live(sessionKey: number | null) {
  const [locations, setLocations] = useState<Record<number, DriverLocation>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionKey) return;

    let interval: any;

    async function fetchLatestLocations() {
      try {
        // To show data NOW even if it's not Sunday:
        // We fetch a larger chunk. In a real LIVE race, you'd add a date filter.
        const response = await fetch(`https://api.openf1.org/v1/location?session_key=${sessionKey}&n=200`);
        const data: DriverLocation[] = await response.json();
        
        if (!data || data.length === 0) return;

        // Group by driver and take the most recent known position in this chunk
        const latest: Record<number, DriverLocation> = {};
        data.forEach(loc => {
          latest[loc.driver_number] = loc;
        });
        
        setLocations(latest);
      } catch (error) {
        console.error("OpenF1 API Error:", error);
      }
    }

    fetchLatestLocations();
    interval = setInterval(fetchLatestLocations, 5000); // Update every 5s

    return () => clearInterval(interval);
  }, [sessionKey]);

  return { locations, loading };
}
