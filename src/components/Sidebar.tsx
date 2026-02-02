import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Library,
  ChevronDown,
  ChevronRight,
  Home,
  Settings,
  PanelLeftClose,
  Sparkles } from
'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  userRole: 'admin' | 'clinic';
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}
type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: {
    id: string;
    label: string;
  }[];
};
export function Sidebar({
  activeView,
  setActiveView,
  userRole,
  collapsed,
  setCollapsed
}: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    workspace: true,
    patients: true,
    library: true,
    ai: true,
    setup: true
  });
  const toggleSection = (section: string) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: <Home size={16} />
  },
  {
    id: 'workspace',
    label: 'Workspace',
    icon: <Briefcase size={16} />,
    children: [
    {
      id: 'companions',
      label: 'Companions'
    },
    {
      id: 'protocols',
      label: 'Protocols'
    }]

  },
  {
    id: 'patients',
    label: 'Patient Management',
    icon: <Users size={16} />,
    children: [
    {
      id: 'all-patients',
      label: 'All Patients'
    },
    // {
    //   id: 'patient-groups',
    //   label: 'Patient Groups'
    // }
  ]

  },
  {
    id: 'library',
    label: 'Library',
    icon: <Library size={16} />,
    children: [
    {
      id: 'ai-rules',
      label: 'AI Rules'
    },
    {
      id: 'plans',
      label: 'Plans'
    },
    {
      id: 'followups',
      label: 'Followups'
    },
    {
      id: 'knowledge-base',
      label: 'Knowledge Base'
    }]

  },
  {
    id: 'ai',
    label: 'AI System',
    icon: <Sparkles size={16} />,
    children: [
    {
      id: 'health-assistant',
      label: 'Health Assistant'
    },
    {
      id: 'conversations',
      label: 'Conversations'
    }]

  },
  {
    id: 'setup',
    label: 'Setup',
    icon: <Settings size={16} />,
    children: [
    {
      id: 'settings',
      label: 'Settings'
    },
    {
      id: 'users',
      label: 'Users'
    },
    {
      id: 'roles',
      label: 'Roles'
    }]

  }];

  if (collapsed) {
    return (
      <aside className="w-16 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-30">
        <div className="h-12 flex items-center justify-center border-b border-gray-100">
          <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
        </div>
        <nav className="flex-1 py-3 flex flex-col items-center gap-1">
          {navItems.slice(0, 5).map((item) =>
          <button
            key={item.id}
            onClick={() =>
            item.children ? toggleSection(item.id) : setActiveView(item.id)
            }
            className={`p-2.5 rounded-md transition-colors ${activeView === item.id || item.children?.some((c) => c.id === activeView) ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
            title={item.label}>

              {item.icon}
            </button>
          )}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => setCollapsed(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md w-full flex justify-center">

            <PanelLeftClose size={16} className="rotate-180" />
          </button>
        </div>
      </aside>);

  }
  return (
    <aside className="w-56 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-30">
      {/* Logo / App Switcher */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-xs">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 leading-tight">
              CRM
            </span>
            <span className="text-[10px] text-gray-400 leading-tight">
              MediCore
            </span>
          </div>
        </div>
        <ChevronDown size={14} className="text-gray-400" />
      </div>



      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const isExpanded = expanded[item.id];
          const hasChildren = item.children && item.children.length > 0;
          const isParentActive =
          hasChildren && item.children.some((c) => c.id === activeView);
          if (!hasChildren) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors ${activeView === item.id ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>

                {item.icon}
                {item.label}
              </button>);

          }
          return (
            <div key={item.id} className="space-y-0.5">
              <button
                onClick={() => toggleSection(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm transition-colors ${isParentActive ? 'text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>

                <div className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </div>
                <ChevronRight
                  size={12}
                  className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />

              </button>

              {isExpanded &&
              <div className="ml-6 space-y-0.5 border-l border-gray-100 pl-2">
                  {item.children?.map((child) =>
                <button
                  key={child.id}
                  onClick={() => setActiveView(child.id)}
                  className={`w-full flex items-center px-2.5 py-1.5 rounded-md text-sm transition-colors ${activeView === child.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>

                      {child.label}
                    </button>
                )}
                </div>
              }
            </div>);

        })}
      </nav>

      {/* Collapse Button */}
      <div className="px-3 py-2 border-t border-gray-100">
        <button
          onClick={() => setCollapsed(true)}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-md transition-colors">

          <PanelLeftClose size={14} />
          <span>Collapse</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=medicore"
            alt="User"
            className="h-8 w-8 rounded-full bg-gray-100" />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userRole === 'admin' ? 'Abhilasha' : 'Clinic Staff'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {userRole === 'admin' ? 'abhilasha@gm...' : 'staff@clinic.com'}
            </p>
          </div>
        </div>
      </div>
    </aside>);

}