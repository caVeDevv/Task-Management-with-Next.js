"use client";

import { useState } from "react";
import Protected from "@/components/ProtectedRoute";
import { useData } from "@/context/CrudContext";
import { userAuth } from "@/context/AuthContext";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Users, Pencil, Trash2, Shield, UserCog, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function UsersPage() {
  const { user } = userAuth();
  const { mainusers, updateUser, deleteUser } = useData();

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  // Permission check
  const isAdmin = user?.role === "admin";

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "manager":
        return <UserCog className="w-4 h-4 text-blue-500" />;
      case "member":
        return <User className="w-4 h-4 text-green-500" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  // Get role badge color
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "manager":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "member":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Count by role
  const adminCount = mainusers.filter((u) => u.role === "admin").length;
  const managerCount = mainusers.filter((u) => u.role === "manager").length;
  const memberCount = mainusers.filter((u) => u.role === "member").length;

  // Open role edit dialog
  const openRoleDialog = (userToEdit) => {
    setEditingUser(userToEdit);
    setSelectedRole(userToEdit.role);
    setIsRoleDialogOpen(true);
  };

  // Handle role update
  const handleUpdateRole = () => {
    if (!editingUser || !selectedRole) return;

    // Prevent removing the last admin
    if (editingUser.role === "admin" && selectedRole !== "admin") {
      if (adminCount <= 1) {
        toast.error("Cannot change role: At least one admin is required", {
          style: {
            background: "#ef4444",
            color: "white",
            fontSize: "15px",
            border: "none",
          },
        });
        return;
      }
    }

    // Prevent user from changing their own role
    if (editingUser.email === user?.email) {
      toast.error("You cannot change your own role", {
        style: {
          background: "#ef4444",
          color: "white",
          fontSize: "15px",
          border: "none",
        },
      });
      return;
    }

    updateUser(editingUser.email, { role: selectedRole });
    toast.success(`Role updated to ${selectedRole}`, {
      style: {
        background: "#008080",
        color: "white",
        fontSize: "15px",
        border: "none",
      },
    });

    setIsRoleDialogOpen(false);
    setEditingUser(null);
  };

  // Handle delete user
  const handleDeleteUser = (userToDelete) => {
    // Prevent deleting the last admin
    if (userToDelete.role === "admin" && adminCount <= 1) {
      toast.error("Cannot delete: At least one admin is required", {
        style: {
          background: "#ef4444",
          color: "white",
          fontSize: "15px",
          border: "none",
        },
      });
      return;
    }

    // Prevent user from deleting themselves
    if (userToDelete.email === user?.email) {
      toast.error("You cannot delete your own account", {
        style: {
          background: "#ef4444",
          color: "white",
          fontSize: "15px",
          border: "none",
        },
      });
      return;
    }

    if (confirm(`Are you sure you want to delete ${userToDelete.email}?`)) {
      deleteUser(userToDelete.email);
      toast.success("User deleted successfully", {
        style: {
          background: "#008080",
          color: "white",
          fontSize: "15px",
          border: "none",
        },
      });
    }
  };

  if (!isAdmin) {
    return (
      <Protected>
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </Protected>
    );
  }

  return (
    <Protected>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-lg font-medium">User Management</h1>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <p className="text-sm font-medium">Total Users</p>
                </div>
                <p className="text-2xl font-semibold">{mainusers.length}</p>
              </div>

              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  <p className="text-sm font-medium">Admins</p>
                </div>
                <p className="text-2xl font-semibold">{adminCount}</p>
              </div>

              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <UserCog className="h-5 w-5 text-blue-500" />
                  <p className="text-sm font-medium">Managers</p>
                </div>
                <p className="text-2xl font-semibold">{managerCount}</p>
              </div>

              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-green-500" />
                  <p className="text-sm font-medium">Members</p>
                </div>
                <p className="text-2xl font-semibold">{memberCount}</p>
              </div>
            </div>

            {/* Users List */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">All Users</h3>
              {mainusers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mainusers.map((u) => (
                    <div
                      key={u.email}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getRoleIcon(u.role)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{u.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {u.email.split("@")[0]}
                          </p>
                        </div>

                        {/* Role Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getRoleBadgeClass(
                            u.role
                          )}`}
                        >
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>

                        {/* Current User Badge */}
                        {u.email === user?.email && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 flex-shrink-0">
                            You
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openRoleDialog(u)}
                          disabled={u.email === user?.email}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(u)}
                          disabled={u.email === user?.email}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Role Edit Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {editingUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-500" />
                      <span>Admin</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="manager">
                    <div className="flex items-center gap-2">
                      <UserCog className="w-4 h-4 text-blue-500" />
                      <span>Manager</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="member">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-green-500" />
                      <span>Member</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role Descriptions */}
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">Role Permissions:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {selectedRole === "admin" && (
                  <>
                    <li>Full system access</li>
                    <li>Manage all users, projects, and tasks</li>
                    <li>Change user roles</li>
                  </>
                )}
                {selectedRole === "manager" && (
                  <>
                    <li>Manage their own projects</li>
                    <li>Create and assign tasks</li>
                    <li>View team members</li>
                  </>
                )}
                {selectedRole === "member" && (
                  <>
                    <li>View assigned tasks</li>
                    <li>Update task status</li>
                    <li>Limited access</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRoleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateRole}>
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Protected>
  );
}
