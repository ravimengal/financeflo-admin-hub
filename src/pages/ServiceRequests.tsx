import { useState, useMemo } from "react";
import { Plus, Search, Eye, Inbox, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateRequestDialog } from "@/components/dialogs/CreateRequestDialog";
import { RequestDetailDialog, ServiceRequest } from "@/components/dialogs/RequestDetailDialog";
import { cn } from "@/lib/utils";

const priorityColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground border-muted",
  medium: "bg-warning/20 text-warning border-warning/30",
  high: "bg-destructive/20 text-destructive border-destructive/30",
};

const statusColors: Record<string, string> = {
  open: "bg-primary/20 text-primary border-primary/30",
  in_progress: "bg-warning/20 text-warning border-warning/30",
  resolved: "bg-success/20 text-success border-success/30",
  closed: "bg-muted text-muted-foreground border-muted",
};

const initialRequests: ServiceRequest[] = [
  {
    id: "REQ-1001",
    title: "Unable to generate monthly invoice report",
    description: "The Invoice Manager app throws an error when trying to export the November report to PDF. Need urgent assistance before the audit deadline.",
    category: "Bug",
    priority: "high",
    status: "in_progress",
    createdBy: "Finance Admin",
    createdAt: "2026-05-04T09:30:00Z",
    documents: [
      { id: "d1", name: "error-screenshot.png", size: 245680, uploadedAt: "2026-05-04T09:32:00Z" },
      { id: "d2", name: "audit-log.txt", size: 12450, uploadedAt: "2026-05-04T09:35:00Z" },
    ],
    comments: [
      { id: "c1", author: "Support Team", message: "Thanks for reporting. We've reproduced the issue and are working on a fix.", createdAt: "2026-05-04T10:15:00Z" },
      { id: "c2", author: "Finance Admin", message: "Any ETA? The audit is on Friday.", createdAt: "2026-05-04T11:00:00Z" },
    ],
  },
  {
    id: "REQ-1002",
    title: "Request to increase user limit on Payment Gateway",
    description: "We need to add 15 more users to the Payment Gateway subscription. Please advise on upgrade options.",
    category: "Subscription",
    priority: "medium",
    status: "open",
    createdBy: "Operations Lead",
    createdAt: "2026-05-05T14:20:00Z",
    documents: [],
    comments: [],
  },
  {
    id: "REQ-1003",
    title: "Configure SSO with Okta",
    description: "Looking to integrate Single Sign-On for all users using our existing Okta tenant.",
    category: "Feature",
    priority: "low",
    status: "resolved",
    createdBy: "IT Admin",
    createdAt: "2026-04-28T08:00:00Z",
    documents: [{ id: "d3", name: "okta-config.pdf", size: 982340, uploadedAt: "2026-04-28T08:05:00Z" }],
    comments: [
      { id: "c3", author: "Support Team", message: "SSO integration is complete. Please test and confirm.", createdAt: "2026-05-02T16:30:00Z" },
    ],
  },
];

export default function ServiceRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      requests.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.id.toLowerCase().includes(search.toLowerCase()) ||
          r.category.toLowerCase().includes(search.toLowerCase())
      ),
    [requests, search]
  );

  const stats = useMemo(
    () => ({
      total: requests.length,
      open: requests.filter((r) => r.status === "open").length,
      inProgress: requests.filter((r) => r.status === "in_progress").length,
      resolved: requests.filter((r) => r.status === "resolved").length,
    }),
    [requests]
  );

  const handleCreate = (data: { title: string; description: string; category: string; priority: ServiceRequest["priority"] }) => {
    const newReq: ServiceRequest = {
      id: `REQ-${1000 + requests.length + 1}`,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: "open",
      createdBy: "Finance Admin",
      createdAt: new Date().toISOString(),
      documents: [],
      comments: [],
    };
    setRequests((prev) => [newReq, ...prev]);
  };

  const updateRequest = (updated: ServiceRequest) => {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const selected = requests.find((r) => r.id === selectedId) || null;

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Service Requests</h1>
            <p className="text-muted-foreground mt-1">Submit and track support, feature, and subscription requests</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4" />
            New Request
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Requests" value={stats.total} icon={Inbox} />
          <StatCard title="Open" value={stats.open} icon={AlertCircle} />
          <StatCard title="In Progress" value={stats.inProgress} icon={Clock} />
          <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle2} />
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, ID, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="content-card p-12 text-center">
            <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No requests found</h3>
            <p className="text-muted-foreground">Create a new request to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filtered.map((r, i) => (
              <div
                key={r.id}
                className="content-card p-5 hover-lift flex flex-col md:flex-row md:items-center gap-4"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground">{r.id}</span>
                    <Badge variant="outline" className={cn("capitalize text-xs", statusColors[r.status])}>
                      {r.status.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className={cn("capitalize text-xs", priorityColors[r.priority])}>
                      {r.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{r.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-foreground truncate">{r.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{r.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>By {r.createdBy}</span>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                    <span>{r.documents.length} docs</span>
                    <span>{r.comments.length} comments</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={() => setSelectedId(r.id)}>
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateRequestDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={handleCreate} />
      <RequestDetailDialog
        request={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelectedId(null)}
        onUpdate={updateRequest}
      />
    </AdminLayout>
  );
}
