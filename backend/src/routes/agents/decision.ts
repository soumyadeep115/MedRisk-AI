import express from "express";
import { runDecisionAgent } from "../../agents/decision.agent";

const router = express.Router();

router.post("/analyze", (req, res) => {
  try {
    const result = runDecisionAgent(req.body);
    res.json(result);
  } catch (err) {
    console.error("Decision agent error:", err);
    res.status(500).json({ error: "Decision analysis failed" });
  }
});

export default router;
