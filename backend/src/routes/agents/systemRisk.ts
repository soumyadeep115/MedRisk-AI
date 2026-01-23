import express from "express";
import { runSystemRiskAgent } from "../../agents/systemRisk.agent";

const router = express.Router();

router.post("/analyze", (req, res) => {
  try {
    const result = runSystemRiskAgent(req.body);
    res.json(result);
  } catch (err) {
    console.error("System Risk agent error:", err);
    res.status(500).json({ error: "System risk analysis failed" });
  }
});

export default router;
