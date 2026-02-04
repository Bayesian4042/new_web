import { useState, useEffect } from 'react';
import {
    ChevronDown,
    Calendar,
    Plus,
    Edit2,
    Trash2,
    X
} from 'lucide-react';
import { TiptapEditor } from '../../components/ui/TiptapEditor';
import { ClinicSelector } from '../../components/ui/ClinicSelector';
import { Button } from '../../components/ui/Button';

interface FollowupMessage {
    id: string;
    content: string;
    triggerType: 'day-after-share' | 'specific-date';
    startDay?: number; // For day-after-share
    specificDate?: string; // For specific-date
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
}

export function FollowupForm({ initialData, userRole, onChange }: FollowupFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [messages, setMessages] = useState<FollowupMessage[]>(initialData?.messages || []);
    const [selectedClinics, setSelectedClinics] = useState<string[]>(initialData?.assignedClinics || []);
    
    // Message editing state
    const [isEditingMessage, setIsEditingMessage] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [messageContent, setMessageContent] = useState('');
    const [triggerType, setTriggerType] = useState<'day-after-share' | 'specific-date'>('day-after-share');
    const [startDay, setStartDay] = useState(1);
    const [specificDate, setSpecificDate] = useState('');
    const [repeatDays, setRepeatDays] = useState(1);
    const [repeatCount, setRepeatCount] = useState(1);
    const [sendTime, setSendTime] = useState('9:00 AM');

    // Calculate total duration and message count
    const calculateTotalDuration = (msgs: FollowupMessage[]) => {
        if (msgs.length === 0) return 0;
        // Only calculate for day-after-share messages
        const dayAfterShareMessages = msgs.filter(m => m.triggerType === 'day-after-share' && m.startDay);
        if (dayAfterShareMessages.length === 0) return 0;
        return Math.max(...dayAfterShareMessages.map(m => (m.startDay || 0) + (m.repeatCount - 1) * m.repeatDays));
    };

    const calculateTotalMessages = (msgs: FollowupMessage[]) => {
        return msgs.reduce((sum, m) => sum + m.repeatCount, 0);
    };

    useEffect(() => {
        onChange({
            name,
            messages,
            totalDuration: calculateTotalDuration(messages),
            totalMessages: calculateTotalMessages(messages),
            assignedClinics: selectedClinics,
            type: initialData?.type || 'Scheduled'
        });
    }, [name, messages, selectedClinics, onChange, initialData?.type]);

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

    // Message management functions
    const handleAddMessage = () => {
        setMessageContent('');
        setTriggerType('day-after-share');
        setStartDay(messages.length > 0 ? calculateTotalDuration(messages) + 1 : 1);
        setSpecificDate('');
        setRepeatDays(1);
        setRepeatCount(1);
        setSendTime('9:00 AM');
        setEditingMessageId(null);
        setIsEditingMessage(true);
    };

    // Handle trigger type change
    const handleTriggerTypeChange = (type: 'day-after-share' | 'specific-date') => {
        setTriggerType(type);
        if (type === 'specific-date') {
            // For specific dates, no repeat makes sense
            setRepeatDays(0);
            setRepeatCount(1);
        } else {
            // Reset to defaults for day-after-share
            setRepeatDays(1);
            setRepeatCount(1);
        }
    };

    const handleEditMessage = (message: FollowupMessage) => {
        setMessageContent(message.content);
        setTriggerType(message.triggerType);
        setStartDay(message.startDay || 1);
        setSpecificDate(message.specificDate || '');
        setRepeatDays(message.repeatDays);
        setRepeatCount(message.repeatCount);
        setSendTime(message.sendTime || '9:00 AM');
        setEditingMessageId(message.id);
        setIsEditingMessage(true);
    };

    const handleSaveMessage = () => {
        if (!messageContent.trim()) return;
        if (triggerType === 'day-after-share' && !startDay) return;
        if (triggerType === 'specific-date' && !specificDate) return;

        const newMessage: FollowupMessage = {
            id: editingMessageId || `msg-${Date.now()}`,
            content: messageContent,
            triggerType,
            startDay: triggerType === 'day-after-share' ? startDay : undefined,
            specificDate: triggerType === 'specific-date' ? specificDate : undefined,
            repeatDays: triggerType === 'day-after-share' ? repeatDays : 0,
            repeatCount: triggerType === 'specific-date' ? 1 : repeatCount,
            sendTime
        };

        if (editingMessageId) {
            setMessages(messages.map(m => m.id === editingMessageId ? newMessage : m));
        } else {
            setMessages([...messages, newMessage]);
        }

        setIsEditingMessage(false);
        setEditingMessageId(null);
    };

    const handleDeleteMessage = (id: string) => {
        setMessages(messages.filter(m => m.id !== id));
    };

    const handleCancelEdit = () => {
        setIsEditingMessage(false);
        setEditingMessageId(null);
    };

    // Calculate send days for a message
    const calculateSendDays = (msg: FollowupMessage) => {
        if (msg.triggerType === 'specific-date' && msg.specificDate) {
            // For specific dates, just show the single date
            const date = new Date(msg.specificDate);
            return [date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })];
        }
        
        // For day-after-share
        const days = [];
        for (let i = 0; i < msg.repeatCount; i++) {
            days.push((msg.startDay || 1) + i * msg.repeatDays);
        }
        return days;
    };

    // Format trigger display for message cards
    const formatTriggerDisplay = (msg: FollowupMessage) => {
        if (msg.triggerType === 'specific-date' && msg.specificDate) {
            return `On ${new Date(msg.specificDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
        return `Day ${msg.startDay}`;
    };

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
                                placeholder="e.g., Post-Surgery Recovery Followup"
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Messages Schedule Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Messages Schedule</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {messages.length > 0 ? `${calculateTotalMessages(messages)} messages over ${calculateTotalDuration(messages)} days` : 'No messages added yet'}
                            </p>
                        </div>
                        <Button onClick={handleAddMessage} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus size={16} />
                            Add Message
                        </Button>
                    </div>

                    {/* Visual Timeline */}
                    {messages.length > 0 && !isEditingMessage && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <h4 className="text-xs font-semibold text-gray-700 mb-3">Timeline Visualization</h4>
                            <div className="relative">
                                {/* Timeline days */}
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                    <span>Day 1</span>
                                    <span>Day {Math.ceil(calculateTotalDuration(messages) / 2)}</span>
                                    <span>Day {calculateTotalDuration(messages)}</span>
                                </div>
                                
                                {/* Timeline bar */}
                                <div className="relative h-2 bg-gray-200 rounded-full mb-4">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '100%' }} />
                                </div>

                                {/* Message markers */}
                                <div className="space-y-2">
                                    {messages.map((msg, index) => {
                                        const sendDays = calculateSendDays(msg);
                                        const totalDays = calculateTotalDuration(messages);
                                        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];
                                        const color = colors[index % colors.length];
                                        
                                        return (
                                            <div key={msg.id} className="flex items-center gap-2">
                                                <div className={`h-3 w-3 rounded-full ${color} flex-shrink-0`} />
                                                <div className="text-xs text-gray-600 flex-1">
                                                    <span className="font-medium">Message {index + 1}:</span> {msg.repeatCount} messages
                                                    {sendDays.length <= 3 && ` (Days ${sendDays.join(', ')})`}
                                                </div>
                                                <div className="flex gap-1">
                                                    {sendDays.slice(0, 10).map((day) => (
                                                        <div
                                                            key={day}
                                                            className={`h-2 ${color} rounded-sm`}
                                                            style={{ 
                                                                width: `${Math.max(4, 100 / totalDays)}px`
                                                            }}
                                                            title={`Day ${day}`}
                                                        />
                                                    ))}
                                                    {sendDays.length > 10 && (
                                                        <span className="text-[10px] text-gray-400">+{sendDays.length - 10}</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Message List */}
                    <div className="space-y-3">
                        {messages.length === 0 && !isEditingMessage && (
                            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                                <Calendar size={32} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-sm text-gray-500 mb-2">No messages scheduled yet</p>
                                <p className="text-xs text-gray-400 mb-4">Add messages to create a dynamic followup schedule</p>
                                <Button onClick={handleAddMessage} size="sm" variant="outline">
                                    <Plus size={14} />
                                    Add First Message
                                </Button>
                            </div>
                        )}

                        {messages.map((msg, index) => {
                            const sendDays = calculateSendDays(msg);
                            const displayDays = sendDays.length <= 5 ? sendDays.join(', ') : `${sendDays.slice(0, 5).join(', ')}...`;
                            
                            return (
                                <div key={msg.id} className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold text-gray-500">Message {index + 1}</span>
                                                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                                                    {msg.repeatCount}x
                                                </span>
                                            </div>
                                            <div 
                                                className="text-sm text-gray-700 mb-3 line-clamp-2"
                                                dangerouslySetInnerHTML={{ __html: msg.content || 'Empty message' }}
                                            />
                                            <div className="flex items-center gap-4 text-xs text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} className="text-gray-400" />
                                                    {formatTriggerDisplay(msg)}
                                                </span>
                                                {msg.triggerType === 'day-after-share' && (
                                                    <>
                                                        <span>Every: {msg.repeatDays} days</span>
                                                        <span>Repeat: {msg.repeatCount}x</span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                → Sends on: {displayDays}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditMessage(msg)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMessage(msg.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Message Edit Form */}
                    {isEditingMessage && (
                        <div className="mt-4 p-6 border-2 border-blue-200 rounded-xl bg-blue-50/30 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold text-gray-900">
                                    {editingMessageId ? 'Edit Message' : 'New Message'}
                                </h4>
                                <button onClick={handleCancelEdit} className="p-1 hover:bg-gray-200 rounded">
                                    <X size={16} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Message Content */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Message Content
                                    </label>
                                    <TiptapEditor
                                        content={messageContent}
                                        onChange={setMessageContent}
                                        placeholder="Hi! Just checking in on how you're feeling today..."
                                    />
                                </div>

                                {/* Trigger Type Selector */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Trigger Type
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleTriggerTypeChange('day-after-share')}
                                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                triggerType === 'day-after-share'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            Day After Share
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleTriggerTypeChange('specific-date')}
                                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                triggerType === 'specific-date'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            Specific Date
                                        </button>
                                    </div>
                                </div>

                                {/* Schedule Parameters */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {triggerType === 'day-after-share' ? (
                                        <>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Start Day
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={startDay}
                                                    onChange={(e) => setStartDay(parseInt(e.target.value) || 1)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Days after start</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Repeat Days
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={repeatDays}
                                                    onChange={(e) => setRepeatDays(parseInt(e.target.value) || 1)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Interval</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Repeat Count
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={repeatCount}
                                                    onChange={(e) => setRepeatCount(parseInt(e.target.value) || 1)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Times</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Send Date
                                            </label>
                                            <input
                                                type="date"
                                                value={specificDate}
                                                onChange={(e) => setSpecificDate(e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Select the exact date to send this message</p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Send Time
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={sendTime}
                                                onChange={(e) => setSendTime(e.target.value)}
                                                className="w-full appearance-none px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm cursor-pointer"
                                            >
                                                {timeOptions.map((time) => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">Preview:</p>
                                    <p className="text-xs text-gray-600">
                                        {triggerType === 'day-after-share' && startDay ? (
                                            <>Sends on days: {calculateSendDays({ id: '', content: '', triggerType, startDay, repeatDays, repeatCount }).join(', ')}</>
                                        ) : triggerType === 'specific-date' && specificDate ? (
                                            <>Sends on: {calculateSendDays({ id: '', content: '', triggerType, specificDate, repeatDays: 0, repeatCount: 1 }).join(', ')}</>
                                        ) : (
                                            <span className="text-gray-400">Select trigger type and configure schedule</span>
                                        )}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                    <Button onClick={handleSaveMessage} className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Save Message
                                    </Button>
                                    <Button onClick={handleCancelEdit} variant="outline">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
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
