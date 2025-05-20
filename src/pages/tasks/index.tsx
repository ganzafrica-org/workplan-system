import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    Filter,
    FolderKanban,
    MoreHorizontal,
    Plus,
    Search,
    X,
    Calendar,
    ListTodo,
} from 'lucide-react';
import { mockProjects, mockWorkplans, mockTasks, Task } from '@/lib/mockData';
import {KanbanBoardView} from "@/components/kanban-board";
import {CalendarView} from "@/components/calendar-view";

const TasksPage: NextPage = () => {
    const router = useRouter();
    const { projectId, workplanId } = router.query;

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(
        typeof projectId === 'string' ? projectId : null
    );
    const [selectedWorkplan, setSelectedWorkplan] = useState<string | null>(
        typeof workplanId === 'string' ? workplanId : null
    );
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

    useEffect(() => {
        let result = [...mockTasks];

        // Project filter (from query params or filter selection)
        if (selectedProject) {
            result = result.filter(task => task.projectId === selectedProject);
        }

        if (selectedWorkplan) {
            result = result.filter(task => task.weeklyWorkplanId === selectedWorkplan);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(task =>
                task.title.toLowerCase().includes(query) ||
                task.description.toLowerCase().includes(query)
            );
        }

        if (statusFilter) {
            result = result.filter(task => task.status === statusFilter);
        }

        setFilteredTasks(result);
    }, [searchQuery, statusFilter, selectedProject, selectedWorkplan, projectId, workplanId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'APPROVED':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'REJECTED':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'SUBMITTED':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };
    const formatDateRange = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    };

    return (
        <AppLayout>
            <Head>
                <title>Tasks | GanzAfrica Workplan System</title>
            </Head>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {selectedProject
                            ? `Tasks: ${mockProjects.find(p => p.id === selectedProject)?.title}`
                            : selectedWorkplan
                                ? `Tasks: Week ${mockWorkplans.find(w => w.id === selectedWorkplan)?.weekNumber} Workplan`
                                : 'All Tasks'
                        }
                    </h1>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filters
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-60">
                                <DropdownMenuLabel>Project</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setSelectedProject(null)}>
                                    All Projects
                                </DropdownMenuItem>
                                {mockProjects.map(project => (
                                    <DropdownMenuItem
                                        key={project.id}
                                        onClick={() => {
                                            setSelectedProject(project.id);
                                            setSelectedWorkplan(null);
                                        }}
                                    >
                                        {project.title}
                                    </DropdownMenuItem>
                                ))}

                                <DropdownMenuSeparator />

                                <DropdownMenuLabel>Workplan</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setSelectedWorkplan(null)}>
                                    All Workplans
                                </DropdownMenuItem>
                                {mockWorkplans
                                    .filter(wp => !selectedProject || wp.projectId === selectedProject)
                                    .map(workplan => (
                                        <DropdownMenuItem
                                            key={workplan.id}
                                            onClick={() => setSelectedWorkplan(workplan.id)}
                                        >
                                            Week {workplan.weekNumber}, {workplan.year}
                                        </DropdownMenuItem>
                                    ))
                                }

                                <DropdownMenuSeparator />

                                <DropdownMenuLabel>Status</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                                    All Statuses
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('PENDING')}>
                                    Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('IN_PROGRESS')}>
                                    In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('SUBMITTED')}>
                                    Submitted
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('APPROVED')}>
                                    Approved
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('REJECTED')}>
                                    Rejected
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('COMPLETED')}>
                                    Completed
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {selectedProject && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedProject(null)}
                            >
                                Project: {mockProjects.find(p => p.id === selectedProject)?.title}
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        )}

                        {selectedWorkplan && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedWorkplan(null)}
                            >
                                Workplan: Week {mockWorkplans.find(w => w.id === selectedWorkplan)?.weekNumber}
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        )}

                        {statusFilter && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setStatusFilter(null)}
                            >
                                Status: {statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <Tabs defaultValue="list" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="list">List View</TabsTrigger>
                        <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
                        <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                    </TabsList>

                    <TabsContent value="list">
                        {filteredTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <div className="rounded-full bg-muted p-3">
                                    <ListTodo className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
                                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                                    {selectedProject || selectedWorkplan
                                        ? "There are no tasks matching your current filters."
                                        : "No tasks match your current filters. Try adjusting your search criteria."}
                                </p>
                                <Button className="mt-4">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Task
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <div className="relative w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium">Task</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Project</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Assignees</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Dates</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium"></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredTasks.map((task) => (
                                            <tr key={task.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle">
                                                    <div>
                                                        <Link href={`/tasks/${task.id}`} className="font-medium hover:underline">
                                                            {task.title}
                                                        </Link>
                                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                                            {task.description}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Link href={`/projects/${task.projectId}`} className="text-sm hover:underline">
                                                        {task.projectTitle}
                                                    </Link>
                                                    {task.weeklyWorkplanId && (
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            Week {mockWorkplans.find(w => w.id === task.weeklyWorkplanId)?.weekNumber}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge className={getStatusColor(task.status)}>
                                                        {task.status.charAt(0) + task.status.slice(1).toLowerCase().replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex -space-x-2">
                                                        {task.assignees.slice(0, 3).map((assignee, index) => (
                                                            <div
                                                                key={assignee.id}
                                                                className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs"
                                                                title={assignee.name}
                                                            >
                                                                {assignee.name.charAt(0)}
                                                            </div>
                                                        ))}
                                                        {task.assignees.length > 3 && (
                                                            <div className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">
                                                                +{task.assignees.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle text-sm text-muted-foreground">
                                                    {formatDateRange(task.startDate, task.endDate)}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Link href={`/tasks/${task.id}`} className="flex w-full">
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {task.status !== 'COMPLETED' && (
                                                                <DropdownMenuItem className="text-green-600">
                                                                    Mark as Completed
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600">
                                                                Delete Task
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="kanban">
                        <KanbanBoardView items={filteredTasks} itemType="task" />
                    </TabsContent>

                    <TabsContent value="calendar">
                        <CalendarView items={filteredTasks} itemType="task" />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
};

export default TasksPage;