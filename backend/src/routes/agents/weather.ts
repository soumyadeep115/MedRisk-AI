import express from "express";
import { runWeatherAgent } from "../../agents/weather.agent";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const result = await runWeatherAgent(req.body);
    res.json(result);
  } catch (err: any) {
    console.error("Weather Agent error:", err?.response?.data || err.message);
    res.status(500).json({
      error: "Weather agent failed",
      details: err?.response?.data || err.message,
    });
  }
});

export default router;
