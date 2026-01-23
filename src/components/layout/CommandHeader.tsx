import { Bell, Search, RefreshCcw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommandHeaderProps {
  title: string;
  subtitle?: string;
}

export function CommandHeader({ title, subtitle }: CommandHeaderProps) {
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search agents, alerts, reports..."
            className="w-64 pl-9 bg-secondary/50 border-border"
          />
        </div>

        {/* Time Display */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="font-mono">{currentTime}</span>
          <span className="text-border">|</span>
          <span>{currentDate}</span>
        </div>

        {/* Refresh */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <RefreshCcw className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-status-critical text-status-critical-foreground text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="destructive" className="text-xs">3 Critical</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-status-critical rounded-full" />
                <span className="font-medium text-sm">ICU Capacity Critical</span>
              </div>
              <p className="text-xs text-muted-foreground ml-4">
                ICU occupancy reached 92% - historical overload threshold exceeded
              </p>
              <span className="text-xs text-muted-foreground ml-4">2 min ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-status-warning rounded-full" />
                <span className="font-medium text-sm">Staff Burnout Alert</span>
              </div>
              <p className="text-xs text-muted-foreground ml-4">
                Night shift utilization 18% above safe threshold
              </p>
              <span className="text-xs text-muted-foreground ml-4">15 min ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-status-critical rounded-full" />
                <span className="font-medium text-sm">Public Health Signal</span>
              </div>
              <p className="text-xs text-muted-foreground ml-4">
                AQI spike detected - respiratory admissions rising
              </p>
              <span className="text-xs text-muted-foreground ml-4">1 hour ago</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-accent cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-foreground">DR</span>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-foreground">Dr. Richards</p>
            <p className="text-xs text-muted-foreground">Chief Medical Officer</p>
          </div>
        </div>
      </div>
    </header>
  );
}
