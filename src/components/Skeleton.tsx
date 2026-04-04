import React from 'react';
import { cn } from '../lib/utils';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div 
      className={cn(
        "animate-pulse bg-brand-gray-200 rounded-none",
        className
      )} 
    />
  );
};

export default Skeleton;
