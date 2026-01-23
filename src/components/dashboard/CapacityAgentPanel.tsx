import {
  Activity,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { AgentCard } from "./RiskComponents";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQdrantSearch, type CapacityContext } from "@/hooks/useQdrantSearch";
import { useMemo } from "react";

const capacityData = [
  { time: "00:00", icu: 78, general: 65 },
  { time: "04:00", icu: 82, general: 68 },
  { time: "08:00", icu: 85, general: 72 },
  { time: "12:00", icu: 88, general: 75 },
  { time: "16:00", icu: 90, general: 78 },
  { time: "20:00", icu: 92, general: 82 },
  { time: "Now", icu: 92, general: 80 },
];

interface CapacityAgentPanelProps {
  className?: string;
}

export function CapacityAgentPanel({ className }: CapacityAgentPanelProps) {
  const icuOccupancy = 92;
  const generalOccupancy = 80;
  const staffUtilization = 85;

  const currentStatus =
    icuOccupancy >= 90
      ? "critical"
      : icuOccupancy >= 80
      ? "warning"
      : "safe";

  const capacityContext = useMemo<CapacityContext>(
    () => ({
      icu_occupancy: icuOccupancy,
      bed_utilization: generalOccupancy,
      staff_utilization: staffUtilization,
    }),
    [icuOccupancy, generalOccupancy, staffUtilization]
  );

  const {
    events: historicalEvents,
    loading,
    error,
    source,
    refresh,
  } = useQdrantSearch(capacityContext);

  // ✅ HARD SAFETY FIX — NEVER UNDEFINED
  const safeEvents = historicalEvents ?? [];

  return (
    <AgentCard
      title="Capacity Risk Agent"
      description="Monitors ICU and general bed utilization to prevent unsafe overload"
      icon={<Activity className="w-5 h-5" />}
      status={currentStatus}
      agentColor="capacity"
      className={className}
    >
      {/* CURRENT OCCUPANCY */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">ICU Occupancy</span>
            <span className="text-sm font-bold text-status-critical">
              {icuOccupancy}%
            </span>
          </div>
          <Progress value={icuOccupancy} className="h-2" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">General Beds</span>
            <span className="text-sm font-bold text-status-warning">
              {generalOccupancy}%
            </span>
          </div>
          <Progress value={generalOccupancy} className="h-2" />
        </div>
      </div>

      {/* TREND CHART */}
      <div className="mt-6 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={capacityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[60, 100]} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="icu"
              stroke="hsl(var(--agent-capacity))"
              fill="hsl(var(--agent-capacity) / 0.2)"
            />
            <Area
              type="monotone"
              dataKey="general"
              stroke="hsl(var(--accent))"
              fill="hsl(var(--accent) / 0.15)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* MEMORY PANEL */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">
              Memory: Similar Historical Events
            </span>
            <Badge variant="outline" className="text-xs">
              {source ?? "Qdrant"}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>

        {error && (
          <div className="text-sm text-status-warning mb-2">{error}</div>
        )}

        {loading && safeEvents.length === 0 ? (
          <div className="flex justify-center py-4 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Loading memory…
          </div>
        ) : safeEvents.length > 0 ? (
          <div className="space-y-2">
            {safeEvents.map((event, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border rounded"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{event.similarity}%</Badge>
                  <span className="font-medium">{event.type}</span>
                </div>
                <Badge variant="secondary">{event.outcome}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-4">
            No similar historical events found
          </div>
        )}
      </div>

      {/* AI ALERT */}
      <div className="mt-4 p-4 border rounded bg-status-critical/10">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-status-critical" />
          <div>
            <h4 className="font-semibold text-status-critical">Agent Alert</h4>
            <p className="text-sm mt-1">
              ICU occupancy at {icuOccupancy}% exceeds safe limits.
              {safeEvents.length > 0 && (
                <> Based on {safeEvents.length} similar past events.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </AgentCard>
  );
}
