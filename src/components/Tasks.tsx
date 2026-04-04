import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Clock, AlertCircle, Trash2, ShieldCheck, MessageSquare, Send, Activity } from 'lucide-react';
import { useStore } from '../StoreContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import Modal from './Modal';
import Avatar from './Avatar';
import { Status, Priority, Task } from '../types';
import { canAssignTask, canDeleteTask, getVisibleTasks } from '../constants';
import { toast } from 'sonner';

const Tasks: React.FC = () => {
  const { tasks, addTask, deleteTask, updateTask, users, currentUser, setCurrentUser, comments, addComment } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commentText, setCommentText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending' as Status,
    priority: 'medium' as Priority,
    deadline: '',
    assignedTo: '',
  });

  const [editTaskData, setEditTaskData] = useState<Partial<Task>>({});

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

  const visibleTasks = getVisibleTasks(currentUser, tasks, users);

  const filteredTasks = visibleTasks.filter(task => {
    const assignee = users.find(u => u.id === task.assignedTo);
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (assignee?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteTask = (task: Task) => {
    if (canDeleteTask(currentUser, task)) {
      deleteTask(task.id);
      toast.success('Task Deleted');
    } else {
      toast.error('Access Denied', {
        description: 'You do not have permission to delete this task.'
      });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !commentText.trim()) return;

    addComment({
      taskId: selectedTask.id,
      userId: currentUser.id,
      text: commentText.trim(),
    });

    setCommentText('');
    toast.success('Comment Added');
  };

  const taskComments = selectedTask 
    ? comments.filter(c => c.taskId === selectedTask.id)
    : [];

  return (
    <div className="p-4 md:p-8 h-full bg-brand-gray-50 dark:bg-brand-gray-900 flex flex-col overflow-y-auto transition-colors duration-300">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-brand-black" />
            <select 
              value={currentUser.id}
              onChange={(e) => {
                const user = users.find(u => u.id === e.target.value);
                if (user) setCurrentUser(user);
              }}
              className="text-[10px] font-bold uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer hover:underline"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
              ))}
            </select>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase font-display">Task Management</h2>
          <p className="text-brand-gray-500 font-medium text-sm md:text-base">Track and manage your team's tasks.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          New Task
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="relative w-full md:flex-1 search-input-container">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-brand-gray-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field py-2"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="reviewed">Reviewed</option>
          </select>
        </div>
      </div>

      <div className="glass-card flex-1 flex flex-col overflow-visible">
        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-4 p-4">
          {filteredTasks.map((task) => {
            const assignee = users.find(u => u.id === task.assignedTo);
            return (
              <div 
                key={task.id} 
                className="bg-white dark:bg-brand-gray-800 border border-brand-gray-100 dark:border-brand-gray-700 p-4 space-y-3"
                onClick={() => {
                  setSelectedTask(task);
                  setIsDetailsModalOpen(true);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-sm dark:text-brand-white">{task.title}</h4>
                    <span className={cn(
                      "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 mt-1 inline-block",
                      task.priority === 'high' ? "bg-red-100 text-red-700" : 
                      task.priority === 'medium' ? "bg-yellow-100 text-yellow-700" : 
                      "bg-blue-100 text-blue-700"
                    )}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === task.id ? null : task.id);
                      }}
                      className="p-1 text-brand-gray-400 hover:text-brand-black dark:hover:text-brand-white transition-colors cursor-pointer"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenuId === task.id && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-brand-gray-800 border border-brand-gray-200 dark:border-brand-gray-700 shadow-xl z-50">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                            setEditTaskData(task);
                            setIsEditModalOpen(true);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-[8px] font-bold uppercase tracking-widest hover:bg-brand-gray-50 dark:hover:bg-brand-gray-700 dark:text-brand-white cursor-pointer"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-[8px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-brand-gray-500 line-clamp-2">{task.description}</p>
                <div className="flex justify-between items-center pt-2 border-t border-brand-gray-50 dark:border-brand-gray-700">
                  <div className="flex items-center gap-2">
                    <Avatar src={assignee?.avatarUrl} name={assignee?.name ?? 'Unknown'} size="sm" />
                    <span className="text-[10px] font-bold dark:text-brand-gray-300">{assignee?.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-brand-gray-400">
                    <Clock size={10} />
                    {task.deadline}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-brand-black text-brand-white text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Task Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Assignee</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-100">
              {filteredTasks.map((task, index) => {
                const assignee = users.find(u => u.id === task.assignedTo);
                const creator = users.find(u => u.id === task.assignedBy);
                
                return (
                  <motion.tr 
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-brand-gray-50 dark:hover:bg-brand-gray-800 transition-colors group"
                  >
                    <td className="px-6 py-4 cursor-pointer group/task" onClick={() => {
                      setSelectedTask(task);
                      setIsDetailsModalOpen(true);
                    }}>
                      <div>
                        <p className="text-sm font-bold dark:text-brand-white group-hover/task:underline">{task.title}</p>
                        <p className="text-xs text-brand-gray-500 line-clamp-1">{task.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={task.status}
                        onChange={(e) => updateTask(task.id, { status: e.target.value as Status })}
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-widest px-2 py-1 border-none bg-transparent cursor-pointer",
                          task.status === 'completed' ? "bg-green-100 text-green-700" : 
                          task.status === 'in_progress' ? "bg-blue-100 text-blue-700" : 
                          task.status === 'reviewed' ? "bg-purple-100 text-purple-700" : 
                          "bg-brand-gray-200 text-brand-gray-700 dark:bg-brand-gray-700 dark:text-brand-gray-300"
                        )}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="reviewed">Reviewed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <AlertCircle size={14} className={cn(
                          task.priority === 'high' ? "text-red-500" : 
                          task.priority === 'medium' ? "text-yellow-500" : 
                          "text-blue-500"
                        )} />
                        <span className="text-xs font-medium capitalize dark:text-brand-gray-300">{task.priority}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-brand-gray-500">
                        <Clock size={14} />
                        {task.deadline}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold dark:text-brand-white">
                        <Avatar src={assignee?.avatarUrl} name={assignee?.name ?? 'Unknown'} size="sm" className="rounded-full" />
                        <div>
                          <p>{assignee?.name ?? 'Unknown'}</p>
                          <p className="text-[8px] text-brand-gray-400 uppercase tracking-tighter">By {creator?.name ?? 'System'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedTask(task);
                            setIsCommentsModalOpen(true);
                          }}
                          className="p-1 text-brand-gray-400 hover:text-brand-black dark:hover:text-brand-white transition-colors cursor-pointer"
                          title="Comments"
                        >
                          <Activity size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteTask(task)}
                          className="p-1 text-brand-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete Task"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                            className="p-1 hover:bg-brand-gray-200 dark:hover:bg-brand-gray-700 transition-colors dark:text-brand-gray-400 cursor-pointer"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {openMenuId === task.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-brand-gray-800 border border-brand-gray-200 dark:border-brand-gray-700 shadow-xl z-50">
                              <button 
                                onClick={() => {
                                  setSelectedTask(task);
                                  setEditTaskData(task);
                                  setIsEditModalOpen(true);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gray-50 dark:hover:bg-brand-gray-700 border-b border-brand-gray-100 dark:border-brand-gray-700 dark:text-brand-white cursor-pointer"
                              >
                                Edit Task
                              </button>
                              <button 
                                onClick={() => {
                                  updateTask(task.id, { status: 'completed' });
                                  toast.success('Task Completed');
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gray-50 dark:hover:bg-brand-gray-700 border-b border-brand-gray-100 dark:border-brand-gray-700 dark:text-brand-white cursor-pointer"
                              >
                                Mark as Completed
                              </button>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/tasks/${task.id}`);
                                  toast.success('Link Copied');
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gray-50 dark:hover:bg-brand-gray-700 dark:text-brand-white cursor-pointer"
                              >
                                Copy Task Link
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
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
          <div className="pt-4">
            <button type="submit" className="w-full btn-primary py-3 uppercase tracking-widest font-bold">
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        title={`Comments: ${selectedTask?.title}`}
      >
        <div className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 no-scrollbar">
            {taskComments.length === 0 ? (
              <div className="text-center py-12 text-brand-gray-400">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm font-medium">No comments yet. Start the conversation!</p>
              </div>
            ) : (
              taskComments.map((comment) => {
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
          
          <form onSubmit={handleAddComment} className="flex gap-2 pt-4 border-t border-brand-gray-100 dark:border-brand-gray-700">
            <input 
              type="text"
              placeholder="Write a comment..."
              className="input-field flex-1"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="btn-primary px-4 py-2">
              <Send size={18} />
            </button>
          </form>
        </div>
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
                  setIsDetailsModalOpen(false);
                  setEditTaskData(selectedTask);
                  setIsEditModalOpen(true);
                }}
                className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2"
              >
                <Plus size={16} className="rotate-45" />
                Edit Task
              </button>
              <button 
                onClick={() => {
                  handleDeleteTask(selectedTask);
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
    </div>
  );
};

export default Tasks;
