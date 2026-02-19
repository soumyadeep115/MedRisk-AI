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
  icu: number;
  beds: number;
  staff: number;
  hospital_id: string;
  external_risk?: ExternalRisk;
};

/* ================= AGENT ================= */

export async function runCapacityRiskAgent(input: CapacityInput) {
  if (!input.hospital_id) {
    throw new Error("hospital_id is required");
  }

  const timestamp_ms = Date.now();

  /* ---------- 1. Semantic context ---------- */
  const context = `
Hospital: ${input.hospital_id}
Occupancy: ${input.beds}%
External risk: ${input.external_risk?.source ?? "NONE"}
External severity: ${input.external_risk?.severity ?? "NONE"}
`;

  const embedding = await embedText(context);

  /* ---------- 2. Historical comparison ---------- */
  const similarEvents = await searchMemory(embedding, 3);

  /* ---------- 3. Capacity risk logic (Occupancy-Based) ---------- */
  let risk_level: "SAFE" | "WARNING" | "CRITICAL" = "SAFE";

  const occupancy = input.beds;

  if (occupancy > 95) {
    risk_level = "CRITICAL";
  } else if (occupancy > 85) {
    risk_level = "WARNING";
  }

  /* ---------- 4. External risk escalation ---------- */
  if (input.external_risk?.severity === "CRITICAL") {
    risk_level = "CRITICAL";
  } else if (
    input.external_risk?.severity === "WARNING" &&
    risk_level === "SAFE"
  ) {
    risk_level = "WARNING";
  }

  /* ---------- 5. Store snapshot (LONG-TERM MEMORY) ---------- */
  await upsertMemory(uuidv4(), embedding, {
    hospital_id: input.hospital_id,
    agent: "CAPACITY",
    occupancy,
    external_risk: input.external_risk ?? null,
    risk_level,
    timestamp_ms,
  });

  /* ---------- 6. Preparation guidance + TIMELINE ---------- */
  if (risk_level !== "SAFE") {
    const summary =
      risk_level === "WARNING"
        ? "Capacity warning: review bed turnover, prepare overflow beds, alert administrators."
        : "Capacity CRITICAL: activate surge protocol, free beds immediately, mobilize backup staff, alert emergency intake.";

    await runEventTimelineAgent({
      hospital_id: input.hospital_id,
      event_type: "CAPACITY",
      severity: risk_level,
      summary,
      source_agent: "CAPACITY_AGENT",
    });
  }

  /* ---------- 7. AUTO-CHAIN EVENT ---------- */
  eventBus.emitAgentStateUpdate({
    event_type: "AGENT_STATE_UPDATED",
    source_agent: "CAPACITY",
    hospital_id: input.hospital_id,
    risk_level,
    timestamp: timestamp_ms,
    correlation_id: uuidv4(),
  });

  /* ---------- 8. Return ---------- */
  return {
    hospital_id: input.hospital_id,
    risk_level,
    explanation:
      `Capacity risk evaluated using occupancy (${occupancy}%).` +
      (input.external_risk
        ? ` External ${input.external_risk.source} risk (${input.external_risk.severity}) applied.`
        : ""),
    matched_events: similarEvents,
    timestamp_ms,
  };
}

/* ================= ERP CAPACITY INTEGRATION ================= */

eventBus.on(
  "CAPACITY_UPDATE",
  async (data: {
    hospital_id: string;
    total_beds: number;
    occupied_beds: number;
  }) => {
    try {
      const { hospital_id, total_beds, occupied_beds } = data;

      if (!total_beds || total_beds === 0) return;

      const occupancyPercent =
        (occupied_beds / total_beds) * 100;

      console.log("🛏️ ERP Capacity Update:", {
        hospital_id,
        occupancyPercent,
      });

      await runCapacityRiskAgent({
        hospital_id,
        icu: occupancyPercent,  // kept for compatibility
        beds: occupancyPercent,
        staff: 0,
      });

    } catch (err) {
      console.error("ERP Capacity Integration Error:", err);
    }
  }
);