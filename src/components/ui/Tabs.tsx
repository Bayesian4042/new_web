import React, { useState, createContext, useContext } from 'react';
interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}
interface TabsContextType {
  value: string;
  setValue: (value: string) => void;
}
const TabsContext = createContext<TabsContextType | undefined>(undefined);
export function Tabs({ defaultValue, children, className = '' }: TabsProps) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider
      value={{
        value,
        setValue
      }}>

      <div className={className}>{children}</div>
    </TabsContext.Provider>);

}
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}
export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500 ${className}`}>

      {children}
    </div>);

}
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}
export function TabsTrigger({
  value,
  children,
  className = ''
}: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');
  const isActive = context.value === value;
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'hover:bg-gray-200 hover:text-gray-900'} ${className}`}
      onClick={() => context.setValue(value)}>

      {children}
    </button>);

}
interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}
export function TabsContent({
  value,
  children,
  className = ''
}: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');
  if (context.value !== value) return null;
  return (
    <div
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className}`}>

      {children}
    </div>);

}