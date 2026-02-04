import { useState } from 'react';
import { Building2, Database, Users, Shield, Activity, FileText, Clock, Calendar, ArrowLeft, Edit2, X, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Clinic } from './Clinics';

interface ClinicDetailProps {
    clinic: Clinic;
    onBack: () => void;
    onSave: (data: Partial<Clinic>) => void;
}

export function ClinicDetail({ clinic, onBack, onSave }: ClinicDetailProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [clinicName, setClinicName] = useState(clinic.name);
    const [ownerEmail, setOwnerEmail] = useState(clinic.ownerEmail);
    const [details, setDetails] = useState(clinic.details || '');
    const [categoryInput, setCategoryInput] = useState('');
    const [categories, setCategories] = useState<string[]>(clinic.categories || []);

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

    const handleSave = () => {
        onSave({
            name: clinicName,
            ownerEmail,
            details,
            categories
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setClinicName(clinic.name);
        setOwnerEmail(clinic.ownerEmail);
        setDetails(clinic.details || '');
        setCategories(clinic.categories || []);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="h-10 w-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Building2 className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{clinic.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-500 font-mono">{clinic.id}</span>
                                <span className="text-gray-300">•</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${clinic.status === 'Active'
                                        ? 'bg-green-50 text-green-700 border border-green-100'
                                        : 'bg-gray-50 text-gray-600 border border-gray-100'
                                    }`}>
                                    {clinic.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={handleCancel}>
                                <X size={16} className="mr-1.5" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Save size={16} className="mr-1.5" />
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                            <Edit2 size={16} className="mr-1.5" />
                            Edit Configuration
                        </Button>
                    )}
                </div>
            </div>

            {/* Activity Overview */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Activity size={16} className="text-blue-600" />
                    Activity & Scale
                </h2>
                <div className="grid grid-cols-6 gap-4">
                    <MetricCard
                        icon={<Database size={18} className="text-purple-600" />}
                        label="Database Size"
                        value={clinic.metrics?.dbSize || '0 MB'}
                        color="purple"
                    />
                    <MetricCard
                        icon={<Users size={18} className="text-blue-600" />}
                        label="Total Users"
                        value={clinic.metrics?.users || 0}
                        color="blue"
                    />
                    <MetricCard
                        icon={<Users size={18} className="text-green-600" />}
                        label="Total Patients"
                        value={clinic.patientCount}
                        color="green"
                    />
                    <MetricCard
                        icon={<Shield size={18} className="text-orange-600" />}
                        label="Roles Defined"
                        value={clinic.metrics?.roles || 0}
                        color="orange"
                    />
                    <MetricCard
                        icon={<Activity size={18} className="text-red-600" />}
                        label="Behaviours"
                        value={clinic.metrics?.behaviours || 0}
                        color="red"
                    />
                    <MetricCard
                        icon={<FileText size={18} className="text-teal-600" />}
                        label="OTC Lists"
                        value={clinic.metrics?.otcLists || 0}
                        color="teal"
                    />
                </div>
            </section>

            {/* Monitoring */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-blue-600" />
                    Monitoring
                </h2>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Last Login</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {clinic.lastActivity?.login ? new Date(clinic.lastActivity.login).toLocaleString() : 'Never'}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Last System Event</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {clinic.lastActivity?.lastEvent || 'None'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Configuration */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Building2 size={16} className="text-blue-600" />
                    Configuration
                </h2>
                {isEditing ? (
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
                        </div>

                        {/* Created On (Read-only) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Created On
                            </label>
                            <input
                                type="text"
                                value={clinic.createdOn}
                                disabled
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm"
                            />
                        </div>

                        {/* Clinic Details */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Clinic Details
                            </label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Describe the clinic, services offered, specializations, etc."
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                            />
                        </div>

                        {/* Categories */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Categories
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
                                    className="px-4"
                                >
                                    Add
                                </Button>
                            </div>
                            {categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {categories.map((category, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100"
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
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1 uppercase font-medium">Owner Email</p>
                                <p className="text-sm font-medium text-gray-900">{clinic.ownerEmail}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1 uppercase font-medium">Created On</p>
                                <p className="text-sm font-medium text-gray-900">{clinic.createdOn}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-2 uppercase font-medium">Categories</p>
                            <div className="flex flex-wrap gap-2">
                                {clinic.categories?.map((cat, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                                        {cat}
                                    </span>
                                )) || <span className="text-sm text-gray-400">No categories</span>}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-2 uppercase font-medium">Description</p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {clinic.details || 'No description provided.'}
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* Activity History */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-600" />
                    Activity History
                </h2>
                <div className="space-y-4">
                    {clinic.activityHistory?.map((event, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="h-2 w-2 rounded-full bg-blue-400 mt-2" />
                                {i !== (clinic.activityHistory?.length || 0) - 1 && (
                                    <div className="w-px h-full bg-gray-200 my-1" />
                                )}
                            </div>
                            <div className="pb-4 flex-1">
                                <p className="text-sm font-medium text-gray-900">{event.action}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">{new Date(event.date).toLocaleString()}</span>
                                    <span className="text-xs text-gray-300">•</span>
                                    <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">{event.user}</span>
                                </div>
                            </div>
                        </div>
                    )) || <p className="text-sm text-gray-400 italic">No recent activity recorded.</p>}
                </div>
            </section>
        </div>
    );
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
    const bgColors: Record<string, string> = {
        purple: 'bg-purple-50',
        blue: 'bg-blue-50',
        green: 'bg-green-50',
        orange: 'bg-orange-50',
        red: 'bg-red-50',
        teal: 'bg-teal-50',
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center hover:border-blue-200 transition-colors">
            <div className={`h-10 w-10 rounded-lg ${bgColors[color] || 'bg-gray-50'} flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">{label}</p>
        </div>
    );
}
