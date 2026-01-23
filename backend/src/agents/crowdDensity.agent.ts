import { embedText } from "../services/embedding.service";
import { upsertMemory } from "../services/qdrant.service";
import { runEventTimelineAgent } from "./eventTimeline.agent";
import { v4 as uuidv4 } from "uuid";
import { eventBus } from "../orchestrator/eventBus";

/* ================= TYPES ================= */

export type CrowdSeverity = "SAFE" | "WARNING" | "CRITICAL";

interface CrowdDensityInput {
  hospital_id: string;
  crowd_density_score: number; // 0–100
  entry_rate_per_minute?: number;
}

/* ================= AGENT ================= */

export async function evaluateCrowdDensity(
  input: CrowdDensityInput
) {
  const { hospital_id, crowd_density_score, entry_rate_per_minute } = input;

  if (!hospital_id) {
    throw new Error("hospital_id is required");
  }

  const timestamp_ms = Date.now();

  /* ---------- Deterministic Severity ---------- */

  let severity: CrowdSeverity = "SAFE";

  if (crowd_density_score >= 70) {
    severity = "CRITICAL";
  } else if (crowd_density_score >= 40) {
    severity = "WARNING";
  }

  /* ---------- Summary ---------- */

  const summary =
    severity === "SAFE"
      ? "Crowd density around hospital is within normal limits."
      : severity === "WARNING"
      ? "Elevated crowd density detected near hospital. OPD surge possible."
      : "Critical crowd congestion detected. Emergency influx likely.";

  /* ---------- Preparation Guidance ---------- */

  const preparation_guidance =
    severity === "SAFE"
      ? null
      : severity === "WARNING"
      ? [
          "Prepare OPD triage counters",
          "Alert emergency desk",
          "Monitor entry rate closely",
        ]
      : [
          "Activate surge protocol",
          "Prepare emergency triage",
          "Alert staffing & capacity agents",
        ];

  /* ---------- Memory Embedding ---------- */

  const embedding_text = `
Hospital crowd density signal.
Density score: ${crowd_density_score}
Entry rate per minute: ${entry_rate_per_minute ?? "unknown"}
Severity: ${severity}
`;

  const vector = await embedText(embedding_text);

  await upsertMemory(uuidv4(), vector, {
    hospital_id,
    agent: "CCTV_CROWD_AGENT",
    severity,
    crowd_density_score,
    entry_rate_per_minute,
    timestamp_ms,
  });

  /* ---------- TIMELINE LOGGING ---------- */

  await runEventTimelineAgent({
    hospital_id,
    event_type: "CCTV",
    severity,
    summary,
    source_agent: "CCTV_CROWD_AGENT",
    crowd_density_score,
  });

  /* ---------- AUTO-CHAIN EVENT ---------- */

  eventBus.emitAgentStateUpdate({
    event_type: "AGENT_STATE_UPDATED",
    source_agent: "CCTV",
    hospital_id,
    risk_level: severity,
    timestamp: timestamp_ms,
    correlation_id: uuidv4(),
  });

  /* ---------- Output ---------- */

  return {
    hospital_id,
    severity,
    summary,
    preparation_guidance,
    timestamp_ms,
  };
}
