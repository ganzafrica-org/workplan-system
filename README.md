# GanzAfrica Workplan System

A comprehensive project management and workplan system designed for GanzAfrica, enabling efficient management of projects, teams, and tasks with role-based access control.

## Features

- **Role-Based Access Control**
   - Admin, Manager, Employee, and Fellow roles with appropriate permissions
   - Department-based organization and filtering

- **Project Management**
   - Create, assign, and track projects
   - Weekly workplan submissions and approvals
   - Task history and progress tracking

- **Team Collaboration**
   - Department and team assignments
   - Feedback and commenting system
   - Resource sharing

- **Document Management**
   - Upload project deliverables and resources
   - Finance-specific features for payslip management
   - Document categorization and filtering

- **Multiple Views**
   - List view for tasks and projects
   - Kanban boards for visual workflow management
   - Gantt charts for project timeline visualization
   - Calendar view for scheduling

- **Analytics and Reporting**
   - Submission rates and task completion tracking
   - Exportable reports (Excel/PDF)
   - Progress dashboards

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git
- PostgreSQL database (Neon DB)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ganzafrica-org/workplan-system.git
   cd workplan-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_neon_db_url_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_here
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Building for Production

```bash
npm run build
# or
yarn build
```

Then start the production server:

```bash
npm start
# or
yarn start
```

## Project Structure

- `/src/pages`: Next.js pages using the Pages Router
- `/src/components`: Reusable React components including:
   - `/ui`: ShadCN UI components
   - `/layout`: Layout components
   - `/features`: Feature-specific components
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions and configurations
- `/src/styles`: Global CSS and styling utilities
- `/prisma`: Prisma schema and migrations

## API Client Usage

The project uses a custom API client for handling data. Here are examples of how to use it:

### GET Request for Projects
```tsx
import { apiClient } from '@/lib/apiClient';

function ProjectList() {
  // Simple GET for projects
  const { data, isLoading, error } = apiClient.get('/projects', {
    params: { department: 'IT' }
  });

  // GET with pagination
  const { data: paginatedData, isLoading: loadingPaginated, error: paginationError } = 
    apiClient.get('/projects', {
      pagination: { page: 1, pageSize: 10 }
    });

  // Rest of your component...
}
```

### POST Request for Tasks
```tsx
import { apiClient } from '@/lib/apiClient';
import { useState } from 'react';

function CreateTask() {
  const [taskData, setTaskData] = useState(null);
  
  const handleSubmit = (formData) => {
    // Set state to trigger the POST request
    setTaskData(formData);
  };

  // POST request happens when taskData is set
  const { data, isLoading, error } = apiClient.post('/tasks', {
    data: taskData
  });

  // Rest of your component...
}
```

### PUT Request for Workplan
```tsx
import { apiClient } from '@/lib/apiClient';
import { useState } from 'react';

function UpdateWorkplan({ workplanId }) {
  const [updateData, setUpdateData] = useState(null);
  
  const handleUpdate = (formData) => {
    setUpdateData(formData);
  };

  // PUT request happens when updateData is set
  const { data, isLoading, error } = apiClient.put(`/workplans/${workplanId}`, {
    data: updateData
  });
}
```

### DELETE Request
```tsx
import { apiClient } from '@/lib/apiClient';
import { useState } from 'react';

function DeleteProject({ projectId }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setConfirmDelete(true);
    }
  };

  // DELETE request happens when confirmDelete is set to true
  const { data, isLoading, error } = apiClient.delete(`/projects/${projectId}`, {
    data: confirmDelete
  });

  // Rest of your component...
}
```

## User Roles and Permissions

The system has four main user roles, each with different permissions:

1. **Admin**: Full system access, can manage departments, teams, and all data.
2. **Manager**: Can manage teams and projects within their department, approve workplans, and monitor progress.
3. **Employee**: Can submit weekly workplans, upload project resources, and view their assigned projects.
4. **Fellow**: Can submit personal weekly plans and view their tasks and feedback.

Special functionality for Finance Department Employees includes the ability to upload payslips for all users.

## Database Schema

The project uses Prisma ORM with a PostgreSQL database. The main data models include:
- Users
- Departments
- Teams
- Projects
- Tasks/Workplans
- Documents/Resources
- Payslips

See the Prisma schema file for detailed definitions.