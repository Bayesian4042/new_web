import { Building2, Plus, Search, X, Layers } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Clinic {
    id: string;
    name: string;
}

interface ClinicSelectorProps {
    selectedClinics: string[];
    onSelectionChange: (clinicIds: string[]) => void;
    selectedCategories?: string[];
    onCategoriesChange?: (categories: string[]) => void;
    userRole: 'admin' | 'clinic';
}

const AVAILABLE_CATEGORIES = [
    'General Medicine',
    'Cardiology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Neurology'
];

const AVAILABLE_CLINICS: Clinic[] = [
    { id: 'clinic-1', name: 'Downtown Medical Center' },
    { id: 'clinic-2', name: 'Westside Health Clinic' },
    { id: 'clinic-3', name: 'Northside Family Practice' },
    { id: 'clinic-4', name: 'Eastside Wellness Center' },
    { id: 'clinic-5', name: 'Southside Medical Group' },
    { id: 'clinic-6', name: 'Central Health Partners' },
    { id: 'clinic-7', name: 'Riverside Community Clinic' },
    { id: 'clinic-8', name: 'Mountain View Health' },
];

export function ClinicSelector({
    selectedClinics,
    onSelectionChange,
    selectedCategories = [],
    onCategoriesChange,
    userRole
}: ClinicSelectorProps) {
    const [categorySearch, setCategorySearch] = useState('');
    const [clinicSearch, setClinicSearch] = useState('');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isClinicOpen, setIsClinicOpen] = useState(false);

    const categoryRef = useRef<HTMLDivElement>(null);
    const clinicRef = useRef<HTMLDivElement>(null);

    if (userRole !== 'admin') return null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
            if (clinicRef.current && !clinicRef.current.contains(event.target as Node)) {
                setIsClinicOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addCategory = (category: string) => {
        if (onCategoriesChange && !selectedCategories.includes(category)) {
            onCategoriesChange([...selectedCategories, category]);
        }
        setCategorySearch('');
        setIsCategoryOpen(false);
    };

    const removeCategory = (category: string) => {
        if (onCategoriesChange) {
            onCategoriesChange(selectedCategories.filter(c => c !== category));
        }
    };

    const addClinic = (clinicId: string) => {
        if (!selectedClinics.includes(clinicId)) {
            onSelectionChange([...selectedClinics, clinicId]);
        }
        setClinicSearch('');
        setIsClinicOpen(false);
    };

    const removeClinic = (clinicId: string) => {
        onSelectionChange(selectedClinics.filter(id => id !== clinicId));
    };

    const filteredCategories = AVAILABLE_CATEGORIES.filter(cat =>
        cat.toLowerCase().includes(categorySearch.toLowerCase()) &&
        !selectedCategories.includes(cat)
    );

    const filteredClinics = AVAILABLE_CLINICS.filter(clinic =>
        clinic.name.toLowerCase().includes(clinicSearch.toLowerCase()) &&
        !selectedClinics.includes(clinic.id)
    );

    const selectedClinicObjects = AVAILABLE_CLINICS.filter(c => selectedClinics.includes(c.id));

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-8">
            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Admin Settings</div>
            {/* Categories Section */}
            <div className="space-y-3" ref={categoryRef}>
                <div className="flex items-center gap-2">
                    <Layers size={14} className="text-purple-500" />
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Categories</label>
                </div>
                <div className="relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={categorySearch}
                            onChange={(e) => {
                                setCategorySearch(e.target.value);
                                setIsCategoryOpen(true);
                            }}
                            onFocus={() => setIsCategoryOpen(true)}
                            placeholder="Select categories..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        />
                    </div>
                    {isCategoryOpen && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => addCategory(cat)}
                                        className="w-full px-4 py-2 text-left hover:bg-purple-50 text-sm font-medium text-purple-700 flex justify-between items-center group"
                                    >
                                        {cat}
                                        <Plus size={14} className="opacity-0 group-hover:opacity-100" />
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-xs text-gray-400 italic">No categories found</div>
                            )}
                        </div>
                    )}
                </div>
                {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {selectedCategories.map(cat => (
                            <div key={cat} className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-lg text-sm font-bold text-purple-700">
                                {cat}
                                <button onClick={() => removeCategory(cat)} className="hover:text-purple-900">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Clinic Section */}
            <div className="space-y-3" ref={clinicRef}>
                <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-blue-500" />
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Clinic</label>
                </div>
                <div className="relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={clinicSearch}
                            onChange={(e) => {
                                setClinicSearch(e.target.value);
                                setIsClinicOpen(true);
                            }}
                            onFocus={() => setIsClinicOpen(true)}
                            placeholder="Select clinics..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    {isClinicOpen && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                            {filteredClinics.length > 0 ? (
                                filteredClinics.map(clinic => (
                                    <button
                                        key={clinic.id}
                                        onClick={() => addClinic(clinic.id)}
                                        className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm font-medium text-gray-700 flex justify-between items-center group"
                                    >
                                        {clinic.name}
                                        <Plus size={14} className="opacity-0 group-hover:opacity-100" />
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-xs text-gray-400 italic">No clinics found</div>
                            )}
                        </div>
                    )}
                </div>
                {selectedClinics.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {selectedClinicObjects.map(clinic => (
                            <div key={clinic.id} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg text-sm font-bold text-blue-900">
                                {clinic.name}
                                <button onClick={() => removeClinic(clinic.id)} className="hover:text-blue-700">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className='text-xs font-bold text-gray-500'>
                Leave empty to make visible to all clinics matching categories
            </div>
        </div>
    );
}
