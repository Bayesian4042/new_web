import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import {
    Search,
    Filter,
    Plus,
    Mail,
    Trash2,
    Edit2,
    Shield,
    ShieldCheck,
    X,
    ChevronDown,
    ArrowUpDown
} from 'lucide-react';
import { createPortal } from 'react-dom';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'Clinic Admin' | 'Clinic Staff';
    status: 'Active' | 'Inactive';
    lastActive: string;
}

const initialUsers: User[] = [
    {
        id: 'USR-001',
        name: 'Dr. Sarah Smith',
        email: 'sarah.smith@clinic.com',
        role: 'Clinic Admin',
        status: 'Active',
        lastActive: '2 mins ago'
    },
    {
        id: 'USR-002',
        name: 'John Doe',
        email: 'john.doe@clinic.com',
        role: 'Clinic Staff',
        status: 'Active',
        lastActive: '1 hour ago'
    },
    {
        id: 'USR-003',
        name: 'Emma Wilson',
        email: 'emma.wilson@clinic.com',
        role: 'Clinic Staff',
        status: 'Inactive',
        lastActive: '2 days ago'
    }
];

export function Users() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Clinic Staff' as 'Clinic Admin' | 'Clinic Staff'
    });

    const handleOpenDrawer = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                role: 'Clinic Staff'
            });
        }
        setIsDrawerOpen(true);
    };

    const handleSave = () => {
        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
        } else {
            const newUser: User = {
                id: `USR-${Math.floor(Math.random() * 1000)}`,
                ...formData,
                status: 'Active',
                lastActive: 'Just now'
            };
            setUsers([...users, newUser]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Users</h1>
                    <p className="text-gray-500 mt-1">Manage clinic staff and their roles</p>
                </div>
                <Button onClick={() => handleOpenDrawer()} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                    <Plus size={16} className="mr-2" />
                    Add User
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex-1 relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-9 pr-4 py-2 text-sm border-none focus:ring-0 text-gray-900 placeholder-gray-400"
                    />
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Filter size={16} />
                    <span>Filter</span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="w-10 py-3 px-3">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                                />
                            </th>
                            <th className="py-3 px-3 text-left">
                                <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                                    Name
                                    <ArrowUpDown size={12} />
                                </button>
                            </th>
                            <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                                Email
                            </th>
                            <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                                Role
                            </th>
                            <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                                Last Active
                            </th>
                            <th className="py-3 px-3 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                onClick={() => handleOpenDrawer(user)}
                                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer"
                            >
                                <td className="py-3 px-3">
                                    <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                                    />
                                </td>
                                <td className="py-3 px-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 text-xs">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-3">
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <Mail size={14} className="text-gray-400" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-3">
                                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${user.role === 'Clinic Admin'
                                        ? 'bg-purple-50 text-purple-700'
                                        : 'bg-blue-50 text-blue-700'
                                        }`}>
                                        {user.role === 'Clinic Admin' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                                        {user.role}
                                    </div>
                                </td>
                                <td className="py-3 px-3">
                                    <span className="text-sm text-gray-600">{user.lastActive}</span>
                                </td>
                                <td className="py-3 px-3">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleOpenDrawer(user); }}
                                            className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                                            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Side Drawer - Portaled to document.body to avoid z-index/clipping issues */}
            {isDrawerOpen && createPortal(
                <>
                    <div
                        className="fixed inset-0 bg-black/20 z-[100] transition-opacity backdrop-blur-sm"
                        onClick={() => setIsDrawerOpen(false)}
                    />
                    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                            <h3 className="font-bold text-gray-900 text-lg">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h3>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-sm"
                                        placeholder="e.g. Dr. Sarah Smith"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-sm"
                                        placeholder="e.g. sarah@clinic.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        Role
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-sm appearance-none"
                                        >
                                            <option value="Clinic Staff">Clinic Staff</option>
                                            <option value="Clinic Admin">Clinic Admin</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Admins have full access to settings and user management.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <Button onClick={handleSave} className="bg-gray-900 hover:bg-black text-white shadow-lg shadow-gray-900/10 px-6">
                                {editingUser ? 'Save Changes' : 'Create User'}
                            </Button>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
}
