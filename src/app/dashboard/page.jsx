// "use client";

// import { userAuth } from "@/context/AuthContext";
// import { useData } from "@/context/CrudContext";
// import Protected from "@/components/ProtectedRoute";
// import { AppSidebar } from "@/components/app-sidebar";
// import { Separator } from "@/components/ui/separator";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import {
//   Users,
//   FolderKanban,
//   ListTodo,
//   CheckCircle2,
//   Clock,
// } from "lucide-react";

// export default function DashboardPage() {
//   const { user } = userAuth();
//   // Globallocal useState
//   const { mainusers, maintasks, mainprojects } = useData();

//   const completedTasks = maintasks.filter((t) => t.status === "done").length;
//   const pendingTasks = maintasks.filter((t) => t.status === "pending").length;

//   return (
//     <Protected>
//       <SidebarProvider>
//         <AppSidebar />
//         <SidebarInset>
//           {/* Header */}
//           <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
//             <div className="flex items-center gap-2 px-4">
//               <SidebarTrigger className="-ml-1" />
//               <Separator orientation="vertical" className="mr-2 h-4" />
//               <h1 className="text-lg font-medium">Dashboard</h1>
//             </div>
//           </header>

//           {/* Main Content */}
//           <div className="flex flex-1 flex-col gap-6 p-6">
//             <div>
//               <h2 className="text-base md:text-xl font-medium mb-1">
//                 Welcome back, {user?.role}!
//               </h2>
//             </div>

//             {/* Admin Dashboard */}
//             {user?.role === "admin" && (
//               <div className="space-y-6">
//                 {/* displaying stats in a grid */}
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                   <div className="rounded-lg border bg-card p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Users className="h-5 w-5 text-blue-500" />
//                       <p className="text-sm font-medium ">Total Users</p>
//                     </div>
//                     <p className="text-2xl font-medium">{mainusers.length}</p>
//                   </div>

//                   <div className="rounded-lg border bg-card p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-2">
//                       <FolderKanban className="h-5 w-5 text-purple-500" />
//                       <p className="text-sm font-medium ">Total Projects</p>
//                     </div>
//                     <p className="text-2xl font-medium">
//                       {mainprojects.length}
//                     </p>
//                   </div>

//                   <div className="rounded-lg border bg-card p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-2">
//                       <CheckCircle2 className="h-5 w-5 text-green-500" />
//                       <p className="text-sm font-medium ">Completed Tasks</p>
//                     </div>
//                     <p className="text-2xl font-medium">{completedTasks}</p>
//                   </div>

//                   <div className="rounded-lg border bg-card p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Clock className="h-5 w-5 text-orange-500" />
//                       <p className="text-sm font-medium ">Pending Tasks</p>
//                     </div>
//                     <p className="text-2xl font-medium">{pendingTasks}</p>
//                   </div>
//                 </div>

//                 {/* Activity */}
//                 <div className="rounded-lg border bg-card p-6 shadow-sm">
//                   <h4 className="font-semibold mb-4">All Projects</h4>
//                   <div className="space-y-3">
//                     {mainprojects.map((project) => {
//                       const projectTasks = maintasks.filter(
//                         (t) => t.projectId === project.id
//                       );
//                       const projectCompletedTasks = projectTasks.filter(
//                         (t) => t.status === "done"
//                       ).length;

//                       return (
//                         <div
//                           key={project.id}
//                           className="flex items-center justify-between p-3 rounded-md bg-muted/50"
//                         >
//                           <div>
//                             <p className="font-medium">{project.name}</p>
//                             <p className="text-sm text-muted-foreground">
//                               {project.description}
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <p className="text-sm font-medium">
//                               {projectCompletedTasks}/{projectTasks.length}{" "}
//                               tasks
//                             </p>
//                             <p className="text-xs text-muted-foreground">
//                               Owner: {project.owner.split("@")[0]}
//                             </p>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Manager Dashboard */}
//             {user?.role === "manager" && (
//               <div className="space-y-6">
//                 {/* displaying stats in a grid  */}
//                 <div className="grid gap-4 md:grid-cols-3">
//                   <div className="rounded-lg border bg-card p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-2">
//                       <FolderKanban className="h-5 w-5 text-purple-500" />
//                       <p className="text-sm font-medium ">My Projects</p>
//                     </div>
//                     <p className="text-2xl font-medium">
//                       {
//                         mainprojects.filter((p) => p.owner === user.email)
//                           .length
//                       }
//                     </p>
//                   </div>

