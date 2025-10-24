"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { userAuth } from "@/context/AuthContext";
import { useData } from "@/context/CrudContext";
import Protected from "@/components/ProtectedRoute";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = userAuth();
  const {
    mainprojects,
    maintasks,
    mainusers,
    addTask,
    updateTask,
    deleteTask,
  } = useData();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    assignedTo: "",
    status: "pending",
  });

  // Load project and tasks
  useEffect(() => {
    const projectId = parseInt(params.id);
    const foundProject = mainprojects.find((p) => p.id === projectId);

    if (!foundProject) {
      //eslint-disable-next-line
      setLoading(false);
      return;
    }

    setProject(foundProject);
    setProjectTasks(maintasks.filter((t) => t.projectId === projectId));
    setLoading(false);
  }, [params.id, mainprojects, maintasks]);

  // Check permissions
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isMember = user?.role === "member";
  const isProjectOwner = project?.owner === user?.email;

  // Permission checks
  const canCreateTask = isAdmin || (isManager && isProjectOwner);
  const canEditTask = (task) => {
    if (isAdmin) return true;
    if (isManager && isProjectOwner) return true;
    return false;
  };
  const canDeleteTask = (task) => {
    if (isAdmin) return true;
    if (isManager && isProjectOwner) return true;
    return false;
  };
  const canMarkAsDone = (task) => {
    if (isAdmin) return true;
    if (isManager && isProjectOwner) return true;
    if (isMember && task.assignedTo === user?.email) return true;
    return false;
  };

  // Handle task form
  const openCreateDialog = () => {
    setEditingTask(null);
    setTaskForm({
      title: "",
      assignedTo: mainusers[0]?.email || "",
      status: "pending",
    });
    setIsTaskDialogOpen(true);
  };

  const openEditDialog = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      assignedTo: task.assignedTo,
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
      toast.success("Task updated successfully");
    } else {
      // Create new task
      addTask({
        ...taskForm,
        projectId: project.id,
      });
      toast.success("Task created successfully");
    }

    setIsTaskDialogOpen(false);
    setTaskForm({ title: "", assignedTo: "", status: "pending" });
  };

  const handleDeleteTask = (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskId);
      toast.success("Task deleted successfully");
    }
  };

  const handleToggleStatus = (task) => {
    const newStatus = task.status === "done" ? "pending" : "done";
    updateTask(task.id, { status: newStatus });
    toast.success(`Task marked as ${newStatus}`);
  };

  // Loading state
  if (loading) {
    return (
      <Protected>
        <div className="h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </Protected>
    );
  }

  // Error state - Project not found
  if (!project) {
    return (
      <Protected>
        <div className="h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The project you're looking for doesn't exist.
            </p>
            <Button onClick={() => router.push("/projects")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
      </Protected>
    );
  }

  // Access denied for members viewing projects they're not assigned to
  if (isMember && !projectTasks.some((t) => t.assignedTo === user?.email)) {
    return (
      <Protected>
        <div className="h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You don't have permission to view this project.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Protected>
    );
  }

  const completedTasks = projectTasks.filter((t) => t.status === "done").length;
  const pendingTasks = projectTasks.filter(
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/projects")}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div>
                <h1 className="text-lg font-medium">{project.name}</h1>
                <p className="text-xs text-muted-foreground">
                  Owner: {project.owner.split("@")[0]}
                </p>
              </div>
            </div>
            {canCreateTask && (
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            )}
          </header>

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Project Info */}
            <div className="rounded-lg border bg-card p-6">
              <p className="text-muted-foreground mb-4">
                {project.description}
              </p>

              {/* Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">
                      {projectTasks.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Tasks</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{completedTasks}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{pendingTasks}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {projectTasks.length > 0
                      ? Math.round((completedTasks / projectTasks.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        projectTasks.length > 0
                          ? (completedTasks / projectTasks.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Tasks</h3>

              {projectTasks.length === 0 ? (
                // Empty state
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">No tasks yet</p>
                  {canCreateTask && (
                    <Button variant="outline" onClick={openCreateDialog}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Task
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {projectTasks.map((task) => {
                    const assignedUser = mainusers.find(
                      (u) => u.email === task.assignedTo
                    );

                    return (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {canMarkAsDone(task) ? (
                            <button
                              onClick={() => handleToggleStatus(task)}
                              className="flex-shrink-0"
                            >
                              {task.status === "done" ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <Clock className="w-5 h-5 text-orange-500" />
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

                          <div className="flex-1">
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Assigned to: {assignedUser?.email.split("@")[0]}
                            </p>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              task.status === "done"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            }`}
                          >
                            {task.status === "done" ? "Completed" : "Pending"}
                          </span>
                        </div>

                        {/* Action buttons */}
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
                : "Add a new task to this project."}
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
