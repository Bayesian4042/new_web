import React from 'react';
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}
export function Card({
  className = '',
  noPadding = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}
      {...props}>

      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>);

}
export function CardHeader({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex flex-col space-y-1.5 p-6 pb-0 ${className}`}
      {...props}>

      {children}
    </div>);

}
export function CardTitle({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`font-semibold leading-none tracking-tight text-lg ${className}`}
      {...props}>

      {children}
    </h3>);

}
export function CardContent({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-4 ${className}`} {...props}>
      {children}
    </div>);

}