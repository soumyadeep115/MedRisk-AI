import { Router } from "express";
import { evaluateCrowdDensity } from "../../agents/crowdDensity.agent";

const router = Router();

router.post("/evaluate", async (req, res) => {
  try {
    const { hospital_id, crowd_density_score, entry_rate_per_minute } = req.body;

    if (
      typeof hospital_id !== "string" ||
      typeof crowd_density_score !== "number"
    ) {
      return res.status(400).json({ error: "Invalid input payload" });
    }

    const result = await evaluateCrowdDensity({
      hospital_id,
      crowd_density_score,
      entry_rate_per_minute
    });

    res.json(result);
  } catch (err) {
    console.error("[CROWD_DENSITY_ROUTE] Failed", err);
    res.status(500).json({ error: "Crowd density evaluation failed" });
  }
});

export default router;
