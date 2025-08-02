import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Link2, 
  Users, 
  Bot,
  Activity
} from "lucide-react";

const navigationItems = [
  { title: "Links", url: "/dashboard/links", icon: Link2 },
  { title: "Users", url: "/dashboard/users", icon: Users },
  { title: "Status", url: "/dashboard/status", icon: Activity },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const baseClasses = "transition-smooth hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
    if (isActive(path)) {
      return `${baseClasses} bg-sidebar-primary text-sidebar-primary-foreground shadow-sm`;
    }
    return baseClasses;
  };

  return (
    <Sidebar className={`${isCollapsed ? "w-14" : "w-64"} border-r border-sidebar-border bg-sidebar transition-smooth`}>
      <SidebarContent>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-sidebar-foreground">Link Bot</h2>
                <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClass(item.url)}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}