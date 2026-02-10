import { useState, useEffect } from 'react';
import {
    ChevronDown,
    Plus,
    Trash2,
    Calendar,
    Clock,
    CheckCircle2,
    RefreshCw,
    Milestone
} from 'lucide-react';
import { TiptapEditor } from '../../components/ui/TiptapEditor';
import { ClinicSelector } from '../../components/ui/ClinicSelector';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

interface FollowupMessage {
    id: string;
    content: string;
    messageType: 'periodic' | 'eventual';
    triggerType: 'day-after-share' | 'specific-date';
    startDay?: number;
    specificDate?: string;
    repeatDays: number;
    repeatCount: number;
    sendTime?: string;
}

interface FollowupFormProps {
    initialData?: {
        id: string;
        name: string;
        content?: string;
        frequency?: string;
        duration?: string;
        time?: string;
        messages?: FollowupMessage[];
        assignedClinics?: string[];
        type?: 'Scheduled' | 'Triggered' | 'Manual';
    } | null;
    userRole: 'admin' | 'clinic';
    onChange: (data: {
        name: string;
        messages: FollowupMessage[];
        totalDuration: number;
        totalMessages: number;
        assignedClinics: string[];
        type: 'Scheduled' | 'Triggered' | 'Manual';
    }) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

export function FollowupForm({ initialData, userRole, onChange, onSubmit, onCancel }: FollowupFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    
    const [messages, setMessages] = useState<FollowupMessage[]>(() => {
        if (initialData?.messages && initialData.messages.length > 0) {
            return initialData.messages.map(m => ({
                ...m,
                messageType: (m as any).messageType || ((m as any).isPeriodic ? 'periodic' : 'eventual')
            }));
        }
        return [];
    });

    const [expandedMessageIds, setExpandedMessageIds] = useState<string[]>(() => {
        return initialData?.messages?.map(m => m.id) || [];
    });

    const [selectedClinics, setSelectedClinics] = useState<string[]>(initialData?.assignedClinics || []);

    const timeOptions = [
        '06:00 (6:00 AM)', '07:00 (7:00 AM)', '08:00 (8:00 AM)', '09:00 (9:00 AM)',
        '10:00 (10:00 AM)', '11:00 (11:00 AM)', '12:00 (12:00 PM)', '13:00 (1:00 PM)',
        '14:00 (2:00 PM)', '15:00 (3:00 PM)', '16:00 (4:00 PM)', '17:00 (5:00 PM)',
        '18:00 (6:00 PM)', '19:00 (7:00 PM)', '20:00 (8:00 PM)', '21:00 (9:00 PM)'
    ];

    useEffect(() => {
        let totalDuration = 0;
        let totalMessages = 0;

        messages.forEach(msg => {
            if (msg.messageType === 'periodic') {
                totalMessages += msg.repeatCount;
                totalDuration += msg.repeatCount * msg.repeatDays;
            } else {
                totalMessages += 1;
                if (msg.triggerType === 'day-after-share' && msg.startDay) {
                    totalDuration = Math.max(totalDuration, msg.startDay);
                }
            }
        });

        onChange({
            name,
            messages,
            totalDuration,
            totalMessages,
            assignedClinics: selectedClinics,
            type: initialData?.type || 'Scheduled'
        });
    }, [name, messages, selectedClinics, onChange, initialData?.type]);

    const addMessage = () => {
        const id = `msg-${Date.now()}`;
        const newMessage: FollowupMessage = {
            id,
            content: '',
            messageType: 'periodic',
            triggerType: 'day-after-share',
            repeatDays: 1,
            repeatCount: 7,
            sendTime: '09:00 (9:00 AM)'
        };
        setMessages([...messages, newMessage]);
        setExpandedMessageIds([...expandedMessageIds, id]);
    };

    const updateMessage = (id: string, updates: Partial<FollowupMessage>) => {
        setMessages(messages.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const removeMessage = (id: string) => {
        setMessages(messages.filter(m => m.id !== id));
        setExpandedMessageIds(expandedMessageIds.filter(eid => eid !== id));
    };

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">

                {/* Main Content Area */}
                <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
                    <div className="flex-1 overflow-y-auto pr-2 space-y-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">

                        {/* 1. Header & Internal Name */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <div className="space-y-4">
                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                        Follow-up Name
                                    </label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Post-Op Recovery Check-in"
                                        className="text-lg font-semibold bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Messages */}
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-sm font-bold text-gray-900">Messages</h3>
                                <Button
                                    onClick={addMessage}
                                    size="sm"
                                    variant="outline"
                                    className="text-blue-600 border-blue-100 hover:bg-blue-50 gap-2 h-9 px-4 rounded-xl font-bold"
                                >
                                    <Plus size={16} />
                                    Add Message
                                </Button>
                            </div>

                            {messages.length === 0 ? (
                                <div className="py-20 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center bg-gray-50/50">
                                    <Milestone size={40} className="text-gray-200 mb-4" />
                                    <p className="text-sm font-bold text-gray-400">No messages added yet.</p>
                                    <Button
                                        onClick={addMessage}
                                        variant="ghost"
                                        className="mt-2 text-blue-500 hover:text-blue-600 font-bold"
                                    >
                                        + Add your first message
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((msg, index) => {
                                        const isExpanded = expandedMessageIds.includes(msg.id);
                                        return (
                                            <Card key={msg.id} noPadding className="border-gray-100 hover:border-gray-200 transition-all shadow-sm overflow-hidden">
                                                {/* Card Header (Always Visible) */}
                                                <div
                                                    onClick={() => setExpandedMessageIds(prev => prev.includes(msg.id) ? prev.filter(id => id !== msg.id) : [...prev, msg.id])}
                                                    className="px-6 py-4 bg-white hover:bg-gray-50/50 cursor-pointer flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-1.5 rounded-lg transition-colors ${isExpanded ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                                                            <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? '' : '-rotate-90'}`} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Message #{index + 1}</span>
                                                                {!isExpanded && (
                                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${msg.messageType === 'periodic' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                                                                        {msg.messageType === 'periodic' ? 'Periodic' : 'Eventual'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {!isExpanded && msg.content && (
                                                                <div
                                                                    className="text-[11px] text-gray-500 line-clamp-1 max-w-md"
                                                                    dangerouslySetInnerHTML={{ __html: msg.content.replace(/<[^>]*>?/gm, '') }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        {!isExpanded && (
                                                            <>
                                                                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                                                                    <Clock size={12} />
                                                                    {msg.sendTime?.split(' ')[0]}
                                                                </div>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); removeMessage(msg.id); }}
                                                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Expandable Content */}
                                                {isExpanded && (
                                                    <CardContent className="px-6 pb-6 pt-2 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                                        {/* Message Type Toggle */}
                                                        <div className="space-y-2">
                                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message Type</label>
                                                            <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200/50">
                                                                <button
                                                                    onClick={() => updateMessage(msg.id, { 
                                                                        messageType: 'periodic',
                                                                        repeatDays: 1,
                                                                        repeatCount: 7
                                                                    })}
                                                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${msg.messageType === 'periodic'
                                                                        ? 'bg-white text-blue-600 shadow-sm'
                                                                        : 'text-gray-500 hover:text-gray-700'
                                                                        }`}
                                                                >
                                                                    Periodic
                                                                </button>
                                                                <button
                                                                    onClick={() => updateMessage(msg.id, { 
                                                                        messageType: 'eventual',
                                                                        specificDate: new Date().toISOString().split('T')[0]
                                                                    })}
                                                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${msg.messageType === 'eventual'
                                                                        ? 'bg-white text-purple-600 shadow-sm'
                                                                        : 'text-gray-500 hover:text-gray-700'
                                                                        }`}
                                                                >
                                                                    Eventual
                                                                </button>
                                                            </div>
                                                            <p className="text-[11px] text-gray-500 italic">
                                                                {msg.messageType === 'periodic'
                                                                    ? "Repeated at a fixed interval"
                                                                    : "Sent on a specific date"}
                                                            </p>
                                                        </div>

                                                        {/* Message Content */}
                                                        <div className="space-y-2">
                                                            <label className="block text-xs font-bold text-gray-700">Message Content</label>
                                                            <TiptapEditor
                                                                content={msg.content}
                                                                onChange={(c) => updateMessage(msg.id, { content: c })}
                                                                placeholder="Hi! Just checking in on how you're feeling today..."
                                                            />
                                                            <p className="text-[10px] text-gray-400 font-medium">Personalized messages improve engagement</p>
                                                        </div>

                                                        {/* Conditional Fields Based on Type */}
                                                        {msg.messageType === 'periodic' ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                                                <div className="space-y-2">
                                                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                                                        <RefreshCw size={14} className="text-blue-500" />
                                                                        Frequency
                                                                    </label>
                                                                    <div className="relative">
                                                                        <select
                                                                            value={msg.repeatDays === 1 ? 'Daily' : msg.repeatDays === 7 ? 'Weekly' : 'Custom'}
                                                                            onChange={(e) => {
                                                                                const val = e.target.value;
                                                                                updateMessage(msg.id, { repeatDays: val === 'Daily' ? 1 : val === 'Weekly' ? 7 : msg.repeatDays });
                                                                            }}
                                                                            className="w-full h-11 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold appearance-none focus:ring-2 focus:ring-blue-500/10 outline-none"
                                                                        >
                                                                            <option value="Daily">Daily</option>
                                                                            <option value="Weekly">Weekly</option>
                                                                        </select>
                                                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                                                        <Calendar size={14} className="text-blue-500" />
                                                                        Duration (days)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        value={msg.repeatCount}
                                                                        onChange={(e) => updateMessage(msg.id, { repeatCount: parseInt(e.target.value) || 1 })}
                                                                        className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/10 outline-none"
                                                                    />
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                                                        <Clock size={14} className="text-blue-500" />
                                                                        Preferred Time
                                                                    </label>
                                                                    <div className="relative">
                                                                        <select
                                                                            value={msg.sendTime}
                                                                            onChange={(e) => updateMessage(msg.id, { sendTime: e.target.value })}
                                                                            className="w-full h-11 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold appearance-none focus:ring-2 focus:ring-blue-500/10 outline-none"
                                                                        >
                                                                            {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                                                        </select>
                                                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                                <div className="space-y-2">
                                                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                                                        <Calendar size={14} className="text-purple-500" />
                                                                        Event Date
                                                                    </label>
                                                                    <input
                                                                        type="date"
                                                                        value={msg.specificDate}
                                                                        onChange={(e) => updateMessage(msg.id, { specificDate: e.target.value })}
                                                                        className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-purple-500/10 outline-none"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                                                        <Clock size={14} className="text-purple-500" />
                                                                        Preferred Time
                                                                    </label>
                                                                    <div className="relative">
                                                                        <select
                                                                            value={msg.sendTime}
                                                                            onChange={(e) => updateMessage(msg.id, { sendTime: e.target.value })}
                                                                            className="w-full h-11 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold appearance-none focus:ring-2 focus:ring-purple-500/10 outline-none"
                                                                        >
                                                                            {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                                                        </select>
                                                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                                            <button
                                                                onClick={() => removeMessage(msg.id)}
                                                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                            >
                                                                <Trash2 size={14} />
                                                                Delete Message
                                                            </button>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => setExpandedMessageIds(prev => prev.filter(id => id !== msg.id))}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-6 rounded-xl font-bold text-xs gap-2 shadow-sm"
                                                            >
                                                                <CheckCircle2 size={14} />
                                                                Save Message
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                )}
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons - Fixed at Bottom */}
                    <div className="flex items-center justify-end gap-3 bg-white border-t border-gray-200 py-3 px-6 rounded-2xl shadow-sm">
                        <Button
                            onClick={onCancel}
                            variant="outline"
                            className="px-6 h-11 rounded-xl font-bold border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onSubmit}
                            className="bg-gray-900 hover:bg-black text-white px-8 h-11 rounded-xl font-bold shadow-lg shadow-gray-200 transition-all active:scale-95"
                        >
                            {initialData ? 'Save Changes' : 'Create Followup'}
                        </Button>
                    </div>
                </div>

                {/* Sidebar - Configuration */}
                <div className="h-full overflow-y-auto space-y-4 px-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">

                    <ClinicSelector
                        selectedClinics={selectedClinics}
                        onSelectionChange={setSelectedClinics}
                        userRole={userRole}
                    />


                </div>
            </div>
        </div>
    );
}
