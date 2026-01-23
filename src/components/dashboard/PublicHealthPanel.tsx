import { Globe, Eye } from "lucide-react";
import { AgentCard } from "./RiskComponents";
import { Badge } from "@/components/ui/badge";

interface PublicHealthPanelProps {
  className?: string;
}

export function PublicHealthPanel({ className }: PublicHealthPanelProps) {
  const signals = {
    admissionGrowth: 26,
    airQualityIndex: 178,
    vaccinationCoverage: 71,
  };

  const status: "safe" | "warning" =
    signals.admissionGrowth > 25 || signals.airQualityIndex > 150
      ? "warning"
      : "safe";

  const reasoning =
    status === "warning"
      ? "A sustained rise in admissions and deteriorating air quality indicate emerging public health pressure."
      : "No abnormal epidemiological signals detected at this time.";

  const monitoredSignals = [
    { label: "Admissions Growth", value: `${signals.admissionGrowth}%` },
    { label: "Air Quality Index", value: signals.airQualityIndex },
    { label: "Vaccination Coverage", value: `${signals.vaccinationCoverage}%` },
    { label: "Regional Alerts", value: "Monitoring" },
  ];

  return (
    <AgentCard
      title="Public Health Agent"
      description="Monitors external health threats and epidemiological signals"
      icon={<Globe className="w-5 h-5" />}
      status={status}
      agentColor="public"
      className={className}
    >
      <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg mb-4">
        <Eye className="w-4 h-4 text-agent-public" />
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
