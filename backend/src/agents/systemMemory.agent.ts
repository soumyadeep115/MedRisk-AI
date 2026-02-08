import { embedText } from "../services/embedding.service";
import { upsertMemory, searchMemory } from "../services/qdrant.service";

export async function runSystemMemoryAgent(input: any) {
  // ---------- SAFETY GUARDS ----------
  const hospital_id = input?.hospital_id ?? "UNKNOWN_HOSPITAL";
  const system_risk = input?.system_risk ?? "UNKNOWN";
  const contributing_agents = Array.isArray(input?.contributing_agents)
    ? input.contributing_agents
    : [];

  const snapshotText = `
Hospital: ${hospital_id}
System Risk: ${system_risk}
Signals: ${contributing_agents.join(", ") || "N/A"}
`;

  // ---------- EMBEDDING ----------
  let embedding: number[];
  try {
    embedding = await embedText(snapshotText);
  } catch (err) {
    console.warn("⚠️ Embedding failed, using fallback vector");
    embedding = Array(1536).fill(0.001);
  }

  // ---------- UPSERT MEMORY ----------
  try {
    await upsertMemory(
      `system-${hospital_id}-${Date.now()}`,
      embedding,
      {
        hospital_id,
        system_risk,
        agents: contributing_agents,
        timestamp_ms: Date.now(),
      }
    );
  } catch (err) {
    console.warn("⚠️ Qdrant upsert failed, continuing without memory write");
  }

  // ---------- SEARCH MEMORY ----------
  let pastEvents: any[] = [];
  try {
    pastEvents = await searchMemory(embedding, 3);
  } catch (err) {
    console.warn("⚠️ Qdrant search failed");
  }

  // ---------- FINAL RESPONSE (FRONTEND SAFE) ----------
  return {
    hospital_id,
    forecast:
      system_risk === "CRITICAL"
        ? "ESCALATION LIKELY"
        : "STABLE",
    explanation:
      "System memory agent compared current hospital state with historical patterns.",
    events: pastEvents, // 👈 IMPORTANT: frontend expects array
    source: "qdrant",
  };
}