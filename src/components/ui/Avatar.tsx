import React from 'react';
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
export function Avatar({
  className = '',
  src,
  alt,
  fallback,
  size = 'md',
  ...props
}: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg'
  };
  return (
    <div
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full ${sizeClasses[size]} ${className}`}
      {...props}>

      {src ?
      <img
        src={src}
        alt={alt || fallback}
        className="aspect-square h-full w-full object-cover" /> :


      <div className="flex h-full w-full items-center justify-center bg-blue-100 font-medium text-blue-700">
          {fallback.slice(0, 2).toUpperCase()}
        </div>
      }
    </div>);

}