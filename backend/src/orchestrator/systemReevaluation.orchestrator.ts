import { eventBus } from "./eventBus";
import { runSystemRiskAgent } from "../agents/systemRisk.agent";
import { v4 as uuidv4 } from "uuid";

/**
 * Prevent parallel reevaluations per hospital
 */
const inFlight = new Set<string>();

/**
 * 🧠 GLOBAL AGENT STATE MEMORY
 */
const agentStateStore: Record<
  string,
  Record<string, "SAFE" | "WARNING" | "CRITICAL">
> = {};

/**
 * 🧠 GLOBAL SYSTEM RISK STORE (AUTHORITATIVE SOURCE FOR UI)
 */
export const systemRiskStore: Record<
  string,
  {
    system_risk: "SAFE" | "WARNING" | "CRITICAL";
    contributors: string[];
    updated_at: number;
  }
> = {};

/**
 * 🌤️ Seed WEATHER as SAFE (no API call, no quota usage)
 */
function seedWeatherSafe(hospitalId: string) {
  eventBus.emitAgentStateUpdate({
    event_type: "AGENT_STATE_UPDATED",
    correlation_id: uuidv4(),

    hospital_id: hospitalId,
    source_agent: "WEATHER",
    risk_level: "SAFE",
    timestamp: Date.now(),
  });

  console.log(`🌤️ Weather state seeded as SAFE for ${hospitalId} (no API call)`);
}

/**
 * 🔁 FORCE COORDINATED REEVALUATION
 * (does NOT call APIs, only uses last-known states)
 */
function ensureAllCoreAgentsPresent(hospitalId: string) {
  const store = agentStateStore[hospitalId];

  if (!store.WEATHER) store.WEATHER = "SAFE";
  if (!store.CCTV) store.CCTV = "SAFE";
  if (!store.CAPACITY) store.CAPACITY = "SAFE";
}

export function initSystemReevaluationOrchestrator() {
  console.log("🧠 System reevaluation orchestrator started");

  // Seed baseline WEATHER once on startup
  setTimeout(() => {
    seedWeatherSafe("HOSP_TEST_001");
  }, 1000);

  eventBus.onAgentStateUpdate(async (event) => {
    const hospitalId = event.hospital_id;

    // ---- INIT STORE ----
    if (!agentStateStore[hospitalId]) {
      agentStateStore[hospitalId] = {};
    }

    // ---- UPDATE AGENT STATE ----
    agentStateStore[hospitalId][event.source_agent] = event.risk_level;

    // ---- STORM PROTECTION ----
    if (inFlight.has(hospitalId)) return;
    inFlight.add(hospitalId);

    try {
      /**
       * 🔥 KEY FIX
       * Any core agent triggers FULL reevaluation
       */
      if (["WEATHER", "CCTV", "CAPACITY"].includes(event.source_agent)) {
        ensureAllCoreAgentsPresent(hospitalId);
      }

      const states = agentStateStore[hospitalId];

      const systemResult = runSystemRiskAgent({
        hospital_id: hospitalId,

        weather: { risk_level: states.WEATHER },
        crowd: { risk_level: states.CCTV },

        capacity: { risk_level: states.CAPACITY },
        staff: { risk_level: states.STAFF ?? "SAFE" },
        equipment: { risk_level: states.EQUIPMENT ?? "SAFE" },
      });

      // ---- AUTHORITATIVE STORE ----
      systemRiskStore[hospitalId] = {
        system_risk: systemResult.system_risk,
        contributors: systemResult.contributing_agents,
        updated_at: Date.now(),
      };

      // ---- DEBUG TRACE ----
      console.log("🧠 [AUTO SYSTEM RISK UPDATED]", {
        hospital_id: hospitalId,
        correlation_id: uuidv4(),
        triggered_by: event.source_agent,
        agent_states: states,
        system_risk: systemResult.system_risk,
        contributors: systemResult.contributing_agents,
      });
    } catch (err) {
      console.error("❌ [SystemReevaluationOrchestrator]", err);
    } finally {
      inFlight.delete(hospitalId);
    }
  });
}