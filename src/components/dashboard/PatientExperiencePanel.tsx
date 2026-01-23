import { Heart, Eye } from "lucide-react";
import { AgentCard } from "./RiskComponents";
import { Badge } from "@/components/ui/badge";

interface PatientExperiencePanelProps {
  className?: string;
}

export function PatientExperiencePanel({ className }: PatientExperiencePanelProps) {
  // Simulated signals
  const signals = {
    avgRating: 3.1,
    waitTimeComplaints: 42,
    dischargeNegative: 38,
  };

  // AgentCard-compatible status
  const status: "safe" | "warning" =
    signals.avgRating < 3.2 || signals.waitTimeComplaints > 40
      ? "warning"
      : "safe";

  const reasoning =
    status === "warning"
      ? "Patient satisfaction has declined below acceptable thresholds, with elevated wait-time complaints indicating operational strain."
      : "Patient experience indicators remain within acceptable limits.";

  const monitoredSignals = [
    { label: "Patient Satisfaction Scores", value: `${signals.avgRating}/5` },
    { label: "Wait Time Complaints", value: `${signals.waitTimeComplaints}%` },
    { label: "Discharge Feedback (Negative)", value: `${signals.dischargeNegative}%` },
    { label: "Care Quality Surveys", value: "Monitoring" },
  ];

  return (
    <AgentCard
      title="Patient Experience Agent"
      description="Monitors patient satisfaction and care quality signals"
      icon={<Heart className="w-5 h-5" />}
      status={status}
      agentColor="patient"
      className={className}
    >
      <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg mb-4">
        <Eye className="w-4 h-4 text-agent-patient" />
        <span className="text-sm font-medium">
          Status: {status === "safe" ? "OBSERVING" : "WARNING"}
        </span>
        <Badge variant="outline" className="ml-auto text-xs">
          Advisory Mode
        </Badge>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium mb-3">Monitored Signals</h4>
        {monitoredSignals.map((s, i) => (
          <div key={i} className="flex justify-between p-2 bg-card border rounded">
            <span className="text-sm">{s.label}</span>
            <Badge variant="secondary">{s.value}</Badge>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-muted/20 border rounded-lg">
        <p className="text-sm italic text-muted-foreground text-center">
          {reasoning}
        </p>
      </div>
    </AgentCard>
  );
}
