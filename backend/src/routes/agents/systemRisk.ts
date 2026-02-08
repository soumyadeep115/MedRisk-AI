import express from "express";
import { systemRiskStore } from "../../orchestrator/systemReevaluation.orchestrator";

const router = express.Router();

/**
 * ✅ GET CURRENT SYSTEM RISK (AUTHORITATIVE SOURCE)
 * Used by frontend SystemRiskPanel
 *
 * Example:
 * GET /api/agents/system-risk/current?hospital_id=HOSP_TEST_001
 */
router.get("/current", (req, res) => {
  const hospital_id = req.query.hospital_id as string | undefined;

  // ---- VALIDATION ----
  if (!hospital_id) {
    return res.status(400).json({
      error: "hospital_id query parameter is required",
    });
  }

  const current = systemRiskStore[hospital_id];

  // ---- NO DATA YET → SAFE BASELINE ----
  if (!current) {
    return res.json({
      hospital_id,
      system_risk: "SAFE",
      contributors: [],
      updated_at: null,
      note: "No agent signals received yet for this hospital",
    });
  }

  // ---- AUTHORITATIVE SYSTEM STATE ----
  return res.json({
    hospital_id,
    system_risk: current.system_risk,
    contributors: current.contributors,
    updated_at: current.updated_at,
  });
});

export default router;