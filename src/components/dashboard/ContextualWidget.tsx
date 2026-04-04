import React from 'react';
import { 
  Server, 
  Shield, 
  Palette, 
  Globe, 
  FlaskConical, 
  BarChart3, 
  Briefcase,
  Clock,
  AlertTriangle,
  FileText,
  Zap,
  Target
} from 'lucide-react';
import { DepartmentName } from '../../types';
import Skeleton from '../Skeleton';

interface ContextualWidgetProps {
  department?: string;
  isLoading?: boolean;
}

export const ContextualWidget: React.FC<ContextualWidgetProps> = ({ department, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-card p-6 h-full">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (department) {
      case 'Digital Infrastructure':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest">System Uptime</h3>
              <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                99.98% Operational
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-brand-gray-100 dark:bg-brand-gray-800 transition-colors">
                <p className="text-[10px] text-brand-gray-500 dark:text-brand-gray-400 uppercase font-bold mb-1">Active Servers</p>
                <p className="text-xl font-bold dark:text-brand-white">124</p>
              </div>
              <div className="p-4 bg-brand-gray-100 dark:bg-brand-gray-800 transition-colors">
                <p className="text-[10px] text-brand-gray-500 dark:text-brand-gray-400 uppercase font-bold mb-1">Avg Latency</p>
                <p className="text-xl font-bold dark:text-brand-white">24ms</p>
              </div>
            </div>
            <div className="mt-6 p-4 border border-brand-gray-200 dark:border-brand-gray-700">
              <div className="flex items-center gap-3">
                <Server size={18} className="text-brand-gray-400" />
                <div>
                  <p className="text-xs font-bold dark:text-brand-white">Main Cluster Node-04</p>
                  <p className="text-[10px] text-brand-gray-500 dark:text-brand-gray-400">Maintenance scheduled in 4h</p>
                </div>
              </div>
            </div>
          </>
        );
      case 'Legal & IP':
        return (
          <>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 dark:text-brand-white">IP Portfolio Status</h3>
            <div className="space-y-4">
              {[
                { label: 'Patent Filings', count: 12, status: 'active' },
                { label: 'Trademark Renewals', count: 5, status: 'pending' },
                { label: 'Contract Reviews', count: 8, status: 'urgent' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-brand-gray-100 dark:bg-brand-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield size={16} className="text-brand-gray-400" />
                    <span className="text-xs font-bold dark:text-brand-white">{item.label}</span>
                  </div>
                  <span className={`text-xs font-bold ${item.status === 'urgent' ? 'text-red-600 dark:text-red-400' : 'text-brand-black dark:text-brand-white'}`}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </>
        );
      case 'Digital Engagement & Design':
        return (
          <>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 dark:text-brand-white">Design Review Queue</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-brand-gray-200 dark:bg-brand-gray-700 relative group overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/design${i}/200/200`} 
                    alt="Asset" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Palette size={16} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-brand-black dark:border-brand-white hover:bg-brand-black dark:hover:bg-brand-white hover:text-white dark:hover:text-brand-black transition-colors dark:text-brand-white">
              View All Assets
            </button>
          </>
        );
      case 'Global Alliance & Advocacy':
        return (
          <>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 dark:text-brand-white">Partner Engagement</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-brand-gray-400" />
                  <span className="text-xs font-bold dark:text-brand-white">Global Reach</span>
                </div>
                <span className="text-xs font-bold dark:text-brand-white">42 Countries</span>
              </div>
              <div className="h-2 bg-brand-gray-200 dark:bg-brand-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-brand-black dark:bg-brand-white w-[75%]" />
              </div>
              <p className="text-[10px] text-brand-gray-500 dark:text-brand-gray-400">75% of Q2 outreach targets met</p>
            </div>
          </>
        );
      case 'R&D':
        return (
          <>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 dark:text-brand-white">Sprint Velocity</h3>
            <div className="flex items-end gap-2 h-32 mb-4">
              {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-brand-black/10 dark:bg-brand-white/10 hover:bg-brand-black dark:hover:bg-brand-white transition-colors"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FlaskConical size={16} className="text-brand-gray-400" />
                <span className="text-xs font-bold dark:text-brand-white">Current Sprint</span>
              </div>
              <span className="text-xs font-bold dark:text-brand-white">84% Done</span>
            </div>
          </>
        );
      case 'Business Research & Analysis':
        return (
          <>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 dark:text-brand-white">Market Insights</h3>
            <div className="space-y-3">
              {[
                { trend: 'AI Integration', impact: 'High', color: 'text-green-600 dark:text-green-400' },
                { trend: 'Remote Work Tech', impact: 'Medium', color: 'text-yellow-600 dark:text-yellow-400' },
                { trend: 'Data Privacy', impact: 'Critical', color: 'text-red-600 dark:text-red-400' },
              ].map((item, i) => (
                <div key={i} className="p-3 border border-brand-gray-100 dark:border-brand-gray-700 flex justify-between items-center bg-brand-gray-50 dark:bg-brand-gray-800 transition-colors">
                  <span className="text-xs font-bold dark:text-brand-white">{item.trend}</span>
                  <span className={`text-[10px] font-bold uppercase ${item.color}`}>{item.impact}</span>
                </div>
              ))}
            </div>
          </>
        );
      case 'Executives':
      default:
        return (
          <>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 dark:text-brand-white">Strategic Goals</h3>
            <div className="space-y-4">
              {[
                { goal: 'Market Expansion', progress: 65 },
                { goal: 'Operational Efficiency', progress: 82 },
                { goal: 'Talent Retention', progress: 45 },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase dark:text-brand-gray-300">
                    <span>{item.goal}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-brand-gray-200 dark:bg-brand-gray-700">
                    <div 
                      className="h-full bg-brand-black dark:bg-brand-white transition-all duration-1000" 
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div className="glass-card p-6 h-full border-t-4 border-t-brand-black">
      {renderContent()}
    </div>
  );
};
