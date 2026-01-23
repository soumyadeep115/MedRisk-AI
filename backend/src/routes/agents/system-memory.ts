import express from "express";
import { runSystemMemoryAgent } from "../../agents/systemMemory.agent";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const result = await runSystemMemoryAgent(req.body); // ✅ MUST await
    res.json(result);
  } catch (err) {
    console.error("❌ System Memory agent error:", err);
    res.status(500).json({ error: "System memory analysis failed" });
  }
});

export default router;
