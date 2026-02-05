import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutGrid, Users, Building2, CreditCard, Menu, X, Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "App List", url: "/", icon: LayoutGrid },
  { title: "User List", url: "/users", icon: Users },
  { title: "Organization", url: "/organization", icon: Building2 },
  { title: "Subscription", url: "/subscription", icon: CreditCard },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          "lg:relative"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Hexagon className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="font-semibold text-foreground text-lg">AdminHub</span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "p-2 rounded-lg hover:bg-sidebar-accent transition-colors",
              collapsed && "hidden lg:block absolute -right-12 top-3 bg-card border border-border"
            )}
          >
            {collapsed ? <Menu className="w-5 h-5 text-muted-foreground" /> : <X className="w-5 h-5 text-muted-foreground lg:hidden" />}
            {!collapsed && <Menu className="w-5 h-5 text-muted-foreground hidden lg:block" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.title}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "hover:bg-sidebar-accent group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-sidebar-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {!collapsed && (
                  <span className={cn("font-medium", isActive && "text-primary")}>
                    {item.title}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile toggle button */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed left-4 top-4 z-40 p-2 rounded-lg bg-card border border-border lg:hidden"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
      )}
    </>
  );
}