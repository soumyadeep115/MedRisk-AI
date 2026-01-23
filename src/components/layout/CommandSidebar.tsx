import { useState } from "react";
import {
  Activity,
  Users,
  Shield,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Heart,
  Package,
  TrendingUp,
  Scale,
  FileText,
  Settings,
  HelpCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/* ===================== TYPES ===================== */

export type ActiveView =
  | "home"
  | "capacity"
  | "staff"
  | "patient"
  | "resource"
  | "public"
  | "equity"
  | "reports"
  | "memory"
  | "settings"
  | "help";

interface CommandSidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  view: ActiveView;
  agentColor?: string;
  badge?: string;
  badgeType?: "safe" | "warning" | "critical";
}

/* ===================== NAV CONFIG ===================== */

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Command Center", view: "home" },
  {
    icon: Activity,
    label: "Capacity Risk",
    view: "capacity",
    agentColor: "agent-capacity",
    badge: "92%",
    badgeType: "critical",
  },
  {
    icon: Users,
    label: "Staff Burnout",
    view: "staff",
    agentColor: "agent-staff",
    badge: "High",
    badgeType: "warning",
  },
  { icon: Heart, label: "Patient Experience", view: "patient", agentColor: "agent-patient" },
  { icon: Package, label: "Resource Risk", view: "resource", agentColor: "agent-resource" },
  { icon: TrendingUp, label: "Public Health", view: "public", agentColor: "agent-public" },
  { icon: Scale, label: "Equity Monitor", view: "equity", agentColor: "agent-equity" },
];

const secondaryNavItems: NavItem[] = [
  { icon: FileText, label: "Reports", view: "reports" },
  { icon: Shield, label: "Memory Explorer", view: "memory" },
  { icon: Settings, label: "Settings", view: "settings" },
  { icon: HelpCircle, label: "Help", view: "help" },
];

/* ===================== COMPONENT ===================== */

export function CommandSidebar({ activeView, setActiveView }: CommandSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const active = activeView === item.view;

    const content = (
      <button
        onClick={() => setActiveView(item.view)}
        className={cn(
          "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
          collapsed && "justify-center px-2"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center w-5 h-5 flex-shrink-0",
            item.agentColor && active && `text-${item.agentColor}`
          )}
        >
          <Icon className="w-5 h-5" />
        </div>

        {!collapsed && (
          <>
            <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-semibold rounded-full",
                  item.badgeType === "critical" && "bg-status-critical text-status-critical-foreground",
                  item.badgeType === "warning" && "bg-status-warning text-status-warning-foreground",
                  item.badgeType === "safe" && "bg-status-safe text-status-safe-foreground"
                )}
              >
                {item.badge}
              </span>
            )}
          </>
        )}

        {active && (
          <div
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full",
              item.agentColor ? `bg-${item.agentColor}` : "bg-sidebar-primary"
            )}
          />
        )}
      </button>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border", collapsed && "justify-center")}>
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-sidebar-primary" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold">MedRisk AI</span>
              <span className="text-xs text-sidebar-muted">Command Center</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {mainNavItems.map((item) => (
          <NavItemComponent key={item.view} item={item} />
        ))}

        <div className="pt-6 mt-6 border-t border-sidebar-border" />

        {secondaryNavItems.map((item) => (
          <NavItemComponent key={item.view} item={item} />
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-sidebar-border text-xs text-sidebar-muted">
          All agents operational
        </div>
      )}

      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </Button>
    </aside>
  );
}
