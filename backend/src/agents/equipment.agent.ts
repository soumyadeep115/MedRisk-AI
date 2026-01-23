import { eventBus } from "../orchestrator/eventBus";
import { v4 as uuidv4 } from "uuid";

/* ================= TYPES ================= */

export interface EquipmentRiskInput {
  hospital_id: string;
  equipment_utilization: number;
  critical_equipment_down: number;
  maintenance_delay_days: number;
}

export interface EquipmentRiskOutput {
  hospital_id: string;
  risk_level: "SAFE" | "WARNING" | "CRITICAL";
  drivers: string[];
  explanation: string;
}

/* ================= AGENT ================= */

export function runEquipmentRiskAgent(
  input: EquipmentRiskInput
): EquipmentRiskOutput {
  const drivers: string[] = [];
  let riskScore = 0;

  if (input.equipment_utilization > 90) {
    drivers.push("Equipment utilization exceeds 90%");
    riskScore += 2;
  } else if (input.equipment_utilization > 80) {
    drivers.push("High equipment utilization (>80%)");
    riskScore += 1;
  }

  if (input.critical_equipment_down >= 3) {
    drivers.push("Multiple critical equipment units unavailable");
    riskScore += 3;
  } else if (input.critical_equipment_down >= 1) {
    drivers.push("Some critical equipment unavailable");
    riskScore += 1;
  }

  if (input.maintenance_delay_days >= 5) {
    drivers.push("Maintenance backlog exceeds 5 days");
    riskScore += 2;
  } else if (input.maintenance_delay_days >= 3) {
    drivers.push("Maintenance delays detected");
    riskScore += 1;
  }

  let risk_level: "SAFE" | "WARNING" | "CRITICAL" = "SAFE";

  if (riskScore >= 5) risk_level = "CRITICAL";
  else if (riskScore >= 2) risk_level = "WARNING";

  let explanation = "Equipment operations are within safe limits.";

  if (risk_level === "WARNING") {
    explanation =
      "Elevated equipment stress detected. Preventive maintenance and load balancing are recommended.";
  }

  if (risk_level === "CRITICAL") {
    explanation =
      "High operational failure risk due to equipment overuse, unavailable critical devices, and maintenance backlog.";
  }

  const timestamp_ms = Date.now();

  /* ---------- AUTO-CHAIN EVENT ---------- */
  eventBus.emitAgentStateUpdate({
    event_type: "AGENT_STATE_UPDATED",
    source_agent: "EQUIPMENT",
    hospital_id: input.hospital_id,
    risk_level,
    timestamp: timestamp_ms,
    correlation_id: uuidv4(),
  });

  return {
    hospital_id: input.hospital_id,
    risk_level,
    drivers,
    explanation,
  };
}
