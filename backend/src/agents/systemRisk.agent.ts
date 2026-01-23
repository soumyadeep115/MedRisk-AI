type AgentResult = {
  risk_level: "SAFE" | "WARNING" | "CRITICAL";
  drivers?: string[];
};

type SystemInput = {
  hospital_id: string;
  capacity: AgentResult;
  staff: AgentResult;
  equipment: AgentResult;
};

export function runSystemRiskAgent(input: SystemInput) {
  const riskScores = {
    SAFE: 0,
    WARNING: 1,
    CRITICAL: 2
  };

  const agents = [
    { name: "Capacity", ...input.capacity },
    { name: "Staff Burnout", ...input.staff },
    { name: "Equipment", ...input.equipment }
  ];

  let totalScore = 0;
  const contributingAgents: string[] = [];

  for (const agent of agents) {
    totalScore += riskScores[agent.risk_level];
    if (agent.risk_level !== "SAFE") {
      contributingAgents.push(`${agent.name}: ${agent.risk_level}`);
    }
  }

  let system_risk: "SAFE" | "WARNING" | "CRITICAL" = "SAFE";

  if (totalScore >= 4) system_risk = "CRITICAL";
  else if (totalScore >= 2) system_risk = "WARNING";

  return {
    hospital_id: input.hospital_id,
    system_risk,
    contributing_agents: contributingAgents,
    explanation:
      "System risk is computed by aggregating risk signals from capacity, staff burnout, and equipment agents."
  };
}
export async function runSystemRiskEvaluation(input: {
  hospital_id: string
  trigger: 'MANUAL' | 'AUTO'
  correlation_id: string
  caused_by?: {
    source_agent: string
    risk_level: string
    timestamp: number
  }
  capacity: AgentResult
  staff: AgentResult
  equipment: AgentResult
}) {
  const result = runSystemRiskAgent({
    hospital_id: input.hospital_id,
    capacity: input.capacity,
    staff: input.staff,
    equipment: input.equipment,
  })

  return {
    ...result,
    trigger: input.trigger,
    correlation_id: input.correlation_id,
    caused_by: input.caused_by,
  }
}

