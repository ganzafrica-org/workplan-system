import { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Project, WorkPlan, Task } from '@/lib/mockData';

type GanttItem = Project | WorkPlan | Task;

interface GanttChartViewProps {
    items: GanttItem[];
    itemType?: 'project' | 'workplan' | 'task';
}

export const GanttChartView = ({ items, itemType = 'project' }: GanttChartViewProps) => {
    const scrollContainer = useRef<HTMLDivElement>(null);
    const [, setScrollPosition] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(40); // pixels per day
    const [selectedItem, setSelectedItem] = useState<GanttItem | null>(null);
    const [viewMode, setViewMode] = useState<'days' | 'weeks' | 'months'>('days');

    const currentDate = new Date();
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 15);
        return date;
    });
    const [endDate, setEndDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 75);
        return date;
    });

    useEffect(() => {
        if (items.length > 0) {
            let earliestDate = new Date();
            let latestDate = new Date();

            items.forEach(item => {
                if ('startDate' in item && 'endDate' in item) {
                    const itemStart = new Date(item.startDate);
                    const itemEnd = new Date(item.endDate);

                    if (itemStart < earliestDate) earliestDate = itemStart;
                    if (itemEnd > latestDate) latestDate = itemEnd;
                }
            });

            earliestDate.setDate(earliestDate.getDate() - 15);
            latestDate.setDate(latestDate.getDate() + 15);

            setStartDate(earliestDate);
            setEndDate(latestDate);
        }
    }, [items]);

    const daysTotal = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const generateDateHeaders = () => {
        const dateHeaders: { date: number; day: number; isWeekend: boolean; isToday: boolean; fullDate: Date }[] = [];
        const monthHeaders: { month: number; year: number; colSpan: number }[] = [];
        const weekHeaders: { weekNumber: number; year: number; colSpan: number }[] = [];

        let currentMonth = -1;
        let monthColSpan = 0;
        let currentWeek = -1;
        let weekColSpan = 0;

        for (let i = 0; i < daysTotal; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);

            if (date.getMonth() !== currentMonth) {
                if (currentMonth !== -1) {
                    monthHeaders.push({
                        month: currentMonth,
                        year: date.getFullYear() - (date.getMonth() === 0 ? 1 : 0),
                        colSpan: monthColSpan
                    });
                }
                currentMonth = date.getMonth();
                monthColSpan = 0;
            }
            monthColSpan++;

            const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
            const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
            const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

            if (weekNum !== currentWeek) {
                if (currentWeek !== -1) {
                    weekHeaders.push({
                        weekNumber: currentWeek,
                        year: date.getFullYear(),
                        colSpan: weekColSpan
                    });
                }
                currentWeek = weekNum;
                weekColSpan = 0;
            }
            weekColSpan++;

            dateHeaders.push({
                date: date.getDate(),
                day: date.getDay(),
                isWeekend: date.getDay() === 0 || date.getDay() === 6,
                isToday: date.toDateString() === currentDate.toDateString(),
                fullDate: date
            });
        }

        if (monthColSpan > 0) {
            monthHeaders.push({
                month: currentMonth,
                year: endDate.getFullYear(),
                colSpan: monthColSpan
            });
        }

        if (weekColSpan > 0) {
            weekHeaders.push({
                weekNumber: currentWeek,
                year: endDate.getFullYear(),
                colSpan: weekColSpan
            });
        }

        return { dateHeaders, monthHeaders, weekHeaders };
    };

    const { dateHeaders, monthHeaders, weekHeaders } = generateDateHeaders();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const scrollLeft = () => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({ left: -200, behavior: 'smooth' });
            setScrollPosition(prev => Math.max(0, prev - 200));
        }
    };

    const scrollRight = () => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({ left: 200, behavior: 'smooth' });
            setScrollPosition(prev => prev + 200);
        }
    };

    useEffect(() => {
        const todayIndex = dateHeaders.findIndex(d => d.isToday);
        if (todayIndex !== -1 && scrollContainer.current) {
            const scrollTo = (todayIndex - 3) * zoomLevel; // Center today
            scrollContainer.current.scrollLeft = scrollTo;
            setScrollPosition(scrollTo);
        }
    }, [zoomLevel, dateHeaders]);

    const getItemTitle = (item: GanttItem): string => {
        return 'title' in item ? item.title : '';
    };

    const getItemStatus = (item: GanttItem): string => {
        return 'status' in item ? item.status : '';
    };

    const getItemDescription = (item: GanttItem): string => {
        return 'description' in item ? item.description : '';
    };

    const calculateItemPosition = (item: GanttItem) => {
        if (!('startDate' in item) || !('endDate' in item)) {
            return { left: '0px', width: '0px' };
        }

        const itemStart = new Date(item.startDate);
        const itemEnd = new Date(item.endDate);

        const startDays = Math.max(
            0,
            Math.ceil((itemStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        );

        const duration = Math.max(1, Math.ceil((itemEnd.getTime() - itemStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);

        return {
            left: `${startDays * zoomLevel}px`,
            width: `${duration * zoomLevel - 4}px`
        };
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
            case 'APPROVED':
                return 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200';
            case 'PLANNING':
            case 'PENDING':
                return 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200';
            case 'ON_HOLD':
                return 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200';
            case 'COMPLETED':
                return 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200';
            case 'REJECTED':
            case 'ARCHIVED':
                return 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200';
            case 'IN_PROGRESS':
                return 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200';
            case 'SUBMITTED':
                return 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200';
            default:
                return 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200';
        }
    };

    const zoomIn = () => {
        setZoomLevel(prev => Math.min(100, prev + 10));
    };

    const zoomOut = () => {
        setZoomLevel(prev => Math.max(20, prev - 10));
    };

    const handleItemClick = (item: GanttItem) => {
        setSelectedItem(item === selectedItem ? null : item);
    };

    const renderItemDetails = () => {
        if (!selectedItem) return null;

        return (
            <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg border w-80 z-10">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{getItemTitle(selectedItem)}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>×</Button>
                </div>

                <div className="mb-2">
          <span className={`inline-block px-2 py-1 text-xs rounded-md ${getStatusColor(getItemStatus(selectedItem))}`}>
            {getItemStatus(selectedItem).charAt(0) + getItemStatus(selectedItem).slice(1).toLowerCase().replace('_', ' ')}
          </span>
                </div>

                {getItemDescription(selectedItem) && (
                    <div className="mb-2 text-sm text-muted-foreground">
                        {getItemDescription(selectedItem)}
                    </div>
                )}

                {'startDate' in selectedItem && 'endDate' in selectedItem && (
                    <div className="text-xs text-muted-foreground">
                        {new Date(selectedItem.startDate).toLocaleDateString()} - {new Date(selectedItem.endDate).toLocaleDateString()}
                    </div>
                )}

                {'progress' in selectedItem && (
                    <div className="mt-2 text-sm">
                        Progress: {selectedItem.progress}%
                    </div>
                )}

                {'completedTasks' in selectedItem && 'totalTasks' in selectedItem && (
                    <div className="mt-1 text-sm">
                        Tasks: {selectedItem.completedTasks}/{selectedItem.totalTasks} completed
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4 relative">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Gantt Chart</h3>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={zoomOut}>
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={zoomIn}>
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewMode('days')}>
                                Days
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setViewMode('weeks')}>
                                Weeks
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setViewMode('months')}>
                                Months
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" onClick={scrollLeft}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={scrollRight}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0 overflow-hidden">
                    <div className="flex">
                        <div className="min-w-48 border-r bg-muted/20">
                            <div className="h-16 border-b px-2 flex items-end justify-start pb-2">
                                <span className="font-medium">{itemType.charAt(0).toUpperCase() + itemType.slice(1)}</span>
                            </div>
                            <div className="divide-y">
                                {items.map((item) => (
                                    <div
                                        key={'id' in item ? item.id : ''}
                                        className={`px-2 py-3 h-12 truncate hover:bg-muted/40 transition-colors ${selectedItem === item ? 'bg-muted/60' : ''}`}
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <span className="font-medium text-sm">{getItemTitle(item)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-grow overflow-x-auto" ref={scrollContainer}>
                            <div style={{ width: `${daysTotal * zoomLevel}px` }}>
                                {viewMode === 'days' || viewMode === 'weeks' ? (
                                    <div className="flex h-8 border-b bg-muted/20">
                                        {monthHeaders.map((month, idx) => (
                                            <div
                                                key={`month-${idx}`}
                                                className="border-r h-full flex items-center justify-center font-medium"
                                                style={{ width: `${month.colSpan * zoomLevel}px` }}
                                            >
                                                {`${monthNames[month.month]} ${month.year}`}
                                            </div>
                                        ))}
                                    </div>
                                ) : null}

                                {viewMode === 'days' ? (
                                    <div className="flex h-8 border-b bg-muted/10">
                                        {dateHeaders.map((header, idx) => (
                                            <div
                                                key={`day-${idx}`}
                                                className={`border-r h-full flex items-center justify-center text-xs 
                          ${header.isWeekend ? 'bg-muted/30' : ''} 
                          ${header.isToday ? 'bg-blue-100 dark:bg-blue-900 font-bold' : ''}`}
                                                style={{ width: `${zoomLevel}px` }}
                                            >
                                                {header.date}
                                            </div>
                                        ))}
                                    </div>
                                ) : viewMode === 'weeks' ? (
                                    <div className="flex h-8 border-b bg-muted/10">
                                        {weekHeaders.map((week, idx) => (
                                            <div
                                                key={`week-${idx}`}
                                                className="border-r h-full flex items-center justify-center text-xs"
                                                style={{ width: `${week.colSpan * zoomLevel}px` }}
                                            >
                                                Week {week.weekNumber}
                                            </div>
                                        ))}
                                    </div>
                                ) : null}

                                <div className="relative">
                                    {items.map((item, itemIdx) => {
                                        const { left, width } = calculateItemPosition(item);
                                        const id = 'id' in item ? item.id : '';

                                        return (
                                            <div
                                                key={`bar-container-${id}`}
                                                className="h-12 relative"
                                                style={{ marginTop: `${itemIdx * 12}px` }}
                                            >
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div
                                                                className={`absolute top-3 h-6 rounded-md border ${getStatusColor(getItemStatus(item))} 
                                  flex items-center px-2 text-xs cursor-pointer hover:opacity-90 transition-opacity
                                  ${selectedItem === item ? 'ring-2 ring-primary' : ''}`}
                                                                style={{ left, width }}
                                                                onClick={() => handleItemClick(item)}
                                                            >
                                                                <span className="truncate">{getItemTitle(item)}</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <div className="space-y-1">
                                                                <p className="font-medium">{getItemTitle(item)}</p>
                                                                <p className="text-xs">Status: {getItemStatus(item).charAt(0) + getItemStatus(item).slice(1).toLowerCase().replace('_', ' ')}</p>
                                                                {'startDate' in item && 'endDate' in item && (
                                                                    <p className="text-xs">
                                                                        {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                                                                    </p>
                                                                )}
                                                                {'progress' in item && (
                                                                    <p className="text-xs">Progress: {item.progress}%</p>
                                                                )}
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selectedItem && renderItemDetails()}
        </div>
    );
};