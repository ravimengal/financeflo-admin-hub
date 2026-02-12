import { NavLink, useLocation } from "react-router-dom";
import { LayoutGrid, Users, Building2, CreditCard, Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutGrid },
  { title: "Users", url: "/users", icon: Users },
  { title: "Organization", url: "/organization", icon: Building2 },
  { title: "Subscription", url: "/subscription", icon: CreditCard },
];

export function Navbar() {
  const location = useLocation();

  return (
    <header className="bg-[hsl(var(--navbar-background))] border-b border-[hsl(222,47%,15%)]">
      <div className="max-w-[1500px] mx-auto px-4 lg:px-2">
        <div className="flex items-center h-14 gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[hsl(var(--navbar-foreground))] font-bold text-base leading-tight">Admin-Hub</span>
              <span className="text-[hsl(var(--navbar-muted))] text-[10px] leading-tight">by FinanceFlo</span>
            </div>
          </div>

          {/* Navigation - inline */}
          <nav className="hidden md:flex items-center gap-0.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap",
                    isActive
                      ? "bg-[hsl(222,47%,20%)] text-[hsl(var(--navbar-foreground))]"
                      : "text-[hsl(var(--navbar-muted))] hover:text-[hsl(var(--navbar-foreground))] hover:bg-[hsl(222,47%,18%)]"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </NavLink>
              );
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--navbar-muted))]" />
            <Input
              placeholder="Search..."
              className="pl-9 w-52 h-8 bg-[hsl(222,47%,15%)] border-[hsl(222,47%,20%)] text-[hsl(var(--navbar-foreground))] placeholder:text-[hsl(var(--navbar-muted))] focus-visible:ring-primary/50 text-sm"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[hsl(var(--navbar-muted))] bg-[hsl(222,47%,20%)] px-1.5 py-0.5 rounded">⌘K</kbd>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-[hsl(var(--navbar-muted))] hover:text-[hsl(var(--navbar-foreground))] transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <Avatar className="h-8 w-8 border border-[hsl(222,47%,20%)]">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">FA</AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-[hsl(var(--navbar-foreground))] text-sm font-medium leading-tight">Finance Admin</span>
                  <span className="text-[hsl(var(--navbar-muted))] text-[10px] leading-tight">admin@company.com</span>
                </div>
                <ChevronDown className="w-3 h-3 text-[hsl(var(--navbar-muted))] hidden lg:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-popover border-border">
              <DropdownMenuItem className="cursor-pointer gap-2">
                <User className="w-4 h-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Settings className="w-4 h-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2 text-destructive">
                <LogOut className="w-4 h-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
