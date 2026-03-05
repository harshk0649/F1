import { useState, useEffect } from 'react';

export interface F1Race {
  raceName: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: {
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
}

export function useUpcomingRace() {
  const [race, setRace] = useState<F1Race | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNextRace() {
      try {
        const response = await fetch('https://ergast.com/api/f1/current/next.json');
        const data = await response.json();
        const nextRace = data.MRData.RaceTable.Races[0];
        setRace(nextRace);
      } catch (error) {
        console.error("Error fetching F1 calendar:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNextRace();
  }, []);

  return { race, loading };
}
