import { useEffect, useState } from "react";
import axios from "axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

/* ================= CONFIG ================= */

const API_BASE = "http://localhost:8080";
const HOSPITAL_ID = "HOSP_TEST_001";
const MAX_POINTS = 20;

/* ================= TYPES ================= */

interface TimelineEvent {
  payload: {
    event_type: string;
    timestamp_ms: number;
    crowd_density_score?: number;
  };
}

interface TrendPoint {
  timestamp_ms: number;
  crowd_density_score: number;
}

/* ================= COMPONENT ================= */

const CCTVAgentPanel = () => {
  const [density, setDensity] = useState<number>(30);
  const [result, setResult] = useState<any>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH TREND ================= */

  const fetchTrend = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/agents/event-replay?hospital_id=${HOSPITAL_ID}`
      );

      const events: TimelineEvent[] = res.data;

      const cctvEvents = events
        .filter((e) => e.payload.event_type === "CCTV")
        .filter(
          (e) => typeof e.payload.crowd_density_score === "number"
        )
        .slice(0, MAX_POINTS)
        .reverse();

      setTrend(
        cctvEvents.map((e) => ({
          timestamp_ms: e.payload.timestamp_ms,
          crowd_density_score: e.payload.crowd_density_score!,
        }))
      );
    } catch (err) {
      console.error("Failed to load CCTV trend", err);
    }
  };

  /* ================= RUN AGENT ================= */

  const runCCTV = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/agents/cctv`, {
        hospital_id: HOSPITAL_ID,
        crowd_density_score: density,
      });

      setResult(res.data);
      await fetchTrend();
    } catch (err) {
      console.error("CCTV agent failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT ================= */

  useEffect(() => {
    fetchTrend();
  }, []);

  /* ================= RENDER ================= */

  return (
    <Card>
      <CardHeader>
        <CardTitle>📹 CCTV Crowd Monitoring Agent</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Density Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Simulated Crowd Density
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={0}
              max={100}
              value={density}
              onChange={(e) => setDensity(Number(e.target.value))}
              className="w-full"
            />
            <span className="w-10 text-right font-mono">
              {density}
            </span>
          </div>
        </div>

        {/* Run Button */}
        <Button
          onClick={runCCTV}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Analyzing…" : "Run CCTV Risk Analysis"}
        </Button>

        {/* Result */}
        {result && (
          <div
            className={`rounded border p-3 text-sm ${
              result.severity === "CRITICAL"
                ? "border-red-500 text-red-600"
                : result.severity === "WARNING"
                ? "border-yellow-500 text-yellow-600"
                : "border-green-500 text-green-600"
            }`}
          >
            <div className="font-semibold">
              Severity: {result.severity}
            </div>
            <div>{result.summary}</div>
          </div>
        )}

        {/* Trend Chart */}
        {trend.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold">
              Crowd Density Trend
            </h4>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <XAxis
                    dataKey="timestamp_ms"
                    tickFormatter={(ts) =>
                      new Date(ts).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    labelFormatter={(ts) =>
                      new Date(Number(ts)).toLocaleString()
                    }
                  />

                  {/* Thresholds */}
                  <ReferenceLine
                    y={40}
                    stroke="#facc15"
                    strokeDasharray="3 3"
                    label="Warning"
                  />
                  <ReferenceLine
                    y={70}
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                    label="Critical"
                  />

                  <Line
                    type="monotone"
                    dataKey="crowd_density_score"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CCTVAgentPanel;
