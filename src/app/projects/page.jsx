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
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Project() {
  const { user } = userAuth();
  const { mainprojects, mainusers, addProject, updateProject, deleteProject } =
    useData();

  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    owner: "",
  });

  // Filter projects based on role
  const userProjects =
    user?.role === "admin"
      ? mainprojects
      : mainprojects.filter((p) => p.owner === user?.email);

  // Only Admin can create/edit/delete projects
  const canCreateProject = user?.role === "admin";
  const canEditProject = user?.role === "admin";
  const canDeleteProject = user?.role === "admin";

  // Get managers for project assignment
  const managers = mainusers.filter((u) => u.role === "manager");

  const openCreateDialog = () => {
    setEditingProject(null);
    setProjectForm({
      name: "",
      description: "",
      owner: managers[0]?.email || "",
    });
    setIsProjectDialogOpen(true);
  };

  const openEditDialog = (project, e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      description: project.description,
      owner: project.owner,
    });
    setIsProjectDialogOpen(true);
  };

  const handleSubmitProject = (e) => {
    e.preventDefault();

    if (!projectForm.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!projectForm.owner) {
      toast.error("Project owner is required");
      return;
    }

    if (editingProject) {
      // Update existing project
      updateProject(editingProject.id, projectForm);
      toast.success("Project updated successfully", {
        style: {
          background: "#008080",
          color: "white",
          fontSize: "15px",
          border: "none",
        },
      });
    } else {
      // Create new project
      addProject({
        name: projectForm.name,
        description: projectForm.description,
        owner: projectForm.owner,
      });
      toast.success("Project created successfully", {
        style: {
          background: "#008080",
          color: "white",
          fontSize: "15px",
          border: "none",
        },
      });
    }

    setIsProjectDialogOpen(false);
    setProjectForm({ name: "", description: "", owner: "" });
  };

  const handleDeleteProject = (projectId, e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    if (
      confirm(
        "Are you sure you want to delete this project? All associated tasks will also be deleted."
      )
    ) {
      deleteProject(projectId);
      toast.success("Project deleted successfully", {
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
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-lg font-medium">Projects</h1>
            </div>
            {canCreateProject && (
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            )}
          </header>

          <div className="p-6">
            {userProjects.length === 0 ? (
              <div className="text-center py-12">
                <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">No projects yet</p>
                {canCreateProject && (
                  <Button variant="outline" onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Project
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userProjects.map((project) => (
                  <div key={project.id} className="relative group">
                    <Link href={`/projects/${project.id}`}>
                      <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                        <h3 className="font-semibold mb-2">{project.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {project.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Owner: {project.owner.split("@")[0]}
                        </p>
                      </div>
                    </Link>

                    {/* Admin Action Buttons */}
                    {canEditProject && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                          onClick={(e) => openEditDialog(project, e)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        {canDeleteProject && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                            onClick={(e) => handleDeleteProject(project.id, e)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Project Creation/Edit Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Create New Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? "Update the project details below."
                : "Add a new project and assign it to a manager."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitProject}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., Website Revamp"
                  value={projectForm.name}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Description</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Brief description of the project"
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectOwner">Assign to Manager</Label>
                {managers.length > 0 ? (
                  <Select
                    value={projectForm.owner}
                    onValueChange={(value) =>
                      setProjectForm({ ...projectForm, owner: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map((manager) => (
                        <SelectItem key={manager.email} value={manager.email}>
                          {manager.email.split("@")[0]} ({manager.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No managers available. Create manager accounts first.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProjectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={managers.length === 0}>
                {editingProject ? "Update Project" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Protected>
  );
}
