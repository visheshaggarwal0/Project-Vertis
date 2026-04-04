import React from 'react';
import { Task } from '../../types';
import Skeleton from '../Skeleton';
import { Clock, AlertCircle, MoreVertical, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TaskWidgetProps {
  tasks: Task[];
  isLoading?: boolean;
  title?: string;
  onTaskClick?: (task: Task) => void;
  onEditClick?: (task: Task) => void;
  onDeleteClick?: (task: Task) => void;
  onCompleteClick?: (task: Task) => void;
}

export const TaskWidget: React.FC<TaskWidgetProps> = ({ 
  tasks, 
  isLoading, 
  title = "My Tasks", 
  onTaskClick,
  onEditClick,
  onDeleteClick,
  onCompleteClick
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div className="glass-card p-6 h-full">
      <h3 className="text-sm font-bold uppercase tracking-widest mb-6">{title}</h3>
      <div className="space-y-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-brand-gray-100 last:border-0">
              <Skeleton className="w-2 h-10 shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-brand-gray-500 font-bold uppercase tracking-widest">No pending tasks</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-4 py-3 border-b border-brand-gray-100 dark:border-brand-gray-800 last:border-0 group relative">
              <div className={cn(
                "w-1 h-10 shrink-0",
                task.priority === 'high' ? "bg-red-500" : 
                task.priority === 'medium' ? "bg-yellow-500" : "bg-brand-gray-300 dark:bg-brand-gray-700"
              )} />
              <div className="flex-1 min-w-0">
                <p 
                  className="text-sm font-bold group-hover:underline cursor-pointer truncate dark:text-brand-white"
                  onClick={() => onTaskClick?.(task)}
                >
                  {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-[10px] text-brand-gray-500 font-bold uppercase">
                    <Clock size={10} />
                    {new Date(task.deadline).toLocaleDateString()}
                  </div>
                  {task.priority === 'high' && (
                    <div className="flex items-center gap-1 text-[10px] text-red-600 font-bold uppercase">
                      <AlertCircle size={10} />
                      Urgent
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onTaskClick?.(task)}
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-brand-gray-200 dark:border-brand-gray-700 hover:bg-brand-black hover:text-white dark:hover:bg-brand-white dark:hover:text-brand-black transition-colors dark:text-brand-white"
                >
                  Open
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === task.id ? null : task.id)}
                    className="p-1 text-brand-gray-400 hover:text-brand-black dark:hover:text-brand-white transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  <AnimatePresence>
                    {activeMenu === task.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setActiveMenu(null)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-0 top-full mt-2 w-40 bg-brand-white dark:bg-brand-black border border-brand-gray-100 dark:border-brand-gray-800 shadow-xl z-20"
                        >
                          <button 
                            onClick={() => {
                              onEditClick?.(task);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gray-50 dark:hover:bg-brand-gray-900 transition-colors dark:text-brand-white"
                          >
                            <Edit2 size={14} />
                            Edit Task
                          </button>
                          <button 
                            onClick={() => {
                              onCompleteClick?.(task);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gray-50 dark:hover:bg-brand-gray-900 transition-colors dark:text-brand-white"
                          >
                            <CheckCircle size={14} />
                            Complete
                          </button>
                          <button 
                            onClick={() => {
                              onDeleteClick?.(task);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
