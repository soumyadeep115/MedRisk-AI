import { searchMemory } from "../services/qdrant.service";

export type AgentName =
  | "CAPACITY"
  | "STAFF"
  | "EQUIPMENT"
  | "CCTV"
  | "WEATHER";

export type AgentSnapshot = {
  agent: AgentName;
  risk_level: "SAFE" | "WARNING" | "CRITICAL";
  timestamp_ms: number;
};

export type SystemState = Partial<Record<AgentName, AgentSnapshot>>;

/**
 * Fetch latest known risk state per agent for a hospital.
 * STRICT-MODE SAFE: uses vector search + in-code filtering.
 */
export async function fetchLatestSystemState(
  hospital_id: string
): Promise<SystemState> {
  // Dummy vector already supported in your system
  const DUMMY_VECTOR = new Array(1536).fill(0.00001);

  // Pull recent memory entries
  const results = await searchMemory(DUMMY_VECTOR, 25);

  const state: SystemState = {};

  for (const point of results) {
    const payload = point.payload as any;

    if (!payload?.hospital_id) continue;
    if (payload.hospital_id !== hospital_id) continue;

    const agent = normalizeAgent(payload.agent);
    if (!agent) continue;

    const timestamp_ms =
      payload.timestamp_ms ??
      (payload.timestamp
        ? Date.parse(payload.timestamp)
        : undefined);

    if (!timestamp_ms) continue;

    // Keep only the LATEST snapshot per agent
    if (!state[agent] || timestamp_ms > state[agent]!.timestamp_ms) {
      state[agent] = {
        agent,
        risk_level: payload.risk_level ?? payload.severity,
        timestamp_ms,
      };
    }
  }

  return state;
}

/* ---------- Helpers ---------- */

function normalizeAgent(raw: string | undefined): AgentName | null {
  if (!raw) return null;

  if (raw.includes("Capacity")) return "CAPACITY";
  if (raw.includes("Staff")) return "STAFF";
  if (raw.includes("Equipment")) return "EQUIPMENT";
  if (raw.includes("CCTV")) return "CCTV";
  if (raw.includes("Weather")) return "WEATHER";

  return null;
}