//                   <div className="rounded-lg border bg-card p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-2">
//                       <CheckCircle2 className="h-5 w-5 text-green-500" />
//                       <p className="text-sm font-medium ">Completed</p>
//                     </div>
//                     <p className="text-2xl font-medium">
//                       {
//                         maintasks.filter((t) => {
//                           const project = mainprojects.find(
//                             (p) => p.id === t.projectId
//                           );
//                           return (
//                             project?.owner === user.email && t.status === "done"
//                           );
//                         }).length
//                       }
//                     </p>
//                   </div>

//                   <div className="rounded-lg border bg-card p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Clock className="h-5 w-5 text-orange-500" />
//                       <p className="text-sm font-medium ">Pending</p>
//                     </div>
//                     <p className="text-2xl font-medium">
//                       {
//                         maintasks.filter((t) => {
//                           const project = mainprojects.find(
//                             (p) => p.id === t.projectId
//                           );
//                           return (
//                             project?.owner === user.email &&
//                             t.status === "pending"
//                           );
//                         }).length
//                       }
//                     </p>
//                   </div>
//                 </div>

//                 {/*  List */}
//                 <div className="rounded-lg border bg-card p-6 shadow-sm">
//                   <h4 className="font-semibold mb-4">Project Overview</h4>
//                   {mainprojects.filter((p) => p.owner === user.email).length >
//                   0 ? (
//                     <div className="space-y-3">
//                       {mainprojects
//                         .filter((p) => p.owner === user.email)
//                         .map((project) => {
//                           const projectTasks = maintasks.filter(
//                             (t) => t.projectId === project.id
//                           );
//                           const projectCompletedTasks = projectTasks.filter(
//                             (t) => t.status === "done"
//                           ).length;

//                           return (
//                             <div
//                               key={project.id}
//                               className="p-4 rounded-md bg-muted/50"
//                             >
//                               <div className="flex items-center justify-between mb-2">
//                                 <h5 className="font-medium">{project.name}</h5>
//                                 <span className="text-sm text-muted-foreground">
//                                   {projectCompletedTasks}/{projectTasks.length}{" "}
//                                   completed
//                                 </span>
//                               </div>
//                               <p className="text-sm text-muted-foreground mb-3">
//                                 {project.description}
//                               </p>

//                               {/* Progress Bar */}
//                               <div className="w-full bg-muted rounded-full h-2">
//                                 <div
//                                   className="bg-primary h-2 rounded-full transition-all"
//                                   style={{
//                                     width: `${
//                                       projectTasks.length > 0
//                                         ? (projectCompletedTasks /
//                                             projectTasks.length) *
//                                           100
//                                         : 0
//                                     }%`,
//                                   }}
//                                 />
//                               </div>
//                             </div>
//                           );
//                         })}
//                     </div>
//                   ) : (
//                     <p className="text-center py-8">
//                       No projects assigned to you yet.
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Member Dashboard */}
//             {user?.role === "member" && (
//               <div className="space-y-6">
//                 {/* displaying stats in a grid */}
//                 <div className="grid gap-4 md:grid-cols-3">
//                   <div className="rounded-lg border bg-card p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-2">
//                       <ListTodo className="h-5 w-5 text-blue-500" />
//                       <p className="text-sm font-medium">Total Tasks</p>
//                     </div>
//                     <p className="text-2xl font-medium">
//                       {
//                         maintasks.filter((t) => t.assignedTo === user.email)
//                           .length
//                       }
//                     </p>
//                   </div>

//                   <div className="rounded-lg border bg-card p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-2">
//                       <CheckCircle2 className="h-5 w-5 text-green-500" />
//                       <p className="text-sm font-medium ">Completed</p>
//                     </div>
//                     <p className="text-2xl font-medium">
//                       {
//                         maintasks.filter(
//                           (t) =>
//                             t.assignedTo === user.email && t.status === "done"
//                         ).length
//                       }
//                     </p>
//                   </div>

