import { fetchLatestSystemState } from "./systemStateReader";
import { runEventTimelineAgent } from "./eventTimeline.agent";

type Severity = "SAFE" | "WARNING" | "CRITICAL";

export async function runSystemAggregator(hospital_id: string) {
  if (!hospital_id) {
    throw new Error("hospital_id is required");
  }

  /* ---------- 1. Fetch persisted agent states ---------- */
  const systemState = await fetchLatestSystemState(hospital_id);

  if (Object.keys(systemState).length === 0) {
    return {
      hospital_id,
      system_severity: "SAFE",
      contributors: {},
      explanation:
        "No recent agent signals available. System assumed SAFE by default.",
      timestamp_ms: Date.now(),
    };
  }

  /* ---------- 2. Severity scoring ---------- */
  const scoreMap: Record<Severity, number> = {
    SAFE: 0,
    WARNING: 1,
    CRITICAL: 2,
  };

  let totalScore = 0;
  const contributors: Record<string, Severity> = {};
  const contributorList: string[] = [];

  for (const snapshot of Object.values(systemState)) {
    totalScore += scoreMap[snapshot.risk_level];
    contributors[snapshot.agent] = snapshot.risk_level;

    if (snapshot.risk_level !== "SAFE") {
      contributorList.push(
        `${snapshot.agent}: ${snapshot.risk_level}`
      );
    }
  }

  /* ---------- 3. Final system severity ---------- */
  let systemSeverity: Severity = "SAFE";

  if (totalScore >= 5) {
    systemSeverity = "CRITICAL";
  } else if (totalScore >= 2) {
    systemSeverity = "WARNING";
  }

  /* ---------- 4. Explanation ---------- */
  const summary =
    systemSeverity === "SAFE"
      ? "All monitored subsystems operating within safe thresholds."
      : systemSeverity === "WARNING"
      ? "Multiple subsystems show elevated risk. Prepare mitigation."
      : "Critical system-wide risk detected. Immediate action required.";

  /* ---------- 5. Timeline logging ---------- */
  await runEventTimelineAgent({
    hospital_id,
    event_type: "SYSTEM",
    severity: systemSeverity,
    summary: `${summary}${
      contributorList.length
        ? ` | Contributors: ${contributorList.join(", ")}`
        : ""
    }`,
    source_agent: "SYSTEM_AGGREGATOR",
  });

  /* ---------- 6. Return ---------- */
  return {
    hospital_id,
    system_severity: systemSeverity,
    contributors,
    explanation: summary,
    evaluated_agents: systemState,
    timestamp_ms: Date.now(),
  };
}
