import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import Skeleton from '../Skeleton';
import { useStore } from '../../StoreContext';

interface ChartWidgetProps {
  title: string;
  data: any[];
  type: 'area' | 'bar';
  dataKey: string;
  isLoading?: boolean;
  color?: string;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  data,
  type,
  dataKey,
  isLoading,
  color: customColor
}) => {
  const { theme } = useStore();
  const color = customColor || (theme === 'dark' ? '#fff' : '#000');
  const gridColor = theme === 'dark' ? '#262626' : '#f1f1f1';
  const tickColor = theme === 'dark' ? '#a3a3a3' : '#737373';
  const tooltipBg = theme === 'dark' ? '#fff' : '#000';
  const tooltipText = theme === 'dark' ? '#000' : '#fff';

  return (
    <div className="glass-card p-6 h-full">
      <h3 className="text-sm font-bold uppercase tracking-widest mb-6 dark:text-brand-white">{title}</h3>
      <div className="h-[250px] w-full">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: tickColor }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: tickColor }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: tooltipBg, 
                    border: 'none', 
                    borderRadius: '0',
                    color: tooltipText 
                  }}
                  itemStyle={{ color: tooltipText }}
                />
                <Area 
                  type="monotone" 
                  dataKey={dataKey} 
                  stroke={color} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill={`url(#color-${dataKey})`} 
                />
              </AreaChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: tickColor }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: tickColor }} 
                />
                <Tooltip 
                  cursor={{ fill: theme === 'dark' ? '#262626' : '#f9f9f9' }}
                  contentStyle={{ 
                    backgroundColor: tooltipBg, 
                    border: 'none', 
                    borderRadius: '0',
                    color: tooltipText 
                  }}
                />
                <Bar dataKey={dataKey} fill={color} radius={[0, 0, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
