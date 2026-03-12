import { useState } from 'react';
import { Filter, X, ArrowUpDown, Bot, Copy, Trash2, Edit2, User as UserIcon, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface PatientCompanion {
    id: string;
    name: string;
    type?: string;
    role: string;
    status: 'Active' | 'Draft' | 'Archived' | 'Review';
    users: number;
    createdBy: string;
    createdOn: string;
    source?: string;
    // Configuration fields
    aiPrompt?: string;
    selectedShortcuts?: string[];
    selectedDocuments?: string[];
    selectedPlans?: string[];
    followupType?: 'periodical' | 'eventual';
    followupMessage?: string;
    frequency?: string;
    duration?: string;
    preferredTime?: string;
    scheduledEvents?: { date: string; time: string; content: string }[];
    patients?: any[];
    assignedClinics?: string[];
    assignedCategories?: string[];
}

interface PatientCompanionsProps {
    onAdd: () => void;
    onEdit: (companion: PatientCompanion) => void;
    onCopy: (companion: PatientCompanion) => void;
    onDelete: (id: string) => void;
    companions: PatientCompanion[];
}

export function PatientCompanions({ onAdd, onEdit, onCopy, onDelete, companions }: PatientCompanionsProps) {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [filterActive, setFilterActive] = useState(false);

    const toggleRow = (id: string) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        setSelectedRows((prev) =>
            prev.length === companions.length ? [] : companions.map((c) => c.id)
        );
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Patient Companions</h1>
                    <p className="text-gray-500 mt-1">Monitor and manage individual patient AI assignments</p>
                </div>
                <Button onClick={onAdd} size="sm" className="bg-gray-900 hover:bg-black text-white rounded-xl shadow-sm px-4 py-2 flex items-center gap-2">
                    <Bot size={16} />
                    Add Patient Companion
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search patient companions..."
                        className="w-full pl-9 pr-4 py-2 text-sm border-none focus:ring-0 text-gray-900 placeholder-gray-400"
                    />
                </div>

                <div className="h-6 w-px bg-gray-200 mx-1" />

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilterActive(!filterActive)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 ${filterActive ? 'bg-gray-50' : ''}`}
                    >
                        <Filter size={16} />
                        <span>Filter</span>
                        {filterActive && <X size={14} className="ml-1 text-gray-400" />}
                    </button>
                    
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                        <ArrowUpDown size={16} />
                        <span>Sort by Date</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50/30">
                                <th className="w-10 py-3 px-4">
                                    <input
                                        type="checkbox"
                                        checked={companions.length > 0 && selectedRows.length === companions.length}
                                        onChange={toggleAll}
                                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                                    />
                                </th>
                                <th className="py-3 px-4">
                                    <div className="flex items-center gap-1 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        ID
                                        <ArrowUpDown size={12} className="text-gray-400" />
                                    </div>
                                </th>
                                <th className="py-3 px-4">
                                    <div className="flex items-center gap-1 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Name
                                        <ArrowUpDown size={12} className="text-gray-400" />
                                    </div>
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Patient</th>
                                <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                                <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Source</th>
                                <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Users</th>
                                <th className="py-3 px-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {companions.map((companion) => (
                                <tr
                                    key={companion.id}
                                    onClick={() => onEdit(companion)}
                                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                >
                                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(companion.id)}
                                            onChange={() => toggleRow(companion.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                                        />
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm font-bold text-blue-600 hover:text-blue-700">
                                            {companion.id}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
                                                <Bot size={14} className="text-indigo-600" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{companion.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                                                <UserIcon size={12} className="text-gray-400" />
                                            </div>
                                            <span className="text-sm text-gray-900 font-bold">
                                                {(companion as any).patients?.[0]?.name || 'Unnamed'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm font-medium text-gray-600">{companion.role}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${companion.status === 'Active'
                                                ? 'bg-green-50 text-green-700'
                                                : companion.status === 'Review'
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : companion.status === 'Draft'
                                                        ? 'bg-yellow-50 text-yellow-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {companion.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase"
                                        >
                                            {companion.source || 'Direct'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm font-bold text-gray-900">{companion.users}</span>
                                    </td>
                                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-1 transition-opacity">
                                            <button
                                                onClick={() => onEdit(companion)}
                                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => onCopy(companion)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Copy"
                                            >
                                                <Copy size={14} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(companion.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
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
            </div>
        </div>
    );
}
