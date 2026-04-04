import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, MoreVertical, Clock, User, MessageSquare, Trash2, Activity } from 'lucide-react';
import { Task, Status, Priority } from '../types';
import { useStore } from '../StoreContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import Modal from './Modal';
import Avatar from './Avatar';
import { canAssignTask, getVisibleTasks, canDeleteTask } from '../constants';
import { toast } from 'sonner';

const COLUMNS: { id: Status; label: string }[] = [
  { id: 'pending', label: 'Pending' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'reviewed', label: 'Reviewed' },
];

interface SortableTaskCardProps {
  task: Task;
  onOpenDetails: (task: Task) => void;
}

const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ task, onOpenDetails }) => {
  const { users } = useStore();
  const assignee = users.find(u => u.id === task.assignedTo);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="glass-card p-4 mb-3 cursor-grab active:cursor-grabbing hover:border-brand-black transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5",
          task.priority === 'high' ? "bg-red-100 text-red-700" : 
          task.priority === 'medium' ? "bg-yellow-100 text-yellow-700" : 
          "bg-blue-100 text-blue-700"
        )}>
          {task.priority}
        </span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(task);
          }}
          className="text-brand-gray-400 hover:text-brand-black"
        >
          <MoreVertical size={14} />
        </button>
      </div>
      <h4 
        className="text-sm font-bold mb-2 hover:underline cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onOpenDetails(task);
        }}
      >
        {task.title}
      </h4>
      <p className="text-xs text-brand-gray-500 mb-4 line-clamp-2">{task.description}</p>
      <div className="flex justify-between items-center text-[10px] font-bold text-brand-gray-400 uppercase">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          {task.deadline}
        </div>
        <div className="flex items-center gap-1">
          <Avatar src={assignee?.avatarUrl} name={assignee?.name ?? 'Unknown'} size="sm" className="rounded-full" />
          {assignee?.name ?? 'Unknown'}
        </div>
      </div>
    </div>
  );
};

interface KanbanColumnProps {
  id: Status;
  label: string;
  tasks: Task[];
  onAddTask: (status: Status) => void;
  onOpenDetails: (task: Task) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, label, tasks, onAddTask, onOpenDetails }) => {
  const { setNodeRef } = useDroppable({ id });

  const getColumnStyles = () => {
    if (tasks.length === 0) return "bg-brand-gray-50/50 border-dashed border-brand-gray-200";
    
    const highPriorityCount = tasks.filter(t => t.priority === 'high').length;
    const mediumPriorityCount = tasks.filter(t => t.priority === 'medium').length;
    
    // High priority density
    if (highPriorityCount >= tasks.length * 0.3 && highPriorityCount > 0) {
      return "bg-red-50/30 border-red-100/50 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]";
    }
    
    // Medium priority density
    if (mediumPriorityCount >= tasks.length * 0.5 && mediumPriorityCount > 0) {
      return "bg-yellow-50/30 border-yellow-100/50 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]";
    }
    
    // High task volume
    if (tasks.length > 6) {
      return "bg-brand-gray-200/40 border-brand-gray-300/50";
    }
    
    // Default populated state
    return "bg-brand-gray-100/50 border-brand-gray-200/50";
  };

  return (
    <div className="w-full md:w-80 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 px-2 shrink-0">
        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 font-display">
          {label}
          <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-full transition-colors duration-500",
            tasks.length > 5 ? "bg-brand-black text-brand-white" : "bg-brand-gray-200 text-brand-black"
          )}>
            {tasks.length}
          </span>
        </h3>
        <button 
          onClick={() => onAddTask(id)}
          className="p-1 hover:bg-brand-gray-200 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      <div 
        ref={setNodeRef}
        className={cn(
          "flex-1 p-3 border transition-all duration-500 overflow-y-auto no-scrollbar",
          getColumnStyles()
        )}
      >
        <SortableContext
          id={id}
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="min-h-full">
            {tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} onOpenDetails={onOpenDetails} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

