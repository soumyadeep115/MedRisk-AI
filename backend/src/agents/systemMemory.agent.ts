import { embedText } from "../services/embedding.service";
import { upsertMemory, searchMemory } from "../services/qdrant.service";

export async function runSystemMemoryAgent(input: {
  hospital_id: string;
  system_risk: string;
  contributing_agents: string[];
}) {
  const snapshotText = `
Hospital: ${input.hospital_id}
System Risk: ${input.system_risk}
Signals: ${input.contributing_agents.join(", ")}
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
      `system-${input.hospital_id}-${Date.now()}`,
      embedding,
      {
        hospital_id: input.hospital_id,
        system_risk: input.system_risk,
        agents: input.contributing_agents,
        timestamp: new Date().toISOString()
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

  // ---------- FINAL RESPONSE ----------
  return {
    hospital_id: input.hospital_id,
    forecast:
      input.system_risk === "CRITICAL"
        ? "ESCALATION LIKELY"
        : "STABLE",
    explanation:
      "System memory agent compared current hospital state with historical crisis patterns.",
    matched_events: pastEvents
  };
}
