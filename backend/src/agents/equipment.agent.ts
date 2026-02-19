import { eventBus } from "../orchestrator/eventBus";
import { v4 as uuidv4 } from "uuid";

/* ================= TYPES ================= */

export interface EquipmentRiskInput {
  hospital_id: string;
  equipment_utilization?: number;
  critical_equipment_down?: number;
  maintenance_delay_days?: number;

  // NEW: inventory-driven signal
  inventory_shortage?: boolean;
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

  const utilization = input.equipment_utilization ?? 0;
  const criticalDown = input.critical_equipment_down ?? 0;
  const maintenanceDelay = input.maintenance_delay_days ?? 0;

  /* ---------- UTILIZATION ---------- */
  if (utilization > 90) {
    drivers.push("Equipment utilization exceeds 90%");
    riskScore += 2;
  } else if (utilization > 80) {
    drivers.push("High equipment utilization (>80%)");
    riskScore += 1;
  }

  /* ---------- CRITICAL EQUIPMENT DOWN ---------- */
  if (criticalDown >= 3) {
    drivers.push("Multiple critical equipment units unavailable");
    riskScore += 3;
  } else if (criticalDown >= 1) {
    drivers.push("Some critical equipment unavailable");
    riskScore += 1;
  }

  /* ---------- MAINTENANCE BACKLOG ---------- */
  if (maintenanceDelay >= 5) {
    drivers.push("Maintenance backlog exceeds 5 days");
    riskScore += 2;
  } else if (maintenanceDelay >= 3) {
    drivers.push("Maintenance delays detected");
    riskScore += 1;
  }

  /* ---------- INVENTORY SHORTAGE SIGNAL ---------- */
  if (input.inventory_shortage) {
    drivers.push("Critical medical inventory below threshold");
    riskScore += 2;
  }

  /* ---------- RISK LEVEL ---------- */
  let risk_level: "SAFE" | "WARNING" | "CRITICAL" = "SAFE";

  if (riskScore >= 5) risk_level = "CRITICAL";
  else if (riskScore >= 2) risk_level = "WARNING";

  /* ---------- EXPLANATION ---------- */
  let explanation = "Equipment operations are within safe limits.";

  if (risk_level === "WARNING") {
    explanation =
      "Elevated equipment stress detected. Preventive maintenance and load balancing are recommended.";
  }

  if (risk_level === "CRITICAL") {
    explanation =
      "High operational failure risk due to equipment strain, unavailable devices, or inventory shortage.";
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