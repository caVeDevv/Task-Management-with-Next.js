# TaskM - Task Management System

A comprehensive role-based task management application built with Next.js, featuring three distinct user roles with customized permissions and dashboards.

## Features

### Role-Based Access Control

- **Admin**: Full system access with user management capabilities
- **Manager**: Project and task management for owned projects
- **Member**: View assigned tasks

### Core Functionality

- **Authentication System**: Secure login with seed data validation
- **Protected Routes**: Dashboard, Projects, and Tasks pages require authentication
- **Real-time Updates**: Global state management for seamless data synchronization
- **Toast Notifications**: User feedback for all CRUD operations and authentication events

### Admin Capabilities

- Manage user roles (promote/demote users
- Create, edit, and delete all projects
- Create, edit, and delete all tasks

### Manager Capabilities

- Create, edit, and delete tasks within their projects
- Monitor task completion rates

### Member Capabilities

- View all tasks assigned to them

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) - React framework for production
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Re-usable component library
- **Language**: JavaScript
- **State Management**: React Context API (AuthContext & CrudContext)
- **Notifications**: Sonner - Toast notifications library

## 📁 Project Structure

```
taskm/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.jsx          # Role-based dashboard
│   │   ├── login/
│   │   │   └── page.jsx          # Authentication page
│   │   ├── projects/
│   │   │   └── [id]/
│   │   │       └── page.jsx      # Project management (protected)
│   │   ├── tasks/
│   │   │   └── page.jsx          # Task management (protected)
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── app-sidebar.jsx       # Navigation sidebar
│   │   └── ProtectedRoute.jsx    # Route protection
│   ├── context/
│   │   ├── AuthContext.jsx       # Authentication logic
│   │   └── CrudContext.jsx       # CRUD and state logic
│   └── data/
│       ├── projects.jsx          # Seed project data
│       ├── tasks.jsx             # Seed task data
│       └── users.jsx             # Seed user data
├── public/
├── package.json
└── README.md
```
## 🔐 Authentication

The application uses seed data for login operations. Users must authenticate with valid credentials from the seed data to access protected routes.

### Seed Data Users

The system includes pre-configured users with different roles:

- **Admin users**: Full system access
- **Manager users**: Project management access
- **Member users**: Task viewing and update access

> **Note**: Invalid login attempts will prompt users to use the correct credentials.

## 🎨 Context Architecture

### AuthContext

Manages global authentication state:

- User login/logout functionality
- Current user information
- Role-based permissions
- Session management

### CrudContext

Handles all CRUD operations:

- User management (admin only)
- Project CRUD operations
- Task CRUD operations
- Real-time data synchronization across components

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd taskm
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 User Roles & Permissions

| Feature             | Admin | Manager              | Member              |
| ------------------- | ----- | -------------------- | ------------------- |
| View Dashboard      | ✅    | ✅                   | ✅                  |
| Manage Users        | ✅    | ❌                   | ❌                  |
| Create Projects     | ✅    | ✅                   | ❌                  |
| Edit Own Projects   | ✅    | ✅                   | ❌                  |
| Edit All Projects   | ✅    | ❌                   | ❌                  |
| Delete Projects     | ✅    | ✅ (own)             | ❌                  |
| Create Tasks        | ✅    | ✅ (in own projects) | ❌                  |
| Edit Tasks          | ✅    | ✅ (in own projects) | ❌                  |
| Delete Tasks        | ✅    | ✅ (in own projects) | ❌                  |
| Update Task Status  | ✅    | ✅                   | ✅ (assigned tasks) |
| View All Tasks      | ✅    | ✅ (project tasks)   | ❌                  |
| View Assigned Tasks | ✅    | ✅                   | ✅                  |

## 🎯 Key Features Breakdown

### Dashboard

- **Admin View**: System-wide statistics, user management, and all projects overview
- **Manager View**: Personal project statistics, project progress tracking, and team task overview
- **Member View**: Personal task list with completion tracking and status management

### Projects Page

- Project creation and management
- Project assignment to managers
- Progress tracking with visual indicators
- Filtering and search capabilities

### Tasks Page

- Task creation with project assignment
- User assignment functionality
- Status tracking (Pending/Completed)

## 🔔 Toast Notifications

The application provides user feedback through toast notifications for:

- ✅ Successful login
- ✅ Successful CRUD operations (Create, Update, Delete)
- ❌ Invalid login attempts
- ❌ Permission errors
- ⚠️ Validation warnings

## 🎨 UI/UX Features

- **Responsive Design**: Fully responsive across all device sizes
- **Dark Mode Support**: Built-in dark mode compatibility
- **Intuitive Navigation**: Role-based sidebar navigation
- **Loading States**: Visual feedback during async operations
- **Empty States**: Helpful messages when no data is available
- **Confirmation Dialogs**: Prevent accidental deletions

## 🔒 Security Features

- Protected routes with authentication checks
- Role-based access control (RBAC)
- Prevention of privilege escalation (users cannot modify their own roles)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, please open an issue in the repository or contact the development team.

---
