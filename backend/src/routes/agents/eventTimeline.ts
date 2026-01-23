import express from "express";
import { runEventTimelineAgent } from "../../agents/eventTimeline.agent";

const router = express.Router();

/**
 * POST /api/agents/event-timeline/log
 */
router.post("/log", async (req, res) => {
  try {
    const result = await runEventTimelineAgent(req.body);
    res.json(result);
  } catch (err: any) {
    if (err?.response) {
      console.error("Qdrant error status:", err.response.status);
      console.error("Qdrant error data:", err.response.data);
    } else {
      console.error("Unknown error:", err);
    }

    res.status(500).json({
      error: "Event timeline logging failed",
      details: err?.response?.data || err.message,
    });
  }
});

export default router;
