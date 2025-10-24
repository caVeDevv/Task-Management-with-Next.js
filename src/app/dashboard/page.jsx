"use client";

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
} from "lucide-react";

export default function DashboardPage() {
  const { user } = userAuth();
  // Global useState
  const { mainusers, maintasks, mainprojects } = useData();

  const completedTasks = maintasks.filter((t) => t.status === "done").length;
  const pendingTasks = maintasks.filter((t) => t.status === "pending").length;

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

                {/* Activity */}
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
                    <p className="text-center py-8">
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
                    <p className="text-center py-8">
                      No tasks assigned to you yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Protected>
  );
}
