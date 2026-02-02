import React from 'react';
import {
  MoreHorizontal,
  Plus,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Button } from './ui/Button';
interface HeaderProps {
  title: string;
  breadcrumb?: string;
  userRole: 'admin' | 'clinic';
  setUserRole: (role: 'admin' | 'clinic') => void;
  onAddClick?: () => void;
  showAdminToggle?: boolean;
  showAddButton?: boolean;
}

export function Header({
  title,
  breadcrumb,
  userRole,
  setUserRole,
  onAddClick,
  showAdminToggle = true,
  showAddButton = true
}: HeaderProps) {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm transition-all duration-200">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-3 text-sm">
        <div className="bg-blue-50 p-1.5 rounded-lg">
          <FolderOpen size={18} className="text-blue-600" />
        </div>
        <div className="flex items-center gap-2">
            {breadcrumb && (
                <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-500 font-medium">{breadcrumb}</span>
                </>
            )}
            <span className="text-gray-400">/</span>
            <span className="font-semibold text-gray-900 tracking-tight">{title}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Role Switcher (Demo) */}

        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all duration-200">
          <RefreshCw size={18} />
        </button>

        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all duration-200">
          <MoreHorizontal size={18} />
        </button>

        {showAddButton && (
          <Button
            size="sm"
            className="h-9 gap-2 bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 px-4 rounded-lg transition-all duration-200"
            onClick={onAddClick}
          >
            <Plus size={16} />
            <span className="font-medium">Add {title}</span>
          </Button>
        )}
      </div>
    </header>
  );
}