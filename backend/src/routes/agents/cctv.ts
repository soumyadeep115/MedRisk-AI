import express from "express";
import { evaluateCrowdDensity } from "../../agents/crowdDensity.agent";

const router = express.Router();

/**
 * POST /api/agents/cctv
 */
router.post("/", async (req, res) => {
  try {
    const {
      hospital_id,
      crowd_density_score,
      entry_rate_per_minute,
    } = req.body;

    if (!hospital_id || typeof hospital_id !== "string") {
      return res.status(400).json({ error: "hospital_id is required" });
    }

    if (typeof crowd_density_score !== "number") {
      return res
        .status(400)
        .json({ error: "crowd_density_score must be a number" });
    }

    const result = await evaluateCrowdDensity({
      hospital_id,
      crowd_density_score,
      entry_rate_per_minute,
    });

    res.json(result);
  } catch (err: any) {
    console.error("[CCTV_ROUTE_ERROR]", err);
    res.status(500).json({
      error: "CCTV agent failed",
      details: err.message,
    });
  }
});

/* ✅ THIS EXPORT WAS MISSING / MISUSED */
export { router as cctvRouter };
