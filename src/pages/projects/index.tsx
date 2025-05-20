import { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, MoreHorizontal, Plus, Search, X} from 'lucide-react';
import { mockProjects, mockDepartments, mockTeams } from '@/lib/mockData';
import {KanbanBoardView} from "@/components/kanban-board";
import {CalendarView} from "@/components/calendar-view";
import {GanttChartView} from "@/components/gantt-chart";

const ProjectsPage: NextPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
    const [teamFilter, setTeamFilter] = useState<string | null>(null);

    const filteredProjects = mockProjects.filter(project => {

        if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        if (statusFilter && project.status !== statusFilter) {
            return false;
        }

        if (departmentFilter && project.departmentId !== departmentFilter) {
            return false;
        }

        return !(teamFilter && project.teamId !== teamFilter);


    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'PLANNING':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'ON_HOLD':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'COMPLETED':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
            case 'ARCHIVED':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    return (
        <AppLayout>
            <Head>
                <title>Projects | GanzAfrica Workplan System</title>
            </Head>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Project
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
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
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                                    All Statuses
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('ACTIVE')}>
                                    Active
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('PLANNING')}>
                                    Planning
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('ON_HOLD')}>
                                    On Hold
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('COMPLETED')}>
                                    Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('ARCHIVED')}>
                                    Archived
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setDepartmentFilter(null)}>
                                    All Departments
                                </DropdownMenuItem>
                                {mockDepartments.map((dept) => (
                                    <DropdownMenuItem
                                        key={dept.id}
                                        onClick={() => setDepartmentFilter(dept.id)}
                                    >
                                        {dept.name}
                                    </DropdownMenuItem>
                                ))}

                                <DropdownMenuSeparator />

                                <DropdownMenuLabel>Filter by Team</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setTeamFilter(null)}>
                                    All Teams
                                </DropdownMenuItem>
                                {mockTeams.map((team) => (
                                    <DropdownMenuItem
                                        key={team.id}
                                        onClick={() => setTeamFilter(team.id)}
                                    >
                                        {team.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

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

                        {departmentFilter && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDepartmentFilter(null)}
                            >
                                Department: {mockDepartments.find(d => d.id === departmentFilter)?.name}
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        )}

                        {teamFilter && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setTeamFilter(null)}
                            >
                                Team: {mockTeams.find(t => t.id === teamFilter)?.name}
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="list">List View</TabsTrigger>
                        <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
                        <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
                        <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        {filteredProjects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <div className="rounded-full bg-muted p-3">
                                    <Search className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
                                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                                    We couldn&#39;t find any projects matching your filters. Try adjusting your search or filters.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredProjects.map((project) => (
                                    <Card key={project.id} className="flex flex-col">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        <Link href={`/projects/${project.id}`} className="hover:underline">
                                                            {project.title}
                                                        </Link>
                                                    </CardTitle>
                                                    <CardDescription className="mt-1">
                                                        {project.teamName} • {project.departmentName}
                                                    </CardDescription>
                                                </div>
                                                <Badge className={getStatusColor(project.status)}>
                                                    {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {project.description}
                                            </p>
                                            <div className="mt-4 space-y-3">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Progress</span>
                                                    <span>{project.progress}%</span>
                                                </div>
                                                <Progress value={project.progress} />
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    {project.completedTasks} of {project.totalTasks} tasks completed
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-0 border-t">
                                            <div className="flex w-full justify-between pt-4 items-center">
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Link href={`/projects/${project.id}`} className="flex w-full">
                                                                View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Link href={`/workplans?projectId=${project.id}`} className="flex w-full">
                                                                View Workplans
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Link href={`/tasks?projectId=${project.id}`} className="flex w-full">
                                                                View Tasks
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>Edit Project</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            Delete Project
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>

                        )}
                    </TabsContent>

                    <TabsContent value="list">
                        <div className="rounded-md border">
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium">Project</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">Department</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">Team</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">Progress</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">Tasks</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">Dates</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredProjects.map((project) => (
                                        <tr key={project.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">
                                                <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                                                    {project.title}
                                                </Link>
                                            </td>
                                            <td className="p-4 align-middle">{project.departmentName}</td>
                                            <td className="p-4 align-middle">{project.teamName}</td>
                                            <td className="p-4 align-middle">
                                                <Badge className={getStatusColor(project.status)}>
                                                    {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <Progress value={project.progress} className="w-24" />
                                                    <span className="text-xs">{project.progress}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {project.completedTasks}/{project.totalTasks}
                                            </td>
                                            <td className="p-4 align-middle">
                <span className="text-xs text-muted-foreground">
                  {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                </span>
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
                                                            <Link href={`/projects/${project.id}`} className="flex w-full">
                                                                View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Link href={`/workplans?projectId=${project.id}`} className="flex w-full">
                                                                View Workplans
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Link href={`/tasks?projectId=${project.id}`} className="flex w-full">
                                                                View Tasks
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>Edit Project</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            Delete Project
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
                    </TabsContent>

                    <TabsContent value="gantt">
                        <GanttChartView items={filteredProjects} itemType="project" />
                    </TabsContent>

                    <TabsContent value="kanban">
                        <KanbanBoardView items={filteredProjects} itemType="project" />
                    </TabsContent>

                    <TabsContent value="calendar">
                        <CalendarView items={filteredProjects} itemType="project" />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
};

export default ProjectsPage;