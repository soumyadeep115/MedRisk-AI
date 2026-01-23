import { v4 as uuidv4 } from "uuid";
import { upsertTimelineEvent } from "../services/qdrant.service";

/**
 * Dummy vector (timeline is NOT similarity-searched)
 */
const VECTOR_SIZE = Number(process.env.QDRANT_VECTOR_SIZE || 1536);
const DUMMY_VECTOR = Array(VECTOR_SIZE).fill(0.001);

export type EventType =
  | "CAPACITY"
  | "STAFF"
  | "EQUIPMENT"
  | "SYSTEM"
  | "WEATHER"
  | "CCTV";

export type Severity = "SAFE" | "WARNING" | "CRITICAL";

export interface TimelineEventInput {
  hospital_id: string;
  event_type: EventType;
  severity: Severity;
  summary: string;
  source_agent: string;

  // ✅ REQUIRED FOR CCTV GRAPH
  crowd_density_score?: number;
}


/**
 * WRITE-ONLY Timeline Agent
 */
export async function runEventTimelineAgent(
  event: TimelineEventInput
) {
  if (!event.hospital_id) {
    throw new Error("hospital_id is required");
  }
  if (!event.source_agent) {
    throw new Error("source_agent is required");
  }

  const payload = {
  hospital_id: event.hospital_id,
  event_type: event.event_type,
  severity: event.severity,
  summary: event.summary,
  source_agent: event.source_agent,

  // ✅ STORE RAW SIGNAL
  crowd_density_score: event.crowd_density_score,

  timestamp: new Date().toISOString(),
  timestamp_ms: Date.now(),
};


  await upsertTimelineEvent(
    uuidv4(),      // pure UUID
    DUMMY_VECTOR,
    payload
  );
}
