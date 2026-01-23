import { eventBus } from "../orchestrator/eventBus";
import { v4 as uuidv4 } from "uuid";

/* ================= TYPES ================= */

type StaffBurnoutInput = {
  hospital_id: string;
  staff_utilization: number;
  avg_shift_length: number;
  overtime_ratio: number;
  absence_rate: number;
};

type BurnoutRiskLevel = "SAFE" | "WARNING" | "CRITICAL";

/* ================= AGENT ================= */

export function runStaffBurnoutAgent(input: StaffBurnoutInput) {
  const riskDrivers: string[] = [];

  if (input.staff_utilization > 85) {
    riskDrivers.push("High staff utilization (>85%)");
  }
  if (input.avg_shift_length > 10) {
    riskDrivers.push("Long average shift length (>10 hours)");
  }
  if (input.overtime_ratio > 20) {
    riskDrivers.push("Excessive overtime ratio (>20%)");
  }
  if (input.absence_rate > 12) {
    riskDrivers.push("High staff absence rate (>12%)");
  }

  let risk_level: BurnoutRiskLevel = "SAFE";

  if (riskDrivers.length >= 3) risk_level = "CRITICAL";
  else if (riskDrivers.length >= 1) risk_level = "WARNING";

  const timestamp_ms = Date.now();

  /* ---------- AUTO-CHAIN EVENT ---------- */
  eventBus.emitAgentStateUpdate({
    event_type: "AGENT_STATE_UPDATED",
    source_agent: "STAFF",
    hospital_id: input.hospital_id,
    risk_level,
    timestamp: timestamp_ms,
    correlation_id: uuidv4(),
  });

  return {
    hospital_id: input.hospital_id,
    risk_level,
    drivers: riskDrivers,
    explanation:
      riskDrivers.length === 0
        ? "Staff workload indicators are within safe operational thresholds."
        : `Burnout risk detected due to: ${riskDrivers.join(", ")}.`,
    timestamp: new Date(timestamp_ms).toISOString(),
  };
}
