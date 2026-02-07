import { useState, useMemo } from "react";
import { LayoutGrid, Search, Plus, MoreVertical, ExternalLink, Trash2, Edit, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useApps, useDeleteApp } from "@/hooks/useApps";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
  active: "bg-success/20 text-success border-success/30",
  inactive: "bg-muted text-muted-foreground border-muted",
  pending: "bg-warning/20 text-warning border-warning/30",
};

function AppCardSkeleton() {
  return (
    <div className="content-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export default function AppList() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  
  const { data: apps = [], isLoading, isError, error } = useApps();
  const deleteAppMutation = useDeleteApp();

  const filteredApps = useMemo(() => 
    apps.filter(
      (app) =>
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.description.toLowerCase().includes(search.toLowerCase())
    ), [apps, search]
  );

  const activeApps = useMemo(() => apps.filter((a) => a.status === "active").length, [apps]);
  const totalUsers = useMemo(() => apps.reduce((acc, app) => acc + app.users, 0), [apps]);

  const handleDelete = async (appId: string, appName: string) => {
    try {
      await deleteAppMutation.mutateAsync(appId);
      toast({
        title: "App deleted",
        description: `${appName} has been deleted successfully.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete the app. Please try again.",
        variant: "destructive",
      });
    }
  };

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
            value={isLoading ? "-" : apps.length}
            icon={LayoutGrid}
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            title="Active Apps"
            value={isLoading ? "-" : activeApps}
            icon={LayoutGrid}
            subtitle={apps.length > 0 ? `${Math.round((activeApps / apps.length) * 100)}% of total` : undefined}
          />
          <StatCard
            title="Total Users"
            value={isLoading ? "-" : totalUsers.toLocaleString()}
            icon={LayoutGrid}
            trend={{ value: 8, positive: true }}
          />
          <StatCard
            title="Avg Users/App"
            value={isLoading || apps.length === 0 ? "-" : Math.round(totalUsers / apps.length)}
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

        {/* Error State */}
        {isError && (
          <div className="content-card p-6 mb-6 border-destructive/50">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Failed to load apps</p>
                <p className="text-sm text-muted-foreground">
                  {error instanceof Error ? error.message : "An error occurred"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <AppCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredApps.length === 0 && (
          <div className="content-card p-12 text-center">
            <LayoutGrid className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {search ? "No apps found" : "No apps yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {search 
                ? "Try adjusting your search terms" 
                : "Get started by creating your first app"}
            </p>
            {!search && (
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Plus className="w-4 h-4" />
                Add New App
              </Button>
            )}
          </div>
        )}

        {/* App Grid */}
        {!isLoading && !isError && filteredApps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map((app, index) => (
              <div
                key={app.id}
                className="content-card p-5 hover-lift group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                      {app.icon || "📱"}
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
                      <DropdownMenuItem 
                        className="gap-2 cursor-pointer text-destructive"
                        onClick={() => handleDelete(app.id, app.name)}
                      >
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
        )}
      </div>
    </AdminLayout>
  );
}
