import { useState } from 'react';
import { Building2, Plus, Copy, Trash2, Search, Clock, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface Clinic {
    id: string;
    name: string;
    ownerEmail: string;
    details?: string;
    categories?: string[];
    timezone?: string;
    createdOn: string;
    patientCount: number;
    status: 'Active' | 'Inactive';
    metrics?: {
        users: number;
        roles: number;
        behaviours: number;
        otcLists: number;
        dbSize: string;
    };
    lastActivity?: {
        login: string;
        lastEvent: string;
    };
    activityHistory?: {
        id: string;
        action: string;
        date: string;
        user: string;
    }[];
}

export const mockClinics: Clinic[] = [
    {
        id: 'CLN-001',
        name: 'Main Clinic',
        ownerEmail: 'admin@mainclinic.com',
        details: 'Primary healthcare facility serving downtown area',
        categories: ['General Medicine', 'Cardiology'],
        timezone: 'America/New_York',
        createdOn: '2026-01-15',
        patientCount: 45,
        status: 'Active',
        metrics: {
            users: 12,
            roles: 4,
            behaviours: 150,
            otcLists: 8,
            dbSize: '2.4 GB'
        },
        lastActivity: {
            login: '2026-02-04T09:30:00',
            lastEvent: 'Patient Record Updated'
        },
        activityHistory: [
            { id: '1', action: 'System Backup Completed', date: '2026-02-04T02:00:00', user: 'System' },
            { id: '2', action: 'New User Added', date: '2026-02-03T14:30:00', user: 'admin@mainclinic.com' },
            { id: '3', action: 'Protocol Modified', date: '2026-02-03T11:15:00', user: 'dr.smith@mainclinic.com' }
        ]
    },
    {
        id: 'CLN-002',
        name: 'North Wing',
        ownerEmail: 'contact@northwing.com',
        details: 'Specialized in orthopedics and physical therapy',
        categories: ['Orthopedics', 'Physical Therapy'],
        timezone: 'America/Los_Angeles',
        createdOn: '2026-01-20',
        patientCount: 32,
        status: 'Active',
        metrics: {
            users: 8,
            roles: 3,
            behaviours: 85,
            otcLists: 5,
            dbSize: '1.1 GB'
        },
        lastActivity: {
            login: '2026-02-03T16:45:00',
            lastEvent: 'Appointment Scheduled'
        },
        activityHistory: [
            { id: '1', action: 'Staff Meeting Notes Added', date: '2026-02-03T16:00:00', user: 'manager@northwing.com' }
        ]
    },
    {
        id: 'CLN-003',
        name: 'Westside Health Clinic',
        ownerEmail: 'info@westsidehealth.com',
        categories: ['Pediatrics', 'Family Medicine'],
        timezone: 'America/Chicago',
        createdOn: '2026-02-01',
        patientCount: 28,
        status: 'Active',
        metrics: {
            users: 5,
            roles: 2,
            behaviours: 45,
            otcLists: 3,
            dbSize: '850 MB'
        },
        lastActivity: {
            login: '2026-02-01T10:00:00',
            lastEvent: 'Initial Setup'
        },
        activityHistory: [
            { id: '1', action: 'Clinic Account Created', date: '2026-02-01T09:00:00', user: 'Super Admin' }
        ]
    }
];

interface ClinicsProps {
    clinics: Clinic[];
    onAddClinic: () => void;
    onViewClinic: (clinic: Clinic) => void;
    onCopyClinic: (clinic: Clinic) => void;
    onDeleteClinic: (clinicId: string) => void;
}

export function Clinics({ clinics, onAddClinic, onViewClinic, onCopyClinic, onDeleteClinic }: ClinicsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [activitySort, setActivitySort] = useState<'none' | 'asc' | 'desc'>('none');

    const filteredClinics = clinics
        .filter(clinic =>
            clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            clinic.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (activitySort === 'none') return 0;
            
            const dateA = a.lastActivity?.login ? new Date(a.lastActivity.login).getTime() : 0;
            const dateB = b.lastActivity?.login ? new Date(b.lastActivity.login).getTime() : 0;
            
            if (activitySort === 'desc') {
                return dateB - dateA; // Most recent first
            } else {
                return dateA - dateB; // Oldest first
            }
        });

    const handleActivitySort = () => {
        if (activitySort === 'none') {
            setActivitySort('desc'); // Most active first
        } else if (activitySort === 'desc') {
            setActivitySort('asc'); // Least active first
        } else {
            setActivitySort('none'); // Reset to default
        }
    };

    const handleCopy = (clinic: Clinic) => {
        onCopyClinic(clinic);
    };

    const handleDelete = (clinicId: string) => {
        if (confirm('Are you sure you want to delete this clinic?')) {
            onDeleteClinic(clinicId);
        }
    };

    const toggleRow = (id: string) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    const toggleAll = (checked: boolean) => {
        setSelectedRows(checked ? clinics.map(c => c.id) : []);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clinic Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage clinics and their information</p>
                </div>
                <Button
                    onClick={onAddClinic}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-9 px-4 text-sm"
                >
                    <Plus size={16} className="mr-1.5" />
                    Add Clinic
                </Button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search clinics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all"
                            />
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">
                        Showing <span className="font-bold text-gray-900">{filteredClinics.length}</span> of <span className="font-bold text-gray-900">{clinics.length}</span> clinics
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="py-3 px-4 text-left w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length === clinics.length}
                                        onChange={(e) => toggleAll(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Clinic Details</span>
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Metrics</span>
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <button
                                        onClick={handleActivitySort}
                                        className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
                                    >
                                        Last Activity
                                        {activitySort === 'none' && <ArrowUpDown size={12} className="text-gray-300" />}
                                        {activitySort === 'desc' && <ArrowDown size={12} className="text-blue-600" />}
                                        {activitySort === 'asc' && <ArrowUp size={12} className="text-blue-600" />}
                                    </button>
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
                                </th>
                                <th className="py-3 px-3 text-right">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredClinics.map((clinic) => (
                                <tr
                                    key={clinic.id}
                                    onClick={() => onViewClinic(clinic)}
                                    className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                                >
                                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(clinic.id)}
                                            onChange={() => toggleRow(clinic.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <Building2 className="text-blue-600" size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-gray-900">{clinic.name}</p>
                                                    <span className="text-xs text-gray-400 font-mono">#{clinic.id}</span>
                                                </div>
                                                <p className="text-xs text-gray-500">{clinic.ownerEmail}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase">Patients</p>
                                                <p className="text-sm font-semibold text-gray-900">{clinic.patientCount}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase">Users</p>
                                                <p className="text-sm font-semibold text-gray-900">{clinic.metrics?.users || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase">DB Size</p>
                                                <p className="text-sm font-semibold text-gray-900">{clinic.metrics?.dbSize || '-'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-gray-400" />
                                            <div>
                                                <p className="text-xs font-medium text-gray-700">
                                                    {clinic.lastActivity?.login ? new Date(clinic.lastActivity.login).toLocaleDateString() : 'Never'}
                                                </p>
                                                <p className="text-[10px] text-gray-400 truncate max-w-[120px]" title={clinic.lastActivity?.lastEvent}>
                                                    {clinic.lastActivity?.lastEvent || 'No activity'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-bold ${clinic.status === 'Active'
                                                ? 'bg-green-50 text-green-700 border border-green-100'
                                                : 'bg-gray-50 text-gray-600 border border-gray-100'
                                                }`}
                                        >
                                            {clinic.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => handleCopy(clinic)}
                                                className="h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                                                title="Copy"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(clinic.id)}
                                                className="h-8 w-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors flex items-center justify-center"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredClinics.length === 0 && (
                    <div className="py-12 text-center">
                        <Building2 className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500 font-medium">No clinics found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                    </div>
                )}
            </div>

        </div>
    );
}
