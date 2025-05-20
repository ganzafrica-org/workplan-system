import { pgTable, text, timestamp, boolean, integer, pgEnum, uuid, uniqueIndex, index, doublePrecision } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'MANAGER', 'EMPLOYEE', 'FELLOW']);
export const taskStatusEnum = pgEnum('task_status', ['PENDING', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'REJECTED', 'COMPLETED']);
export const projectStatusEnum = pgEnum('project_status', ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']);

export const departments = pgTable('departments', {
    id: uuid('id').primaryKey().$defaultFn(() => createId()),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const departmentsRelations = relations(departments, ({ many }) => ({
    users: many(users),
    teams: many(teams),
    projects: many(projects),
}));

export const users = pgTable('users', {
    id: uuid('id').primaryKey().$defaultFn(() => createId()),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    password: text('password').notNull(),
    role: userRoleEnum('role').default('EMPLOYEE').notNull(),
    isFinanceDept: boolean('is_finance_dept').default(false).notNull(),
    departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        emailIdx: uniqueIndex('users_email_idx').on(table.email),
        departmentIdIdx: index('users_department_id_idx').on(table.departmentId),
    };
});

export const usersRelations = relations(users, ({ one, many }) => ({
    department: one(departments, {
        fields: [users.departmentId],
        references: [departments.id],
    }),
    teamMemberships: many(teamMembers),
    projectsCreated: many(projects, { relationName: 'creator' }),
    projectsAssigned: many(projectAssignments),
    tasksCreated: many(tasks, { relationName: 'creator' }),
    tasksAssigned: many(taskAssignments),
    comments: many(comments),
    uploadedDocuments: many(documents),
    receivedPayslips: many(payslips, { relationName: 'receiver' }),
    uploadedPayslips: many(payslips, { relationName: 'uploader' }),
}));

export const teams = pgTable('teams', {
    id: uuid('id').primaryKey().$defaultFn(() => createId()),
    name: text('name').notNull(),
    description: text('description'),
    departmentId: uuid('department_id').notNull().references(() => departments.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        uniqueNameDeptIdx: uniqueIndex('teams_name_department_id_idx').on(table.name, table.departmentId),
        departmentIdIdx: index('teams_department_id_idx').on(table.departmentId),
    };
});

export const teamsRelations = relations(teams, ({ one, many }) => ({
    department: one(departments, {
        fields: [teams.departmentId],
        references: [departments.id],
    }),
    members: many(teamMembers),
    projects: many(projects),
}));

export const teamMembers = pgTable('team_members', {
    id: uuid('id').primaryKey().$defaultFn(() => createId()),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
    isLeader: boolean('is_leader').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        uniqueUserTeamIdx: uniqueIndex('team_members_user_id_team_id_idx').on(table.userId, table.teamId),
        teamIdIdx: index('team_members_team_id_idx').on(table.teamId),
        userIdIdx: index('team_members_user_id_idx').on(table.userId),
    };
});

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
    user: one(users, {
        fields: [teamMembers.userId],
        references: [users.id],
    }),
    team: one(teams, {
        fields: [teamMembers.teamId],
        references: [teams.id],
    }),
}));

export const projects = pgTable('projects', {
    id: uuid('id').primaryKey().$defaultFn(() => createId()),
    title: text('title').notNull(),
    description: text('description'),
    status: projectStatusEnum('status').default('PLANNING').notNull(),
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    creatorId: uuid('creator_id').notNull().references(() => users.id),
    departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        creatorIdIdx: index('projects_creator_id_idx').on(table.creatorId),
        departmentIdIdx: index('projects_department_id_idx').on(table.departmentId),
        teamIdIdx: index('projects_team_id_idx').on(table.teamId),
    };
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
    creator: one(users, {
        fields: [projects.creatorId],
        references: [users.id],
        relationName: 'creator',
    }),
    department: one(departments, {
        fields: [projects.departmentId],
        references: [departments.id],
    }),
    team: one(teams, {
        fields: [projects.teamId],
        references: [teams.id],
    }),
    assignments: many(projectAssignments),
    tasks: many(tasks),
    documents: many(documents),
    weeklyWorkplans: many(weeklyWorkplans),
}));

export const projectAssignments = pgTable('project_assignments', {
    id: uuid('id').primaryKey().$defaultFn(() => createId()),
    projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    role: text('role'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        uniqueProjectUserIdx: uniqueIndex('project_assignments_project_id_user_id_idx').on(table.projectId, table.userId),
        projectIdIdx: index('project_assignments_project_id_idx').on(table.projectId),
        userIdIdx: index('project_assignments_user_id_idx').on(table.userId),
    };
});

export const projectAssignmentsRelations = relations(projectAssignments, ({ one }) => ({
    project: one(projects, {
        fields: [projectAssignments.projectId],
        references: [projects.id],
    }),
    user: one(users, {
        fields: [projectAssignments.userId],
        references: [users.id],
    }),
}));

