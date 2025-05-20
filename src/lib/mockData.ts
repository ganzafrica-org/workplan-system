export type Project = {
    id: string;
    title: string;
    description: string;
    status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
    startDate: string;
    endDate: string;
    departmentId: string;
    departmentName: string;
    teamId: string;
    teamName: string;
    progress: number;
    totalTasks: number;
    completedTasks: number;
};

export type WorkPlan = {
    id: string;
    projectId: string;
    projectTitle: string;
    weekNumber: number;
    year: number;
    startDate: string;
    endDate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    description: string;
    tasksCount: number;
};

export type Task = {
    id: string;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    startDate: string;
    endDate: string;
    projectId: string;
    projectTitle: string;
    weeklyWorkplanId?: string;
    assignees: { id: string; name: string }[];
};

export type Team = {
    id: string;
    name: string;
    description: string;
    departmentId: string;
    departmentName: string;
    membersCount: number;
    projectsCount: number;
};

export type Department = {
    id: string;
    name: string;
    description: string;
    usersCount: number;
    teamsCount: number;
};

export type User = {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'FELLOW';
    departmentId: string;
    departmentName: string;
    isFinanceDept: boolean;
};

export type Document = {
    id: string;
    name: string;
    url: string;
    fileType: string;
    size: number;
    description: string;
    uploaderId: string;
    uploaderName: string;
    projectId?: string;
    projectTitle?: string;
    taskId?: string;
    taskTitle?: string;
    uploadDate: string;
};

export const mockProjects: Project[] = [
    {
        id: 'proj_1',
        title: 'Agricultural Training Program',
        description: 'Training program for local farmers on sustainable practices',
        status: 'ACTIVE',
        startDate: '2025-02-01',
        endDate: '2025-07-30',
        departmentId: 'dept_1',
        departmentName: 'Programs',
        teamId: 'team_1',
        teamName: 'Agricultural Training Team',
        progress: 45,
        totalTasks: 24,
        completedTasks: 11
    },
    {
        id: 'proj_2',
        title: 'Youth Climate Leadership',
        description: 'Developing youth leaders in climate action and advocacy',
        status: 'PLANNING',
        startDate: '2025-06-15',
        endDate: '2025-12-15',
        departmentId: 'dept_1',
        departmentName: 'Programs',
        teamId: 'team_2',
        teamName: 'Youth Leadership Team',
        progress: 15,
        totalTasks: 18,
        completedTasks: 3
    },
    {
        id: 'proj_3',
        title: 'Digital Marketing Strategy',
        description: 'Developing and implementing a digital marketing strategy for GanzAfrica',
        status: 'ACTIVE',
        startDate: '2025-01-10',
        endDate: '2025-05-30',
        departmentId: 'dept_2',
        departmentName: 'Communications',
        teamId: 'team_3',
        teamName: 'Marketing Team',
        progress: 70,
        totalTasks: 15,
        completedTasks: 10
    },
    {
        id: 'proj_4',
        title: 'Community Reforestation',
        description: 'Community-based tree planting initiative in rural areas',
        status: 'ON_HOLD',
        startDate: '2025-03-01',
        endDate: '2025-08-30',
        departmentId: 'dept_1',
        departmentName: 'Programs',
        teamId: 'team_4',
        teamName: 'Environmental Team',
        progress: 30,
        totalTasks: 22,
        completedTasks: 7
    },
    {
        id: 'proj_5',
        title: 'Annual Financial Audit',
        description: 'Preparation and execution of annual financial audit',
        status: 'COMPLETED',
        startDate: '2025-01-05',
        endDate: '2025-02-28',
        departmentId: 'dept_3',
        departmentName: 'Finance',
        teamId: 'team_5',
        teamName: 'Finance Team',
        progress: 100,
        totalTasks: 12,
        completedTasks: 12
    }
];

export const mockWorkplans: WorkPlan[] = [
    {
        id: 'wp_1',
        projectId: 'proj_1',
        projectTitle: 'Agricultural Training Program',
        weekNumber: 12,
        year: 2025,
        startDate: '2025-03-18',
        endDate: '2025-03-24',
        status: 'APPROVED',
        description: 'Conducting training sessions in Musanze district',
        tasksCount: 5
    },
    {
        id: 'wp_2',
        projectId: 'proj_1',
        projectTitle: 'Agricultural Training Program',
        weekNumber: 13,
        year: 2025,
        startDate: '2025-03-25',
        endDate: '2025-03-31',
        status: 'PENDING',
        description: 'Follow-up activities and outcome measurement',
        tasksCount: 4
    },
    {
        id: 'wp_3',
        projectId: 'proj_2',
        projectTitle: 'Youth Climate Leadership',
        weekNumber: 12,
        year: 2025,
        startDate: '2025-03-18',
        endDate: '2025-03-24',
        status: 'APPROVED',
        description: 'Planning and curriculum development',
        tasksCount: 3
    },
    {
        id: 'wp_4',
        projectId: 'proj_3',
        projectTitle: 'Digital Marketing Strategy',
        weekNumber: 12,
        year: 2025,
        startDate: '2025-03-18',
        endDate: '2025-03-24',
        status: 'APPROVED',
        description: 'Content creation and social media scheduling',
        tasksCount: 6
    },
    {
        id: 'wp_5',
        projectId: 'proj_3',
        projectTitle: 'Digital Marketing Strategy',
        weekNumber: 13,
        year: 2025,
        startDate: '2025-03-25',
        endDate: '2025-03-31',
        status: 'REJECTED',
        description: 'Analytics review and campaign optimization',
        tasksCount: 4
    }
];

