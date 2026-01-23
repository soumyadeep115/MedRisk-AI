import express from "express";
import { runStaffBurnoutAgent } from "../../agents/staffBurnout.agent";

const router = express.Router();

router.post("/analyze", (req, res) => {
  try {
    const result = runStaffBurnoutAgent(req.body);
    res.json(result);
  } catch (err) {
    console.error("Staff Burnout agent error:", err);
    res.status(500).json({ error: "Staff burnout analysis failed" });
  }
});

export default router;
