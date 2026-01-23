import { Database, Search, Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MemoryPanelProps {
  className?: string;
}

const collections = [
  { name: "capacity_events", count: 1247, lastUpdated: "2 min ago" },
  { name: "patient_feedback_patterns", count: 8932, lastUpdated: "5 min ago" },
  { name: "staffing_risk_cases", count: 456, lastUpdated: "2 min ago" },
  { name: "resource_shortages", count: 892, lastUpdated: "15 min ago" },
  { name: "public_health_trends", count: 2341, lastUpdated: "1 hr ago" },
  { name: "equity_alerts", count: 234, lastUpdated: "30 min ago" },
  { name: "decision_outcomes", count: 5678, lastUpdated: "5 min ago" },
];

const recentQueries = [
  { 
    query: "ICU overload events during festival season",
    collection: "capacity_events",
    results: 3,
    latency: "45ms",
    time: "2 min ago"
  },
  { 
    query: "Staff burnout patterns with >20% utilization gap",
    collection: "staffing_risk_cases",
    results: 2,
    latency: "38ms",
    time: "2 min ago"
  },
  { 
    query: "Respiratory admission correlation with AQI >150",
    collection: "public_health_trends",
    results: 5,
    latency: "52ms",
    time: "5 min ago"
  },
];

const sampleMemoryEntry = {
  id: "cap_evt_2023_1105",
  collection: "capacity_events",
  timestamp: "2023-11-05T14:32:00Z",
  metadata: {
    event_type: "pollution_spike",
    icu_occupancy: 91,
    general_bed_occupancy: 85,
    aqi_level: 195,
    outcome: "emergency_staffing_activated",
    resolution_time: "6 hours",
    severity: "critical"
  },
  embedding_preview: "[0.234, -0.156, 0.892, 0.445, -0.223, ...]",
  similarity_score: 0.94
};

export function MemoryPanel({ className }: MemoryPanelProps) {
  return (
    <div className={`bg-card rounded-lg border border-border shadow-card ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Database className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">Qdrant Memory Explorer</h3>
              <p className="text-sm text-muted-foreground">Long-term vector memory for agent reasoning</p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Connected
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="collections" className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="collections" className="flex-1">Collections</TabsTrigger>
            <TabsTrigger value="queries" className="flex-1">Recent Queries</TabsTrigger>
            <TabsTrigger value="inspect" className="flex-1">Inspect</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="collections" className="p-4 pt-2">
          <div className="space-y-2">
            {collections.map((collection, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-status-safe rounded-full" />
                  <span className="font-mono text-sm text-card-foreground">{collection.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{collection.count.toLocaleString()} vectors</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {collection.lastUpdated}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Total: {collections.reduce((acc, c) => acc + c.count, 0).toLocaleString()} memory entries
          </div>
        </TabsContent>

        <TabsContent value="queries" className="p-4 pt-2">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Semantic search across all collections..."
              className="pl-9"
            />
          </div>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {recentQueries.map((query, index) => (
                <div 
                  key={index}
                  className="p-3 bg-muted/30 rounded-lg"
                >
                  <p className="text-sm font-medium text-card-foreground mb-2">"{query.query}"</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="outline" className="font-mono">{query.collection}</Badge>
                    <span>{query.results} results</span>
                    <span className="text-status-safe">{query.latency}</span>
                    <span className="ml-auto">{query.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="inspect" className="p-4 pt-2">
          <div className="p-4 bg-muted/30 rounded-lg font-mono text-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground">Sample Memory Entry</span>
              <Badge variant="secondary">Similarity: {sampleMemoryEntry.similarity_score}</Badge>
            </div>
            <pre className="text-card-foreground overflow-x-auto">
{`{
  "id": "${sampleMemoryEntry.id}",
  "collection": "${sampleMemoryEntry.collection}",
  "timestamp": "${sampleMemoryEntry.timestamp}",
  "metadata": {
    "event_type": "${sampleMemoryEntry.metadata.event_type}",
    "icu_occupancy": ${sampleMemoryEntry.metadata.icu_occupancy},
    "general_bed_occupancy": ${sampleMemoryEntry.metadata.general_bed_occupancy},
    "aqi_level": ${sampleMemoryEntry.metadata.aqi_level},
    "outcome": "${sampleMemoryEntry.metadata.outcome}",
    "resolution_time": "${sampleMemoryEntry.metadata.resolution_time}",
    "severity": "${sampleMemoryEntry.metadata.severity}"
  },
  "embedding": ${sampleMemoryEntry.embedding_preview}
}`}
            </pre>
          </div>
          <Button variant="outline" className="w-full mt-4" size="sm">
            Query Similar Events
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
