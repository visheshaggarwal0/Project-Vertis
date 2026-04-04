import React from 'react';
import Avatar from '../Avatar';
import Skeleton from '../Skeleton';

interface Activity {
  name: string;
  action: string;
  time: string;
  avatar?: string;
}

interface ActivityWidgetProps {
  activities: Activity[];
  isLoading?: boolean;
}

export const ActivityWidget: React.FC<ActivityWidgetProps> = ({ activities, isLoading }) => {
  return (
    <div className="glass-card p-6 h-full">
      <h3 className="text-sm font-bold uppercase tracking-widest mb-6 dark:text-brand-white">Recent Activity</h3>
      <div className="space-y-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-brand-gray-100 dark:border-brand-gray-700 last:border-0">
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="w-10 h-10 shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-4 w-20 ml-4" />
            </div>
          ))
        ) : (
          activities.map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-brand-gray-100 dark:border-brand-gray-700 last:border-0 gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Avatar src={activity.avatar} name={activity.name} size="md" className="shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold dark:text-brand-white truncate" title={activity.action}>{activity.action}</p>
                  <p className="text-xs text-brand-gray-500 dark:text-brand-gray-400 truncate">{activity.time} by {activity.name}</p>
                </div>
              </div>
              <button className="text-[10px] font-bold uppercase tracking-widest hover:underline dark:text-brand-white shrink-0">View</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
