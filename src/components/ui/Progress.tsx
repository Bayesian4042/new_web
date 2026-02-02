import React from 'react';
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
}
export function Progress({
  className = '',
  value,
  max = 100,
  variant = 'default',
  showLabel = false,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max(value / max * 100, 0), 100);
  const variantStyles = {
    default: 'bg-blue-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };
  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel &&
      <div className="flex justify-between mb-1 text-xs text-gray-500">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      }
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full transition-all duration-500 ease-in-out ${variantStyles[variant]}`}
          style={{
            width: `${percentage}%`
          }} />

      </div>
    </div>);

}