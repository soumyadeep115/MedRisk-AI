import "dotenv/config";

import { scrollMemory, upsertMemory } from "../services/qdrant.service";

const VECTOR_SIZE = 1536; // MUST match Qdrant collection
const DUMMY_VECTOR = new Array(VECTOR_SIZE).fill(0.01);

async function backfillTimestamp() {
  // Scroll points WITHOUT vectors (correct)
  const points = await scrollMemory({}, 500);

  for (const point of points) {
    const payload = point.payload as Record<string, any> | undefined;
    if (!payload) continue;

    // Only backfill when timestamp_ms is missing
    if (
      payload.timestamp &&
      typeof payload.timestamp_ms !== "number"
    ) {
      const fixedPayload = {
        ...payload,
        timestamp_ms: new Date(payload.timestamp).getTime()
      };

      // ALWAYS inject dummy vector — NEVER read from point
      await upsertMemory(
        point.id,
        DUMMY_VECTOR,
        fixedPayload
      );
    }
  }

  console.log("✅ Timestamp backfill completed");
}

backfillTimestamp().catch((err) => {
  console.error("❌ Backfill failed:", err);
});
