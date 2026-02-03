import { useState } from 'react';
import { Building2, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Clinic {
    id: string;
    name: string;
    ownerEmail: string;
    details?: string;
    categories?: string[];
    createdOn: string;
    patientCount: number;
    status: 'Active' | 'Inactive';
}

interface ClinicFormProps {
    initialData?: Clinic | null;
    onCancel?: () => void;
    onSubmit: (data: Partial<Clinic>) => void;
}

export function ClinicForm({ initialData, onCancel, onSubmit }: ClinicFormProps) {
    const [clinicName, setClinicName] = useState(initialData?.name || '');
    const [ownerEmail, setOwnerEmail] = useState(initialData?.ownerEmail || '');
    const [details, setDetails] = useState(initialData?.details || '');
    const [categoryInput, setCategoryInput] = useState('');
    const [categories, setCategories] = useState<string[]>(initialData?.categories || []);

    const handleAddCategory = () => {
        if (categoryInput.trim() && !categories.includes(categoryInput.trim())) {
            setCategories([...categories, categoryInput.trim()]);
            setCategoryInput('');
        }
    };

    const handleRemoveCategory = (category: string) => {
        setCategories(categories.filter(c => c !== category));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddCategory();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name: clinicName,
            ownerEmail,
            details,
            categories
        });
        if (onCancel) onCancel();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Building2 className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {initialData ? 'Edit Clinic' : 'New Clinic'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {initialData ? 'Update clinic information' : 'Add a new clinic to the system'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                        Basic Information
                    </h3>

                    <div className="space-y-4">
                        {/* Clinic Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Clinic Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={clinicName}
                                onChange={(e) => setClinicName(e.target.value)}
                                placeholder="Enter clinic name"
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>

                        {/* Owner Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Owner Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={ownerEmail}
                                onChange={(e) => setOwnerEmail(e.target.value)}
                                placeholder="owner@clinic.com"
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1.5">
                                This email will be used for clinic administration and notifications
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                        Additional Information
                    </h3>

                    <div className="space-y-4">
                        {/* Clinic Details */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Clinic Details <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                            </label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Describe the clinic, services offered, specializations, etc."
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-1.5">
                                Provide additional context about the clinic's services and specializations
                            </p>
                        </div>

                        {/* Categories */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Categories <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={categoryInput}
                                    onChange={(e) => setCategoryInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="e.g., Cardiology, Pediatrics"
                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddCategory}
                                    variant="outline"
                                    className="px-4 h-auto"
                                >
                                    Add
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5">
                                Press Enter or click Add to include a category
                            </p>

                            {/* Categories List */}
                            {categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {categories.map((category, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 group"
                                        >
                                            <span className="text-sm font-medium">{category}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCategory(category)}
                                                className="text-blue-400 hover:text-blue-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <Button
                        type="button"
                        variant="outline"
                        className="px-6"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {initialData ? 'Update Clinic' : 'Create Clinic'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
