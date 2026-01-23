import { eventBus } from "./eventBus";
import { runSystemRiskAgent } from "../agents/systemRisk.agent";
import { v4 as uuidv4 } from "uuid";

const inFlight = new Set<string>();

export function initSystemReevaluationOrchestrator() {
  eventBus.onAgentStateUpdate(async (event) => {
    const key = event.hospital_id;

    // Prevent storm / race conditions
    if (inFlight.has(key)) return;
    inFlight.add(key);

    try {
      /**
       * IMPORTANT:
       * System Risk Agent is PURE LOGIC.
       * It must be fed by latest known agent states.
       *
       * For now (hackathon-safe), we derive minimal inputs
       * from the triggering event.
       */

      const systemResult = runSystemRiskAgent({
        hospital_id: event.hospital_id,
        capacity: {
          risk_level: event.source_agent === "CAPACITY"
            ? event.risk_level
            : "SAFE",
        },
        staff: {
          risk_level: event.source_agent === "STAFF"
            ? event.risk_level
            : "SAFE",
        },
        equipment: {
          risk_level: event.source_agent === "EQUIPMENT"
            ? event.risk_level
            : "SAFE",
        },
      });

      // 🔹 Optional: log or forward this later to timeline agent
      console.log("[AUTO SYSTEM RISK]", {
        trigger: "AUTO",
        correlation_id: uuidv4(),
        caused_by: event.source_agent,
        result: systemResult,
      });

    } catch (err) {
      console.error("[SystemReevaluationOrchestrator]", err);
    } finally {
      inFlight.delete(key);
    }
  });
}
