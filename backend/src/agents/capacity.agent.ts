import { embedText } from "../services/embedding.service";
import {
  upsertMemory,
  searchMemory
} from "../services/qdrant.service";
import { runEventTimelineAgent } from "./eventTimeline.agent";
import { eventBus } from "../orchestrator/eventBus";
import { v4 as uuidv4 } from "uuid";

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
ICU utilization: ${input.icu}%
Bed utilization: ${input.beds}%
Staff utilization: ${input.staff}%
External risk: ${input.external_risk?.source ?? "NONE"}
External severity: ${input.external_risk?.severity ?? "NONE"}
`;

  const embedding = await embedText(context);

  /* ---------- 2. Store snapshot (LONG-TERM MEMORY) ---------- */
  await upsertMemory(uuidv4(), embedding, {
    hospital_id: input.hospital_id,
    agent: "CAPACITY",
    icu: input.icu,
    beds: input.beds,
    staff: input.staff,
    external_risk: input.external_risk ?? null,
    risk_level: null, // filled after evaluation
    timestamp_ms,
  });

  /* ---------- 3. Historical comparison ---------- */
  const similarEvents = await searchMemory(embedding, 3);

  /* ---------- 4. Capacity risk logic ---------- */
  let risk_level: "SAFE" | "WARNING" | "CRITICAL" = "SAFE";

  if (input.icu > 85 || input.beds > 90) {
    risk_level = "CRITICAL";
  } else if (input.icu > 70 || input.beds > 75) {
    risk_level = "WARNING";
  }

  /* ---------- 5. External risk escalation ---------- */
  if (input.external_risk?.severity === "CRITICAL") {
    risk_level = "CRITICAL";
  } else if (
    input.external_risk?.severity === "WARNING" &&
    risk_level === "SAFE"
  ) {
    risk_level = "WARNING";
  }

  /* ---------- 6. Preparation guidance + TIMELINE ---------- */
  if (risk_level !== "SAFE") {
    const summary =
      risk_level === "WARNING"
        ? "Capacity warning: review bed turnover, prepare ICU step-up beds, ensure oxygen pipeline readiness, alert duty administrators."
        : "Capacity CRITICAL: activate surge protocol, free ICU beds, increase oxygen reserves, mobilize backup staff, alert emergency intake.";

    await runEventTimelineAgent({
      hospital_id: input.hospital_id,
      event_type: "CAPACITY",
      severity: risk_level,
      summary,
      source_agent: "CAPACITY_AGENT",
    });
  }

  /* ---------- 7. AUTO-CHAIN EVENT (PHASE B COMPLETE) ---------- */
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
      `Capacity risk evaluated using ICU (${input.icu}%), beds (${input.beds}%), staff (${input.staff}%)` +
      (input.external_risk
        ? ` with external ${input.external_risk.source} risk (${input.external_risk.severity}).`
        : "."),
    matched_events: similarEvents,
    timestamp_ms,
  };
}
