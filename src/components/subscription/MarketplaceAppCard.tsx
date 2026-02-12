import { Check, Plus, Star, Loader2, FileText, ArrowRightLeft, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MarketplaceApp } from "@/services/subscription.service";

interface MarketplaceAppCardProps {
  app: MarketplaceApp;
  isInstalled: boolean;
  onInstall: () => void;
  isInstalling: boolean;
}

export function MarketplaceAppCard({ app, isInstalled, onInstall, isInstalling }: MarketplaceAppCardProps) {
  const credits = app.pricing.includedCredits;

  return (
    <div className={cn("content-card p-6 hover-lift relative", app.popular && "ring-2 ring-primary/50")}>
      {app.popular && (
        <div className="absolute -top-2.5 left-4">
          <Badge className="bg-primary text-primary-foreground gap-1 text-xs">
            <Star className="w-3 h-3" /> Popular
          </Badge>
        </div>
      )}

      <div className="flex items-center gap-3 mb-3 mt-1">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
          {app.icon || "📦"}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{app.name}</h3>
          <span className="text-xs text-muted-foreground capitalize">{app.category}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{app.description}</p>

      {/* Included credits */}
      <div className="bg-muted/50 rounded-lg p-3 mb-4 space-y-1.5">
        <p className="text-xs font-medium text-foreground mb-2">Included Credits</p>
        <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><FileText className="w-3 h-3" /> {credits.invoices.total} Invoices</div>
          <div className="flex items-center gap-1"><ArrowRightLeft className="w-3 h-3" /> {credits.transactions.total} Transactions</div>
          <div className="flex items-center gap-1"><Send className="w-3 h-3" /> {credits.requests.total} Requests</div>
          <div className="flex items-center gap-1"><Users className="w-3 h-3" /> {credits.users.total} Users</div>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-1.5 mb-4">
        {app.features.slice(0, 3).map((feat) => (
          <li key={feat} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="w-3 h-3 text-success flex-shrink-0" />
            {feat}
          </li>
        ))}
      </ul>

      {/* Price & Install */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div>
          <span className="text-xl font-bold text-foreground">${app.pricing.basePrice}</span>
          <span className="text-xs text-muted-foreground">/{app.pricing.period === 'monthly' ? 'mo' : 'yr'}</span>
        </div>
        <Button
          size="sm"
          disabled={isInstalled || isInstalling}
          onClick={onInstall}
          className={cn(
            isInstalled ? "bg-secondary text-secondary-foreground" : ""
          )}
        >
          {isInstalling ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : isInstalled ? (
            <Check className="w-4 h-4 mr-1" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}
          {isInstalled ? "Installed" : "Install"}
        </Button>
      </div>
    </div>
  );
}
