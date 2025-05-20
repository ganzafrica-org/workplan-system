import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Project, WorkPlan, Task } from '@/lib/mockData';

type CalendarItem = Project | WorkPlan | Task;

interface CalendarViewProps {
    items: CalendarItem[];
    itemType?: 'project' | 'workplan' | 'task';
}

export const CalendarView = ({ items, itemType = 'project' }: CalendarViewProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
    const [hoveredItem, setHoveredItem] = useState<CalendarItem | null>(null);

    const getFirstDayOfWeek = (date: Date): Date => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    };

    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const nextMonth = () => {
        if (currentView === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        } else if (currentView === 'week') {
            const nextWeek = new Date(currentDate);
            nextWeek.setDate(nextWeek.getDate() + 7);
            setCurrentDate(nextWeek);
        } else if (currentView === 'day') {
            const nextDay = new Date(currentDate);
            nextDay.setDate(nextDay.getDate() + 1);
            setCurrentDate(nextDay);
        }
    };

    const prevMonth = () => {
        if (currentView === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        } else if (currentView === 'week') {
            const prevWeek = new Date(currentDate);
            prevWeek.setDate(prevWeek.getDate() - 7);
            setCurrentDate(prevWeek);
        } else if (currentView === 'day') {
            const prevDay = new Date(currentDate);
            prevDay.setDate(prevDay.getDate() - 1);
            setCurrentDate(prevDay);
        }
    };

    const handleViewChange = (view: 'month' | 'week' | 'day') => {
        setCurrentView(view);
        if (view === 'week') {
            setCurrentDate(getFirstDayOfWeek(currentDate));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
            case 'APPROVED':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'PLANNING':
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'ON_HOLD':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'COMPLETED':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
            case 'REJECTED':
            case 'ARCHIVED':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'SUBMITTED':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    const getItemTitle = (item: CalendarItem): string => {
        return 'title' in item ? item.title : '';
    };

    const getItemStatus = (item: CalendarItem): string => {
        return 'status' in item ? item.status : '';
    };

    const getItemDescription = (item: CalendarItem): string => {
        return 'description' in item ? item.description : '';
    };

    const itemsForDate = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return items.filter(item => {
            if (!('startDate' in item) || !('endDate' in item)) return false;

            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);
            return date >= startDate && date <= endDate;
        });
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const renderMonthView = () => {
        const calendarDays = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="h-24 border border-muted bg-muted/30"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayItems = itemsForDate(day);
            const currentDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isTodayFlag = isToday(currentDateObj);

            calendarDays.push(
                <div
                    key={`day-${day}`}
                    className={`min-h-24 border p-1 relative hover:bg-muted/20 transition-colors ${
                        isTodayFlag ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                    }`}
                >
                    <div className={`font-medium text-sm p-1 ${isTodayFlag ? 'text-blue-700 dark:text-blue-400' : ''}`}>
                        {day}
                    </div>
                    <div className="space-y-1 mt-1 max-h-20 overflow-y-auto">
                        {dayItems.slice(0, 3).map((item, idx) => (
                            <div
                                key={`${day}-item-${idx}`}
                                className="text-xs p-1 rounded truncate cursor-pointer hover:bg-muted"
                                onMouseEnter={() => setHoveredItem(item)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <Badge className={`${getStatusColor(getItemStatus(item))} text-xs`}>
                                    {getItemStatus(item).charAt(0) + getItemStatus(item).slice(1).toLowerCase().replace('_', ' ')}
                                </Badge>
                                <span className="ml-1 truncate">{getItemTitle(item)}</span>
                            </div>
                        ))}
                        {dayItems.length > 3 && (
                            <div className="text-xs text-muted-foreground px-1">
                                +{dayItems.length - 3} more
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-7">
                {calendarDays}
            </div>
        );
    };

    const renderWeekView = () => {
        const weekStart = getFirstDayOfWeek(currentDate);
        const weekDays = [];

        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);

            const dayItems = items.filter(item => {
                if (!('startDate' in item) || !('endDate' in item)) return false;

                const startDate = new Date(item.startDate);
                const endDate = new Date(item.endDate);
                return day >= startDate && day <= endDate;
            });

            const isTodayFlag = isToday(day);

            weekDays.push(
                <div
                    key={`weekday-${i}`}
                    className={`border-r last:border-r-0 flex flex-col ${isTodayFlag ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}
                >
                    <div className={`text-center py-2 border-b font-medium ${isTodayFlag ? 'text-blue-700 dark:text-blue-400' : ''}`}>
                        <div>{dayNames[i]}</div>
                        <div className="text-xl">{day.getDate()}</div>
                        <div className="text-xs text-muted-foreground">{monthNames[day.getMonth()]}</div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-1 space-y-1 min-h-[300px]">
                        {dayItems.map((item, idx) => (
                            <div
                                key={`week-item-${i}-${idx}`}
                                className={`text-xs p-2 rounded cursor-pointer border-l-2 ${getStatusColor(getItemStatus(item))} hover:bg-muted/30`}
                                onMouseEnter={() => setHoveredItem(item)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <div className="font-medium truncate">{getItemTitle(item)}</div>
                                <div className="text-muted-foreground truncate">{getItemDescription(item)}</div>
                            </div>
                        ))}
                        {dayItems.length === 0 && (
                            <div className="h-full flex items-center justify-center">
                                <Button size="sm" variant="ghost" className="text-xs text-muted-foreground">
                                    <Plus className="h-3 w-3 mr-1" /> Add
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-7 h-full">{weekDays}</div>
        );
    };

    const renderDayView = () => {
        const hours = Array.from({ length: 24 }, (_, i) => i);

        const dayItems = items.filter(item => {
            if (!('startDate' in item) || !('endDate' in item)) return false;

            const itemStartDate = new Date(item.startDate);
            const itemEndDate = new Date(item.endDate);

            const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
            const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

            return (
                (itemStartDate <= endOfDay && itemEndDate >= startOfDay) ||
                (itemStartDate >= startOfDay && itemStartDate <= endOfDay) ||
                (itemEndDate >= startOfDay && itemEndDate <= endOfDay)
            );
        });

        const formatHour = (hour: number) => {
            if (hour === 0 || hour === 24) return '12 AM';
            if (hour === 12) return '12 PM';
            return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
        };

        const itemsByHour: Record<number, CalendarItem[]> = {};
        hours.forEach(hour => {
            itemsByHour[hour] = [];
        });

        dayItems.forEach(item => {
            if (!('startDate' in item)) return;

            const startDate = new Date(item.startDate);
            if (startDate.getDate() === currentDate.getDate() &&
                startDate.getMonth() === currentDate.getMonth() &&
                startDate.getFullYear() === currentDate.getFullYear()) {
                const hour = startDate.getHours();
                itemsByHour[hour].push(item);
            } else {
                // If the item spans multiple days, put it at the top
                itemsByHour[0].push(item);
            }
        });

        const now = new Date();
        const currentHour = now.getHours();
        const isCurrentDay = isToday(currentDate);

        return (
            <div className="flex flex-col h-full border rounded-md">
                <div className="text-center py-4 border-b font-medium">
                    <div className="text-xl">{monthNames[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}</div>
                    <div className="text-sm text-muted-foreground">{dayNames[currentDate.getDay()]}</div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {hours.map(hour => (
                        <div
                            key={`hour-${hour}`}
                            className={`flex border-b min-h-16 ${isCurrentDay && hour === currentHour ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}
                        >
                            <div className="w-16 p-2 border-r flex-shrink-0 text-muted-foreground text-xs">
                                {formatHour(hour)}
                            </div>
                            <div className="flex-1 p-1">
                                {itemsByHour[hour].map((item, idx) => (
                                    <div
                                        key={`day-item-${hour}-${idx}`}
                                        className={`text-xs p-2 my-1 rounded cursor-pointer border-l-2 ${getStatusColor(getItemStatus(item))}`}
                                        onMouseEnter={() => setHoveredItem(item)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                    >
                                        <div className="font-medium">{getItemTitle(item)}</div>
                                        <div className="text-muted-foreground">{getItemDescription(item)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Item tooltip/popup when hovering
    const renderItemPopup = () => {
        if (!hoveredItem) return null;

        return (
            <div className="absolute z-50 bg-white dark:bg-gray-800 p-3 rounded-md shadow-lg border max-w-xs">
                <div className="font-bold mb-1">{getItemTitle(hoveredItem)}</div>
                <div className="mb-2">
                    <Badge className={getStatusColor(getItemStatus(hoveredItem))}>
                        {getItemStatus(hoveredItem).charAt(0) + getItemStatus(hoveredItem).slice(1).toLowerCase().replace('_', ' ')}
                    </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{getItemDescription(hoveredItem)}</div>

                {'startDate' in hoveredItem && 'endDate' in hoveredItem && (
                    <div className="text-xs mt-2 text-muted-foreground">
                        {new Date(hoveredItem.startDate).toLocaleDateString()} - {new Date(hoveredItem.endDate).toLocaleDateString()}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4 relative">
            {hoveredItem && renderItemPopup()}

            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">
                        {currentView === 'month' && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                        {currentView === 'week' && `Week of ${monthNames[getFirstDayOfWeek(currentDate).getMonth()]} ${getFirstDayOfWeek(currentDate).getDate()}, ${currentDate.getFullYear()}`}
                        {currentView === 'day' && `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`}
                    </h3>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                {currentView.charAt(0).toUpperCase() + currentView.slice(1)} View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewChange('month')}>
                                Month
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewChange('week')}>
                                Week
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewChange('day')}>
                                Day
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Card>
                <CardContent className={`p-0 ${currentView !== 'month' ? 'min-h-[600px]' : ''}`}>
                    <div className="grid grid-cols-7 bg-muted/50">
                        {dayNames.map((day) => (
                            <div key={day} className="py-2 text-center text-sm font-medium">
                                {day}
                            </div>
                        ))}
                    </div>

                    {currentView === 'month' && renderMonthView()}
                    {currentView === 'week' && renderWeekView()}
                    {currentView === 'day' && renderDayView()}
                </CardContent>
            </Card>
        </div>
    );
};