import { useState } from "react";

import { MainLayout } from "@/components/layout/MainLayout";
import { CapacityAgentPanel } from "@/components/dashboard/CapacityAgentPanel";
import { StaffBurnoutPanel } from "@/components/dashboard/StaffBurnoutPanel";
import { ExplainabilityPanel } from "@/components/dashboard/ExplainabilityPanel";
import { MemoryPanel } from "@/components/dashboard/MemoryPanel";
import { PatientExperiencePanel } from "@/components/dashboard/PatientExperiencePanel";
import { ResourceRiskPanel } from "@/components/dashboard/ResourceRiskPanel";
import { PublicHealthPanel } from "@/components/dashboard/PublicHealthPanel";
import { EquityMonitorPanel } from "@/components/dashboard/EquityMonitorPanel";
import { StatCard } from "@/components/dashboard/RiskComponents";
import { WeatherTrigger } from "@/components/WeatherTrigger";
import { PreparationAlerts } from "@/components/PreparationAlerts";
import CCTVAgentPanel from "@/components/dashboard/CCTVAgentPanel";
import { SystemRiskPanel } from "@/components/dashboard/SystemRiskPanel";

import { Activity, Users, AlertTriangle, Shield } from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState<
    | "home"
    | "capacity"
    | "staff"
    | "patient"
    | "resource"
    | "public"
    | "equity"
  >("home");

  return (
    <MainLayout
      title="Command Center"
      subtitle="Healthcare Risk Intelligence Overview"
      activeView={activeView}
      setActiveView={setActiveView}
    >
      {/* ================= HOME VIEW ================= */}
      {activeView === "home" && (
        <>
          {/* 🧠 SYSTEM RISK AGGREGATOR (TOP PRIORITY) */}
          <div className="mb-6">
            <SystemRiskPanel />
          </div>

          {/* 🔘 Manual Intelligence Triggers */}
          <div className="mb-6 space-y-4">
            <WeatherTrigger />
            <PreparationAlerts />
          </div>

          {/* 📊 Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="System Risk Level"
              value="Critical"
              icon={<AlertTriangle className="w-5 h-5" />}
              className="border-l-4 border-l-status-critical"
            />
            <StatCard
              label="Active Agents"
              value="7/7"
              change={{ value: "All operational", positive: true }}
              icon={<Shield className="w-5 h-5" />}
            />
            <StatCard
              label="ICU Occupancy"
              value="92%"
              change={{ value: "+4% today", positive: false }}
              icon={<Activity className="w-5 h-5" />}
            />
            <StatCard
              label="Staff Utilization"
              value="87%"
              change={{ value: "+12% vs avg", positive: false }}
              icon={<Users className="w-5 h-5" />}
            />
          </div>

          {/* 🧠 Main Command Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* LEFT: Core Agents */}
            <div className="xl:col-span-2 space-y-6">
              <CapacityAgentPanel />
              <StaffBurnoutPanel />
              <CCTVAgentPanel />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PatientExperiencePanel />
                <ResourceRiskPanel />
                <PublicHealthPanel />
                <EquityMonitorPanel />
              </div>
            </div>

            {/* RIGHT: Explainability & Memory */}
            <div className="space-y-6">
              <ExplainabilityPanel />
              <MemoryPanel />
            </div>
          </div>
        </>
      )}

      {/* ================= INDIVIDUAL VIEWS ================= */}
      {activeView === "capacity" && <CapacityAgentPanel />}
      {activeView === "staff" && <StaffBurnoutPanel />}
      {activeView === "patient" && <PatientExperiencePanel />}
      {activeView === "resource" && <ResourceRiskPanel />}
      {activeView === "public" && <PublicHealthPanel />}
      {activeView === "equity" && <EquityMonitorPanel />}
    </MainLayout>
  );
};

export default Index;