export const mockTasks: Task[] = [
    {
        id: 'task_1',
        title: 'Prepare training materials',
        description: 'Create handouts and presentation slides for the agricultural training',
        status: 'COMPLETED',
        startDate: '2025-03-18',
        endDate: '2025-03-20',
        projectId: 'proj_1',
        projectTitle: 'Agricultural Training Program',
        weeklyWorkplanId: 'wp_1',
        assignees: [
            { id: 'user_2', name: 'Jane Smith' },
            { id: 'user_3', name: 'Robert Johnson' }
        ]
    },
    {
        id: 'task_2',
        title: 'Contact local community leaders',
        description: 'Coordinate with local leaders to arrange training venue and logistics',
        status: 'COMPLETED',
        startDate: '2025-03-19',
        endDate: '2025-03-21',
        projectId: 'proj_1',
        projectTitle: 'Agricultural Training Program',
        weeklyWorkplanId: 'wp_1',
        assignees: [
            { id: 'user_4', name: 'Sarah Williams' }
        ]
    },
    {
        id: 'task_3',
        title: 'Conduct training session on soil management',
        description: 'Lead the session on sustainable soil management practices',
        status: 'IN_PROGRESS',
        startDate: '2025-03-22',
        endDate: '2025-03-22',
        projectId: 'proj_1',
        projectTitle: 'Agricultural Training Program',
        weeklyWorkplanId: 'wp_1',
        assignees: [
            { id: 'user_2', name: 'Jane Smith' }
        ]
    },
    {
        id: 'task_4',
        title: 'Research content for social media campaign',
        description: 'Identify key topics and create content calendar for upcoming social media campaign',
        status: 'COMPLETED',
        startDate: '2025-03-18',
        endDate: '2025-03-20',
        projectId: 'proj_3',
        projectTitle: 'Digital Marketing Strategy',
        weeklyWorkplanId: 'wp_4',
        assignees: [
            { id: 'user_5', name: 'Michael Brown' }
        ]
    },
    {
        id: 'task_5',
        title: 'Design social media graphics',
        description: 'Create visual assets for Facebook, Twitter, and Instagram posts',
        status: 'IN_PROGRESS',
        startDate: '2025-03-20',
        endDate: '2025-03-23',
        projectId: 'proj_3',
        projectTitle: 'Digital Marketing Strategy',
        weeklyWorkplanId: 'wp_4',
        assignees: [
            { id: 'user_6', name: 'Linda Davis' }
        ]
    }
];

export const mockTeams: Team[] = [
    {
        id: 'team_1',
        name: 'Agricultural Training Team',
        description: 'Team responsible for agricultural training programs',
        departmentId: 'dept_1',
        departmentName: 'Programs',
        membersCount: 6,
        projectsCount: 2
    },
    {
        id: 'team_2',
        name: 'Youth Leadership Team',
        description: 'Team focused on youth engagement and leadership development',
        departmentId: 'dept_1',
        departmentName: 'Programs',
        membersCount: 5,
        projectsCount: 1
    },
    {
        id: 'team_3',
        name: 'Marketing Team',
        description: 'Team managing digital and traditional marketing efforts',
        departmentId: 'dept_2',
        departmentName: 'Communications',
        membersCount: 4,
        projectsCount: 1
    },
    {
        id: 'team_4',
        name: 'Environmental Team',
        description: 'Team focused on environmental conservation projects',
        departmentId: 'dept_1',
        departmentName: 'Programs',
        membersCount: 7,
        projectsCount: 1
    },
    {
        id: 'team_5',
        name: 'Finance Team',
        description: 'Team managing financial operations and audits',
        departmentId: 'dept_3',
        departmentName: 'Finance',
        membersCount: 3,
        projectsCount: 1
    }
];

