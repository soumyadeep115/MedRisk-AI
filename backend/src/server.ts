import dotenv from "dotenv";
dotenv.config(); // MUST be first

import express from "express";
import cors from "cors";

/* ---------- AUTO-CHAIN ORCHESTRATOR ---------- */
import { initSystemReevaluationOrchestrator } from "./orchestrator/systemReevaluation.orchestrator";

/* ---------- ROUTES ---------- */
import capacityRoute from "./routes/agents/capacity";
import staffBurnoutRoute from "./routes/agents/staffBurnout";
import equipmentRoute from "./routes/agents/equipment";
import systemRiskRoute from "./routes/agents/systemRisk";
import decisionRoute from "./routes/agents/decision";
import systemMemoryRoute from "./routes/agents/system-memory";
import eventReplayRoute from "./routes/agents/eventReplay";
import weatherRoute from "./routes/agents/weather";
import crowdDensityRoute from "./routes/agents/crowdDensity";
import { cctvRouter } from "./routes/agents/cctv";
import systemAggregatorRoute from "./routes/agents/system-aggregator";

/* ---------- APP SETUP ---------- */
const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log("🔍 INCOMING REQUEST");
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("HEADERS ORIGIN:", req.headers.origin);
  console.log("-----------------------------");
  next();
});

/* ---------- HEALTH ---------- */
app.get("/health", (_req, res) => {
  res.json({ status: "MedRisk AI backend running" });
});

/* ---------- AGENT ROUTES ---------- */
app.use("/api/agents/capacity", capacityRoute);
app.use("/api/agents/staff-burnout", staffBurnoutRoute);
app.use("/api/agents/equipment", equipmentRoute);
app.use("/api/agents/system-risk", systemRiskRoute);
app.use("/api/agents/decision", decisionRoute);
app.use("/api/agents/system-memory", systemMemoryRoute);
app.use("/api/agents/event-replay", eventReplayRoute);
app.use("/api/agents/weather", weatherRoute);
app.use("/api/agents/crowd-density", crowdDensityRoute);
app.use("/api/agents/cctv", cctvRouter);
app.use("/api/agents/system-aggregator", systemAggregatorRoute);

/* ---------- START ORCHESTRATOR SAFELY ---------- */
try {
  initSystemReevaluationOrchestrator();
  console.log("🧠 System reevaluation orchestrator started");
} catch (err) {
  console.warn("⚠️ Orchestrator failed to start, continuing without it");
}

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 MedRisk AI backend listening on port ${PORT}`);
});