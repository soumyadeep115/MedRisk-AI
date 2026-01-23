import express from "express";
import { runSystemAggregator } from "../../agents/systemAggregator.agent";

const router = express.Router();

/**
 * POST /api/agents/system-aggregator
 */
router.post("/", async (req, res) => {
  try {
    const { hospital_id } = req.body;

    const result = await runSystemAggregator(hospital_id);
    res.json(result);
  } catch (err: any) {
    console.error("System Aggregator Error:", err.message);
    res.status(500).json({
      error: "System aggregation failed",
      details: err.message,
    });
  }
});

export default router;
