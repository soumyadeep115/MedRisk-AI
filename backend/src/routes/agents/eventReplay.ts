import express from "express";
import { scrollTimelineEvents } from "../../services/qdrant.service";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const hospital_id = req.query.hospital_id;

    if (!hospital_id) {
      return res.status(400).json({ error: "hospital_id required" });
    }

    const allEvents = await scrollTimelineEvents({}, 50);

// Filter in application layer (NO index required)
const events = allEvents.filter(
  (e: any) => e.payload?.hospital_id === hospital_id
);



    // Sort newest first
    const sorted = events.sort(
      (a: any, b: any) =>
        b.payload.timestamp_ms - a.payload.timestamp_ms
    );

    res.json(sorted);
  } catch (err: any) {
  console.error("Event replay error:");
  console.error(err?.response?.status);
  console.error(err?.response?.data || err.message);

  res.status(500).json({
    error: "Event replay failed",
    details: err?.response?.data || err.message,
  });
}

});

export default router;