const Kanban: React.FC = () => {
  const { tasks, updateTask, addTask, deleteTask, users, currentUser, comments, addComment } = useStore();
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commentText, setCommentText] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending' as Status,
    priority: 'medium' as Priority,
    deadline: '',
    assignedTo: '',
  });

  const [editTaskData, setEditTaskData] = useState<Partial<Task>>({});

  const visibleTasks = getVisibleTasks(currentUser, tasks, users);

  useEffect(() => {
    setLocalTasks(visibleTasks);
  }, [tasks, currentUser, users]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumn = (id: string) => {
    if (COLUMNS.some(col => col.id === id)) return id as Status;
    const task = localTasks.find(t => t.id === id);
    return task ? task.status : null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setLocalTasks((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId);
      const overIndex = prev.findIndex((t) => t.id === overId);

      let newIndex;
      if (prev.find(t => t.id === overId)) {
        newIndex = overIndex;
      } else {
        newIndex = prev.length;
      }

      const updatedTasks = [...prev];
      updatedTasks[activeIndex] = {
        ...updatedTasks[activeIndex],
        status: overColumn as Status
      };

      return arrayMove(updatedTasks, activeIndex, newIndex);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    // Find the task in the original store to get its true current status
    const originalTask = tasks.find(t => t.id === activeId);

    if (originalTask && overColumn && originalTask.status !== overColumn) {
      updateTask(activeId, { status: overColumn as Status });
    } else {
      const activeIndex = localTasks.findIndex((t) => t.id === activeId);
      const overIndex = localTasks.findIndex((t) => t.id === overId);

      if (activeIndex !== overIndex && overIndex !== -1) {
        const newTasks = arrayMove(localTasks, activeIndex, overIndex);
        setLocalTasks(newTasks);
      }
    }

    setActiveId(null);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const assignee = users.find(u => u.id === newTask.assignedTo);
    if (!assignee) return;

    if (!canAssignTask(currentUser, assignee)) {
      toast.error('Access Denied', {
        description: `As a ${currentUser.role}, you cannot assign tasks to a ${assignee.role}${currentUser.roleLevel >= 3 ? ' outside your department' : ''}.`
      });
      return;
    }

    addTask({
      ...newTask,
      assignedBy: currentUser.id
    });
    
    toast.success('Task Created', {
      description: `Successfully assigned "${newTask.title}" to ${assignee.name}.`
    });
    
    setIsModalOpen(false);
    setNewTask({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      deadline: '',
      assignedTo: '',
    });
  };

  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !editTaskData.title) return;

    updateTask(selectedTask.id, editTaskData);
    toast.success('Task Updated');
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const openAddTaskModal = (status: Status) => {
    setNewTask(prev => ({ ...prev, status }));
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 h-full bg-brand-gray-50 dark:bg-brand-gray-900 flex flex-col overflow-hidden transition-colors duration-300">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase">Kanban Board</h2>
          <p className="text-brand-gray-500 font-medium text-sm md:text-base">Manage your workflow visually.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          New Task
        </button>
      </header>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex flex-col md:flex-row gap-6 h-full">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {COLUMNS.map((column) => (
              <KanbanColumn 
                key={column.id} 
                id={column.id} 
                label={column.label} 
                tasks={localTasks.filter(t => t.status === column.id)}
                onAddTask={openAddTaskModal}
                onOpenDetails={(task) => {
                  setSelectedTask(task);
                  setIsDetailsModalOpen(true);
                }}
              />
            ))}
            
            <DragOverlay dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: '0.5',
                  },
                },
              }),
            }}>
              {activeId ? (
                <div className="glass-card p-4 shadow-xl border-brand-black rotate-3 scale-105">
                  <h4 className="text-sm font-bold mb-2">{localTasks.find(t => t.id === activeId)?.title}</h4>
                  <p className="text-xs text-brand-gray-500 line-clamp-2">{localTasks.find(t => t.id === activeId)?.description}</p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Task"
      >
        <form onSubmit={handleEditTask} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Title</label>
            <input 
              required
              type="text" 
              className="input-field" 
              value={editTaskData.title || ''}
              onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Description</label>
            <textarea 
              className="input-field min-h-[100px]" 
              value={editTaskData.description || ''}
              onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Priority</label>
              <select 
                className="input-field"
                value={editTaskData.priority || 'medium'}
                onChange={(e) => setEditTaskData({ ...editTaskData, priority: e.target.value as Priority })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Deadline</label>
              <input 
                required
                type="date" 
                className="input-field" 
                value={editTaskData.deadline || ''}
                onChange={(e) => setEditTaskData({ ...editTaskData, deadline: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Assignee</label>
            <select 
              required
              className="input-field"
              value={editTaskData.assignedTo || ''}
              onChange={(e) => setEditTaskData({ ...editTaskData, assignedTo: e.target.value })}
            >
              <option value="">Select Assignee</option>
              {users.filter(u => canAssignTask(currentUser, u)).map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.role} - {user.departmentId})</option>
              ))}
            </select>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full btn-primary py-3 uppercase tracking-widest font-bold">
              Update Task
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Task"
      >
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Title</label>
            <input 
              required
              type="text" 
              className="input-field" 
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Description</label>
            <textarea 
              className="input-field min-h-[100px]" 
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Priority</label>
              <select 
                className="input-field"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Deadline</label>
              <input 
                required
                type="date" 
                className="input-field" 
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Status</label>
              <select 
                className="input-field"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Status })}
              >
                {COLUMNS.map(col => (
                  <option key={col.id} value={col.id}>{col.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Assignee</label>
              <select 
                required
                className="input-field"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              >
                <option value="">Select Assignee</option>
                {users.filter(u => canAssignTask(currentUser, u)).map(user => (
                  <option key={user.id} value={user.id}>{user.name} ({user.role} - {user.departmentId})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full btn-primary py-3 uppercase tracking-widest font-bold">
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Task Details"
      >
        {selectedTask && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2 dark:text-brand-white">{selectedTask.title}</h3>
              <p className="text-brand-gray-500 dark:text-brand-gray-400">{selectedTask.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 py-6 border-y border-brand-gray-100 dark:border-brand-gray-800">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Status</p>
                <p className="text-sm font-bold uppercase dark:text-brand-white">{selectedTask.status.replace('_', ' ')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Priority</p>
                <p className="text-sm font-bold uppercase dark:text-brand-white">{selectedTask.priority}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Deadline</p>
                <p className="text-sm font-bold dark:text-brand-white">{selectedTask.deadline}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400">Assignee</p>
                <p className="text-sm font-bold dark:text-brand-white">
                  {users.find(u => u.id === selectedTask.assignedTo)?.name}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setEditTaskData(selectedTask);
                  setIsDetailsModalOpen(false);
                  setIsEditModalOpen(true);
                }}
                className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2"
              >
                Edit Task
              </button>
              <button 
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setIsCommentsModalOpen(true);
                }}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                View Comments
              </button>
              <button 
                onClick={() => {
                  if (canDeleteTask(currentUser, selectedTask)) {
                    deleteTask(selectedTask.id);
                    toast.success('Task Deleted');
                  } else {
                    toast.error('Access Denied');
                  }
                  setIsDetailsModalOpen(false);
                }}
                className="btn-secondary border-red-200 text-red-500 hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        title={`Comments: ${selectedTask?.title}`}
      >
        <div className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 no-scrollbar">
            {selectedTask && comments.filter(c => c.taskId === selectedTask.id).length === 0 ? (
              <div className="text-center py-12 text-brand-gray-400">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm font-medium">No comments yet.</p>
              </div>
            ) : (
              selectedTask && comments.filter(c => c.taskId === selectedTask.id).map((comment) => {
                const user = users.find(u => u.id === comment.userId);
                const isMe = comment.userId === currentUser.id;
                
                return (
                  <div key={comment.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                    <div className="flex items-center gap-2 mb-1">
                      {!isMe && <Avatar src={user?.avatarUrl} name={user?.name ?? 'Unknown'} size="sm" className="rounded-full" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500">
                        {user?.name ?? 'Unknown'} • {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && <Avatar src={user?.avatarUrl} name={user?.name ?? 'Unknown'} size="sm" className="rounded-full" />}
                    </div>
                    <div className={cn(
                      "px-4 py-2 text-sm max-w-[85%]",
                      isMe 
                        ? "bg-brand-black text-brand-white" 
                        : "bg-brand-gray-100 dark:bg-brand-gray-800 dark:text-brand-white"
                    )}>
                      {comment.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!selectedTask || !commentText.trim()) return;
            addComment({
              taskId: selectedTask.id,
              userId: currentUser.id,
              text: commentText.trim(),
            });
            setCommentText('');
            toast.success('Comment Added');
          }} className="flex gap-2 pt-4 border-t border-brand-gray-100 dark:border-brand-gray-700">
            <input 
              type="text"
              placeholder="Write a comment..."
              className="input-field flex-1"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="btn-primary px-4 py-2">
              <Plus size={18} />
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Kanban;
