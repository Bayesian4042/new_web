import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}
export function Input({ className = '', icon, ...props }: InputProps) {
  return (
    <div className="relative flex items-center w-full">
      {icon &&
      <div className="absolute left-3 text-gray-500 pointer-events-none">
          {icon}
        </div>
      }
      <input
        className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${icon ? 'pl-10' : ''} ${className}`}
        {...props} />

    </div>);

}