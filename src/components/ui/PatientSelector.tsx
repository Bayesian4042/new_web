import { User, Check, Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Patient {
    id: string;
    name: string;
    email?: string;
}

interface PatientSelectorProps {
    selectedPatients: string[];
    onSelectionChange: (patientIds: string[]) => void;
    userRole: 'admin' | 'clinic';
    label?: string;
    description?: string;
}

// Mock patient data - replace with actual API call
const AVAILABLE_PATIENTS: Patient[] = [
    { id: 'pat-1', name: 'John Doe', email: 'john.doe@example.com' },
    { id: 'pat-2', name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: 'pat-3', name: 'Michael Brown', email: 'm.brown@test.com' },
    { id: 'pat-4', name: 'Emily Davis', email: 'emily.d@test.com' },
    { id: 'pat-5', name: 'David Wilson', email: 'david.w@example.com' },
    { id: 'pat-6', name: 'Sarah Miller', email: 'sarah.m@test.com' },
    { id: 'pat-7', name: 'James Taylor', email: 'james.t@example.com' },
    { id: 'pat-8', name: 'Jessica Anderson', email: 'jessica.a@test.com' },
];

export function PatientSelector({
    selectedPatients,
    onSelectionChange,
    userRole,
    label = 'Assign to Patients',
    description = 'Select which patients should be assigned to this protocol.'
}: PatientSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Show for both Admin and Clinic users
    if (userRole !== 'admin' && userRole !== 'clinic') {
        return null;
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addPatient = (patientId: string) => {
        if (!selectedPatients.includes(patientId)) {
            onSelectionChange([...selectedPatients, patientId]);
        }
        setSearchQuery('');
        setIsDropdownOpen(false);
    };

    const removePatient = (patientId: string) => {
        onSelectionChange(selectedPatients.filter(id => id !== patientId));
    };

    const clearAll = () => {
        onSelectionChange([]);
    };

    const filteredPatients = AVAILABLE_PATIENTS.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const notSelected = !selectedPatients.includes(patient.id);
        return matchesSearch && notSelected;
    });

    const selectedPatientObjects = AVAILABLE_PATIENTS.filter(patient =>
        selectedPatients.includes(patient.id)
    );

    const noneSelected = selectedPatients.length === 0;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <User size={16} className="text-gray-500" />
                            {label}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                    </div>
                    {!noneSelected && (
                        <button
                            onClick={clearAll}
                            className="text-xs font-medium text-red-600 hover:text-red-700"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {/* Selection Status */}
                <div className={`border rounded-lg px-3 py-2 ${noneSelected
                    ? 'bg-blue-50 border-blue-100'
                    : 'bg-green-50 border-green-100'
                    }`}>
                    <p className={`text-xs font-medium ${noneSelected ? 'text-blue-700' : 'text-green-700'
                        }`}>
                        {noneSelected ? (
                            <>
                                <span className="font-bold">No Patients Assigned</span> - This protocol is not assigned to any specific patients yet
                            </>
                        ) : (
                            <>
                                <span className="font-bold">{selectedPatients.length} Patient{selectedPatients.length !== 1 ? 's' : ''}</span> selected
                            </>
                        )}
                    </p>
                </div>

                {/* Selected Patients Display */}
                {!noneSelected && (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            Selected Patients
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {selectedPatientObjects.map((patient) => (
                                <div
                                    key={patient.id}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm group hover:bg-blue-100 transition-colors"
                                >
                                    <div>
                                        <p className="font-medium text-blue-900">{patient.name}</p>
                                        {patient.email && (
                                            <p className="text-xs text-blue-600">{patient.email}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removePatient(patient.id)}
                                        className="p-1 hover:bg-blue-200 rounded transition-colors"
                                        title="Remove patient"
                                    >
                                        <X size={14} className="text-blue-700" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add Patient Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Add Patient
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsDropdownOpen(true);
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            placeholder="Search patients by name or email..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    {/* Dropdown List */}
                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                            {filteredPatients.length > 0 ? (
                                <div className="py-1">
                                    {filteredPatients.map((patient) => (
                                        <button
                                            key={patient.id}
                                            onClick={() => addPatient(patient.id)}
                                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                                                {patient.email && (
                                                    <p className="text-xs text-gray-500">{patient.email}</p>
                                                )}
                                            </div>
                                            <Check size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-8 text-center">
                                    <p className="text-sm text-gray-500">
                                        {searchQuery ? 'No patients found' : 'All available patients selected'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
