import { useState, useMemo } from "react";
import { Users, Search, Plus, MoreVertical, Mail, Shield, Trash2, UserCheck } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CreateUserDialog } from "@/components/dialogs/CreateUserDialog";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";

const roleColors = {
  admin: "bg-primary/20 text-primary border-primary/30",
  editor: "bg-info/20 text-info border-info/30",
  viewer: "bg-muted text-muted-foreground border-muted",
};
const statusColors = {
  active: "bg-success/20 text-success border-success/30",
  inactive: "bg-muted text-muted-foreground border-muted",
  pending: "bg-warning/20 text-warning border-warning/30",
};

type User = { id: string; name: string; email: string; role: "admin" | "editor" | "viewer"; status: "active" | "inactive" | "pending"; lastActive: string; joinedAt: string };

const initialUsers: User[] = [
  { id: "1", name: "Sarah Chen", email: "sarah.chen@company.com", role: "admin", status: "active", lastActive: "2 min ago", joinedAt: "2024-03-15" },
  { id: "2", name: "Marcus Johnson", email: "marcus.j@company.com", role: "editor", status: "active", lastActive: "1 hour ago", joinedAt: "2024-05-22" },
  { id: "3", name: "Emily Williams", email: "emily.w@company.com", role: "viewer", status: "active", lastActive: "3 hours ago", joinedAt: "2024-07-10" },
  { id: "4", name: "David Kim", email: "david.kim@company.com", role: "editor", status: "inactive", lastActive: "2 weeks ago", joinedAt: "2024-04-18" },
  { id: "5", name: "Jessica Brown", email: "jess.b@company.com", role: "viewer", status: "pending", lastActive: "Never", joinedAt: "2025-01-28" },
  { id: "6", name: "Alex Rivera", email: "alex.r@company.com", role: "admin", status: "active", lastActive: "5 min ago", joinedAt: "2024-01-05" },
  { id: "7", name: "Priya Patel", email: "priya.p@company.com", role: "viewer", status: "pending", lastActive: "Never", joinedAt: "2025-02-01" },
];

export default function UserList() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const { toast } = useToast();

  const filteredUsers = useMemo(() =>
    users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())), [users, search]);

  const activeUsers = useMemo(() => users.filter((u) => u.status === "active").length, [users]);
  const adminCount = useMemo(() => users.filter((u) => u.role === "admin").length, [users]);
  const pendingCount = useMemo(() => users.filter((u) => u.status === "pending").length, [users]);

  const handleCreateUser = (data: { name: string; email: string; role: string }) => {
    setUsers((prev) => [{
      id: Date.now().toString(), name: data.name, email: data.email,
      role: data.role as User["role"], status: "pending", lastActive: "Never",
      joinedAt: new Date().toISOString().split("T")[0],
    }, ...prev]);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    toast({ title: "User removed", description: `${deleteTarget.name} has been removed.` });
    setDeleteTarget(null);
  };

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    toast({ title: "Role updated", description: `User role changed to ${newRole}.` });
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User List</h1>
            <p className="text-muted-foreground mt-1">Manage team members and their permissions</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4" /> Invite User
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Users" value={users.length} icon={Users} trend={{ value: 15, positive: true }} />
          <StatCard title="Active Users" value={activeUsers} icon={UserCheck} subtitle={`${Math.round((activeUsers / users.length) * 100)}% of total`} />
          <StatCard title="Admins" value={adminCount} icon={Shield} />
          <StatCard title="Pending Invites" value={pendingCount} icon={Mail} />
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
        </div>

        <div className="content-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Role</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Last Active</TableHead>
                <TableHead className="text-muted-foreground">Joined</TableHead>
                <TableHead className="text-muted-foreground w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-border hover:bg-accent/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/20 text-primary text-sm">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={cn("capitalize", roleColors[user.role])}>{user.role}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={cn("capitalize", statusColors[user.status])}>{user.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-lg hover:bg-accent"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleRoleChange(user.id, user.role === "admin" ? "editor" : "admin")}>
                          <Shield className="w-4 h-4" /> {user.role === "admin" ? "Demote to Editor" : "Promote to Admin"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => toast({ title: "Email sent", description: `Notification sent to ${user.email}` })}>
                          <Mail className="w-4 h-4" /> Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => setDeleteTarget({ id: user.id, name: user.name })}>
                          <Trash2 className="w-4 h-4" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} onUserCreated={handleCreateUser} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Remove User"
        description={`Are you sure you want to remove "${deleteTarget?.name}"? They will lose access immediately.`}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}
