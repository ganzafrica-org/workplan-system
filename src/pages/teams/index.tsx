import { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    Users,
    X,
    Briefcase,
    UserPlus,
    Building,
} from 'lucide-react';
import { mockTeams, mockDepartments } from '@/lib/mockData';

const TeamsPage: NextPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);

    const filteredTeams = mockTeams.filter(team => {

        if (searchQuery && !team.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !team.description.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return !(departmentFilter && team.departmentId !== departmentFilter);


    });

    return (
        <AppLayout>
            <Head>
                <title>Teams | GanzAfrica Workplan System</title>
            </Head>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Team
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search teams..."
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
                                    Department
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setDepartmentFilter(null)}>
                                    All Departments
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {mockDepartments.map(dept => (
                                    <DropdownMenuItem
                                        key={dept.id}
                                        onClick={() => setDepartmentFilter(dept.id)}
                                    >
                                        {dept.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

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
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTeams.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                            <div className="rounded-full bg-muted p-3">
                                <Users className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">No teams found</h3>
                            <p className="mt-2 text-sm text-muted-foreground max-w-md">
                                No teams match your current filters. Try adjusting your search criteria.
                            </p>
                            <Button className="mt-4">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Team
                            </Button>
                        </div>
                    ) : (
                        filteredTeams.map(team => (
                            <Card key={team.id}>
                                <CardHeader>
                                    <CardTitle>
                                        <Link href={`/teams/${team.id}`} className="hover:underline">
                                            {team.name}
                                        </Link>
                                    </CardTitle>
                                    <CardDescription>
                                        <div className="flex items-center">
                                            <Building className="h-3 w-3 mr-1" />
                                            {team.departmentName}
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {team.description}
                                    </p>
                                    <div className="mt-4 flex flex-col gap-2">
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span className="text-sm">{team.membersCount} Members</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span className="text-sm">{team.projectsCount} Projects</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t pt-0 flex justify-between">
                                    <div className="flex w-full justify-between pt-4 items-center">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/teams/${team.id}`}>
                                            View Team
                                        </Link>
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Link href={`/teams/${team.id}`} className="flex w-full">
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link href={`/projects?teamId=${team.id}`} className="flex w-full">
                                                    View Projects
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Add Member
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Edit Team</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                Delete Team
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default TeamsPage;