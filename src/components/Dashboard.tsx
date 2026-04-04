import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  DollarSign, 
  LayoutDashboard,
  Zap,
  Target,
  Activity as ActivityIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../StoreContext';
import { StatWidget } from './dashboard/StatWidget';
import { ChartWidget } from './dashboard/ChartWidget';
import { ActivityWidget } from './dashboard/ActivityWidget';
import { ContextualWidget } from './dashboard/ContextualWidget';
import { TaskWidget } from './dashboard/TaskWidget';
import { PieChartWidget } from './dashboard/PieChartWidget';
import Modal from './Modal';
import { Status, Priority, Task } from '../types';
import { canAssignTask, canDeleteTask } from '../constants';
import { MessageSquare, Trash2, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import Avatar from './Avatar';
import { toast } from 'sonner';

const data = [
  { name: 'Jan', revenue: 4000, leads: 2400, tasks: 12 },
  { name: 'Feb', revenue: 3000, leads: 1398, tasks: 18 },
  { name: 'Mar', revenue: 2000, leads: 9800, tasks: 22 },
  { name: 'Apr', revenue: 2780, leads: 3908, tasks: 15 },
  { name: 'May', revenue: 1890, leads: 4800, tasks: 25 },
  { name: 'Jun', revenue: 2390, leads: 3800, tasks: 30 },
];

const Dashboard: React.FC = () => {
  const { stats, currentUser, tasks, users, addTask, updateTask, deleteTask, comments, addComment } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTaskData, setEditTaskData] = useState<Partial<Task>>({});
  const [commentText, setCommentText] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending' as Status,
    priority: 'medium' as Priority,
    deadline: '',
    assignedTo: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const myTasks = useMemo(() => {
    return tasks.filter(t => t.assignedTo === currentUser.id && t.status !== 'completed');
  }, [tasks, currentUser.id]);

  const departmentTasks = useMemo(() => {
    if (!currentUser.departmentId) return [];
    const deptUsers = users.filter(u => u.departmentId === currentUser.departmentId).map(u => u.id);
    return tasks.filter(t => deptUsers.includes(t.assignedTo) && t.status !== 'completed');
  }, [tasks, users, currentUser.departmentId]);

  const activities = [
    { name: 'Sarah Jenkins', action: 'New lead qualified: Global Logistics', time: '2 hours ago', avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png' },
    { name: 'Michael Chen', action: 'Task completed: Q3 Report', time: '4 hours ago', avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140039.png' },
    { name: 'Emma Wilson', action: 'New contact added: Tech Solutions', time: '5 hours ago', avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140051.png' },
    { name: 'David Miller', action: 'Lead status updated: BioTech Inc', time: '1 day ago', avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140043.png' },
    { name: 'Robert Brown', action: 'New order placed: Q2 Logistics', time: '2 days ago', avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140042.png' },
  ];

  const leadDistribution = [
    { name: 'Qualified', value: 45, color: '#000000' },
    { name: 'Contacted', value: 25, color: '#404040' },
    { name: 'Proposal', value: 20, color: '#737373' },
    { name: 'Negotiation', value: 10, color: '#a3a3a3' },
  ];

  const taskPriorityDistribution = [
    { name: 'High', value: 15, color: '#ef4444' },
    { name: 'Medium', value: 35, color: '#f59e0b' },
    { name: 'Low', value: 50, color: '#3b82f6' },
  ];

  const renderDashboard = () => {
    // Level 0-2: Executive & COO Associate View
    if (currentUser.roleLevel <= 2) {
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            <StatWidget label="Total Revenue" value={stats.totalRevenue} prefix="$" change="+12.5%" icon={DollarSign} positive={true} isLoading={isLoading} />
            <StatWidget label="Active Leads" value={stats.activeLeads} change="+5.2%" icon={TrendingUp} positive={true} isLoading={isLoading} />
            <StatWidget label="Completed Tasks" value={stats.completedTasks} change="-2.4%" icon={CheckCircle} positive={false} isLoading={isLoading} />
            <StatWidget label="Conversion Rate" value={stats.conversionRate} suffix="%" decimals={1} change="+1.2%" icon={Users} positive={true} isLoading={isLoading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <ChartWidget title={currentUser.roleLevel <= 1 ? "Global Revenue Growth" : "Operational Revenue Tracking"} data={data} type="area" dataKey="revenue" isLoading={isLoading} />
              <ChartWidget title="Lead Acquisition Velocity" data={data} type="bar" dataKey="leads" isLoading={isLoading} />
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <PieChartWidget title="Lead Pipeline Distribution" data={leadDistribution} isLoading={isLoading} />
                <PieChartWidget title="Task Priority Breakdown" data={taskPriorityDistribution} isLoading={isLoading} />
              </div>
            </div>
            <div className="space-y-8">
              <ContextualWidget department={currentUser.departmentId} isLoading={isLoading} />
              <ActivityWidget activities={activities} isLoading={isLoading} />
            </div>
          </div>
        </div>
      );
    }

    // Level 3: Department Head View
    if (currentUser.roleLevel === 3) {
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <StatWidget label="Dept. Active Tasks" value={departmentTasks.length} icon={Zap} isLoading={isLoading} />
            <StatWidget label="Dept. Completion Rate" value={78} suffix="%" change="+4%" icon={CheckCircle} positive={true} isLoading={isLoading} />
            <StatWidget label="Team Efficiency" value={92} suffix="%" change="+2%" icon={Target} positive={true} isLoading={isLoading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-3 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <PieChartWidget title="Departmental Priority Distribution" data={taskPriorityDistribution} isLoading={isLoading} />
                <ChartWidget title="Team Output Velocity" data={data} type="bar" dataKey="tasks" isLoading={isLoading} />
              </div>
              <TaskWidget 
                title="Departmental Workload" 
                tasks={departmentTasks.slice(0, 5)} 
                isLoading={isLoading} 
                onTaskClick={(task) => {
                  setSelectedTask(task);
                  setIsDetailsModalOpen(true);
                }}
                onEditClick={(task) => {
                  setSelectedTask(task);
                  setEditTaskData(task);
                  setIsEditModalOpen(true);
                }}
                onDeleteClick={(task) => {
                  if (canDeleteTask(currentUser, task)) {
                    deleteTask(task.id);
                    toast.success('Task Deleted');
                  } else {
                    toast.error('Access Denied');
                  }
                }}
                onCompleteClick={(task) => {
                  updateTask(task.id, { status: 'completed' });
                  toast.success('Task Completed');
                }}
              />
            </div>
            <div className="space-y-8">
              <ContextualWidget department={currentUser.departmentId} isLoading={isLoading} />
              <ActivityWidget activities={activities.slice(0, 3)} isLoading={isLoading} />
            </div>
          </div>
        </div>
      );
    }

    // Level 4-5: Associate View
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <StatWidget label="My Pending Tasks" value={myTasks.length} icon={ActivityIcon} isLoading={isLoading} />
          <StatWidget label="Tasks Due This Week" value={myTasks.filter(t => new Date(t.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length} icon={LayoutDashboard} isLoading={isLoading} />
          <StatWidget label="My Efficiency" value={85} suffix="%" icon={Target} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <ChartWidget title="My Task Completion Trend" data={data} type="area" dataKey="tasks" isLoading={isLoading} />
              <PieChartWidget title="My Task Priorities" data={taskPriorityDistribution} isLoading={isLoading} />
            </div>
            <TaskWidget 
              title="My Command Center" 
              tasks={myTasks} 
              isLoading={isLoading} 
              onTaskClick={(task) => {
                setSelectedTask(task);
                setIsDetailsModalOpen(true);
              }}
              onEditClick={(task) => {
                setSelectedTask(task);
                setEditTaskData(task);
                setIsEditModalOpen(true);
              }}
              onDeleteClick={(task) => {
                if (canDeleteTask(currentUser, task)) {
                  deleteTask(task.id);
                  toast.success('Task Deleted');
                } else {
                  toast.error('Access Denied');
                }
              }}
              onCompleteClick={(task) => {
                updateTask(task.id, { status: 'completed' });
                toast.success('Task Completed');
              }}
            />
          </div>
          <div className="space-y-8">
            <ContextualWidget department={currentUser.departmentId} isLoading={isLoading} />
            <ActivityWidget activities={activities.slice(0, 3)} isLoading={isLoading} />
          </div>
        </div>
      </div>
    );
  };

  const handleDownloadReport = () => {
    toast.info('Generating Report', {
      description: 'Your executive summary is being compiled. Download will start shortly.'
    });

    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Metric,Value,Change\n"
        + `Total Revenue,${stats.totalRevenue},+12.5%\n`
        + `Active Leads,${stats.activeLeads},+5.2%\n`
        + `Completed Tasks,${stats.completedTasks},-2.4%\n`
        + `Conversion Rate,${stats.conversionRate}%,+1.2%`;
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `VERTIS_Executive_Summary_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Report Downloaded', {
        description: 'The executive summary has been saved to your device.'
      });
    }, 2000);
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

  return (
    <div className="p-4 md:p-8 space-y-8 overflow-y-auto h-full bg-brand-gray-50 dark:bg-brand-gray-900 pb-12 transition-colors duration-300">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase font-display">
            {currentUser.roleLevel <= 1 ? 'Global Overview' : 
             currentUser.roleLevel === 2 ? 'Operational Hub' :
             currentUser.roleLevel === 3 ? `${currentUser.departmentId} Hub` : 
             'My Command Center'}
          </h2>
          <p className="text-brand-gray-500 font-medium text-sm md:text-base">
            {currentUser.roleLevel <= 1 ? `Welcome back, ${currentUser.name.split(' ')[0]}. Here's the global pulse.` : 
             currentUser.roleLevel === 2 ? `Overseeing strategic operations and C-Suite support.` :
             currentUser.roleLevel === 3 ? `Managing the ${currentUser.departmentId} team today.` : 
             `Focusing on your objectives for today.`}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={handleDownloadReport} className="btn-secondary flex-1 md:flex-none">Download Report</button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex-1 md:flex-none flex items-center justify-center gap-2">
            <Plus size={18} />
            Add New Task
          </button>
        </div>
      </header>

      {renderDashboard()}

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
                <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
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
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Task"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          if (selectedTask) {
            updateTask(selectedTask.id, editTaskData);
            toast.success('Task Updated');
            setIsEditModalOpen(false);
          }
        }} className="space-y-4">
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
                value={editTaskData.priority}
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
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 block mb-1">Status</label>
            <select 
              className="input-field"
              value={editTaskData.status}
              onChange={(e) => setEditTaskData({ ...editTaskData, status: e.target.value as Status })}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="reviewed">Reviewed</option>
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

export default Dashboard;