export const mockDepartments: Department[] = [
    {
        id: 'dept_1',
        name: 'Programs',
        description: 'Department managing all program activities',
        usersCount: 18,
        teamsCount: 3
    },
    {
        id: 'dept_2',
        name: 'Communications',
        description: 'Department managing communications and marketing',
        usersCount: 6,
        teamsCount: 1
    },
    {
        id: 'dept_3',
        name: 'Finance',
        description: 'Department managing financial operations',
        usersCount: 4,
        teamsCount: 1
    },
    {
        id: 'dept_4',
        name: 'IT',
        description: 'Department managing technical systems and support',
        usersCount: 3,
        teamsCount: 1
    }
];

export const mockUsers: User[] = [
    {
        id: 'user_1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'ADMIN',
        departmentId: 'dept_1',
        departmentName: 'Programs',
        isFinanceDept: false
    },
    {
        id: 'user_2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'MANAGER',
        departmentId: 'dept_1',
        departmentName: 'Programs',
        isFinanceDept: false
    },
    {
        id: 'user_3',
        name: 'Robert Johnson',
        email: 'robert@example.com',
        role: 'EMPLOYEE',
        departmentId: 'dept_1',
        departmentName: 'Programs',
        isFinanceDept: false
    },
    {
        id: 'user_4',
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        role: 'EMPLOYEE',
        departmentId: 'dept_1',
        departmentName: 'Programs',
        isFinanceDept: false
    },
    {
        id: 'user_5',
        name: 'Michael Brown',
        email: 'michael@example.com',
        role: 'EMPLOYEE',
        departmentId: 'dept_2',
        departmentName: 'Communications',
        isFinanceDept: false
    },
    {
        id: 'user_6',
        name: 'Linda Davis',
        email: 'linda@example.com',
        role: 'EMPLOYEE',
        departmentId: 'dept_2',
        departmentName: 'Communications',
        isFinanceDept: false
    },
    {
        id: 'user_7',
        name: 'James Wilson',
        email: 'james@example.com',
        role: 'EMPLOYEE',
        departmentId: 'dept_3',
        departmentName: 'Finance',
        isFinanceDept: true
    },
    {
        id: 'user_8',
        name: 'Emily Taylor',
        email: 'emily@example.com',
        role: 'FELLOW',
        departmentId: 'dept_1',
        departmentName: 'Programs',
        isFinanceDept: false
    }
];

export const mockDocuments: Document[] = [
    {
        id: 'doc_1',
        name: 'Agricultural Training Manual',
        url: '/documents/ag_training_manual.pdf',
        fileType: 'pdf',
        size: 4500000,
        description: 'Comprehensive training manual for agricultural practices',
        uploaderId: 'user_2',
        uploaderName: 'Jane Smith',
        projectId: 'proj_1',
        projectTitle: 'Agricultural Training Program',
        uploadDate: '2025-03-10'
    },
    {
        id: 'doc_2',
        name: 'Training Schedule',
        url: '/documents/training_schedule.xlsx',
        fileType: 'xlsx',
        size: 250000,
        description: 'Schedule for upcoming training sessions',
        uploaderId: 'user_2',
        uploaderName: 'Jane Smith',
        projectId: 'proj_1',
        projectTitle: 'Agricultural Training Program',
        taskId: 'task_1',
        taskTitle: 'Prepare training materials',
        uploadDate: '2025-03-19'
    },
    {
        id: 'doc_3',
        name: 'Marketing Strategy Presentation',
        url: '/documents/marketing_strategy.pptx',
        fileType: 'pptx',
        size: 3200000,
        description: 'Presentation outlining digital marketing strategy',
        uploaderId: 'user_5',
        uploaderName: 'Michael Brown',
        projectId: 'proj_3',
        projectTitle: 'Digital Marketing Strategy',
        uploadDate: '2025-02-25'
    },
    {
        id: 'doc_4',
        name: 'Social Media Graphics',
        url: '/documents/social_media_assets.zip',
        fileType: 'zip',
        size: 15000000,
        description: 'Collection of graphic assets for social media campaign',
        uploaderId: 'user_6',
        uploaderName: 'Linda Davis',
        projectId: 'proj_3',
        projectTitle: 'Digital Marketing Strategy',
        taskId: 'task_5',
        taskTitle: 'Design social media graphics',
        uploadDate: '2025-03-21'
    },
    {
        id: 'doc_5',
        name: 'Financial Audit Report',
        url: '/documents/financial_audit_2025.pdf',
        fileType: 'pdf',
        size: 2800000,
        description: 'Final report from the annual financial audit',
        uploaderId: 'user_7',
        uploaderName: 'James Wilson',
        projectId: 'proj_5',
        projectTitle: 'Annual Financial Audit',
        uploadDate: '2025-02-27'
    }
];

export const mockData = {
    projects: mockProjects,
    workplans: mockWorkplans,
    tasks: mockTasks,
    teams: mockTeams,
    departments: mockDepartments,
    users: mockUsers,
    documents: mockDocuments
};