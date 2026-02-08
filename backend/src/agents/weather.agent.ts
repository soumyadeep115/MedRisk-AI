import axios from "axios";
import { runEventTimelineAgent } from "./eventTimeline.agent";
import { runCapacityRiskAgent } from "./capacity.agent";
import { eventBus } from "../orchestrator/eventBus";
import { v4 as uuidv4 } from "uuid";

interface WeatherbitCurrentResponse {
  data: Array<{
    temp: number;
    aqi: number;
  }>;
}

const WEATHERBIT_KEY = process.env.WEATHERBIT_API_KEY;
const BASE_URL = process.env.WEATHERBIT_BASE_URL;

export async function runWeatherAgent(input: any) {
  /* ---------- INPUT GUARDS ---------- */
  const hospital_id = input?.hospital_id ?? "UNKNOWN_HOSPITAL";
  const city = input?.city ?? "Mumbai";
  const country = input?.country ?? "IN";

  let temp = 33;
  let aqi = 90;
  let summarySuffix = " (fallback data)";

  /* ---------- 1. Fetch Weather (SAFE) ---------- */
  if (WEATHERBIT_KEY && BASE_URL) {
    try {
      const res = await axios.get<WeatherbitCurrentResponse>(
        `${BASE_URL}/current`,
        {
          params: { city, country, key: WEATHERBIT_KEY },
        }
      );

      temp = res.data.data[0].temp;
      aqi = res.data.data[0].aqi;
      summarySuffix = "";
    } catch {
      console.warn("⚠️ Weatherbit unavailable, using fallback");
    }
  } else {
    console.warn("⚠️ Weatherbit env missing, using fallback");
  }

  /* ---------- 2. Risk Logic ---------- */
  let severity: "SAFE" | "WARNING" | "CRITICAL" = "SAFE";

  if (aqi >= 150 || temp >= 40) severity = "CRITICAL";
  else if (aqi >= 100 || temp >= 35) severity = "WARNING";

  const summary = `Weather risk: Temp=${temp}°C, AQI=${aqi}${summarySuffix}`;

  /* ---------- 3. Timeline (NON-BLOCKING) ---------- */
  try {
    await runEventTimelineAgent({
      hospital_id,
      event_type: "WEATHER",
      severity,
      summary,
      source_agent: "WEATHER_AGENT",
    });
  } catch {
    console.warn("⚠️ Timeline logging skipped");
  }

  /* ---------- 4. AUTO-CHAIN EVENT (NON-BLOCKING) ---------- */
  try {
    eventBus.emitAgentStateUpdate({
      event_type: "AGENT_STATE_UPDATED",
      source_agent: "WEATHER",
      hospital_id,
      risk_level: severity,
      timestamp: Date.now(),
      correlation_id: uuidv4(),
    });
  } catch {
    console.warn("⚠️ Event bus emit skipped");
  }

  /* ---------- 5. Capacity Escalation (SAFE) ---------- */
  if (severity !== "SAFE") {
    try {
      await runCapacityRiskAgent({
        hospital_id,
        icu: 0,
        beds: 0,
        staff: 0,
        external_risk: {
          source: "WEATHER",
          severity,
        },
      });
    } catch {
      console.warn("⚠️ Capacity escalation skipped");
    }
  }

  /* ---------- FINAL RESPONSE (ALWAYS RETURNS) ---------- */
  return {
    hospital_id,
    city,
    temp,
    aqi,
    severity,
    summary,
    source: WEATHERBIT_KEY ? "weatherbit" : "fallback",
  };
}