//                   <div className="rounded-lg border bg-card p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Clock className="h-5 w-5 text-orange-500" />
//                       <p className="text-sm font-medium">Pending</p>
//                     </div>
//                     <p className="text-2xl font-medium">
//                       {
//                         maintasks.filter(
//                           (t) =>
//                             t.assignedTo === user.email &&
//                             t.status === "pending"
//                         ).length
//                       }
//                     </p>
//                   </div>
//                 </div>

//                 {/* List */}
//                 <div className="rounded-lg border bg-card p-6 shadow-sm">
//                   <h4 className="font-semibold mb-4">Task List</h4>
//                   {maintasks.filter((t) => t.assignedTo === user.email).length >
//                   0 ? (
//                     <div className="space-y-2">
//                       {maintasks
//                         .filter((t) => t.assignedTo === user.email)
//                         .map((task) => {
//                           const project = mainprojects.find(
//                             (p) => p.id === task.projectId
//                           );

//                           return (
//                             <div
//                               key={task.id}
//                               className="flex items-center justify-between p-4 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors"
//                             >
//                               <div className="flex items-center gap-3">
//                                 {task.status === "done" ? (
//                                   <CheckCircle2 className="h-5 w-5 text-green-500" />
//                                 ) : (
//                                   <Clock className="h-5 w-5 text-orange-500" />
//                                 )}
//                                 <div>
//                                   <p className="font-medium">{task.title}</p>
//                                   <p className="text-sm text-muted-foreground">
//                                     Project: {project?.name || "Unknown"}
//                                   </p>
//                                 </div>
//                               </div>
//                               <span
//                                 className={`px-3 py-1 rounded-full text-xs font-medium ${
//                                   task.status === "done"
//                                     ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
//                                     : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
//                                 }`}
//                               >
//                                 {task.status === "done"
//                                   ? "Completed"
//                                   : "Pending"}
//                               </span>
//                             </div>
//                           );
//                         })}
//                     </div>
//                   ) : (
//                     <p className="text-center py-8">
//                       No tasks assigned to you yet.
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </SidebarInset>
//       </SidebarProvider>
//     </Protected>
//   );
// }

"use client";

