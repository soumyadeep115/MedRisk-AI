import { Package, Eye } from "lucide-react";
import { AgentCard } from "./RiskComponents";
import { Badge } from "@/components/ui/badge";

interface ResourceRiskPanelProps {
  className?: string;
}

export function ResourceRiskPanel({ className }: ResourceRiskPanelProps) {
  const signals = {
    oxygen: 28,
    pharmacy: 35,
    equipment: 72,
    bloodBank: 48,
  };

  let status: "safe" | "warning" | "critical" = "safe";

  if (signals.oxygen < 15) status = "critical";
  else if (signals.oxygen < 30 || signals.pharmacy < 40) status = "warning";

  const reasoning =
    status === "critical"
      ? "Oxygen reserves have dropped below critical safety thresholds, posing immediate risk to patient care."
      : status === "warning"
      ? "Multiple medical resources are approaching low availability thresholds."
      : "All critical medical resources remain within safe operational limits.";

  const monitoredSignals = [
    { label: "Oxygen Supply", value: `${signals.oxygen}%` },
    { label: "Pharmacy Stock", value: `${signals.pharmacy}%` },
    { label: "Equipment Availability", value: `${signals.equipment}%` },
    { label: "Blood Bank Inventory", value: `${signals.bloodBank}%` },
  ];

  return (
    <AgentCard
      title="Resource Risk Agent"
      description="Tracks supply chain and resource availability"
      icon={<Package className="w-5 h-5" />}
      status={status}
      agentColor="resource"
      className={className}
    >
      <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg mb-4">
        <Eye className="w-4 h-4 text-agent-resource" />
        <span className="text-sm font-medium">
          Status: {status.toUpperCase()}
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
