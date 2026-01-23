import express from "express";
import { runCapacityRiskAgent } from "../../agents/capacity.agent";

const router = express.Router();

/**
 * POST /api/agents/capacity/analyze
 */
router.post("/analyze", async (req, res) => {
  try {
    const { icu, beds, staff, hospital_id } = req.body;

    if (
      icu === undefined ||
      beds === undefined ||
      staff === undefined ||
      !hospital_id
    ) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    const result = await runCapacityRiskAgent({
      icu,
      beds,
      staff,
      hospital_id
    });

    res.json(result);
  } catch (error) {
    console.error("Capacity agent error:", error);
    res.status(500).json({
      error: "Capacity risk analysis failed"
    });
  }
});

export default router;
