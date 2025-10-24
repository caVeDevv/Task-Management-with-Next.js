"use client";

import { createContext, useContext, useState, useEffect } from "react";
import usersData from "../data/users.json";
import tasksData from "../data/tasks.json";
import projectsData from "../data/projects.json";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [mainusers, setMainUsers] = useState([]);
  const [maintasks, setMainTasks] = useState([]);
  const [mainprojects, setMainProjects] = useState([]);

  useEffect(() => {
    // Load from localStorage or use seed data
    const storedUsers = localStorage.getItem("taskflow_users");
    const storedTasks = localStorage.getItem("taskflow_tasks");
    const storedProjects = localStorage.getItem("taskflow_projects");

    //eslint-disable-next-line
    setMainUsers(storedUsers ? JSON.parse(storedUsers) : usersData);
    setMainTasks(storedTasks ? JSON.parse(storedTasks) : tasksData);
    setMainProjects(storedProjects ? JSON.parse(storedProjects) : projectsData);
  }, []);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    if (mainusers.length > 0)
      localStorage.setItem("taskflow_users", JSON.stringify(mainusers));
  }, [mainusers]);

  useEffect(() => {
    if (maintasks.length > 0)
      localStorage.setItem("taskflow_tasks", JSON.stringify(maintasks));
  }, [maintasks]);

  useEffect(() => {
    if (mainprojects.length > 0)
      localStorage.setItem("taskflow_projects", JSON.stringify(mainprojects));
  }, [mainprojects]);

  // CRUD Operations for Tasks
  const addTask = (task) => {
    const newTask = { ...task, id: Date.now() };
    setMainTasks([...maintasks, newTask]);
    return newTask;
  };

  const updateTask = (taskId, updates) => {
    setMainTasks(
      maintasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (taskId) => {
    setMainTasks(maintasks.filter((t) => t.id !== taskId));
  };

  // CRUD Operations for Projects
  const addProject = (project) => {
    const newProject = { ...project, id: Date.now() };
    setMainProjects([...mainprojects, newProject]);
    return newProject;
  };

  const updateProject = (projectId, updates) => {
    setMainProjects(
      mainprojects.map((p) => (p.id === projectId ? { ...p, ...updates } : p))
    );
  };

  const deleteProject = (projectId) => {
    setMainProjects(mainprojects.filter((p) => p.id !== projectId));
    // Also delete associated tasks
    setMainTasks(maintasks.filter((t) => t.projectId !== projectId));
  };

  // User role management (for admin)
  const updateUserRole = (email, newRole) => {
    setMainUsers(
      mainusers.map((u) => (u.email === email ? { ...u, role: newRole } : u))
    );
  };

  const value = {
    mainusers,
    maintasks,
    mainprojects,
    addTask,
    updateTask,
    deleteTask,
    addProject,
    updateProject,
    deleteProject,
    updateUserRole,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
