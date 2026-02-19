import { useState } from "react";
import { CreditCard, Package, Plus, TrendingUp, Search } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { InstalledAppCard } from "@/components/subscription/InstalledAppCard";
import { MarketplaceAppCard } from "@/components/subscription/MarketplaceAppCard";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import type { SubscribedApp, MarketplaceApp } from "@/services";

const initialInstalled: SubscribedApp[] = [
  {
    id: "s1", appId: "m1", appName: "Invoice Pro", appIcon: "📊", appDescription: "Full-featured invoicing with automated reminders, recurring billing, and PDF export.",
    status: "active", installedAt: "2024-06-15", expiresAt: "2025-06-15",
    credits: { invoices: { used: 847, total: 1000 }, transactions: { used: 3200, total: 5000 }, requests: { used: 8500, total: 10000 }, users: { used: 8, total: 10 } },
  },
  {
    id: "s2", appId: "m2", appName: "Payment Gateway", appIcon: "💳", appDescription: "Accept credit cards, bank transfers, and digital wallets with real-time settlement.",
    status: "active", installedAt: "2024-08-01", expiresAt: "2025-08-01",
    credits: { invoices: { used: 200, total: 500 }, transactions: { used: 12400, total: 20000 }, requests: { used: 45000, total: 50000 }, users: { used: 15, total: 25 } },
  },
  {
    id: "s3", appId: "m5", appName: "Compliance Tracker", appIcon: "📋", appDescription: "Automated regulatory compliance monitoring with audit trails and reporting.",
    status: "trial", installedAt: "2025-01-15", expiresAt: "2025-02-15",
    credits: { invoices: { used: 10, total: 100 }, transactions: { used: 50, total: 500 }, requests: { used: 120, total: 1000 }, users: { used: 2, total: 5 } },
  },
];

const marketplaceApps: MarketplaceApp[] = [
  { id: "m1", name: "Invoice Pro", description: "Full-featured invoicing with automated reminders, recurring billing, and PDF export.", icon: "📊", category: "billing", pricing: { basePrice: 49, period: "monthly", includedCredits: { invoices: { used: 0, total: 1000 }, transactions: { used: 0, total: 5000 }, requests: { used: 0, total: 10000 }, users: { used: 0, total: 10 } } }, features: ["Recurring invoices", "PDF export", "Multi-currency", "Payment reminders"], popular: true },
  { id: "m2", name: "Payment Gateway", description: "Accept credit cards, bank transfers, and digital wallets with real-time settlement.", icon: "💳", category: "payments", pricing: { basePrice: 79, period: "monthly", includedCredits: { invoices: { used: 0, total: 500 }, transactions: { used: 0, total: 20000 }, requests: { used: 0, total: 50000 }, users: { used: 0, total: 25 } } }, features: ["Real-time settlement", "Chargeback protection", "PCI compliant", "Multi-gateway"], popular: true },
  { id: "m3", name: "Email Campaigns", description: "Design and send email campaigns with analytics, A/B testing, and automated sequences.", icon: "📧", category: "marketing", pricing: { basePrice: 29, period: "monthly", includedCredits: { invoices: { used: 0, total: 200 }, transactions: { used: 0, total: 1000 }, requests: { used: 0, total: 5000 }, users: { used: 0, total: 5 } } }, features: ["A/B testing", "Drag & drop editor", "Analytics dashboard"] },
  { id: "m4", name: "Fraud Detection", description: "AI-powered fraud monitoring with real-time alerts and automated risk scoring.", icon: "🔒", category: "security", pricing: { basePrice: 99, period: "monthly", includedCredits: { invoices: { used: 0, total: 500 }, transactions: { used: 0, total: 50000 }, requests: { used: 0, total: 100000 }, users: { used: 0, total: 15 } } }, features: ["ML risk scoring", "Real-time alerts", "Custom rules engine", "Audit logs"], popular: true },
  { id: "m5", name: "Compliance Tracker", description: "Automated regulatory compliance monitoring with audit trails and reporting.", icon: "📋", category: "compliance", pricing: { basePrice: 59, period: "monthly", includedCredits: { invoices: { used: 0, total: 100 }, transactions: { used: 0, total: 500 }, requests: { used: 0, total: 1000 }, users: { used: 0, total: 5 } } }, features: ["Audit trail", "Regulatory updates", "Report generation"] },
  { id: "m6", name: "Analytics Hub", description: "Comprehensive analytics with custom dashboards, KPI tracking, and data visualization.", icon: "📈", category: "analytics", pricing: { basePrice: 39, period: "monthly", includedCredits: { invoices: { used: 0, total: 300 }, transactions: { used: 0, total: 10000 }, requests: { used: 0, total: 25000 }, users: { used: 0, total: 10 } } }, features: ["Custom dashboards", "Real-time KPIs", "Data export"] },
];

