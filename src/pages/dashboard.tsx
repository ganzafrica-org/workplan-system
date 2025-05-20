import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    BarChart2,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    FolderKanban,
    ListTodo,
    Plus,
    UserPlus
} from 'lucide-react';
import { mockProjects, mockTasks, mockWorkplans } from '@/lib/mockData';

type Activity = {
    id: string;
    type: 'task' | 'comment' | 'document' | 'workplan';
    title: string;
    projectTitle: string;
    user: string;
    time: string;
    status?: string;
};

const recentActivities: Activity[] = [
    {
        id: 'act1',
        type: 'task',
        title: 'Prepare training materials',
        projectTitle: 'Agricultural Training Program',
        user: 'Jane Smith',
        time: '2 hours ago',
        status: 'COMPLETED'
    },
    {
        id: 'act2',
        type: 'workplan',
        title: 'Week 12 Workplan',
        projectTitle: 'Digital Marketing Strategy',
        user: 'Michael Brown',
        time: '4 hours ago',
        status: 'APPROVED'
    },
    {
        id: 'act3',
        type: 'document',
        title: 'Social Media Graphics',
        projectTitle: 'Digital Marketing Strategy',
        user: 'Linda Davis',
        time: '6 hours ago'
    },
    {
        id: 'act4',
        type: 'task',
        title: 'Contact local community leaders',
        projectTitle: 'Agricultural Training Program',
        user: 'Sarah Williams',
        time: '1 day ago',
        status: 'COMPLETED'
    },
    {
        id: 'act5',
        type: 'comment',
        title: 'Added comment to "Conduct training session"',
        projectTitle: 'Agricultural Training Program',
        user: 'Robert Johnson',
        time: '1 day ago'
    }
];

const Dashboard: NextPage = () => {
    const [activeProjects, setActiveProjects] = useState(0);
    const [pendingTasks, setPendingTasks] = useState(0);
    const [upcomingDeadlines, setUpcomingDeadlines] = useState(0);
    const [pendingWorkplans, setPendingWorkplans] = useState(0);

    useEffect(() => {
        const active = mockProjects.filter(p => p.status === 'ACTIVE').length;
        setActiveProjects(active);

        const pending = mockTasks.filter(t =>
            t.status === 'PENDING' || t.status === 'IN_PROGRESS'
        ).length;
        setPendingTasks(pending);

        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const upcoming = mockTasks.filter(t => {
            const endDate = new Date(t.endDate);
            return endDate >= now && endDate <= nextWeek && t.status !== 'COMPLETED';
        }).length;
        setUpcomingDeadlines(upcoming);

        const pendingWP = mockWorkplans.filter(wp => wp.status === 'PENDING').length;
        setPendingWorkplans(pendingWP);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
            case 'APPROVED':
                return 'text-green-600';
            case 'REJECTED':
                return 'text-red-600';
            case 'IN_PROGRESS':
                return 'text-blue-600';
            case 'PENDING':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'task':
                return <ListTodo className="h-4 w-4" />;
            case 'workplan':
                return <FileText className="h-4 w-4" />;
            case 'document':
                return <FileText className="h-4 w-4" />;
            case 'comment':
                return <MessageSquare className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <AppLayout>
            <Head>
                <title>Dashboard | GanzAfrica Workplan System</title>
            </Head>

            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <div className="flex items-center gap-2">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Project
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                            <BarChart2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeProjects}</div>
                            <p className="text-xs text-muted-foreground">
                                {Math.round((activeProjects / mockProjects.length) * 100)}% of total projects
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                            <ListTodo className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingTasks}</div>
                            <p className="text-xs text-muted-foreground">
                                {pendingTasks} tasks need attention
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{upcomingDeadlines}</div>
                            <p className="text-xs text-muted-foreground">
                                Due in the next 7 days
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Workplans</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingWorkplans}</div>
                            <p className="text-xs text-muted-foreground">
                                Waiting for approval
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Project Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockProjects.slice(0, 5).map((project) => (
                                    <div key={project.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                                                    {project.title}
                                                </Link>
                                                <span className="text-xs text-muted-foreground">
                          {project.departmentName} • {project.teamName} • {project.status}
                        </span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {project.completedTasks}/{project.totalTasks} tasks
                                            </div>
                                        </div>
                                        <Progress value={project.progress} />
                                    </div>
                                ))}
                                <div className="mt-6 text-center">
                                    <Button variant="outline" asChild>
                                        <Link href="/projects">View All Projects</Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest actions across your projects</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-3">
                                        <div className="bg-muted rounded-full p-1.5">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium">
                                                {activity.title}
                                                {activity.status && (
                                                    <span className={`ml-2 text-xs ${getStatusColor(activity.status)}`}>
                            ({activity.status})
                          </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {activity.projectTitle} • {activity.user}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{activity.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;

function MessageSquare(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    );
}