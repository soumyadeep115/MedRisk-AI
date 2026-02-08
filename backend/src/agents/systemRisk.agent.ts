/* ================= TYPES ================= */

export type RiskLevel = "SAFE" | "WARNING" | "CRITICAL";

export type AgentResult = {
  risk_level: RiskLevel;
  drivers?: string[];
};

export type SystemInput = {
  hospital_id: string;

  weather?: AgentResult;
  crowd?: AgentResult;

  capacity: AgentResult;
  staff: AgentResult;
  equipment: AgentResult;
};

/* ================= CORE AGENT ================= */

export function runSystemRiskAgent(input: SystemInput) {
  const riskScores: Record<RiskLevel, number> = {
    SAFE: 0,
    WARNING: 1,
    CRITICAL: 2,
  };

  const agents = [
    { name: "Weather", risk: input.weather?.risk_level ?? "SAFE" },
    { name: "Crowd Density", risk: input.crowd?.risk_level ?? "SAFE" },
    { name: "Capacity", risk: input.capacity.risk_level },
    { name: "Staff Burnout", risk: input.staff.risk_level },
    { name: "Equipment", risk: input.equipment.risk_level },
  ];

  let totalScore = 0;
  const contributingAgents: string[] = [];

  for (const agent of agents) {
    totalScore += riskScores[agent.risk];

    if (agent.risk !== "SAFE") {
      contributingAgents.push(`${agent.name}: ${agent.risk}`);
    }
  }

  let system_risk: RiskLevel = "SAFE";

  if (totalScore >= 4) system_risk = "CRITICAL";
  else if (totalScore >= 2) system_risk = "WARNING";

  return {
    hospital_id: input.hospital_id,
    system_risk,
    contributing_agents: contributingAgents,
    explanation:
      "System risk is computed by aggregating weather, crowd density, capacity, staff burnout, and equipment signals.",
  };
}

/* ================= ORCHESTRATED WRAPPER ================= */

export async function runSystemRiskEvaluation(input: {
  hospital_id: string;
  trigger: "MANUAL" | "AUTO";
  correlation_id: string;
  caused_by?: {
    source_agent: string;
    risk_level: RiskLevel;
    timestamp: number;
  };

  weather?: AgentResult;
  crowd?: AgentResult;
  capacity: AgentResult;
  staff: AgentResult;
  equipment: AgentResult;
}) {
  const result = runSystemRiskAgent({
    hospital_id: input.hospital_id,
    weather: input.weather,
    crowd: input.crowd,
    capacity: input.capacity,
    staff: input.staff,
    equipment: input.equipment,
  });

  return {
    ...result,
    trigger: input.trigger,
    correlation_id: input.correlation_id,
    caused_by: input.caused_by,
  };
}