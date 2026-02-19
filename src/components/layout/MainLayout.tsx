import { ReactNode } from "react";
import { CommandSidebar } from "./CommandSidebar";
import { CommandHeader } from "./CommandHeader";

export type ActiveView =
  | "home"
  | "capacity"
  | "staff"
  | "patient"
  | "resource"
  | "public"
  | "equity"
  | "operations_patients"
  | "operations_inventory"
  | "operations_rooms";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export function MainLayout({
  children,
  title,
  subtitle,
  activeView,
  setActiveView,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* 🔹 Sidebar gets state-based navigation */}
      <CommandSidebar
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <CommandHeader title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
