import { useState, useEffect } from 'react';

export interface F1Session {
  session_key: number;
  session_name: string;
  circuit_short_name: string;
  location: string;
  country_name: string;
}

export function useLatestSession() {
  const [session, setSession] = useState<F1Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        // Get sessions for 2024 and pick the latest 'Race'
        const response = await fetch('https://api.openf1.org/v1/sessions?year=2024&session_type=Race');
        const data: F1Session[] = await response.json();
        // The last one in the list is the most recent race
        if (data.length > 0) {
          setSession(data[data.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching latest session:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, []);

  return { session, loading };
}
