import React, { useState, useEffect } from 'react';
import { animate } from 'motion/react';
import Skeleton from '../Skeleton';

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const CountUp: React.FC<CountUpProps> = ({ value, prefix = '', suffix = '', decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(latest)
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

interface StatWidgetProps {
  label: string;
  value: number;
  icon: React.ElementType;
  change?: string;
  positive?: boolean;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  isLoading?: boolean;
}

export const StatWidget: React.FC<StatWidgetProps> = ({
  label,
  value,
  icon: Icon,
  change,
  positive,
  prefix,
  suffix,
  decimals,
  isLoading
}) => {
  return (
    <div className="glass-card p-6 border-l-4 border-l-brand-black dark:border-l-brand-white">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-brand-gray-100 dark:bg-brand-gray-700 rounded-none transition-colors">
          <Icon size={20} className="text-brand-black dark:text-brand-white" />
        </div>
        {change && (
          <div className={`flex items-center text-xs font-bold ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {change}
            {positive ? <span className="ml-0.5">↑</span> : <span className="ml-0.5">↓</span>}
          </div>
        )}
      </div>
      <h3 className="text-brand-gray-500 dark:text-brand-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</h3>
      <div className="text-2xl font-bold tracking-tight dark:text-brand-white">
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <CountUp value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
        )}
      </div>
    </div>
  );
};
