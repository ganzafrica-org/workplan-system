import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    ClipboardCheck,
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    X,
    Calendar,
    FileText
} from 'lucide-react';
import { mockWorkplans, mockProjects, WorkPlan } from '@/lib/mockData';
import {CalendarView} from "@/components/calendar-view";

const WorkplansPage: NextPage = () => {
    const router = useRouter();
    const { projectId } = router.query;

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [filteredWorkplans, setFilteredWorkplans] = useState<WorkPlan[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(
        typeof projectId === 'string' ? projectId : null
    );

    useEffect(() => {
        let result = [...mockWorkplans];

        if (selectedProject) {
            result = result.filter(wp => wp.projectId === selectedProject);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(wp =>
                wp.description.toLowerCase().includes(query) ||
                wp.projectTitle.toLowerCase().includes(query)
            );
        }

        if (statusFilter) {
            result = result.filter(wp => wp.status === statusFilter);
        }

        setFilteredWorkplans(result);
    }, [searchQuery, statusFilter, selectedProject, projectId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'REJECTED':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    // Helper function to format date range
    const formatDateRange = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    };

    return (
        <AppLayout>
            <Head>
                <title>Workplans | GanzAfrica Workplan System</title>
            </Head>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {selectedProject
                            ? `Workplans: ${mockProjects.find(p => p.id === selectedProject)?.title}`
                            : 'All Workplans'}
                    </h1>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Workplan
                    </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search workplans..."
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
                                <div className="p-2">
                                    <div className="font-medium mb-1">Project</div>
                                    <div className="grid gap-2">
                                        <Button
                                            variant={selectedProject === null ? "default" : "outline"}
                                            size="sm"
                                            className="justify-start"
                                            onClick={() => setSelectedProject(null)}
                                        >
                                            All Projects
                                        </Button>
                                        {mockProjects.map(project => (
                                            <Button
                                                key={project.id}
                                                variant={selectedProject === project.id ? "default" : "outline"}
                                                size="sm"
                                                className="justify-start"
                                                onClick={() => setSelectedProject(project.id)}
                                            >
                                                {project.title}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-2 border-t">
                                    <div className="font-medium mb-1">Status</div>
                                    <div className="grid gap-2">
                                        <Button
                                            variant={statusFilter === null ? "default" : "outline"}
                                            size="sm"
                                            className="justify-start"
                                            onClick={() => setStatusFilter(null)}
                                        >
                                            All Statuses
                                        </Button>
                                        <Button
                                            variant={statusFilter === 'PENDING' ? "default" : "outline"}
                                            size="sm"
                                            className="justify-start"
                                            onClick={() => setStatusFilter('PENDING')}
                                        >
                                            Pending
                                        </Button>
                                        <Button
                                            variant={statusFilter === 'APPROVED' ? "default" : "outline"}
                                            size="sm"
                                            className="justify-start"
                                            onClick={() => setStatusFilter('APPROVED')}
                                        >
                                            Approved
                                        </Button>
                                        <Button
                                            variant={statusFilter === 'REJECTED' ? "default" : "outline"}
                                            size="sm"
                                            className="justify-start"
                                            onClick={() => setStatusFilter('REJECTED')}
                                        >
                                            Rejected
                                        </Button>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Active filters */}
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

                <Tabs defaultValue="grid" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="grid">Grid View</TabsTrigger>
                        <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                        <TabsTrigger value="list">List View</TabsTrigger>
                    </TabsList>

                    <TabsContent value="grid">
                        {filteredWorkplans.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <div className="rounded-full bg-muted p-3">
                                    <ClipboardCheck className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold">No workplans found</h3>
                                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                                    {selectedProject
                                        ? "There are no workplans for this project yet. Try creating one."
                                        : "No workplans match your current filters. Try adjusting your search criteria."}
                                </p>
                                <Button className="mt-4">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Workplan
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredWorkplans.map((workplan) => (
                                    <Card key={workplan.id}>
                                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                            <div>
                                                <CardTitle className="text-base font-medium">
                                                    Week {workplan.weekNumber}, {workplan.year}
                                                </CardTitle>
                                                <Link
                                                    href={`/projects/${workplan.projectId}`}
                                                    className="text-sm text-muted-foreground hover:underline"
                                                >
                                                    {workplan.projectTitle}
                                                </Link>
                                            </div>
                                            <Badge className={getStatusColor(workplan.status)}>
                                                {workplan.status.charAt(0) + workplan.status.slice(1).toLowerCase()}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="text-sm">
                                                    {workplan.description}
                                                </div>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {formatDateRange(workplan.startDate, workplan.endDate)}
                                                </div>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <FileText className="h-4 w-4 mr-1" />
                                                    {workplan.tasksCount} Tasks
                                                </div>
                                                <div className="flex justify-between items-center pt-2">
                                                    <Link href={`/workplans/${workplan.id}`}>
                                                        <Button variant="outline" size="sm">View Details</Button>
                                                    </Link>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Link href={`/workplans/${workplan.id}`} className="flex w-full">
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Link href={`/tasks?workplanId=${workplan.id}`} className="flex w-full">
                                                                    View Tasks
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {workplan.status === 'PENDING' && (
                                                                <>
                                                                    <DropdownMenuItem>Edit Workplan</DropdownMenuItem>
                                                                    <DropdownMenuItem className="text-green-600">
                                                                        Approve Workplan
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="text-red-600">
                                                                        Reject Workplan
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="calendar">
                        <CalendarView items={filteredWorkplans} itemType="workplan" />
                    </TabsContent>

                    <TabsContent value="list">
                        <div className="rounded-md border">
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium">Week/Year</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">Project</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">Date Range</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium">Tasks</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredWorkplans.map((workplan) => (
                                        <tr key={workplan.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">
                                                <Link href={`/workplans/${workplan.id}`} className="hover:underline">
                                                    Week {workplan.weekNumber}, {workplan.year}
                                                </Link>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Link href={`/projects/${workplan.projectId}`} className="hover:underline text-muted-foreground">
                                                    {workplan.projectTitle}
                                                </Link>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className="line-clamp-1">{workplan.description}</span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge className={getStatusColor(workplan.status)}>
                                                    {workplan.status.charAt(0) + workplan.status.slice(1).toLowerCase()}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-sm text-muted-foreground">
                                                {formatDateRange(workplan.startDate, workplan.endDate)}
                                            </td>
                                            <td className="p-4 align-middle">{workplan.tasksCount}</td>
                                            <td className="p-4 align-middle">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Link href={`/workplans/${workplan.id}`} className="flex w-full">
                                                                View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Link href={`/tasks?workplanId=${workplan.id}`} className="flex w-full">
                                                                View Tasks
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {workplan.status === 'PENDING' && (
                                                            <>
                                                                <DropdownMenuItem>Edit Workplan</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-green-600">
                                                                    Approve Workplan
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-red-600">
                                                                    Reject Workplan
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
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
                </Tabs>
            </div>
        </AppLayout>
    );
};

export default WorkplansPage;