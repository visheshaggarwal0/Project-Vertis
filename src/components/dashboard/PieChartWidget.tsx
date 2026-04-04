import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { cn } from '../../lib/utils';

interface PieChartWidgetProps {
  title: string;
  data: { name: string; value: number; color: string }[];
  isLoading?: boolean;
}

export const PieChartWidget: React.FC<PieChartWidgetProps> = ({ title, data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-card p-6 h-[350px] animate-pulse">
        <div className="h-4 w-32 bg-brand-gray-200 dark:bg-brand-gray-700 mb-6" />
        <div className="h-48 w-48 rounded-full bg-brand-gray-200 dark:bg-brand-gray-700 mx-auto" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6 h-[350px] flex flex-col">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500 mb-6">{title}</h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#000', 
                border: 'none', 
                borderRadius: '0px',
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-500">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
