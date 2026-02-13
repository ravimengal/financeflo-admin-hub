import { useState, useMemo } from "react";
import { LayoutGrid, Search, Plus, MoreVertical, ExternalLink, Trash2, Edit, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CreateAppDialog } from "@/components/dialogs/CreateAppDialog";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";

const statusColors = {
  active: "bg-success/20 text-success border-success/30",
  inactive: "bg-muted text-muted-foreground border-muted",
  pending: "bg-warning/20 text-warning border-warning/30",
};

const initialApps = [
  { id: "1", name: "Invoice Manager", description: "Create, send, and track invoices with automated reminders and payment tracking.", status: "active" as const, users: 245, createdAt: "2024-10-15", icon: "📊" },
  { id: "2", name: "Payment Gateway", description: "Process credit card and bank transfer payments securely with real-time notifications.", status: "active" as const, users: 1820, createdAt: "2024-08-22", icon: "💳" },
  { id: "3", name: "Email Campaigns", description: "Design and send email campaigns to customers with analytics and A/B testing.", status: "inactive" as const, users: 530, createdAt: "2024-11-05", icon: "📧" },
  { id: "4", name: "Mobile Banking", description: "Full-featured mobile banking with biometric login and instant transfers.", status: "active" as const, users: 3400, createdAt: "2024-06-12", icon: "📱" },
  { id: "5", name: "Fraud Detection", description: "AI-powered fraud monitoring with real-time alerts and automated risk scoring.", status: "pending" as const, users: 0, createdAt: "2025-01-20", icon: "🔒" },
  { id: "6", name: "Analytics Dashboard", description: "Comprehensive analytics with custom dashboards, KPI tracking, and export capabilities.", status: "active" as const, users: 890, createdAt: "2024-09-30", icon: "📈" },
];

export default function AppList() {
  const [search, setSearch] = useState("");
  const [apps, setApps] = useState(initialApps);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { toast } = useToast();

  const filteredApps = useMemo(() =>
    apps.filter(
      (app) =>
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.description.toLowerCase().includes(search.toLowerCase())
    ), [apps, search]
  );

  const activeApps = useMemo(() => apps.filter((a) => a.status === "active").length, [apps]);
  const totalUsers = useMemo(() => apps.reduce((acc, app) => acc + app.users, 0), [apps]);

  const handleCreateApp = (data: { name: string; description: string; status: string; icon: string }) => {
    const newApp = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description || "No description provided.",
      status: data.status as "active" | "inactive" | "pending",
      users: 0,
      createdAt: new Date().toISOString().split("T")[0],
      icon: data.icon,
    };
    setApps((prev) => [newApp, ...prev]);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setApps((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    toast({ title: "App deleted", description: `${deleteTarget.name} has been deleted.` });
    setDeleteTarget(null);
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">App List</h1>
            <p className="text-muted-foreground mt-1">Manage and monitor your applications</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4" />
            Add New App
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Apps" value={apps.length} icon={LayoutGrid} trend={{ value: 12, positive: true }} />
          <StatCard title="Active Apps" value={activeApps} icon={LayoutGrid} subtitle={`${Math.round((activeApps / apps.length) * 100)}% of total`} />
          <StatCard title="Total Users" value={totalUsers.toLocaleString()} icon={LayoutGrid} trend={{ value: 8, positive: true }} />
          <StatCard title="Avg Users/App" value={apps.length > 0 ? Math.round(totalUsers / apps.length) : 0} icon={LayoutGrid} />
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search apps..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
        </div>

        {filteredApps.length === 0 ? (
          <div className="content-card p-12 text-center">
            <LayoutGrid className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">{search ? "No apps found" : "No apps yet"}</h3>
            <p className="text-muted-foreground mb-4">{search ? "Try adjusting your search terms" : "Get started by creating your first app"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map((app, index) => (
              <div key={app.id} className="content-card p-5 hover-lift group" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">{app.icon}</div>
                    <div>
                      <h3 className="font-semibold text-foreground">{app.name}</h3>
                      <Badge variant="outline" className={cn("mt-1 capitalize", statusColors[app.status])}>{app.status}</Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-lg hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem className="gap-2 cursor-pointer"><ExternalLink className="w-4 h-4" /> Open</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer"><Edit className="w-4 h-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => setDeleteTarget({ id: app.id, name: app.name })}>
                        <Trash2 className="w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{app.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{app.users.toLocaleString()} users</span>
                  <span className="text-muted-foreground">Created {new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateAppDialog open={createOpen} onOpenChange={setCreateOpen} onCreateApp={handleCreateApp} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete App"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}
