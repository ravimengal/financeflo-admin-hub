import { useState } from "react";
import { CreditCard, Package, Plus, Trash2, TrendingUp, Users, FileText, ArrowRightLeft, Send, AlertCircle, Loader2, Check, Star, Search } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useCurrentSubscription, useMarketplaceApps, useInstallApp, useUninstallApp } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { InstalledAppCard } from "@/components/subscription/InstalledAppCard";
import { MarketplaceAppCard } from "@/components/subscription/MarketplaceAppCard";

export default function Subscription() {
  const { toast } = useToast();
  const [marketSearch, setMarketSearch] = useState("");

  const { data: subscription, isLoading: subLoading, isError: subError } = useCurrentSubscription();
  const { data: marketplaceApps = [], isLoading: marketLoading } = useMarketplaceApps();
  const installMutation = useInstallApp();
  const uninstallMutation = useUninstallApp();

  const installedApps = subscription?.installedApps || [];
  const activeCount = installedApps.filter(a => a.status === 'active').length;

  const filteredMarketApps = marketplaceApps.filter(app =>
    app.name.toLowerCase().includes(marketSearch.toLowerCase()) ||
    app.category.toLowerCase().includes(marketSearch.toLowerCase())
  );

  const handleInstall = async (appId: string, appName: string) => {
    try {
      await installMutation.mutateAsync({ appId });
      toast({ title: "App installed", description: `${appName} has been added to your subscription.` });
    } catch {
      toast({ title: "Error", description: "Failed to install app.", variant: "destructive" });
    }
  };

  const handleUninstall = async (subscribedAppId: string, appName: string) => {
    try {
      await uninstallMutation.mutateAsync(subscribedAppId);
      toast({ title: "App removed", description: `${appName} has been removed.` });
    } catch {
      toast({ title: "Error", description: "Failed to remove app.", variant: "destructive" });
    }
  };

  const isLoading = subLoading || marketLoading;

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Subscription</h1>
          <p className="text-muted-foreground mt-1">
            Install apps and manage your credit-based usage per application
          </p>
        </div>

        {subError && (
          <div className="content-card p-6 mb-8 border-destructive/50">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Failed to load subscription</p>
                <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Installed Apps"
            value={isLoading ? "-" : installedApps.length}
            icon={Package}
          />
          <StatCard
            title="Active Apps"
            value={isLoading ? "-" : activeCount}
            icon={TrendingUp}
            subtitle={installedApps.length > 0 ? `${Math.round((activeCount / installedApps.length) * 100)}% active` : undefined}
          />
          <StatCard
            title="Monthly Spend"
            value={isLoading ? "-" : `$${subscription?.totalMonthlySpend || 0}`}
            icon={CreditCard}
          />
          <StatCard
            title="Available Apps"
            value={isLoading ? "-" : marketplaceApps.length}
            icon={Plus}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="installed" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="installed">Installed Apps ({installedApps.length})</TabsTrigger>
            <TabsTrigger value="marketplace">App Marketplace</TabsTrigger>
          </TabsList>

          {/* Installed Apps */}
          <TabsContent value="installed" className="space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="content-card p-6">
                    <Skeleton className="h-6 w-48 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="space-y-3">
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : installedApps.length === 0 ? (
              <div className="content-card p-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No apps installed</h3>
                <p className="text-muted-foreground mb-4">Browse the marketplace to install apps for your subscription.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {installedApps.map((app) => (
                  <InstalledAppCard
                    key={app.id}
                    app={app}
                    onUninstall={() => handleUninstall(app.id, app.appName)}
                    isUninstalling={uninstallMutation.isPending}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Marketplace */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search apps by name or category..."
                value={marketSearch}
                onChange={(e) => setMarketSearch(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>

            {marketLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="content-card p-6">
                    <Skeleton className="h-10 w-10 rounded-xl mb-4" />
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredMarketApps.length === 0 ? (
              <div className="content-card p-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No apps found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMarketApps.map((app) => {
                  const isInstalled = installedApps.some(ia => ia.appId === app.id);
                  return (
                    <MarketplaceAppCard
                      key={app.id}
                      app={app}
                      isInstalled={isInstalled}
                      onInstall={() => handleInstall(app.id, app.name)}
                      isInstalling={installMutation.isPending}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
