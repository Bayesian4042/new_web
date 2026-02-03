import { useState } from 'react';
import { Building2, Plus, Edit, Copy, Trash2, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface Clinic {
    id: string;
    name: string;
    ownerEmail: string;
    details?: string;
    categories?: string[];
    createdOn: string;
    patientCount: number;
    status: 'Active' | 'Inactive';
}

export const mockClinics: Clinic[] = [
    {
        id: 'CLN-001',
        name: 'Main Clinic',
        ownerEmail: 'admin@mainclinic.com',
        details: 'Primary healthcare facility serving downtown area',
        categories: ['General Medicine', 'Cardiology'],
        createdOn: '2026-01-15',
        patientCount: 45,
        status: 'Active'
    },
    {
        id: 'CLN-002',
        name: 'North Wing',
        ownerEmail: 'contact@northwing.com',
        details: 'Specialized in orthopedics and physical therapy',
        categories: ['Orthopedics', 'Physical Therapy'],
        createdOn: '2026-01-20',
        patientCount: 32,
        status: 'Active'
    },
    {
        id: 'CLN-003',
        name: 'Westside Health Clinic',
        ownerEmail: 'info@westsidehealth.com',
        categories: ['Pediatrics', 'Family Medicine'],
        createdOn: '2026-02-01',
        patientCount: 28,
        status: 'Active'
    }
];

interface ClinicsProps {
    clinics: Clinic[];
    onAddClinic: () => void;
    onEditClinic: (clinic: Clinic) => void;
    onCopyClinic: (clinic: Clinic) => void;
    onDeleteClinic: (clinicId: string) => void;
}

export function Clinics({ clinics, onAddClinic, onEditClinic, onCopyClinic, onDeleteClinic }: ClinicsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const filteredClinics = clinics.filter(clinic =>
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Building2 className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Clinics</p>
                            <p className="text-2xl font-bold text-gray-900">{clinics.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <Building2 className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Clinics</p>
                            <p className="text-2xl font-bold text-gray-900">{clinics.filter(c => c.status === 'Active').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                            <Building2 className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Patients</p>
                            <p className="text-2xl font-bold text-gray-900">{clinics.reduce((sum, c) => sum + c.patientCount, 0)}</p>
                        </div>
                    </div>
                </div>
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
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Clinic ID</span>
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Clinic Name</span>
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Owner Email</span>
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</span>
                                </th>
                                <th className="py-3 px-3 text-left">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Patients</span>
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
                                    className="hover:bg-gray-50/50 transition-colors group"
                                >
                                    <td className="py-3 px-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(clinic.id)}
                                            onChange={() => toggleRow(clinic.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="text-sm font-medium text-gray-600">{clinic.id}</span>
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <Building2 className="text-blue-600" size={14} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{clinic.name}</p>
                                                {clinic.details && (
                                                    <p className="text-xs text-gray-500 line-clamp-1">{clinic.details}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="text-sm text-gray-600">{clinic.ownerEmail}</span>
                                    </td>
                                    <td className="py-3 px-3">
                                        {clinic.categories && clinic.categories.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {clinic.categories.slice(0, 2).map((category, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                                    >
                                                        {category}
                                                    </span>
                                                ))}
                                                {clinic.categories.length > 2 && (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                                                        +{clinic.categories.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="text-sm font-semibold text-gray-900">{clinic.patientCount}</span>
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
                                    <td className="py-3 px-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => onEditClinic(clinic)}
                                                className="h-8 w-8 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center"
                                                title="Edit"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleCopy(clinic)}
                                                className="h-8 w-8 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-colors flex items-center justify-center"
                                                title="Copy"
                                            >
                                                <Copy size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(clinic.id)}
                                                className="h-8 w-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors flex items-center justify-center"
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
