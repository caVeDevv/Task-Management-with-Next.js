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
import {
  Plus,
  ListTodo,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function TasksPage() {
  const { user } = userAuth();
  const {
    maintasks,
    mainprojects,
    mainusers,
    addTask,
    updateTask,
    deleteTask,
  } = useData();

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [taskForm, setTaskForm] = useState({
    title: "",
    assignedTo: "",
    projectId: "",
    status: "pending",
  });

  // Permission checks
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isMember = user?.role === "member";

  // Get user's projects (for managers)
  const userProjects = mainprojects.filter((p) => p.owner === user?.email);

  // Filter tasks based on role
  const getFilteredTasks = () => {
    let filtered = [];

    if (isAdmin) {
      // Admin sees all tasks
      filtered = maintasks;
    } else if (isManager) {
      // Manager sees tasks in their projects
      const projectIds = userProjects.map((p) => p.id);
      filtered = maintasks.filter((t) => projectIds.includes(t.projectId));
    } else if (isMember) {
      // Member sees only their assigned tasks
      filtered = maintasks.filter((t) => t.assignedTo === user?.email);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  // Permission functions
  const canCreateTask = isAdmin;

  const canEditTask = (task) => {
    if (isAdmin) return true;
    if (isManager) {
      const project = mainprojects.find((p) => p.id === task.projectId);
      return project?.owner === user?.email;
    }
    return false;
  };

  const canDeleteTask = (task) => {
    if (isAdmin) return true;
    if (isManager) {
      const project = mainprojects.find((p) => p.id === task.projectId);
      return project?.owner === user?.email;
    }
    return false;
  };

  const canToggleStatus = (task) => {
    if (isAdmin) return true;
    if (isManager) {
      const project = mainprojects.find((p) => p.id === task.projectId);
      return project?.owner === user?.email;
    }
    if (isMember) return task.assignedTo === user?.email;
    return false;
  };

  // Dialog handlers
  const openCreateDialog = () => {
    setEditingTask(null);
    setTaskForm({
      title: "",
      assignedTo: mainusers[0]?.email || "",
      projectId: mainprojects[0]?.id || "",
      status: "pending",
    });
    setIsTaskDialogOpen(true);
  };

  const openEditDialog = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      assignedTo: task.assignedTo,
      projectId: task.projectId,
      status: task.status,
    });
    setIsTaskDialogOpen(true);
  };

  const handleSubmitTask = (e) => {
    e.preventDefault();

    if (!taskForm.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (editingTask) {
      // Update existing task
      updateTask(editingTask.id, taskForm);
      toast.success("Task updated successfully", {
        style: {
          background: "#008080",
          color: "white",
          fontSize: "15px",
          border: "none",
        },
      });
    } else {
      // Create new task
      addTask({
        ...taskForm,
        projectId: parseInt(taskForm.projectId),
      });
      toast.success("Task created successfully", {
        style: {
          background: "#008080",
          color: "white",
          fontSize: "15px",
          border: "none",
        },
      });
    }

    setIsTaskDialogOpen(false);
    setTaskForm({
      title: "",
      assignedTo: "",
      projectId: "",
      status: "pending",
    });
  };

  const handleDeleteTask = (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskId);
      toast.success("Task deleted successfully", {
        style: {
          background: "#008080",
          color: "white",
          fontSize: "15px",
          border: "none",
        },
      });
    }
  };

  const handleToggleStatus = (task) => {
    const newStatus = task.status === "done" ? "pending" : "done";
    updateTask(task.id, { status: newStatus });
    toast.success(`Task marked as ${newStatus}`, {
      style: {
        background: "#008080",
        color: "white",
        fontSize: "15px",
        border: "none",
      },
    });
  };

  // Stats
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(
    (t) => t.status === "done"
  ).length;
  const pendingTasks = filteredTasks.filter(
    (t) => t.status === "pending"
  ).length;

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
              <h1 className="text-lg font-medium">Tasks</h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="done">Completed</SelectItem>
                </SelectContent>
              </Select>

              {canCreateTask && (
                <Button onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              )}
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ListTodo className="h-5 w-5 text-blue-500" />
                  <p className="text-sm font-medium">Total Tasks</p>
                </div>
                <p className="text-2xl font-semibold">{totalTasks}</p>
              </div>

              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <p className="text-sm font-medium">Completed</p>
                </div>
                <p className="text-2xl font-semibold">{completedTasks}</p>
              </div>

              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <p className="text-sm font-medium">Pending</p>
                </div>
                <p className="text-2xl font-semibold">{pendingTasks}</p>
              </div>
            </div>

            {/* Tasks List */}
            <div className="rounded-lg border bg-card p-6">
              {filteredTasks.length === 0 ? (
                // Empty state
                <div className="text-center py-12">
                  <ListTodo className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">
                    {filterStatus === "all"
                      ? "No tasks yet"
                      : `No ${filterStatus} tasks`}
                  </p>
                  {canCreateTask && filterStatus === "all" && (
                    <Button variant="outline" onClick={openCreateDialog}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Task
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map((task) => {
                    const project = mainprojects.find(
                      (p) => p.id === task.projectId
                    );
                    const assignedUser = mainusers.find(
                      (u) => u.email === task.assignedTo
                    );

                    return (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {/* Status Toggle */}
                          {canToggleStatus(task) ? (
                            <button
                              onClick={() => handleToggleStatus(task)}
                              className="flex-shrink-0"
                            >
                              {task.status === "done" ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 cursor-pointer" />
                              ) : (
                                <Clock className="w-5 h-5 text-orange-500 cursor-pointer" />
                              )}
                            </button>
                          ) : (
                            <div className="flex-shrink-0">
                              {task.status === "done" ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <Clock className="w-5 h-5 text-orange-500" />
                              )}
                            </div>
                          )}

                          {/* Task Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{task.title}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Project: {project?.name || "Unknown"}</span>
                              <span>
                                Assigned to:{" "}
                                {assignedUser?.email.split("@")[0] || "Unknown"}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                              task.status === "done"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            }`}
                          >
                            {task.status === "done" ? "Completed" : "Pending"}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          {canEditTask(task) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(task)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          )}
                          {canDeleteTask(task) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Update the task details below."
                : "Add a new task to a project."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitTask}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Design homepage"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectId">Project</Label>
                <Select
                  value={taskForm.projectId.toString()}
                  onValueChange={(value) =>
                    setTaskForm({ ...taskForm, projectId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainprojects.map((project) => (
                      <SelectItem
                        key={project.id}
                        value={project.id.toString()}
                      >
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select
                  value={taskForm.assignedTo}
                  onValueChange={(value) =>
                    setTaskForm({ ...taskForm, assignedTo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainusers.map((u) => (
                      <SelectItem key={u.email} value={u.email}>
                        {u.email.split("@")[0]} ({u.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={taskForm.status}
                  onValueChange={(value) =>
                    setTaskForm({ ...taskForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTaskDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingTask ? "Update Task" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Protected>
  );
}
