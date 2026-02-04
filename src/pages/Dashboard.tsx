import React from 'react';
import {
  Users,
  FileText,
  Activity,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

export function Dashboard() {
  const stats = [
    {
      label: 'Total Patients',
      value: '1,284',
      icon: Users,
      trend: '+12%',
      color: 'blue'
    },
    {
      label: 'Active Protocols',
      value: '42',
      icon: FileText,
      trend: '+5%',
      color: 'indigo'
    },
    {
      label: 'Conversations',
      value: '856',
      icon: Activity,
      trend: '+8%',
      color: 'emerald'
    }
  ];

  const shortcuts = [
    {
      label: 'Patients',
      icon: Users,
      path: 'all-patients',
      description: 'Manage patient records'
    },
    {
      label: 'Protocols',
      icon: FileText,
      path: 'protocols',
      description: 'View & edit protocols'
    },
    {
      label: 'Companions',
      icon: Activity,
      path: 'companions',
      description: 'AI companion settings'
    },
    {
      label: 'AI Rules',
      icon: FileText,
      path: 'ai-rules',
      description: 'Configure reasoning'
    }
  ];

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Hero Section / Welcome (Optional, or just start with Stats) */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, Abhilasha</h2>
        <p className="text-gray-500 mt-1">Here's what's happening in your clinic today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">
                    {stat.value}
                  </p>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 flex items-center gap-0.5`}>
                    <ArrowUpRight size={12} />
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className={`h-10 w-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={20} className={`text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Quick Access</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shortcuts.map((item, i) => (
            <button
              key={i}
              className="group flex flex-col items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 text-left h-full"
            >
              <div className="flex items-center justify-between w-full">
                  <div className="h-10 w-10 rounded-lg bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                  <item.icon size={20} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {item.label}
                </span>
                <span className="text-xs text-gray-500 mt-0.5 block">
                  {item.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}