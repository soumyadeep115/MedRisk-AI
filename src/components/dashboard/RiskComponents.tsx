import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RiskLevel = "safe" | "warning" | "critical";

interface RiskStatusIndicatorProps {
  status: RiskLevel;
  size?: "sm" | "md" | "lg";
  showPulse?: boolean;
  label?: string;
}

export function RiskStatusIndicator({ 
  status, 
  size = "md", 
  showPulse = true,
  label 
}: RiskStatusIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const statusColors = {
    safe: "bg-status-safe",
    warning: "bg-status-warning",
    critical: "bg-status-critical",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={cn(sizeClasses[size], statusColors[status], "rounded-full")} />
        {showPulse && (status === "warning" || status === "critical") && (
          <div 
            className={cn(
              "absolute inset-0 rounded-full animate-ping opacity-75",
              statusColors[status]
            )} 
          />
        )}
      </div>
      {label && (
        <span className={cn(
          "text-sm font-medium capitalize",
          status === "safe" && "text-status-safe",
          status === "warning" && "text-status-warning",
          status === "critical" && "text-status-critical"
        )}>
          {label}
        </span>
      )}
    </div>
  );
}

interface AgentCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  status: RiskLevel;
  agentColor: "capacity" | "staff" | "patient" | "resource" | "public" | "equity" | "explain";
  metrics?: { label: string; value: string | number; trend?: "up" | "down" | "stable" }[];
  children?: ReactNode;
  className?: string;
}

export function AgentCard({
  title,
  description,
  icon,
  status,
  agentColor,
  metrics,
  children,
  className,
}: AgentCardProps) {
  const agentBorderColors = {
    capacity: "border-l-agent-capacity",
    staff: "border-l-agent-staff",
    patient: "border-l-agent-patient",
    resource: "border-l-agent-resource",
    public: "border-l-agent-public",
    equity: "border-l-agent-equity",
    explain: "border-l-agent-explain",
  };

  const agentIconColors = {
    capacity: "text-agent-capacity",
    staff: "text-agent-staff",
    patient: "text-agent-patient",
    resource: "text-agent-resource",
    public: "text-agent-public",
    equity: "text-agent-equity",
    explain: "text-agent-explain",
  };

  return (
    <div 
      className={cn(
        "bg-card rounded-lg border border-border shadow-card transition-shadow hover:shadow-card-hover",
        "border-l-4",
        agentBorderColors[agentColor],
        status === "critical" && "glow-critical",
        status === "warning" && "glow-warning",
        className
      )}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg bg-muted/50",
              agentIconColors[agentColor]
            )}>
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <RiskStatusIndicator status={status} label={status} />
        </div>

        {/* Metrics Grid */}
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {metrics.map((metric, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{metric.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold text-card-foreground">{metric.value}</span>
                  {metric.trend && (
                    <span className={cn(
                      "text-xs font-medium",
                      metric.trend === "up" && "text-status-critical",
                      metric.trend === "down" && "text-status-safe",
                      metric.trend === "stable" && "text-muted-foreground"
                    )}>
                      {metric.trend === "up" && "↑"}
                      {metric.trend === "down" && "↓"}
                      {metric.trend === "stable" && "→"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Content */}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  change?: { value: string; positive: boolean };
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, change, icon, className }: StatCardProps) {
  return (
    <div className={cn(
      "p-4 bg-card rounded-lg border border-border shadow-card",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">{value}</p>
          {change && (
            <p className={cn(
              "text-sm mt-1",
              change.positive ? "text-status-safe" : "text-status-critical"
            )}>
              {change.positive ? "↑" : "↓"} {change.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
