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

const WEATHERBIT_KEY = process.env.WEATHERBIT_API_KEY!;
const BASE_URL = process.env.WEATHERBIT_BASE_URL!;

export async function runWeatherAgent(input: {
  hospital_id: string;
  city: string;
  country?: string;
}) {
  const { hospital_id, city, country = "IN" } = input;

  let temp: number;
  let aqi: number;
  let summarySuffix = "";

  /* ---------- 1. Fetch Weather ---------- */
  try {
    const res = await axios.get<WeatherbitCurrentResponse>(
      `${BASE_URL}/current`,
      {
        params: { city, country, key: WEATHERBIT_KEY },
      }
    );

    temp = res.data.data[0].temp;
    aqi = res.data.data[0].aqi;
  } catch {
    console.warn("Weatherbit unavailable, using fallback");
    temp = 33;
    aqi = 90;
    summarySuffix = " (fallback data)";
  }

  /* ---------- 2. Risk Logic ---------- */
  let severity: "SAFE" | "WARNING" | "CRITICAL" = "SAFE";

  if (aqi >= 150 || temp >= 40) severity = "CRITICAL";
  else if (aqi >= 100 || temp >= 35) severity = "WARNING";

  const summary = `Weather risk: Temp=${temp}°C, AQI=${aqi}${summarySuffix}`;

  /* ---------- 3. Timeline ---------- */
  await runEventTimelineAgent({
    hospital_id,
    event_type: "WEATHER",
    severity,
    summary,
    source_agent: "WEATHER_AGENT",
  });

  /* ---------- 4. AUTO-CHAIN EVENT ---------- */
  eventBus.emitAgentStateUpdate({
    event_type: "AGENT_STATE_UPDATED",
    source_agent: "WEATHER",
    hospital_id,
    risk_level: severity,
    timestamp: Date.now(),
    correlation_id: uuidv4(),
  });

  /* ---------- 5. Capacity Escalation ---------- */
  if (severity !== "SAFE") {
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
  }

  return {
    hospital_id,
    temp,
    aqi,
    severity,
    summary,
  };
}
