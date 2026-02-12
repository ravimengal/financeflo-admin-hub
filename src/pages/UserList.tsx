import { useState, useMemo } from "react";
import { Users, Search, Plus, MoreVertical, Mail, Shield, Trash2, UserCheck, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useUsers, useDeleteUser } from "@/hooks/useUsers";
import { useToast } from "@/hooks/use-toast";
import { CreateUserDialog } from "@/components/dialogs/CreateUserDialog";

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

function UserRowSkeleton() {
  return (
    <TableRow className="border-border">
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
    </TableRow>
  );
}

export default function UserList() {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: users = [], isLoading, isError, error } = useUsers();
  const deleteUserMutation = useDeleteUser();

  const filteredUsers = useMemo(() =>
    users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    ), [users, search]
  );

  const activeUsers = useMemo(() => users.filter((u) => u.status === "active").length, [users]);
  const adminCount = useMemo(() => users.filter((u) => u.role === "admin").length, [users]);
  const pendingCount = useMemo(() => users.filter((u) => u.status === "pending").length, [users]);

  const handleDelete = async (userId: string, userName: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
      toast({
        title: "User removed",
        description: `${userName} has been removed successfully.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove the user. Please try again.",
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
            <h1 className="text-3xl font-bold text-foreground">User List</h1>
            <p className="text-muted-foreground mt-1">
              Manage team members and their permissions
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4" />
            Invite User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Users"
            value={isLoading ? "-" : users.length}
            icon={Users}
            trend={{ value: 15, positive: true }}
          />
          <StatCard
            title="Active Users"
            value={isLoading ? "-" : activeUsers}
            icon={UserCheck}
            subtitle={users.length > 0 ? `${Math.round((activeUsers / users.length) * 100)}% of total` : undefined}
          />
          <StatCard
            title="Admins"
            value={isLoading ? "-" : adminCount}
            icon={Shield}
          />
          <StatCard
            title="Pending Invites"
            value={isLoading ? "-" : pendingCount}
            icon={Mail}
          />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
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
                <p className="font-medium">Failed to load users</p>
                <p className="text-sm text-muted-foreground">
                  {error instanceof Error ? error.message : "An error occurred"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredUsers.length === 0 && (
          <div className="content-card p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {search ? "No users found" : "No users yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {search 
                ? "Try adjusting your search terms" 
                : "Get started by inviting your first team member"}
            </p>
            {!search && (
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Plus className="w-4 h-4" />
                Invite User
              </Button>
            )}
          </div>
        )}

        {/* User Table */}
        {(isLoading || filteredUsers.length > 0) && !isError && (
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
                {isLoading ? (
                  [...Array(5)].map((_, i) => <UserRowSkeleton key={i} />)
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-border hover:bg-accent/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} />
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
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("capitalize", roleColors[user.role])}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("capitalize", statusColors[user.status])}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.lastActive || "Never"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-lg hover:bg-accent">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Shield className="w-4 h-4" /> Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Mail className="w-4 h-4" /> Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2 cursor-pointer text-destructive"
                              onClick={() => handleDelete(user.id, user.name)}
                            >
                              <Trash2 className="w-4 h-4" /> Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />
    </AdminLayout>
  );
}
