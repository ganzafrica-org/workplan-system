import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    Download,
    EyeIcon,
    File,
    Filter,
    FolderOpen,
    Grid,
    List,
    MoreHorizontal,
    Plus,
    Search,
    X,
    ExternalLink,
    Briefcase,
    ListTodo,
} from 'lucide-react';
import { mockDocuments, mockProjects, Document } from '@/lib/mockData';

const FileIcon = ({ fileType }: { fileType: string }) => {
    switch (fileType.toLowerCase()) {
        case 'pdf':
            return <File className="h-10 w-10 text-red-500" />;
        case 'docx':
        case 'doc':
            return <File className="h-10 w-10 text-blue-500" />;
        case 'xlsx':
        case 'xls':
            return <File className="h-10 w-10 text-green-500" />;
        case 'pptx':
        case 'ppt':
            return <File className="h-10 w-10 text-orange-500" />;
        case 'zip':
        case 'rar':
            return <File className="h-10 w-10 text-purple-500" />;
        case 'jpg':
        case 'jpeg':
        case 'png':
            return <File className="h-10 w-10 text-sky-500" />;
        default:
            return <File className="h-10 w-10 text-gray-500" />;
    }
};

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    const kilobytes = bytes / 1024;
    if (kilobytes < 1024) return `${kilobytes.toFixed(1)} KB`;
    const megabytes = kilobytes / 1024;
    return `${megabytes.toFixed(1)} MB`;
};

const DocumentsPage: NextPage = () => {
    const router = useRouter();
    const { projectId, taskId } = router.query;

    const [searchQuery, setSearchQuery] = useState('');
    const [fileTypeFilter, setFileTypeFilter] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(
        typeof projectId === 'string' ? projectId : null
    );
    const [selectedTask, setSelectedTask] = useState<string | null>(
        typeof taskId === 'string' ? taskId : null
    );
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);

    const fileTypes = Array.from(new Set(mockDocuments.map(doc => doc.fileType)));

    useEffect(() => {
        let result = [...mockDocuments];

        if (selectedProject) {
            result = result.filter(doc => doc.projectId === selectedProject);
        }

        if (selectedTask) {
            result = result.filter(doc => doc.taskId === selectedTask);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(doc =>
                doc.name.toLowerCase().includes(query) ||
                (doc.description?.toLowerCase().includes(query) || false)
            );
        }

        if (fileTypeFilter) {
            result = result.filter(doc => doc.fileType === fileTypeFilter);
        }

        setFilteredDocuments(result);
    }, [searchQuery, fileTypeFilter, selectedProject, selectedTask, projectId, taskId]);

    return (
        <AppLayout>
            <Head>
                <title>Documents | GanzAfrica Workplan System</title>
            </Head>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {selectedProject
                            ? `Documents: ${mockProjects.find(p => p.id === selectedProject)?.title}`
                            : 'All Documents'
                        }
                    </h1>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Document
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search documents..."
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
                                <DropdownMenuItem onClick={() => {
                                    setSelectedProject(null);
                                    setSelectedTask(null);
                                }}>
                                    All Projects
                                </DropdownMenuItem>
                                {mockProjects.map(project => (
                                    <DropdownMenuItem
                                        key={project.id}
                                        onClick={() => {
                                            setSelectedProject(project.id);
                                            setSelectedTask(null);
                                        }}
                                    >
                                        {project.title}
                                    </DropdownMenuItem>
                                ))}

                                <DropdownMenuSeparator />

                                <DropdownMenuLabel>File Type</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setFileTypeFilter(null)}>
                                    All File Types
                                </DropdownMenuItem>
                                {fileTypes.map(type => (
                                    <DropdownMenuItem
                                        key={type}
                                        onClick={() => setFileTypeFilter(type)}
                                    >
                                        {type.toUpperCase()}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Active filters */}
                        {selectedProject && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedProject(null);
                                    setSelectedTask(null);
                                }}
                            >
                                Project: {mockProjects.find(p => p.id === selectedProject)?.title}
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        )}

                        {fileTypeFilter && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setFileTypeFilter(null)}
                            >
                                Type: {fileTypeFilter.toUpperCase()}
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        )}

                        {/* View toggle */}
                        <div className="ml-auto">
                            <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'list')}>
                                <TabsList>
                                    <TabsTrigger value="grid">
                                        <Grid className="h-4 w-4" />
                                    </TabsTrigger>
                                    <TabsTrigger value="list">
                                        <List className="h-4 w-4" />
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>
                </div>

                {filteredDocuments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <div className="rounded-full bg-muted p-3">
                            <FolderOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No documents found</h3>
                        <p className="mt-2 text-sm text-muted-foreground max-w-md">
                            {selectedProject
                                ? "There are no documents for this project yet."
                                : "No documents match your current filters. Try adjusting your search criteria."}
                        </p>
                        <Button className="mt-4">
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Document
                        </Button>
                    </div>
                ) : view === 'grid' ? (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredDocuments.map((document) => (
                            <Card key={document.id} className="overflow-hidden">
                                <div className="flex items-center justify-center h-32 bg-muted">
                                    <FileIcon fileType={document.fileType} />
                                </div>
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        <h3 className="font-medium line-clamp-1" title={document.name}>
                                            {document.name}
                                        </h3>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {document.fileType.toUpperCase()} • {formatFileSize(document.size)}
                      </span>
                                            <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                                        </div>
                                        {document.projectTitle && (
                                            <div className="text-xs text-muted-foreground flex items-center">
                                                <Briefcase className="h-3 w-3 mr-1" />
                                                <Link href={`/projects/${document.projectId}`} className="hover:underline line-clamp-1">
                                                    {document.projectTitle}
                                                </Link>
                                            </div>
                                        )}
                                        {document.taskTitle && (
                                            <div className="text-xs text-muted-foreground flex items-center">
                                                <ListTodo className="h-3 w-3 mr-1" />
                                                <Link href={`/tasks/${document.taskId}`} className="hover:underline line-clamp-1">
                                                    {document.taskTitle}
                                                </Link>
                                            </div>
                                        )}
                                        <div className="flex gap-2 pt-2">
                                            <Button size="sm" variant="outline" className="w-full">
                                                <EyeIcon className="h-3 w-3 mr-1" />
                                                View
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="outline">
                                                        <MoreHorizontal className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                        Open in New Tab
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium">Size</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium">Project</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium">Uploaded By</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredDocuments.map((document) => (
                                    <tr key={document.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <FileIcon fileType={document.fileType} />
                                                <div>
                                                    <div className="font-medium">{document.name}</div>
                                                    {document.description && (
                                                        <div className="text-xs text-muted-foreground line-clamp-1">
                                                            {document.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge variant="outline">{document.fileType.toUpperCase()}</Badge>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {formatFileSize(document.size)}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {document.projectTitle ? (
                                                <Link href={`/projects/${document.projectId}`} className="hover:underline">
                                                    {document.projectTitle}
                                                </Link>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {document.uploaderName}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {new Date(document.uploadDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="outline">
                                                    <EyeIcon className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="sm" variant="outline">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <ExternalLink className="h-4 w-4 mr-2" />
                                                            Open in New Tab
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default DocumentsPage;