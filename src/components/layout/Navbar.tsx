 import { NavLink, useLocation } from "react-router-dom";
 import { LayoutGrid, Users, Building2, CreditCard, ChevronDown, User } from "lucide-react";
 import { cn } from "@/lib/utils";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 
 const menuItems = [
   { title: "App List", url: "/", icon: LayoutGrid },
   { title: "User List", url: "/users", icon: Users },
   { title: "Organization", url: "/organization", icon: Building2 },
   { title: "Subscription", url: "/subscription", icon: CreditCard },
 ];
 
 export function Navbar() {
   const location = useLocation();
 
   return (
     <header className="bg-[hsl(var(--navbar-background))] border-b border-[hsl(var(--navbar-background))]">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex items-center justify-between h-14">
           {/* Logo */}
           <div className="flex items-center gap-2">
             <div className="flex items-center gap-1">
               <div className="w-2 h-2 rounded-full bg-primary" />
               <div className="w-2 h-2 rounded-full bg-primary" />
               <div className="w-2 h-2 rounded-full bg-primary" />
             </div>
             <span className="text-primary font-bold text-xl">AdminHub</span>
           </div>
 
           {/* Navigation */}
           <nav className="hidden md:flex items-center gap-1">
             {menuItems.map((item) => {
               const isActive = location.pathname === item.url;
               return (
                 <NavLink
                   key={item.title}
                   to={item.url}
                   className={cn(
                     "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                     isActive
                       ? "text-[hsl(var(--navbar-foreground))]"
                       : "text-[hsl(var(--navbar-muted))] hover:text-[hsl(var(--navbar-foreground))]"
                   )}
                 >
                   <item.icon className="w-4 h-4" />
                   {item.title}
                 </NavLink>
               );
             })}
           </nav>
 
           {/* User Menu */}
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <button className="flex items-center gap-2 text-[hsl(var(--navbar-foreground))] hover:text-primary transition-colors">
                 <User className="w-4 h-4" />
                 <span className="text-sm font-medium">Admin</span>
                 <ChevronDown className="w-4 h-4" />
               </button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-48">
               <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
               <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
               <DropdownMenuItem className="cursor-pointer text-destructive">Logout</DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
         </div>
       </div>
     </header>
   );
 }