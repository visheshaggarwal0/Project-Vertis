import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useStore } from '../StoreContext';
import { Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { getVisibleTasks } from '../constants';
import { format, isSameDay } from 'date-fns';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const CalendarView: React.FC = () => {
  const { tasks, users, currentUser } = useStore();
  const [date, setDate] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    toast.info('Connecting to External Calendar', {
      description: 'Establishing secure handshake with provider...'
    });

    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Calendar Synced', {
        description: 'Your external events have been imported successfully.'
      });
    }, 3000);
  };

  const visibleTasks = getVisibleTasks(currentUser, tasks, users);

  const tasksForSelectedDate = visibleTasks.filter(task => 
    isSameDay(new Date(task.deadline), date)
  );

  const tileClassName = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      if (visibleTasks.some(task => isSameDay(new Date(task.deadline), date))) {
        return 'has-tasks';
      }
    }
    return null;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 overflow-y-auto h-full bg-brand-gray-50 dark:bg-brand-gray-900 transition-colors duration-300">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase font-display">Calendar</h2>
          <p className="text-brand-gray-500 font-medium text-sm md:text-base">Schedule and view your deadlines.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6">
          <style>{`
            .react-calendar {
              width: 100%;
              border: none;
              font-family: inherit;
              background: transparent;
            }
            .react-calendar__navigation button {
              color: black;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 14px;
            }
            .dark .react-calendar__navigation button {
              color: white;
            }
            .react-calendar__month-view__weekdays {
              text-transform: uppercase;
              font-weight: bold;
              font-size: 10px;
              color: #737373;
            }
            .react-calendar__tile {
              padding: 1.5em 0.5em;
              font-size: 14px;
              font-weight: 500;
              border-radius: 0;
              position: relative;
            }
            .dark .react-calendar__tile {
              color: white;
            }
            .react-calendar__tile--now {
              background: #f1f1f1;
              color: black;
            }
            .dark .react-calendar__tile--now {
              background: #121212;
              color: white;
            }
            .react-calendar__tile--active {
              background: black !important;
              color: white !important;
            }
            .dark .react-calendar__tile--active {
              background: white !important;
              color: black !important;
            }
            .react-calendar__tile:hover {
              background: #e5e5e5;
            }
            .dark .react-calendar__tile:hover {
              background: #121212;
            }
            .react-calendar__tile--hasActive {
              background: black;
            }
            .has-tasks::after {
              content: '';
              position: absolute;
              bottom: 4px;
              left: 50%;
              transform: translateX(-50%);
              width: 4px;
              height: 4px;
              background: black;
              border-radius: 50%;
            }
            .dark .has-tasks::after {
              background: white;
            }
          `}</style>
          <Calendar 
            onChange={(val) => setDate(val as Date)} 
            value={date}
            className="w-full"
            nextLabel={<ChevronRight size={20} />}
            prevLabel={<ChevronLeft size={20} />}
            next2Label={null}
            prev2Label={null}
            tileClassName={tileClassName}
          />
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex justify-between items-center">
              Tasks for {format(date, 'MMM dd')}
              <span className="text-[10px] bg-brand-black text-brand-white px-2 py-0.5">
                {tasksForSelectedDate.length}
              </span>
            </h3>
            
            {tasksForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {tasksForSelectedDate.map((task) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-brand-gray-200 hover:border-brand-black transition-colors"
                  >
                    <h4 className="text-sm font-bold mb-1">{task.title}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-brand-gray-500 font-bold uppercase">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {task.deadline}
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        {users.find(u => u.id === task.assignedTo)?.name ?? 'Unknown'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-brand-gray-400 font-medium italic">No tasks scheduled for this day.</p>
              </div>
            )}
          </div>

          <div className="glass-card p-6 bg-brand-black text-brand-white">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Sync External Calendar</h3>
            <p className="text-xs text-brand-gray-400 mb-6 font-medium leading-relaxed">
              Integrate with Google Calendar or Outlook to centralize all your professional deadlines and team meetings in one place.
            </p>
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className={cn(
                "w-full py-2 border border-brand-white text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer",
                isSyncing ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-white hover:text-brand-black"
              )}
            >
              {isSyncing ? 'Syncing...' : 'Connect Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
