import { Scale, Eye } from "lucide-react";
import { AgentCard } from "./RiskComponents";
import { Badge } from "@/components/ui/badge";

interface EquityMonitorPanelProps {
  className?: string;
}

export function EquityMonitorPanel({ className }: EquityMonitorPanelProps) {
  const signals = {
    waitTimeDisparity: 34,
    bedAllocationImbalance: 22,
  };

  const status: "safe" | "warning" =
    signals.waitTimeDisparity > 30 ? "warning" : "safe";

  const reasoning =
    status === "warning"
      ? "Significant disparities detected in wait times and bed allocation, suggesting inequitable care delivery."
      : "Care access and outcomes remain equitably distributed.";

  const monitoredSignals = [
    { label: "Wait Time Disparity", value: `${signals.waitTimeDisparity}%` },
    { label: "Bed Allocation Imbalance", value: `${signals.bedAllocationImbalance}%` },
    { label: "Outcome Variance", value: "Monitoring" },
    { label: "Demographic Equity", value: "Monitoring" },
  ];

  return (
    <AgentCard
      title="Equity Monitor Agent"
      description="Tracks fairness and equity in care delivery"
      icon={<Scale className="w-5 h-5" />}
      status={status}
      agentColor="equity"
      className={className}
    >
      <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg mb-4">
        <Eye className="w-4 h-4 text-agent-equity" />
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
