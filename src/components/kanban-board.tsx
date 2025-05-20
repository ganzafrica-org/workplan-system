import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project, WorkPlan, Task } from '@/lib/mockData';

type KanbanItem = Project | WorkPlan | Task;

interface KanbanBoardViewProps {
    items: KanbanItem[];
    itemType?: 'project' | 'workplan' | 'task';
}

export const KanbanBoardView = ({ items, itemType = 'project' }: KanbanBoardViewProps) => {
    const [boards, setBoards] = useState<Record<string, KanbanItem[]>>({});
    const [draggingItem, setDraggingItem] = useState<KanbanItem | null>(null);
    const [draggingBoard, setDraggingBoard] = useState<string | null>(null);
    const [hoveredBoard, setHoveredBoard] = useState<string | null>(null);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const dragItemRef = useRef<HTMLDivElement | null>(null);
    const dragItemIndex = useRef<number>(-1);
    const dragBoard = useRef<string | null>(null);

    useEffect(() => {
        const groupedItems = items.reduce((acc: Record<string, KanbanItem[]>, item) => {
            if (!('status' in item)) return acc;

            const status = item.status;
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(item);
            return acc;
        }, {});

        setBoards(groupedItems);
    }, [items]);

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

    const getStatusName = (status: string) => {
        return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');
    };

    const columnOrder = [
        'PLANNING',
        'PENDING',
        'IN_PROGRESS',
        'ACTIVE',
        'SUBMITTED',
        'APPROVED',
        'REJECTED',
        'ON_HOLD',
        'COMPLETED',
        'ARCHIVED'
    ];

    const availableColumns = columnOrder.filter(
        status => boards[status] && boards[status].length > 0
    );

    const columnsToRender = availableColumns.length > 0
        ? availableColumns
        : Object.keys(boards);

    const getItemTitle = (item: KanbanItem): string => {
        return 'title' in item ? item.title : '';
    };

    const getItemDescription = (item: KanbanItem): string => {
        return 'description' in item ? item.description : '';
    };

    const getItemId = (item: KanbanItem): string => {
        return 'id' in item ? item.id : '';
    };

    const handleDragStart = (e: React.DragEvent, board: string, item: KanbanItem, index: number) => {
        setDraggingItem(item);
        setDraggingBoard(board);
        dragItemRef.current = e.currentTarget as HTMLDivElement;
        dragItemIndex.current = index;
        dragBoard.current = board;

        setTimeout(() => {
            if (dragItemRef.current) {
                dragItemRef.current.style.opacity = '0.4';
            }
        }, 0);

        e.dataTransfer.setData('itemId', getItemId(item));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, board: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (board !== hoveredBoard) {
            setHoveredBoard(board);
        }

        return false;
    };

    const handleDragEnter = (e: React.DragEvent, board: string) => {
        e.preventDefault();
        setHoveredBoard(board);
    };

    const handleDragLeave = () => {
        setHoveredBoard(null);
    };

    const handleDragEnd = () => {
        if (dragItemRef.current) {
            dragItemRef.current.style.opacity = '1';
        }

        setDraggingItem(null);
        setDraggingBoard(null);
        setHoveredBoard(null);
        dragItemRef.current = null;
        dragItemIndex.current = -1;
        dragBoard.current = null;
    };

    const handleDrop = (e: React.DragEvent, targetBoard: string) => {
        e.preventDefault();
        e.dataTransfer.getData('itemId');
        if (draggingBoard === targetBoard) {

            return;
        }

        if (draggingItem && draggingBoard) {

            const newBoards = { ...boards };

            newBoards[draggingBoard] = newBoards[draggingBoard].filter(
                item => getItemId(item) !== getItemId(draggingItem)
            );

            const updatedItem = { ...draggingItem, status: targetBoard };

            if (!newBoards[targetBoard]) {
                newBoards[targetBoard] = [];
            }
            newBoards[targetBoard].push(updatedItem as Project | WorkPlan | Task);

            setBoards(newBoards);
        }

        setDraggingItem(null);
        setDraggingBoard(null);
        setHoveredBoard(null);
    };

    const toggleItemExpanded = (itemId: string) => {
        if (expandedItem === itemId) {
            setExpandedItem(null);
        } else {
            setExpandedItem(itemId);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Kanban Board</h3>

            <div className="flex gap-4 overflow-x-auto pb-4">
                {columnsToRender.map((status) => (
                    <div
                        key={status}
                        className={`flex-shrink-0 w-72 bg-muted/20 rounded-md 
              ${hoveredBoard === status ? 'ring-2 ring-primary' : ''}
              ${draggingBoard === status ? 'opacity-70' : ''}`}
                        onDragOver={(e) => handleDragOver(e, status)}
                        onDragEnter={(e) => handleDragEnter(e, status)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, status)}
                    >
                        <div className="p-3 border-b bg-muted/30">
                            <div className="flex items-center justify-between">
                                <Badge className={getStatusColor(status)}>
                                    {getStatusName(status)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                  {boards[status]?.length || 0} items
                </span>
                            </div>
                        </div>

                        <div className="p-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                            {boards[status]?.map((item, index) => (
                                <div
                                    key={getItemId(item)}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, status, item, index)}
                                    onDragEnd={handleDragEnd}
                                    ref={draggingItem === item ? dragItemRef : null}
                                >
                                    <Card
                                        className={`mb-2 cursor-move hover:border-primary transition-colors
                      ${expandedItem === getItemId(item) ? 'border-primary' : ''}`}
                                        onClick={() => toggleItemExpanded(getItemId(item))}
                                    >
                                        <CardContent className="p-3 space-y-2">
                                            <div className="font-medium text-sm line-clamp-1">
                                                {getItemTitle(item)}
                                            </div>

                                            {(expandedItem === getItemId(item) || getItemDescription(item).length < 100) && (
                                                <div className="text-xs text-muted-foreground">
                                                    {getItemDescription(item)}
                                                </div>
                                            )}

                                            {expandedItem !== getItemId(item) && getItemDescription(item).length >= 100 && (
                                                <div className="text-xs text-muted-foreground line-clamp-2">
                                                    {getItemDescription(item)}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between text-xs">
                                                {'progress' in item && (
                                                    <div>{item.progress}% complete</div>
                                                )}

                                                {'weekNumber' in item && (
                                                    <div>Week {item.weekNumber}</div>
                                                )}

                                                {'assignees' in item && item.assignees && item.assignees.length > 0 && (
                                                    <div className="flex -space-x-2">
                                                        {item.assignees.slice(0, 3).map((assignee, index) => (
                                                            <div
                                                                key={assignee.id}
                                                                className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs"
                                                                title={assignee.name}
                                                            >
                                                                {assignee.name.charAt(0)}
                                                            </div>
                                                        ))}
                                                        {item.assignees.length > 3 && (
                                                            <div className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">
                                                                +{item.assignees.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {expandedItem === getItemId(item) && (
                                                <div className="pt-2 mt-2 border-t text-xs">
                                                    {'startDate' in item && 'endDate' in item && (
                                                        <div className="text-muted-foreground mb-1">
                                                            {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                                                        </div>
                                                    )}

                                                    {'departmentName' in item && (
                                                        <div className="text-muted-foreground">
                                                            Department: {item.departmentName}
                                                        </div>
                                                    )}

                                                    {'teamName' in item && (
                                                        <div className="text-muted-foreground">
                                                            Team: {item.teamName}
                                                        </div>
                                                    )}

                                                    {'projectTitle' in item && (
                                                        <div className="text-muted-foreground">
                                                            Project: {item.projectTitle}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}

                            {(!boards[status] || boards[status].length === 0) && (
                                <div className="text-center py-6 text-sm text-muted-foreground">
                                    No items in this status
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};