import { useState } from "react";
import { userAuth } from "@/context/AuthContext";
import { useData } from "@/context/CrudContext";
import Protected from "@/components/ProtectedRoute";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Users,
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock,
  Shield,
  UserCog,
  User,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function DashboardPage() {
  const { user } = userAuth();
  const { mainusers, maintasks, mainprojects, updateUser, deleteUser } =
    useData();

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const completedTasks = maintasks.filter((t) => t.status === "done").length;
  const pendingTasks = maintasks.filter((t) => t.status === "pending").length;

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

  return (
    <Protected>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-lg font-medium">Dashboard</h1>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-6 p-6">
            <div>
              <h2 className="text-base md:text-xl font-medium mb-1">
                Welcome back, {user?.role}!
              </h2>
            </div>

            {/* Admin Dashboard */}
            {user?.role === "admin" && (
              <div className="space-y-6">
                {/* displaying stats in a grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <p className="text-sm font-medium ">Total Users</p>
                    </div>
                    <p className="text-2xl font-medium">{mainusers.length}</p>
                  </div>

                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderKanban className="h-5 w-5 text-purple-500" />
                      <p className="text-sm font-medium ">Total Projects</p>
                    </div>
                    <p className="text-2xl font-medium">
                      {mainprojects.length}
                    </p>
                  </div>

                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <p className="text-sm font-medium ">Completed Tasks</p>
                    </div>
                    <p className="text-2xl font-medium">{completedTasks}</p>
                  </div>

                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <p className="text-sm font-medium ">Pending Tasks</p>
                    </div>
                    <p className="text-2xl font-medium">{pendingTasks}</p>
                  </div>
                </div>

                {/* User Management Section */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h4 className="font-semibold mb-4">User Management</h4>
                  <div className="space-y-3">
                    {mainusers.map((u) => (
                      <div
                        key={u.email}
                        className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
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
                </div>

                {/* All Projects */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h4 className="font-semibold mb-4">All Projects</h4>
                  <div className="space-y-3">
                    {mainprojects.map((project) => {
                      const projectTasks = maintasks.filter(
                        (t) => t.projectId === project.id
                      );
                      const projectCompletedTasks = projectTasks.filter(
                        (t) => t.status === "done"
                      ).length;

                      return (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                        >
                          <div>
                            <p className="font-medium">{project.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {project.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {projectCompletedTasks}/{projectTasks.length}{" "}
                              tasks
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Owner: {project.owner.split("@")[0]}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Manager Dashboard */}
            {user?.role === "manager" && (
              <div className="space-y-6">
                {/* displaying stats in a grid  */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderKanban className="h-5 w-5 text-purple-500" />
                      <p className="text-sm font-medium ">My Projects</p>
                    </div>
                    <p className="text-2xl font-medium">
                      {
                        mainprojects.filter((p) => p.owner === user.email)
                          .length
                      }
                    </p>
                  </div>

                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <p className="text-sm font-medium ">Completed</p>
                    </div>
                    <p className="text-2xl font-medium">
                      {
                        maintasks.filter((t) => {
                          const project = mainprojects.find(
                            (p) => p.id === t.projectId
                          );
                          return (
                            project?.owner === user.email && t.status === "done"
                          );
                        }).length
                      }
                    </p>
                  </div>

                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <p className="text-sm font-medium ">Pending</p>
                    </div>
                    <p className="text-2xl font-medium">
                      {
                        maintasks.filter((t) => {
                          const project = mainprojects.find(
                            (p) => p.id === t.projectId
                          );
                          return (
                            project?.owner === user.email &&
                            t.status === "pending"
                          );
                        }).length
                      }
                    </p>
                  </div>
                </div>

                {/*  List */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h4 className="font-semibold mb-4">Project Overview</h4>
                  {mainprojects.filter((p) => p.owner === user.email).length >
                  0 ? (
                    <div className="space-y-3">
                      {mainprojects
                        .filter((p) => p.owner === user.email)
                        .map((project) => {
                          const projectTasks = maintasks.filter(
                            (t) => t.projectId === project.id
                          );
                          const projectCompletedTasks = projectTasks.filter(
                            (t) => t.status === "done"
                          ).length;

                          return (
                            <div
                              key={project.id}
                              className="p-4 rounded-md bg-muted/50"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium">{project.name}</h5>
                                <span className="text-sm text-muted-foreground">
                                  {projectCompletedTasks}/{projectTasks.length}{" "}
                                  completed
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {project.description}
                              </p>

                              {/* Progress Bar */}
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{
                                    width: `${
                                      projectTasks.length > 0
                                        ? (projectCompletedTasks /
                                            projectTasks.length) *
                                          100
                                        : 0
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No projects assigned to you yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Member Dashboard */}
            {user?.role === "member" && (
              <div className="space-y-6">
                {/* displaying stats in a grid */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <ListTodo className="h-5 w-5 text-blue-500" />
                      <p className="text-sm font-medium">Total Tasks</p>
                    </div>
                    <p className="text-2xl font-medium">
                      {
                        maintasks.filter((t) => t.assignedTo === user.email)
                          .length
                      }
                    </p>
                  </div>

                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <p className="text-sm font-medium ">Completed</p>
                    </div>
                    <p className="text-2xl font-medium">
                      {
                        maintasks.filter(
                          (t) =>
                            t.assignedTo === user.email && t.status === "done"
                        ).length
                      }
                    </p>
                  </div>

                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <p className="text-sm font-medium">Pending</p>
                    </div>
                    <p className="text-2xl font-medium">
                      {
                        maintasks.filter(
                          (t) =>
                            t.assignedTo === user.email &&
                            t.status === "pending"
                        ).length
                      }
                    </p>
                  </div>
                </div>

                {/* List */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <h4 className="font-semibold mb-4">Task List</h4>
                  {maintasks.filter((t) => t.assignedTo === user.email).length >
                  0 ? (
                    <div className="space-y-2">
                      {maintasks
                        .filter((t) => t.assignedTo === user.email)
                        .map((task) => {
                          const project = mainprojects.find(
                            (p) => p.id === task.projectId
                          );

                          return (
                            <div
                              key={task.id}
                              className="flex items-center justify-between p-4 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {task.status === "done" ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <Clock className="h-5 w-5 text-orange-500" />
                                )}
                                <div>
                                  <p className="font-medium">{task.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Project: {project?.name || "Unknown"}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  task.status === "done"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                }`}
                              >
                                {task.status === "done"
                                  ? "Completed"
                                  : "Pending"}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No tasks assigned to you yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Role Edit Dialog - Only for Admin */}
      {user?.role === "admin" && (
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
      )}
    </Protected>
  );
}
