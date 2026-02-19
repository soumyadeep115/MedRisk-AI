import { embedText } from "../services/embedding.service";
import {
  upsertMemory,
  searchMemory
} from "../services/qdrant.service";
import { runEventTimelineAgent } from "./eventTimeline.agent";
import { eventBus } from "../orchestrator/eventBus";
import { v4 as uuidv4 } from "uuid";

console.log("🔥 Capacity Agent Module Loaded");

/* ================= TYPES ================= */

type ExternalRisk = {
  source: "WEATHER" | "CCTV";
  severity: "WARNING" | "CRITICAL";
};

type CapacityInput = {
  hospital_id: string;
  occupancy_percent: number;
  available_beds: number;
  capacity_threshold: number;
  external_risk?: ExternalRisk;
};

/* ================= CORE AGENT ================= */

export async function runCapacityRiskAgent(input: CapacityInput) {
  if (!input.hospital_id) {
    throw new Error("hospital_id is required");
  }

  const timestamp_ms = Date.now();

  const {
    hospital_id,
    occupancy_percent,
    available_beds,
    capacity_threshold,
    external_risk
  } = input;

  /* ---------- 1. Semantic Context ---------- */
  const context = `
Hospital: ${hospital_id}
Occupancy: ${occupancy_percent}%
Available beds: ${available_beds}
Capacity threshold: ${capacity_threshold}
External risk: ${external_risk?.source ?? "NONE"}
External severity: ${external_risk?.severity ?? "NONE"}
`;

  const embedding = await embedText(context);

  /* ---------- 2. Historical Comparison ---------- */
  const similarEvents = await searchMemory(embedding, 3);

  /* ---------- 3. Capacity Risk Logic ---------- */

  let risk_level: "SAFE" | "WARNING" | "CRITICAL" = "SAFE";

  /* 🔥 Threshold-based override (PRIMARY LOGIC) */
  if (available_beds <= capacity_threshold) {
    risk_level = "CRITICAL";
  } else {
    /* Fallback to occupancy-based evaluation */
    if (occupancy_percent > 95) {
      risk_level = "CRITICAL";
    } else if (occupancy_percent > 85) {
      risk_level = "WARNING";
    }
  }

  /* ---------- 4. External Risk Escalation ---------- */
  if (external_risk?.severity === "CRITICAL") {
    risk_level = "CRITICAL";
  } else if (
    external_risk?.severity === "WARNING" &&
    risk_level === "SAFE"
  ) {
    risk_level = "WARNING";
  }

  /* ---------- 5. Store Snapshot (LONG-TERM MEMORY) ---------- */
  await upsertMemory(uuidv4(), embedding, {
    hospital_id,
    agent: "CAPACITY",
    occupancy_percent,
    available_beds,
    capacity_threshold,
    external_risk: external_risk ?? null,
    risk_level,
    timestamp_ms,
  });

  /* ---------- 6. Timeline Escalation ---------- */
  if (risk_level !== "SAFE") {
    const summary =
      risk_level === "WARNING"
        ? "Capacity warning: review bed turnover, prepare overflow beds, alert administrators."
        : "Capacity CRITICAL: threshold breached or occupancy extremely high. Activate surge protocol, free beds immediately, mobilize backup staff.";

    await runEventTimelineAgent({
      hospital_id,
      event_type: "CAPACITY",
      severity: risk_level,
      summary,
      source_agent: "CAPACITY_AGENT",
    });
  }

  /* ---------- 7. Emit Agent State Update ---------- */
  eventBus.emitAgentStateUpdate({
    event_type: "AGENT_STATE_UPDATED",
    source_agent: "CAPACITY",
    hospital_id,
    risk_level,
    timestamp: timestamp_ms,
    correlation_id: uuidv4(),
  });

  /* ---------- 8. Return ---------- */
  return {
    hospital_id,
    risk_level,
    explanation:
      `Capacity evaluated. Occupancy: ${occupancy_percent}%. Available beds: ${available_beds}. Threshold: ${capacity_threshold}.` +
      (external_risk
        ? ` External ${external_risk.source} risk (${external_risk.severity}) applied.`
        : ""),
    matched_events: similarEvents,
    timestamp_ms,
  };
}

/* ================= ERP CAPACITY EVENT INTEGRATION ================= */

eventBus.on(
  "CAPACITY_UPDATE",
  async (data: {
    hospital_id: string;
    total_beds: number;
    occupied_beds: number;
    capacity_threshold?: number;
  }) => {
    try {
      const {
        hospital_id,
        total_beds,
        occupied_beds,
        capacity_threshold = 0
      } = data;

      if (!total_beds || total_beds <= 0) return;

      const available_beds = total_beds - occupied_beds;

      const occupancy_percent =
        (occupied_beds / total_beds) * 100;

      console.log("🛏️ ERP Capacity Update:", {
        hospital_id,
        total_beds,
        occupied_beds,
        available_beds,
        capacity_threshold,
        occupancy_percent
      });

      await runCapacityRiskAgent({
        hospital_id,
        occupancy_percent,
        available_beds,
        capacity_threshold
      });

    } catch (err) {
      console.error("ERP Capacity Integration Error:", err);
    }
  }
);