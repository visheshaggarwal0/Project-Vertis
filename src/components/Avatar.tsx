import React from 'react';
import { cn } from '../lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ src, name, className, size = 'md' }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-lg',
  };

  // If no src, use a placeholder service for a "real" avatar look if desired, 
  // or just stick to initials which is already "placeholder-like".
  // The user asked for a "placeholder avatar", which often implies an image.
  const placeholderUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

  return (
    <div 
      className={cn(
        "relative flex shrink-0 overflow-hidden bg-brand-gray-200 font-bold items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <img
        src={src || placeholderUrl}
        alt={name}
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover"
        onError={(e) => {
          // Fallback to placeholder if the provided src fails
          (e.target as HTMLImageElement).src = placeholderUrl;
        }}
      />
    </div>
  );
};

export default Avatar;
