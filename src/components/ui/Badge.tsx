import React from 'react';
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning';
}
export function Badge({
  className = '',
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-blue-100 text-blue-700 border-transparent',
    secondary: 'bg-gray-100 text-gray-900 border-transparent',
    outline: 'text-gray-900 border-gray-200',
    success: 'bg-green-100 text-green-700 border-transparent',
    warning: 'bg-yellow-100 text-yellow-800 border-transparent'
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}>

      {children}
    </span>);

}