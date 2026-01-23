import express from "express";
import { runEquipmentRiskAgent } from "../../agents/equipment.agent";

const router = express.Router();

router.post("/analyze", (req, res) => {
  try {
    const result = runEquipmentRiskAgent(req.body);
    res.json(result);
  } catch (err) {
    console.error("Equipment agent error:", err);
    res.status(500).json({ error: "Equipment risk analysis failed" });
  }
});

export default router;
