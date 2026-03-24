import { useState } from 'react';
import { Building2, Plus, Copy, Trash2, Search, Clock, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { BILLING_PLANS } from '../billing/billingData';

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
    // Billing fields
    planId?: string;
    whitelistFlag?: boolean;
    billingStatus?: 'current' | 'payment_failed' | 'whitelist' | 'inactive';
    commitmentEndDate?: string;
    stripeCustomerId?: string;
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
        ],
        planId: 'starter',
        whitelistFlag: false,
        billingStatus: 'current',
        commitmentEndDate: '2026-07-15',
        stripeCustomerId: 'cus_mock_001',
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
        ],
        planId: 'growth',
        whitelistFlag: false,
        billingStatus: 'payment_failed',
        commitmentEndDate: '2026-07-20',
        stripeCustomerId: 'cus_mock_002',
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
        ],
        planId: 'lite',
        whitelistFlag: true,
        billingStatus: 'whitelist',
        commitmentEndDate: '2026-09-10',
        stripeCustomerId: undefined,
    },
    {
        id: 'CLN-004',
        name: 'New Clinic',
        ownerEmail: 'admin@newclinic.com',
        details: 'Recently onboarded clinic — no billing plan assigned yet',
        categories: ['General Medicine'],
        timezone: 'America/New_York',
        createdOn: '2026-03-24',
        patientCount: 0,
        status: 'Active',
        metrics: {
            users: 1,
            roles: 1,
            behaviours: 0,
            otcLists: 0,
            dbSize: '0 MB'
        },
        lastActivity: {
            login: '2026-03-24T09:00:00',
            lastEvent: 'Account Created'
        },
        activityHistory: [
            { id: '1', action: 'Clinic Account Created', date: '2026-03-24T09:00:00', user: 'Super Admin' }
        ],
        planId: undefined,
        whitelistFlag: false,
        billingStatus: 'no_plan',
        commitmentEndDate: undefined,
        stripeCustomerId: undefined,
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
                <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100 bg-gray-50/10">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search clinics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 pl-9 pr-3 py-1.5 text-sm bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-lg transition-all"
                            />
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                        Showing <span className="font-bold text-gray-900">{filteredClinics.length}</span> of <span className="font-bold text-gray-900">{clinics.length}</span> clinics
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/30 border-b border-gray-200">
                                <th className="py-3 px-4 text-left w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length === clinics.length}
                                        onChange={(e) => toggleAll(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                                    />
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Clinic Details</span>
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Metrics</span>
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <button
                                        onClick={handleActivitySort}
                                        className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-gray-900 transition-colors"
                                    >
                                        Last Activity
                                        {activitySort === 'none' && <ArrowUpDown size={10} className="text-gray-400" />}
                                        {activitySort === 'desc' && <ArrowDown size={10} className="text-blue-600" />}
                                        {activitySort === 'asc' && <ArrowUp size={10} className="text-blue-600" />}
                                    </button>
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</span>
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Billing</span>
                                </th>
                                <th className="py-3 px-3 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredClinics.map((clinic) => (
                                <tr
                                    key={clinic.id}
                                    onClick={() => onViewClinic(clinic)}
                                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                >
                                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(clinic.id)}
                                            onChange={() => toggleRow(clinic.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                                        />
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 border border-indigo-100 shadow-sm transition-transform group-hover:scale-105">
                                                <Building2 className="text-indigo-600" size={18} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-gray-900">{clinic.name}</p>
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-mono font-bold uppercase">#{clinic.id}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium">{clinic.ownerEmail}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Patients</p>
                                                <p className="text-sm font-bold text-gray-900">{clinic.patientCount}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Users</p>
                                                <p className="text-sm font-bold text-gray-900">{clinic.metrics?.users || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">DB Size</p>
                                                <p className="text-sm font-bold text-gray-900">{clinic.metrics?.dbSize || '-'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-gray-400" />
                                            <div>
                                                <p className="text-xs font-bold text-gray-700">
                                                    {clinic.lastActivity?.login ? new Date(clinic.lastActivity.login).toLocaleDateString() : 'Never'}
                                                </p>
                                                <p className="text-[10px] font-medium text-gray-400 truncate max-w-[120px]" title={clinic.lastActivity?.lastEvent}>
                                                    {clinic.lastActivity?.lastEvent || 'No activity'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${clinic.status === 'Active'
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {clinic.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="space-y-1">
                                            {clinic.billingStatus === 'no_plan' ? (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500">
                                                    No Plan
                                                </span>
                                            ) : clinic.whitelistFlag ? (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                                                    Whitelist
                                                </span>
                                            ) : (
                                                <>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        clinic.billingStatus === 'current' ? 'bg-green-100 text-green-700' :
                                                        clinic.billingStatus === 'payment_failed' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {clinic.billingStatus === 'current' ? 'Paid' :
                                                         clinic.billingStatus === 'payment_failed' ? 'Failed' : 'Inactive'}
                                                    </span>
                                                    {clinic.planId && (
                                                        <p className="text-[10px] text-gray-500 font-medium">
                                                            {BILLING_PLANS.find(p => p.id === clinic.planId)?.name ?? clinic.planId}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-1 transition-opacity">
                                            <button
                                                onClick={() => handleCopy(clinic)}
                                                className="h-8 w-8 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors flex items-center justify-center"
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
                    <div className="py-16 text-center bg-white border-t border-gray-50">
                        <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                            <Building2 className="text-gray-300" size={24} />
                        </div>
                        <p className="text-sm font-bold text-gray-900">No clinics found</p>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>

        </div>
    );
}
