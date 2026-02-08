import express from "express";
import { scrollTimelineEvents } from "../../services/qdrant.service";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const hospital_id = req.query.hospital_id as string;

    if (!hospital_id) {
      return res.status(400).json({ error: "hospital_id required" });
    }

    // Fetch from Qdrant (safe even if empty)
    const allEvents = await scrollTimelineEvents({}, 50);

    // Ensure array
    const safeEvents = Array.isArray(allEvents) ? allEvents : [];

    // Filter by hospital
    const filtered = safeEvents.filter(
      (e: any) => e?.payload?.hospital_id === hospital_id
    );

    // Remove events without timestamp (CRITICAL FIX)
    const withTimestamp = filtered.filter(
      (e: any) => typeof e?.payload?.timestamp_ms === "number"
    );

    // Sort newest first
    withTimestamp.sort(
      (a: any, b: any) =>
        b.payload.timestamp_ms - a.payload.timestamp_ms
    );

    // Always return array
    res.json(withTimestamp);
  } catch (err: any) {
  console.warn("⚠️ Event replay fallback:", err?.message);

  res.json([]); // 👈 NEVER return 500
}
});

export default router;