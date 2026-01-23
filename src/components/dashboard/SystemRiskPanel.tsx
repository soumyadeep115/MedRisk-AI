import { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle, ShieldCheck } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/* ================= CONFIG ================= */

const API_BASE = "http://localhost:8080";
const HOSPITAL_ID = "test_hospital_001";

/* ================= TYPES ================= */

type Severity = "SAFE" | "WARNING" | "CRITICAL";

interface TimelineEvent {
  payload: {
    hospital_id: string;
    event_type: string;
    severity: Severity;
    summary: string;
    timestamp_ms: number;
  };
}

/* ================= COMPONENT ================= */

export const SystemRiskPanel = () => {
  const [severity, setSeverity] = useState<Severity>("SAFE");
  const [summary, setSummary] = useState<string>("All systems nominal.");
  const [timestamp, setTimestamp] = useState<number | null>(null);

  /* ================= FETCH SYSTEM EVENT ================= */

  useEffect(() => {
    async function fetchSystemRisk() {
      try {
        const res = await axios.get<TimelineEvent[]>(
          `${API_BASE}/api/agents/event-replay`,
          { params: { hospital_id: HOSPITAL_ID } }
        );

        const systemEvent = res.data.find(
          (e) => e.payload?.event_type === "SYSTEM"
        );

        if (systemEvent) {
          setSeverity(systemEvent.payload.severity);
          setSummary(systemEvent.payload.summary);
          setTimestamp(systemEvent.payload.timestamp_ms);
        }
      } catch (err) {
        console.error("Failed to fetch system risk", err);
      }
    }

    fetchSystemRisk();
  }, []);

  /* ================= SEVERITY STYLES ================= */

  const severityStyles: Record<Severity, string> = {
    SAFE: "border-green-500 text-green-600 bg-green-50",
    WARNING: "border-yellow-500 text-yellow-600 bg-yellow-50",
    CRITICAL: "border-red-500 text-red-600 bg-red-50",
  };

  /* ================= RENDER ================= */

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          System Risk (Auto-Evaluated)
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div
          className={`rounded border p-4 ${severityStyles[severity]}`}
        >
          <div className="flex items-center gap-2 text-lg font-bold">
            <ShieldCheck className="h-5 w-5" />
            SYSTEM STATUS: {severity}
          </div>

          <div className="mt-2 text-sm">
            {summary}
          </div>

          {timestamp && (
            <div className="mt-3 text-xs opacity-70">
              Last auto-evaluated:{" "}
              {new Date(timestamp).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
