import { Trash2, FileText, ArrowRightLeft, Send, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { SubscribedApp } from "@/services";

const statusStyles = {
  active: "bg-success/20 text-success border-success/30",
  expired: "bg-destructive/20 text-destructive border-destructive/30",
  trial: "bg-warning/20 text-warning border-warning/30",
};

interface CreditRowProps {
  label: string;
  icon: typeof FileText;
  used: number;
  total: number;
}

function CreditRow({ label, icon: Icon, used, total }: CreditRowProps) {
  const pct = total > 0 ? (used / total) * 100 : 0;
  const isHigh = pct > 80;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Icon className="w-3.5 h-3.5" />
          {label}
        </div>
        <span className={cn("text-sm font-medium", isHigh ? "text-destructive" : "text-foreground")}>
          {used.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
      <Progress value={pct} className={cn("h-1.5", isHigh && "[&>div]:bg-destructive")} />
    </div>
  );
}

interface InstalledAppCardProps {
  app: SubscribedApp;
  onUninstall: () => void;
  isUninstalling: boolean;
}

export function InstalledAppCard({ app, onUninstall, isUninstalling }: InstalledAppCardProps) {
  return (
    <div className="content-card p-6 hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
            {app.appIcon || "📦"}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{app.appName}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className={cn("text-xs capitalize", statusStyles[app.status])}>
                {app.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Expires {new Date(app.expiresAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onUninstall}
          disabled={isUninstalling}
          className="text-muted-foreground hover:text-destructive"
        >
          {isUninstalling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{app.appDescription}</p>

      <div className="space-y-3">
        <CreditRow label="Invoices" icon={FileText} used={app.credits.invoices.used} total={app.credits.invoices.total} />
        <CreditRow label="Transactions" icon={ArrowRightLeft} used={app.credits.transactions.used} total={app.credits.transactions.total} />
        <CreditRow label="Requests" icon={Send} used={app.credits.requests.used} total={app.credits.requests.total} />
        <CreditRow label="Users" icon={Users} used={app.credits.users.used} total={app.credits.users.total} />
      </div>
    </div>
  );
}
