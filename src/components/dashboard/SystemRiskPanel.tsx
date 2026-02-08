import { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle, ShieldCheck } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/* ================= CONFIG ================= */

const API_BASE = "http://localhost:8080";
const HOSPITAL_ID = "HOSP_TEST_001"; // 🔴 keep consistent everywhere

/* ================= TYPES ================= */

type Severity = "SAFE" | "WARNING" | "CRITICAL";

interface SystemRiskResponse {
  hospital_id: string;
  system_risk: Severity;
  contributors: string[];
  updated_at: number | null;
}

/* ================= COMPONENT ================= */

export const SystemRiskPanel = () => {
  const [severity, setSeverity] = useState<Severity>("SAFE");
  const [contributors, setContributors] = useState<string[]>([]);
  const [timestamp, setTimestamp] = useState<number | null>(null);

  /* ================= FETCH LIVE SYSTEM RISK ================= */

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function fetchSystemRisk() {
      try {
        const res = await axios.get<SystemRiskResponse>(
          `${API_BASE}/api/agents/system-risk/current`,
          { params: { hospital_id: HOSPITAL_ID } }
        );

        setSeverity(res.data.system_risk);
        setContributors(res.data.contributors);
        setTimestamp(res.data.updated_at);
      } catch (err) {
        console.error("❌ Failed to fetch live system risk", err);
      }
    }

    // initial fetch
    fetchSystemRisk();

    // auto-refresh every 5 seconds
    interval = setInterval(fetchSystemRisk, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ================= SEVERITY STYLES ================= */

  const severityStyles: Record<Severity, string> = {
    SAFE: "border-green-500 text-green-700 bg-green-50",
    WARNING: "border-yellow-500 text-yellow-700 bg-yellow-50",
    CRITICAL: "border-red-500 text-red-700 bg-red-50",
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
        <div className={`rounded border p-4 ${severityStyles[severity]}`}>
          <div className="flex items-center gap-2 text-lg font-bold">
            <ShieldCheck className="h-5 w-5" />
            SYSTEM STATUS: {severity}
          </div>

          <div className="mt-2 text-sm">
            {contributors.length > 0 ? (
              <>
                Multiple subsystems show elevated risk. Prepare mitigation.
                <br />
                <span className="font-medium">
                  Contributors: {contributors.join(", ")}
                </span>
              </>
            ) : (
              "All monitored subsystems are operating within safe thresholds."
            )}
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