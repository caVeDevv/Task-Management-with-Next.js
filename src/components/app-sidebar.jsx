"use client";

import { Home, FolderKanban, ListTodo, Shield, LogOut } from "lucide-react";
import Link from "next/link";
import { userAuth } from "../context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AppSidebar() {
  const router = useRouter();
  const { user, logout } = userAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
    toast.success("Logged out successfully", {
      style: {
        background: "#008080",
        color: "white",
        fontSize: "15px",
        border: "none",
      },
    });
  };

  const items = [{ title: "Dashboard", url: "/dashboard", icon: Home }];

  if (user?.role === "admin" || user?.role === "manager") {
    items.push({ title: "Projects", url: "/projects", icon: FolderKanban });
  }

  items.push({ title: "Tasks", url: "/tasks", icon: ListTodo });

  // if (user?.role === "admin") {
  //   items.push({ title: "Admin", url: "/admin", icon: Shield });
  // }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Task-M {user.role}</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
