import { useState, useEffect } from 'react';
import {
    Clock,
    ChevronDown,
    Calendar
} from 'lucide-react';
import { TiptapEditor } from '../../components/ui/TiptapEditor';
import { ClinicSelector } from '../../components/ui/ClinicSelector';

interface FollowupFormProps {
    initialData?: {
        id: string;
        name: string;
        content?: string;
        frequency?: string;
        duration?: string;
        time?: string;
        assignedClinics?: string[];
        type?: 'Scheduled' | 'Triggered' | 'Manual';
    } | null;
    userRole: 'admin' | 'clinic';
    onChange: (data: any) => void;
}

export function FollowupForm({ initialData, userRole, onChange }: FollowupFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [message, setMessage] = useState(initialData?.content || '');
    const [frequency, setFrequency] = useState(initialData?.frequency || 'Daily');
    const [duration, setDuration] = useState(initialData?.duration || '7');
    const [sendTime, setSendTime] = useState(initialData?.time || '9:00 AM');
    const [selectedClinics, setSelectedClinics] = useState<string[]>(initialData?.assignedClinics || []);

    useEffect(() => {
        onChange({
            name,
            content: message,
            frequency,
            duration,
            time: sendTime,
            assignedClinics: selectedClinics,
            type: initialData?.type || 'Scheduled'
        });
    }, [name, message, frequency, duration, sendTime, selectedClinics, onChange, initialData?.type]);

    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const m = minute === 0 ? '00' : '30';
                times.push(`${h}:${m} ${ampm}`);
            }
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 gap-8">

                {/* Name Field */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                Follow-up Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Post-Op Day 1 Check"
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Message Content (Using Tiptap to match AI Rules 'Same UI' request) */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                Message Content
                            </label>
                            <TiptapEditor
                                content={message}
                                onChange={setMessage}
                                placeholder="Hi! Just checking in on how you're feeling today..."
                            />
                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-xs text-gray-400">
                                    Personalized messages improve engagement
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule Details Grid */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Frequency */}
                        <div className="space-y-2.5">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Clock size={16} className="text-gray-400" />
                                Frequency
                            </label>
                            <div className="relative">
                                <select
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                    className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-700 cursor-pointer"
                                >
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="space-y-2.5">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Calendar size={16} className="text-gray-400" />
                                Duration (days)
                            </label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-700"
                            />
                        </div>

                        {/* Send Time */}
                        <div className="space-y-2.5">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Clock size={16} className="text-gray-400" />
                                Send Time
                            </label>
                            <div className="relative">
                                <select
                                    value={sendTime}
                                    onChange={(e) => setSendTime(e.target.value)}
                                    className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-700 cursor-pointer"
                                >
                                    {timeOptions.map((time) => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clinic Selector - Only for Super Admin */}
                <ClinicSelector
                    selectedClinics={selectedClinics}
                    onSelectionChange={setSelectedClinics}
                    userRole={userRole}
                />
            </div>
        </div>
    );
}