export const weeklyWorkplans = pgTable('weekly_workplans', {
    id: uuid('id').primaryKey().$defaultFn(() => createId()),
    projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    weekNumber: integer('week_number').notNull(),
    year: integer('year').notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        uniqueProjectWeekYearIdx: uniqueIndex('weekly_workplans_project_id_week_number_year_idx').on(
            table.projectId, table.weekNumber, table.year
        ),
        projectIdIdx: index('weekly_workplans_project_id_idx').on(table.projectId),
        weekYearIdx: index('weekly_workplans_week_number_year_idx').on(table.weekNumber, table.year),
    };
});

export const weeklyWorkplansRelations = relations(weeklyWorkplans, ({ one, many }) => ({
    project: one(projects, {
        fields: [weeklyWorkplans.projectId],
        references: [projects.id],
    }),
    tasks: many(tasks),
}));

export const tasks = pgTable('tasks', {
    id: uuid('id').primaryKey().$defaultFn(() => createId()),
    title: text('title').notNull(),
    description: text('description'),
    status: taskStatusEnum('status').default('PENDING').notNull(),
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    weeklyWorkplanId: uuid('weekly_workplan_id').references(() => weeklyWorkplans.id, { onDelete: 'set null' }),
    projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    creatorId: uuid('creator_id').notNull().references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        weeklyWorkplanIdIdx: index('tasks_weekly_workplan_id_idx').on(table.weeklyWorkplanId),
        projectIdIdx: index('tasks_project_id_idx').on(table.projectId),
        creatorIdIdx: index('tasks_creator_id_idx').on(table.creatorId),
    };
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
    weeklyWorkplan: one(weeklyWorkplans, {
        fields: [tasks.weeklyWorkplanId],
        references: [weeklyWorkplans.id],
    }),
    project: one(projects, {
        fields: [tasks.projectId],
        references: [projects.id],
    }),
    creator: one(users, {
        fields: [tasks.creatorId],
        references: [users.id],
        relationName: 'creator',
    }),
    assignments: many(taskAssignments),
    comments: many(comments),
    documents: many(documents),
}));

export const taskAssignments = pgTable('task_assignments', {
    id: uuid('id').primaryKey().$defaultFn(() => createId()),
    taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        uniqueTaskUserIdx: uniqueIndex('task_assignments_task_id_user_id_idx').on(table.taskId, table.userId),
        taskIdIdx: index('task_assignments_task_id_idx').on(table.taskId),
        userIdIdx: index('task_assignments_user_id_idx').on(table.userId),
    };
});

export const taskAssignmentsRelations = relations(taskAssignments, ({ one }) => ({
    task: one(tasks, {
        fields: [taskAssignments.taskId],
        references: [tasks.id],
    }),
    user: one(users, {
        fields: [taskAssignments.userId],
        references: [users.id],
    }),
}));

export const comments = pgTable('comments', {
    id: uuid('id').primaryKey().$defaultFn(() => createId()),
    content: text('content').notNull(),
    taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        taskIdIdx: index('comments_task_id_idx').on(table.taskId),
        userIdIdx: index('comments_user_id_idx').on(table.userId),
    };
});

export const commentsRelations = relations(comments, ({ one }) => ({
    task: one(tasks, {
        fields: [comments.taskId],
        references: [tasks.id],
    }),
    user: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
}));

export const documents = pgTable('documents', {
    id: uuid('id').primaryKey().$defaultFn(() => createId()),
    name: text('name').notNull(),
    url: text('url').notNull(),
    fileType: text('file_type').notNull(),
    size: integer('size').notNull(),
    description: text('description'),
    uploaderId: uuid('uploader_id').notNull().references(() => users.id),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
    taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        uploaderIdIdx: index('documents_uploader_id_idx').on(table.uploaderId),
        projectIdIdx: index('documents_project_id_idx').on(table.projectId),
        taskIdIdx: index('documents_task_id_idx').on(table.taskId),
    };
});

export const documentsRelations = relations(documents, ({ one }) => ({
    uploader: one(users, {
        fields: [documents.uploaderId],
        references: [users.id],
    }),
    project: one(projects, {
        fields: [documents.projectId],
        references: [projects.id],
    }),
    task: one(tasks, {
        fields: [documents.taskId],
        references: [tasks.id],
    }),
}));

export const payslips = pgTable('payslips', {
    id: uuid('id').primaryKey().$defaultFn(() => createId()),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    uploaderId: uuid('uploader_id').notNull().references(() => users.id),
    month: integer('month').notNull(),
    year: integer('year').notNull(),
    amount: doublePrecision('amount').notNull(),
    currency: text('currency').default('RWF').notNull(),
    documentUrl: text('document_url').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        uniqueUserMonthYearIdx: uniqueIndex('payslips_user_id_month_year_idx').on(table.userId, table.month, table.year),
        userIdIdx: index('payslips_user_id_idx').on(table.userId),
        uploaderIdIdx: index('payslips_uploader_id_idx').on(table.uploaderId),
        monthYearIdx: index('payslips_month_year_idx').on(table.month, table.year),
    };
});

export const payslipsRelations = relations(payslips, ({ one }) => ({
    user: one(users, {
        fields: [payslips.userId],
        references: [users.id],
        relationName: 'receiver',
    }),
    uploader: one(users, {
        fields: [payslips.uploaderId],
        references: [users.id],
        relationName: 'uploader',
    }),
}));