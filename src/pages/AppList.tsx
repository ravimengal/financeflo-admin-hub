import { useState } from "react";
import { LayoutGrid, Search, Plus, MoreVertical, ExternalLink, Trash2, Edit } from "lucide-react";
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

interface App {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "pending";
  users: number;
  createdAt: string;
  icon: string;
}

const mockApps: App[] = [
  {
    id: "1",
    name: "Finance Tracker",
    description: "Track expenses and revenue in real-time",
    status: "active",
    users: 1250,
    createdAt: "2024-01-15",
    icon: "💰",
  },
  {
    id: "2",
    name: "HR Portal",
    description: "Employee management and payroll system",
    status: "active",
    users: 890,
    createdAt: "2024-02-20",
    icon: "👥",
  },
  {
    id: "3",
    name: "Inventory Manager",
    description: "Stock tracking and order management",
    status: "pending",
    users: 450,
    createdAt: "2024-03-10",
    icon: "📦",
  },
  {
    id: "4",
    name: "CRM Pro",
    description: "Customer relationship management",
    status: "active",
    users: 2100,
    createdAt: "2023-11-05",
    icon: "🎯",
  },
  {
    id: "5",
    name: "Analytics Dashboard",
    description: "Business intelligence and reporting",
    status: "inactive",
    users: 320,
    createdAt: "2024-01-28",
    icon: "📊",
  },
  {
    id: "6",
    name: "Task Manager",
    description: "Project and task management tool",
    status: "active",
    users: 780,
    createdAt: "2024-02-14",
    icon: "✅",
  },
];

const statusColors = {
  active: "bg-success/20 text-success border-success/30",
  inactive: "bg-muted text-muted-foreground border-muted",
  pending: "bg-warning/20 text-warning border-warning/30",
};

export default function AppList() {
  const [search, setSearch] = useState("");
  const [apps] = useState<App[]>(mockApps);

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase())
  );

  const activeApps = apps.filter((a) => a.status === "active").length;
  const totalUsers = apps.reduce((acc, app) => acc + app.users, 0);

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">App List</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor your applications
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="w-4 h-4" />
            Add New App
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Apps"
            value={apps.length}
            icon={LayoutGrid}
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            title="Active Apps"
            value={activeApps}
            icon={LayoutGrid}
            subtitle={`${Math.round((activeApps / apps.length) * 100)}% of total`}
          />
          <StatCard
            title="Total Users"
            value={totalUsers.toLocaleString()}
            icon={LayoutGrid}
            trend={{ value: 8, positive: true }}
          />
          <StatCard
            title="Avg Users/App"
            value={Math.round(totalUsers / apps.length)}
            icon={LayoutGrid}
          />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app, index) => (
            <div
              key={app.id}
              className="glass-card rounded-xl p-5 hover-lift group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                    {app.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{app.name}</h3>
                    <Badge
                      variant="outline"
                      className={cn("mt-1 capitalize", statusColors[app.status])}
                    >
                      {app.status}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-lg hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <ExternalLink className="w-4 h-4" /> Open
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Edit className="w-4 h-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                      <Trash2 className="w-4 h-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {app.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {app.users.toLocaleString()} users
                </span>
                <span className="text-muted-foreground">
                  Created {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}