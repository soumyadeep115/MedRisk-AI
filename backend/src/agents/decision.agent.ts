type DecisionInput = {
  hospital_id: string;
  system_risk: "SAFE" | "WARNING" | "CRITICAL";
  agents: Record<string, { risk_level: string }>;
};

export function runDecisionAgent(input: DecisionInput) {
  const actions: string[] = [];
  const reasoning: string[] = [];

  if (input.system_risk === "CRITICAL") {
    actions.push(
      "Activate surge ICU beds within 2 hours",
      "Freeze elective admissions temporarily",
      "Initiate emergency command briefing"
    );
    reasoning.push("System risk is CRITICAL");
  }

  if (input.agents.capacity?.risk_level === "CRITICAL") {
    actions.push("Redistribute patients to partner hospitals");
    reasoning.push("Capacity agent reports CRITICAL risk");
  }

  if (input.agents.staff?.risk_level === "WARNING") {
    actions.push("Reduce overtime and rotate staff shifts");
    reasoning.push("Staff burnout risk detected");
  }

  if (input.agents.equipment?.risk_level === "CRITICAL") {
    actions.push("Fast-track repair for critical equipment");
    reasoning.push("Equipment availability compromised");
  }

  return {
    hospital_id: input.hospital_id,
    urgency: input.system_risk === "CRITICAL" ? "IMMEDIATE" : "MONITOR",
    recommended_actions: [...new Set(actions)],
    reasoning
  };
}