export default function Subscription() {
  const { toast } = useToast();
  const [marketSearch, setMarketSearch] = useState("");
  const [installed, setInstalled] = useState(initialInstalled);
  const [uninstallTarget, setUninstallTarget] = useState<{ id: string; name: string } | null>(null);

  const activeCount = installed.filter((a) => a.status === "active").length;
  const monthlySpend = installed.reduce((acc, app) => {
    const mApp = marketplaceApps.find((m) => m.id === app.appId);
    return acc + (mApp?.pricing.basePrice || 0);
  }, 0);

  const filteredMarket = marketplaceApps.filter((app) =>
    app.name.toLowerCase().includes(marketSearch.toLowerCase()) || app.category.toLowerCase().includes(marketSearch.toLowerCase())
  );

  const handleInstall = (appId: string) => {
    const mApp = marketplaceApps.find((a) => a.id === appId);
    if (!mApp) return;
    const newSub: SubscribedApp = {
      id: `s-${Date.now()}`, appId, appName: mApp.name, appIcon: mApp.icon,
      appDescription: mApp.description, status: "active",
      installedAt: new Date().toISOString().split("T")[0],
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
      credits: mApp.pricing.includedCredits,
    };
    setInstalled((prev) => [...prev, newSub]);
    toast({ title: "App installed", description: `${mApp.name} has been added to your subscription.` });
  };

  const handleUninstall = () => {
    if (!uninstallTarget) return;
    setInstalled((prev) => prev.filter((a) => a.id !== uninstallTarget.id));
    toast({ title: "App removed", description: `${uninstallTarget.name} has been removed.` });
    setUninstallTarget(null);
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Subscription</h1>
          <p className="text-muted-foreground mt-1">Install apps and manage your credit-based usage per application</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Installed Apps" value={installed.length} icon={Package} />
          <StatCard title="Active Apps" value={activeCount} icon={TrendingUp} subtitle={installed.length > 0 ? `${Math.round((activeCount / installed.length) * 100)}% active` : undefined} />
          <StatCard title="Monthly Spend" value={`$${monthlySpend}`} icon={CreditCard} />
          <StatCard title="Available Apps" value={marketplaceApps.length} icon={Plus} />
        </div>

        <Tabs defaultValue="installed" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="installed">Installed Apps ({installed.length})</TabsTrigger>
            <TabsTrigger value="marketplace">App Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="installed" className="space-y-4">
            {installed.length === 0 ? (
              <div className="content-card p-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No apps installed</h3>
                <p className="text-muted-foreground mb-4">Browse the marketplace to install apps.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {installed.map((app) => (
                  <InstalledAppCard key={app.id} app={app} onUninstall={() => setUninstallTarget({ id: app.id, name: app.appName })} isUninstalling={false} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search apps by name or category..." value={marketSearch} onChange={(e) => setMarketSearch(e.target.value)} className="pl-10 bg-card border-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMarket.map((app) => {
                const isInstalled = installed.some((ia) => ia.appId === app.id);
                return (
                  <MarketplaceAppCard key={app.id} app={app} isInstalled={isInstalled} onInstall={() => handleInstall(app.id)} isInstalling={false} />
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmDialog
        open={!!uninstallTarget}
        onOpenChange={(o) => !o && setUninstallTarget(null)}
        title="Uninstall App"
        description={`Are you sure you want to uninstall "${uninstallTarget?.name}"? You will lose all remaining credits.`}
        onConfirm={handleUninstall}
      />
    </AdminLayout>
  );
}
