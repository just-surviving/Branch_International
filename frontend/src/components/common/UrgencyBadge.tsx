import React from 'react';
import type { UrgencyLevel } from '../../types';
import { URGENCY_COLORS } from '../../utils/constants';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const icons = {
  CRITICAL: AlertTriangle,
  HIGH: AlertCircle,
  MEDIUM: Info,
  LOW: CheckCircle,
};

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
  lg: 'text-sm px-3 py-1.5',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
};

const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  level,
  showIcon = true,
  size = 'md',
}) => {
  // Handle undefined or invalid urgency levels
  if (!level || !URGENCY_COLORS[level]) {
    return null;
  }

  const colors = URGENCY_COLORS[level];
  const Icon = icons[level];

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]}`}
    >
      {showIcon && Icon && <Icon className={iconSizes[size]} />}
      {level}
    </span>
  );
};

export default UrgencyBadge;
