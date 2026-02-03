import {
  FolderOpen,
  Shield,
  User
} from 'lucide-react';

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
        <button
          onClick={() => setUserRole(userRole === 'admin' ? 'clinic' : 'admin')}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
          title="Toggle User Role"
        >
          {userRole === 'admin' ? <Shield size={14} /> : <User size={14} />}
          <span>{userRole === 'admin' ? 'Super Admin' : 'Clinic'}</span>
        </button>
      </div>
    </header>
  );
}