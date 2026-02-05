import { CreditCard, Check, Zap, Crown, Rocket } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for small teams getting started",
    icon: Zap,
    features: [
      "Up to 5 team members",
      "10 GB storage",
      "Basic analytics",
      "Email support",
    ],
    current: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "For growing teams that need more power",
    icon: Crown,
    features: [
      "Up to 25 team members",
      "100 GB storage",
      "Advanced analytics",
      "Priority support",
      "API access",
      "Custom integrations",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large organizations with complex needs",
    icon: Rocket,
    features: [
      "Unlimited team members",
      "Unlimited storage",
      "Custom analytics",
      "24/7 dedicated support",
      "Full API access",
      "Custom development",
      "SLA guarantee",
    ],
    current: false,
  },
];

const usageData = {
  storage: { used: 45, total: 100, unit: "GB" },
  users: { used: 18, total: 25 },
  apiCalls: { used: 45000, total: 100000 },
};

export default function Subscription() {
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

        {/* Current Plan Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Current Plan"
            value="Professional"
            icon={Crown}
            subtitle="Renews Feb 15, 2026"
          />
          <StatCard
            title="Monthly Cost"
            value="$79"
            icon={CreditCard}
          />
          <StatCard
            title="Team Members"
            value={`${usageData.users.used}/${usageData.users.total}`}
            icon={CreditCard}
          />
          <StatCard
            title="Days Remaining"
            value="10"
            icon={CreditCard}
            subtitle="Next billing cycle"
          />
        </div>

        {/* Usage Section */}
        <div className="content-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Usage This Month
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Storage</span>
                <span className="text-sm font-medium text-foreground">
                  {usageData.storage.used} / {usageData.storage.total} {usageData.storage.unit}
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
        </div>

        {/* Plans */}
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Available Plans
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "content-card p-6 relative hover-lift",
                plan.current && "ring-2 ring-primary glow-primary",
                plan.popular && "border-primary/50"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <plan.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {plan.description}
              </p>
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
                  plan.current
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}