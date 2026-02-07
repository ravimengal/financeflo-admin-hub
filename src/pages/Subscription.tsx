import { useMemo } from "react";
import { CreditCard, Check, Zap, Crown, Rocket, AlertCircle, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCurrentSubscription, usePlans, useUpgradePlan } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

const planIcons: Record<string, typeof Zap> = {
  starter: Zap,
  professional: Crown,
  enterprise: Rocket,
};

function PlanCardSkeleton() {
  return (
    <div className="content-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="mb-4">
        <Skeleton className="h-10 w-24 mb-1" />
      </div>
      <Skeleton className="h-4 w-full mb-6" />
      <div className="space-y-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function Subscription() {
  const { toast } = useToast();
  
  const { data: subscription, isLoading: subLoading, isError: subError } = useCurrentSubscription();
  const { data: plans = [], isLoading: plansLoading } = usePlans();
  const upgradeMutation = useUpgradePlan();

  const currentPlan = useMemo(() => 
    plans.find(p => p.id === subscription?.planId),
    [plans, subscription]
  );

  const usageData = subscription?.usage || {
    storage: { used: 0, total: 100 },
    users: { used: 0, total: 10 },
    apiCalls: { used: 0, total: 10000 },
  };

  const handleUpgrade = async (planId: string, planName: string) => {
    try {
      await upgradeMutation.mutateAsync(planId);
      toast({
        title: "Plan upgraded",
        description: `Successfully upgraded to ${planName} plan.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to upgrade plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isLoading = subLoading || plansLoading;

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Subscription</h1>
          <p className="text-muted-foreground mt-1">
            Manage your plan and billing information
          </p>
        </div>

        {/* Error State */}
        {subError && (
          <div className="content-card p-6 mb-8 border-destructive/50">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Failed to load subscription</p>
                <p className="text-sm text-muted-foreground">
                  Please try refreshing the page
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current Plan Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Current Plan"
            value={isLoading ? "-" : currentPlan?.name || "Free"}
            icon={Crown}
            subtitle={subscription?.currentPeriodEnd 
              ? `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
              : undefined
            }
          />
          <StatCard
            title="Monthly Cost"
            value={isLoading ? "-" : currentPlan ? `$${currentPlan.price}` : "$0"}
            icon={CreditCard}
          />
          <StatCard
            title="Team Members"
            value={isLoading ? "-" : `${usageData.users.used}/${usageData.users.total}`}
            icon={CreditCard}
          />
          <StatCard
            title="Status"
            value={isLoading ? "-" : subscription?.status || "Active"}
            icon={CreditCard}
            subtitle={subscription?.status === "active" ? "Next billing cycle" : undefined}
          />
        </div>

        {/* Usage Section */}
        <div className="content-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Usage This Month
          </h2>
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Storage</span>
                  <span className="text-sm font-medium text-foreground">
                    {usageData.storage.used} / {usageData.storage.total} GB
                  </span>
                </div>
                <Progress
                  value={(usageData.storage.used / usageData.storage.total) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Team Members</span>
                  <span className="text-sm font-medium text-foreground">
                    {usageData.users.used} / {usageData.users.total}
                  </span>
                </div>
                <Progress
                  value={(usageData.users.used / usageData.users.total) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">API Calls</span>
                  <span className="text-sm font-medium text-foreground">
                    {usageData.apiCalls.used.toLocaleString()} / {usageData.apiCalls.total.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={(usageData.apiCalls.used / usageData.apiCalls.total) * 100}
                  className="h-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Plans */}
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Available Plans
        </h2>
        
        {plansLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <PlanCardSkeleton key={i} />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="content-card p-12 text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No plans available</h3>
            <p className="text-muted-foreground">
              Please check back later for available subscription plans.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrent = subscription?.planId === plan.id;
              const Icon = planIcons[plan.name.toLowerCase()] || Zap;
              
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "content-card p-6 relative hover-lift",
                    isCurrent && "ring-2 ring-primary glow-primary"
                  )}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={cn(
                      "w-full",
                      isCurrent
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    disabled={isCurrent || upgradeMutation.isPending}
                    onClick={() => handleUpgrade(plan.id, plan.name)}
                  >
                    {upgradeMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {isCurrent ? "Current Plan" : "Upgrade"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
