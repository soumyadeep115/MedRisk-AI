import { useCallback, useEffect, useState } from "react";
import axios from "axios";

/* ================= TYPES ================= */

export interface CapacityContext {
  icu_occupancy: number;
  bed_utilization: number;
  staff_utilization: number;
}

export interface CapacityEvent {
  similarity: number;
  type: string;
  date: string;
  icuPeak: number;
  outcome: string;
}

/* ================= HOOK ================= */

export function useQdrantSearch(context: CapacityContext) {
  const [events, setEvents] = useState<CapacityEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"qdrant" | "demo">("qdrant");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/agents/capacity/search", {
        context,
      });

      const data = Array.isArray(res.data?.events)
        ? res.data.events
        : [];

      setEvents(data);
      setSource(res.data?.source === "demo" ? "demo" : "qdrant");
    } catch (err) {
      console.error("Qdrant search failed:", err);

      // fallback demo mode
      setEvents([]);
      setSource("demo");
      setError("Qdrant unavailable — using fallback memory");
    } finally {
      setLoading(false);
    }
  }, [context]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,     // ✅ always array
    loading,    // ✅ boolean
    error,      // ✅ string | null
    source,     // ✅ "qdrant" | "demo"
    refresh: fetchEvents, // ✅ function
  };
}
