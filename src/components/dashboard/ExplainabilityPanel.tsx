import { FileText, Brain, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExplainabilityPanelProps {
  className?: string;
}

const explanationSteps = [
  {
    agent: "Capacity Risk Agent",
    finding: "ICU occupancy at 92% exceeds historical overload threshold of 90%",
    confidence: 95,
    memoryRef: "3 similar events retrieved from capacity_events collection",
  },
  {
    agent: "Staff Burnout Agent",
    finding: "Night shift utilization 18% above safe threshold, matching pre-burnout patterns",
    confidence: 88,
    memoryRef: "2 historical burnout cases with 85% pattern similarity",
  },
  {
    agent: "Public Health Signal Agent",
    finding: "AQI spike (185) correlates with 23% increase in respiratory admissions",
    confidence: 82,
    memoryRef: "Pollution-admission correlation from public_health_trends",
  },
];

const decisionChain = [
  { step: 1, action: "Detected ICU occupancy threshold breach", time: "2 min ago" },
  { step: 2, action: "Retrieved 3 similar historical events from Qdrant", time: "2 min ago" },
  { step: 3, action: "Cross-referenced with staff availability data", time: "2 min ago" },
  { step: 4, action: "Identified matching burnout risk patterns", time: "1 min ago" },
  { step: 5, action: "Checked public health signals for external factors", time: "1 min ago" },
  { step: 6, action: "Generated composite risk assessment", time: "Now" },
];

export function ExplainabilityPanel({ className }: ExplainabilityPanelProps) {
  return (
    <div className={`bg-card rounded-lg border border-border shadow-card ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-agent-explain/10">
            <Brain className="w-5 h-5 text-agent-explain" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Explainability & Narrative Agent</h3>
            <p className="text-sm text-muted-foreground">Transparent reasoning for all decisions</p>
          </div>
        </div>
      </div>

      {/* Current Narrative */}
      <div className="p-4 border-b border-border bg-muted/20">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-agent-explain flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-2">Current Situation Narrative</h4>
            <p className="text-sm text-card-foreground leading-relaxed">
              "Care delays today are likely due to <span className="font-semibold text-status-critical">ICU saturation (92%)</span>, 
              combined with <span className="font-semibold text-status-warning">staff shortage (-18% coverage)</span> on night shifts. 
              Additionally, increased respiratory admissions linked to <span className="font-semibold text-agent-public">AQI spike (185)</span> are 
              contributing to capacity strain. This pattern closely matches the 
              <span className="font-semibold text-agent-capacity"> Diwali 2023 scenario</span> where similar conditions led to diversion protocols."
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Generated 30 seconds ago
              </span>
              <Badge variant="outline">Auto-refresh: 5 min</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Contributions */}
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-medium text-card-foreground mb-3">Agent Contributions</h4>
        <div className="space-y-3">
          {explanationSteps.map((step, index) => (
            <div 
              key={index}
              className="p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-card-foreground">{step.agent}</span>
                <Badge variant="secondary" className="text-xs">
                  {step.confidence}% confidence
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{step.finding}</p>
              <p className="text-xs text-agent-explain mt-2 flex items-center gap-1">
                <Brain className="w-3 h-3" />
                {step.memoryRef}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Chain */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-card-foreground mb-3">Reasoning Chain</h4>
        <ScrollArea className="h-48">
          <div className="space-y-1">
            {decisionChain.map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-2 hover:bg-muted/30 rounded transition-colors"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {item.step}
                </div>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <span className="flex-1 text-sm text-card-foreground">{item.action}</span>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" className="w-full" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Full Audit Trail
          </Button>
        </div>
      </div>
    </div>
  );
}
