import { Users, Clock, AlertCircle, TrendingDown } from "lucide-react";
import { AgentCard } from "./RiskComponents";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const utilizationData = [
  { shift: "Day Shift A", utilization: 78, target: 75 },
  { shift: "Day Shift B", utilization: 82, target: 75 },
  { shift: "Night Shift A", utilization: 93, target: 75 },
  { shift: "Night Shift B", utilization: 88, target: 75 },
  { shift: "ICU Team", utilization: 95, target: 75 },
  { shift: "ER Team", utilization: 91, target: 75 },
];

const burnoutIndicators = [
  { metric: "Overtime Hours (Weekly Avg)", value: "12.5 hrs", status: "critical", threshold: "8 hrs" },
  { metric: "Leave Requests Pending", value: "23", status: "warning", threshold: "10" },
  { metric: "Sick Days (Last 30)", value: "47", status: "warning", threshold: "30" },
  { metric: "Shift Coverage Gap", value: "18%", status: "critical", threshold: "5%" },
];

const historicalBurnoutCases = [
  { period: "Diwali 2023", severity: "High", staffingGap: "22%", patientImpact: "15% delay increase" },
  { period: "Monsoon 2023", severity: "Critical", staffingGap: "28%", patientImpact: "ICU response delayed" },
];

interface StaffBurnoutPanelProps {
  className?: string;
}

export function StaffBurnoutPanel({ className }: StaffBurnoutPanelProps) {
  const overallBurnoutRisk = 87;
  const currentStatus = overallBurnoutRisk >= 85 ? "warning" : overallBurnoutRisk >= 70 ? "warning" : "safe";

  const getBarColor = (utilization: number) => {
    if (utilization >= 90) return "hsl(var(--status-critical))";
    if (utilization >= 80) return "hsl(var(--status-warning))";
    return "hsl(var(--status-safe))";
  };

  return (
    <AgentCard
      title="Staff Burnout & Safety Agent"
      description="Protects healthcare workers and reduces patient safety risks"
      icon={<Users className="w-5 h-5" />}
      status={currentStatus}
      agentColor="staff"
      className={className}
    >
      {/* Overall Burnout Risk Score */}
      <div className="p-4 bg-status-warning/10 border border-status-warning/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-card-foreground">Overall Burnout Risk Index</span>
          <span className="text-2xl font-bold text-status-warning">{overallBurnoutRisk}%</span>
        </div>
        <Progress value={overallBurnoutRisk} className="h-3 bg-muted" />
        <p className="text-xs text-muted-foreground mt-2">
          High risk threshold: 75% | Current: Sustained overload detected
        </p>
      </div>

      {/* Utilization by Shift */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-card-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Staff Utilization by Shift
        </h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={utilizationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                type="category" 
                dataKey="shift" 
                width={90}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value}%`, 'Utilization']}
              />
              <Bar dataKey="utilization" radius={[0, 4, 4, 0]}>
                {utilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.utilization)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-status-safe rounded" />
            <span className="text-muted-foreground">&lt;80% Safe</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-status-warning rounded" />
            <span className="text-muted-foreground">80-90% Warning</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-status-critical rounded" />
            <span className="text-muted-foreground">&gt;90% Critical</span>
          </div>
        </div>
      </div>

      {/* Burnout Indicators */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-card-foreground mb-3">Key Burnout Indicators</h4>
        <div className="grid grid-cols-2 gap-3">
          {burnoutIndicators.map((indicator, index) => (
            <div 
              key={index}
              className="p-3 bg-muted/30 rounded-lg"
            >
              <p className="text-xs text-muted-foreground">{indicator.metric}</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className={`text-lg font-bold ${
                  indicator.status === "critical" ? "text-status-critical" : "text-status-warning"
                }`}>
                  {indicator.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  Threshold: {indicator.threshold}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Context */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-agent-staff" />
          <h4 className="text-sm font-medium text-card-foreground">Memory: Historical Burnout Cases</h4>
          <Badge variant="outline" className="text-xs">Qdrant</Badge>
        </div>
        <div className="space-y-2">
          {historicalBurnoutCases.map((event, index) => (
            <div 
              key={index}
              className="p-3 bg-card rounded border border-border"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-card-foreground">{event.period}</span>
                <Badge 
                  variant={event.severity === "Critical" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {event.severity}
                </Badge>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>Staffing Gap: {event.staffingGap}</span>
                <span>•</span>
                <span>Impact: {event.patientImpact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Recommendation */}
      <div className="mt-4 p-4 bg-agent-staff/10 border border-agent-staff/20 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-agent-staff flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-agent-staff">Agent Recommendation</h4>
            <p className="text-sm text-card-foreground mt-1">
              Night Shift A and ICU Team utilization exceeds safe thresholds. Pattern matches Diwali 2023 burnout event. 
              Recommend immediate review of scheduling and consideration of temporary staff augmentation.
            </p>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Note: This is a systemic observation, not individual performance assessment.
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="bg-agent-staff hover:bg-agent-staff/90">
                Review Staffing Plan
              </Button>
              <Button size="sm" variant="outline">
                Request Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AgentCard>
  );
}
