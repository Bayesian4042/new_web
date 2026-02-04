import { useState, useRef, useEffect } from 'react';
import {
    Plus,
    Calendar,
    Check,
    BookOpen,
    Zap,
    Brain,
    FileText,
    Bell,
    Link2,
    Send,
    User as UserIcon,
    Trash2,
    Edit2,
    ChevronRight,
    Phone,
    Clock,
    ChevronDown
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SideSheet, SideSheetItem } from '../../components/ui/SideSheet';

interface TestMessage {
    id: string;
    sender: 'user' | 'bot';
    content: string;
    timestamp: string;
}

export interface Protocol {
    id: string;
    name: string;
    category: string;
    status: 'Active' | 'Review' | 'Draft';
    enrolled: number;
    duration: string;
    createdOn: string;
    aiRules?: string;
    followupMessage?: string;
    assignedClinics?: string[];
    assignedPatients?: string[];
    selectedShortcuts?: string[];
    selectedDocuments?: string[];
    selectedPlans?: string[];
}

interface ProtocolFormProps {
    onClose: () => void;
    onSave: () => void;
    initialData?: Protocol | null;
    userRole: 'admin' | 'clinic';
}

type FormSection =
    'protocol-type' |
    'patient-details' |
    'intent-shortcut' |
    'ai-rules' |
    'knowledge-base' |
    'plan-links' |
    'follow-up';

type SheetType = 'shortcuts' | 'documents' | 'plans' | 'templates' | 'followups' | null;

const shortcutItems: SideSheetItem[] = [
    { id: 's1', name: 'Check Vital Signs', description: 'Request patient to log blood pressure/heart rate', category: 'Monitoring' },
    { id: 's2', name: 'Log Pain Level', description: 'Ask patient to rate pain on scale 1-10', category: 'Symptoms' },
    { id: 's3', name: 'Schedule Appointment', description: 'Open calendar to book a clinical visit', category: 'Action' },
    { id: 's4', name: 'Explain Medication', description: 'Provide details about dosage and side effects', category: 'Info' },
    { id: 's5', name: 'Emergency Contact', description: 'Show rapid response contact numbers', category: 'Safety' },
];

const documentItems: SideSheetItem[] = [
    { id: 'd1', name: 'Knee Rehab Guide', description: 'Standard post-op exercise protocols', category: 'Orthopedics' },
    { id: 'd2', name: 'Diabetes Nutrition', description: 'Low-glycemic diet recommendations', category: 'Chronic Care' },
    { id: 'd3', name: 'CBT for Anxiety', description: 'Weekly cognitive behavioral exercises', category: 'Mental Health' },
];

const planItems: SideSheetItem[] = [
    { id: 'p1', name: '6-Week Knee Recovery', description: 'Graduated recovery plan with 12 steps', category: 'Orthopedics' },
    { id: 'p2', name: 'BP Monitoring Plan', description: 'Daily checks for 4 weeks', category: 'Cardiology' },
    { id: 'p3', name: 'Standard Prenatal Care', description: 'Comprehensive trimester-based care', category: 'Obstetrics' },
];

const templateItems: SideSheetItem[] = [
    { id: 't1', name: 'Post-Surgery Standard', description: 'Base template for all surgical recovery', category: 'General' },
    { id: 't2', name: 'Chronic Disease Monitoring', description: 'Template for long-term symptom tracking', category: 'General' },
];

const followupItems: (SideSheetItem & { config?: { content: string; frequency: string; duration: string; time: string } })[] = [
    {
        id: 'f1',
        name: 'Post-Op Day 1 Check',
        description: 'First day follow-up after procedure',
        category: 'Recovery',
        config: {
            content: "Hi! Checking in on your first day of recovery. How are your symptoms today?",
            frequency: 'Daily',
            duration: '7',
            time: '09:00'
        }
    },
    {
        id: 'f2',
        name: 'Weekly Progress Review',
        description: 'Review of general health progress',
        category: 'General',
        config: {
            content: "Time for your weekly review! How has your mood and energy been over the past 7 days?",
            frequency: 'Weekly',
            duration: '30',
            time: '10:00'
        }
    }
];

interface Patient {
    name: string;
    countryCode: string;
    phoneNumber: string;
    appointment?: {
        title: string;
        date: string;
        time: string;
        cancellationPhone: string;
        instructions: string;
    };
}

export function ProtocolForm({ onClose, onSave, initialData, userRole }: ProtocolFormProps) {
    const [protocolTitle, setProtocolTitle] = useState(initialData?.name || '');
    const [aiRules, setAiRules] = useState(initialData?.aiRules || '');
    const [selectedShortcuts, setSelectedShortcuts] = useState<string[]>(initialData?.selectedShortcuts || []);
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>(initialData?.selectedDocuments || []);
    const [selectedPlans, setSelectedPlans] = useState<string[]>(initialData?.selectedPlans || []);
    const [followupMessage, setFollowupMessage] = useState(initialData?.followupMessage || '');
    const [followupType, setFollowupType] = useState<'periodical' | 'eventual'>('periodical');
    const [frequency, setFrequency] = useState('daily');
    const [duration, setDuration] = useState('7');
    const [preferredTime, setPreferredTime] = useState('09:00');
    const [scheduledEvents, setScheduledEvents] = useState<{ date: string; time: string; content: string }[]>([
        { date: '', time: '09:00', content: '' }
    ]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [editingPatientIndex, setEditingPatientIndex] = useState<number | null>(null);

    const isNewProtocol = !initialData;

    useEffect(() => {
        if (initialData) {
            setProtocolTitle(initialData.name || '');
        }
    }, [initialData]);

    const allSections = [
        {
            id: 'protocol-type' as const,
            label: 'Protocol Style',
            icon: Zap,
            required: true
        },
        {
            id: 'patient-details' as const,
            label: 'Patient Details',
            icon: UserIcon,
            required: true
        },
        {
            id: 'intent-shortcut' as const,
            label: 'Intent Shortcut',
            icon: FileText,
            required: false
        },
        {
            id: 'ai-rules' as const,
            label: 'AI Rules',
            icon: Brain,
            required: true
        },
        {
            id: 'knowledge-base' as const,
            label: 'Knowledge Base',
            icon: BookOpen,
            required: false
        },
        {
            id: 'plan-links' as const,
            label: 'Plan Links',
            icon: Link2,
            required: false
        },
        {
            id: 'follow-up' as const,
            label: 'Follow-up',
            icon: Bell,
            required: false
        }
    ];

    // Filter out patient-details for admin users
    const sections = userRole === 'admin' 
        ? allSections.filter(s => s.id !== 'patient-details')
        : allSections;

    const isSectionComplete = (sectionId: FormSection): boolean => {
        switch (sectionId) {
            case 'protocol-type': return protocolTitle.length > 0;
            case 'patient-details': return patients.length > 0 && patients.every(p => p.name.trim() && p.phoneNumber.trim());
            case 'ai-rules': return aiRules.length > 10;
            default: return true;
        }
    };

    const [activeSheet, setActiveSheet] = useState<SheetType>(null);
    const [tempSelection, setTempSelection] = useState<string[]>([]);
    const [visitedSections, setVisitedSections] = useState<Set<FormSection>>(new Set(['protocol-type']));

    const [testMessages, setTestMessages] = useState<TestMessage[]>([
        {
            id: '1',
            sender: 'bot',
            content: `Hello! I'm your AI health assistant. I'll be guiding you through this protocol. How can I help you today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [testInput, setTestInput] = useState('');

    const sectionRefs = {
        'protocol-type': useRef<HTMLElement>(null),
        'patient-details': useRef<HTMLElement>(null),
        'intent-shortcut': useRef<HTMLElement>(null),
        'ai-rules': useRef<HTMLElement>(null),
        'knowledge-base': useRef<HTMLElement>(null),
        'plan-links': useRef<HTMLElement>(null),
        'follow-up': useRef<HTMLElement>(null)
    };

    const scrollToSection = (sectionId: FormSection) => {
        setVisitedSections((prev) => new Set([...prev, sectionId]));
        sectionRefs[sectionId].current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    const completedCount = sections.filter((s) => isSectionComplete(s.id)).length;
    const progress = (completedCount / sections.length) * 100;

    const openSheet = (type: SheetType) => {
        setActiveSheet(type);
        if (type === 'shortcuts') setTempSelection([...selectedShortcuts]);
        else if (type === 'documents') setTempSelection([...selectedDocuments]);
        else if (type === 'plans') setTempSelection([...selectedPlans]);
        else if (type === 'followups') setTempSelection([]);
        else setTempSelection([]);
    };

    const handleSheetConfirm = () => {
        if (activeSheet === 'shortcuts') setSelectedShortcuts(tempSelection);
        else if (activeSheet === 'documents') setSelectedDocuments(tempSelection);
        else if (activeSheet === 'plans') setSelectedPlans(tempSelection);
        else if (activeSheet === 'followups') {
            if (tempSelection.length > 0) {
                const item = followupItems.find(f => f.id === tempSelection[tempSelection.length - 1]);
                if (item?.config) {
                    setFollowupMessage(item.config.content);
                    setFrequency(item.config.frequency);
                    setDuration(item.config.duration);
                    setPreferredTime(item.config.time);
                }
            }
        }
        else if (activeSheet === 'templates' && tempSelection.length > 0) {
            const template = templateItems.find((t) => t.id === tempSelection[0]);
            if (template) {
                setAiRules(`Protocol: ${template.name}. AI behavior simulation...`);
            }
        }
        setActiveSheet(null);
    };

    const removeItem = (type: 'shortcuts' | 'documents' | 'plans', id: string) => {
        if (type === 'shortcuts') setSelectedShortcuts((prev) => prev.filter((i) => i !== id));
        else if (type === 'documents') setSelectedDocuments((prev) => prev.filter((i) => i !== id));
        else if (type === 'plans') setSelectedPlans((prev) => prev.filter((i) => i !== id));
    };

    const handleAddPatient = () => {
        const newIndex = patients.length;
        setPatients([...patients, { name: '', countryCode: '+1', phoneNumber: '' }]);
        setEditingPatientIndex(newIndex);
    };

    const handleRemovePatient = (index: number) => {
        setPatients(patients.filter((_, i) => i !== index));
        if (editingPatientIndex === index) setEditingPatientIndex(null);
    };

    const handleUpdatePatient = (index: number, field: keyof Patient, value: any) => {
        const newPatients = [...patients];
        newPatients[index] = { ...newPatients[index], [field]: value };
        setPatients(newPatients);
    };

    const handleUpdateAppointment = (index: number, field: string, value: string) => {
        const newPatients = [...patients];
        const patient = newPatients[index];
        if (patient.appointment) {
            patient.appointment = { ...patient.appointment, [field]: value };
            setPatients(newPatients);
        }
    };

    const toggleAppointment = (index: number) => {
        const newPatients = [...patients];
        if (newPatients[index].appointment) {
            delete newPatients[index].appointment;
        } else {
            newPatients[index].appointment = {
                title: '',
                date: '',
                time: '09:00',
                cancellationPhone: '',
                instructions: ''
            };
        }
        setPatients(newPatients);
    };

    const handleSendTestMessage = () => {
        if (!testInput.trim() || isNewProtocol) return;
        const newMessages: TestMessage[] = [
            ...testMessages,
            {
                id: Date.now().toString(),
                sender: 'user',
                content: testInput,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ];
        setTestMessages(newMessages);
        setTestInput('');
        setTimeout(() => {
            setTestMessages([
                ...newMessages,
                {
                    id: (Date.now() + 1).toString(),
                    sender: 'bot',
                    content: "This is a simulated AI response based on the protocol rules.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }, 1000);
    };

    const getItemById = (type: 'shortcuts' | 'documents' | 'plans', id: string) => {
        if (type === 'shortcuts') return shortcutItems.find((i) => i.id === id);
        if (type === 'documents') return documentItems.find((i) => i.id === id);
        if (type === 'plans') return planItems.find((i) => i.id === id);
        return null;
    };

    const renderSelectedItems = (type: 'shortcuts' | 'documents' | 'plans', ids: string[]) => {
        if (ids.length === 0) return null;
        return (
            <div className="space-y-3">
                {ids.map((id) => {
                    const item = getItemById(type, id);
                    if (!item) return null;
                    return (
                        <div key={id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg group hover:border-gray-300 hover:shadow-sm transition-all">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-gray-50 flex items-center justify-center">
                                    {type === 'shortcuts' && <Zap size={16} className="text-gray-600" />}
                                    {type === 'documents' && <FileText size={16} className="text-gray-600" />}
                                    {type === 'plans' && <Link2 size={16} className="text-gray-600" />}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.category}</p>
                                </div>
                            </div>
                            {userRole === 'admin' && (
                                <button onClick={() => removeItem(type, id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex h-full bg-gray-50">
            {/* Sidebar - Minimized */}
            <div className="w-48 bg-white border-r border-gray-200 py-4 flex-shrink-0 flex flex-col">
                <div className="px-3 mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide">Progress</span>
                        <span className="text-xs font-bold text-gray-900">{completedCount}/{sections.length}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <div className="px-3 mb-3 font-semibold text-[10px] text-gray-500 uppercase tracking-wider">Steps</div>
                <nav className="flex-1 px-2 space-y-1">
                    {sections.map((section, index) => {
                        const isComplete = isSectionComplete(section.id);
                        const isVisited = visitedSections.has(section.id);
                        return (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full flex items-center gap-2 px-2 py-2 text-xs rounded-lg transition-all ${isVisited ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                <div className={`h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${isComplete ? 'bg-green-100 text-green-700' : isVisited ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    {isComplete ? <Check size={12} /> : index + 1}
                                </div>
                                <span className="font-medium flex-1 text-left truncate">{section.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50 flex">
                <div className="flex-1 overflow-y-auto pb-20">
                    <div className="max-w-3xl mx-auto pt-8 px-8 space-y-12">
                        {/* Section 1: Protocol Style */}
                        <section ref={sectionRefs['protocol-type']} className="scroll-mt-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center"><Zap size={18} className="text-blue-600" /></div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Protocol Style</h3>
                                    <p className="text-sm text-gray-500">Basic configuration and title</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Protocol Title *</label>
                                <input
                                    type="text"
                                    value={protocolTitle}
                                    onChange={(e) => setProtocolTitle(e.target.value)}
                                    placeholder="e.g. Post-Op Recovery"
                                    disabled={userRole === 'clinic'}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm disabled:bg-gray-100"
                                />
                            </div>
                        </section>

                        {/* Section: Patient Details - Hidden for admin users */}
                        {userRole !== 'admin' && (
                            <section
                                ref={sectionRefs['patient-details']}
                                className="scroll-mt-6">

                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <UserIcon size={18} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                Patient Details (Multiple)
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Add patients who will use this protocol
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 shadow-sm"
                                        onClick={handleAddPatient}>
                                        <Plus size={14} />
                                        Add Patient
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {patients.map((patient, index) => {
                                        const isEditing = editingPatientIndex === index;

                                        if (!isEditing) {
                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => setEditingPatientIndex(index)}
                                                    className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between group cursor-pointer hover:border-blue-400 hover:shadow-md transition-all animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-100">
                                                            <UserIcon size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">
                                                                {patient.name || 'Unnamed Patient'}
                                                            </p>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                                    <Phone size={12} />
                                                                    {patient.countryCode} {patient.phoneNumber || 'No number'}
                                                                </span>
                                                                {patient.appointment && (
                                                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                                                                        <Calendar size={10} />
                                                                        Appointment Scheduled
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemovePatient(index);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                            <Trash2 size={16} />
                                                        </button>
                                                        <div className="p-2 text-gray-400 group-hover:text-blue-600 transition-colors">
                                                            <ChevronRight size={20} />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 relative group transition-all animate-in zoom-in-95 duration-200 shadow-sm">
                                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                                            <Edit2 size={16} />
                                                        </div>
                                                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Edit Patient Details</h4>
                                                    </div>
                                                    <button
                                                        onClick={() => setEditingPatientIndex(null)}
                                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                                                    >
                                                        Save
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Full Name</label>
                                                        <input
                                                            type="text"
                                                            value={patient.name}
                                                            onChange={(e) => handleUpdatePatient(index, 'name', e.target.value)}
                                                            placeholder="Enter patient's full name"
                                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm transition-all bg-gray-50/30"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Country Code</label>
                                                        <select
                                                            value={patient.countryCode}
                                                            onChange={(e) => handleUpdatePatient(index, 'countryCode', e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm transition-all bg-gray-50/30"
                                                        >
                                                            <option value="+1">🇺🇸 +1 (USA)</option>
                                                            <option value="+44">🇬🇧 +44 (UK)</option>
                                                            <option value="+34">🇪🇸 +34 (ES)</option>
                                                            <option value="+52">🇲🇽 +52 (MX)</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Phone Number</label>
                                                        <input
                                                            type="tel"
                                                            value={patient.phoneNumber}
                                                            onChange={(e) => handleUpdatePatient(index, 'phoneNumber', e.target.value)}
                                                            placeholder="e.g. 555-0123"
                                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm transition-all bg-gray-50/30"
                                                        />
                                                    </div>

                                                    <div className="md:col-span-2 pt-4 border-t border-gray-50">
                                                        <div className="flex items-center justify-between mb-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${patient.appointment ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                                                    <Calendar size={18} />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-semibold text-gray-900">Appointment Details</h4>
                                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Optional Information</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${patient.appointment ? 'text-blue-600' : 'text-gray-400'}`}>
                                                                    {patient.appointment ? 'Enabled' : 'Disabled'}
                                                                </span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        toggleAppointment(index);
                                                                    }}
                                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 outline-none focus:ring-2 focus:ring-blue-500/20 ${patient.appointment ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${patient.appointment ? 'translate-x-6' : 'translate-x-1'}`} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {patient.appointment && (
                                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 bg-gray-50/30 p-4 rounded-xl border border-gray-100">
                                                                <div>
                                                                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Appointment Title</label>
                                                                    <input
                                                                        type="text"
                                                                        value={patient.appointment.title}
                                                                        onChange={(e) => handleUpdateAppointment(index, 'title', e.target.value)}
                                                                        placeholder="e.g. Post-Op Follow-up"
                                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm transition-all bg-white"
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Date</label>
                                                                        <input
                                                                            type="date"
                                                                            value={patient.appointment.date}
                                                                            onChange={(e) => handleUpdateAppointment(index, 'date', e.target.value)}
                                                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm transition-all bg-white"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Time</label>
                                                                        <input
                                                                            type="time"
                                                                            value={patient.appointment.time}
                                                                            onChange={(e) => handleUpdateAppointment(index, 'time', e.target.value)}
                                                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm transition-all bg-white"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="md:col-span-2">
                                                                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Instructions</label>
                                                                    <textarea
                                                                        value={patient.appointment.instructions}
                                                                        onChange={(e) => handleUpdateAppointment(index, 'instructions', e.target.value)}
                                                                        placeholder="e.g. Please bring your medical records..."
                                                                        rows={2}
                                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm transition-all resize-none bg-white font-sans"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {patients.length === 0 && (
                                        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-10 text-center">
                                            <UserIcon size={32} className="text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm font-medium text-gray-500">No patients assigned yet</p>
                                            <button onClick={handleAddPatient} className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-700">Add your first patient</button>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Section 2: Intent Shortcut */}
                        <section ref={sectionRefs['intent-shortcut']} className="scroll-mt-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center"><FileText size={18} className="text-purple-600" /></div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Intent Shortcuts</h3>
                                        <p className="text-sm text-gray-500">Quick actions for the AI</p>
                                    </div>
                                </div>
                                {userRole === 'admin' && (
                                    <button onClick={() => openSheet('shortcuts')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all">
                                        <Plus size={14} /> Add Shortcut
                                    </button>
                                )}
                            </div>
                            <div className="bg-gray-50/50 rounded-xl border border-dashed border-gray-300 p-6">
                                {selectedShortcuts.length > 0 ? renderSelectedItems('shortcuts', selectedShortcuts) : <p className="text-center text-sm text-gray-400 py-4">No shortcuts selected</p>}
                            </div>
                        </section>

                        {/* Section 3: AI Rules */}
                        <section ref={sectionRefs['ai-rules']} className="scroll-mt-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center"><Brain size={18} className="text-amber-600" /></div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">AI Rules</h3>
                                        <p className="text-sm text-gray-500">Clinical logic and behavior</p>
                                    </div>
                                </div>
                                {userRole === 'admin' && (
                                    <button onClick={() => openSheet('templates')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all">
                                        <BookOpen size={14} /> Use Template
                                    </button>
                                )}
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <textarea
                                    value={aiRules}
                                    onChange={(e) => setAiRules(e.target.value)}
                                    disabled={userRole === 'clinic'}
                                    placeholder="Enter your clinical instructions here..."
                                    className="w-full p-4 min-h-[160px] text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none disabled:bg-gray-100"
                                />
                            </div>
                        </section>

                        {/* Section 4: Knowledge Base */}
                        <section ref={sectionRefs['knowledge-base']} className="scroll-mt-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center"><BookOpen size={18} className="text-green-600" /></div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Knowledge Base</h3>
                                        <p className="text-sm text-gray-500">Reference clinical documents</p>
                                    </div>
                                </div>
                                {userRole === 'admin' && (
                                    <button onClick={() => openSheet('documents')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-all">
                                        <Plus size={14} /> Add Document
                                    </button>
                                )}
                            </div>
                            <div className="bg-gray-50/50 rounded-xl border border-dashed border-gray-300 p-6">
                                {selectedDocuments.length > 0 ? renderSelectedItems('documents', selectedDocuments) : <p className="text-center text-sm text-gray-400 py-4">No documents selected</p>}
                            </div>
                        </section>

                        {/* Section 5: Plan Links */}
                        <section ref={sectionRefs['plan-links']} className="scroll-mt-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center"><Link2 size={18} className="text-indigo-600" /></div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Plan Links</h3>
                                        <p className="text-sm text-gray-500">Connect care plans</p>
                                    </div>
                                </div>
                                {userRole === 'admin' && (
                                    <button onClick={() => openSheet('plans')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all">
                                        <Plus size={14} /> Link Plan
                                    </button>
                                )}
                            </div>
                            <div className="bg-gray-50/50 rounded-xl border border-dashed border-gray-300 p-6">
                                {selectedPlans.length > 0 ? renderSelectedItems('plans', selectedPlans) : <p className="text-center text-sm text-gray-400 py-4">No plans linked</p>}
                            </div>
                        </section>

                        {/* Section 6: Follow-up */}
                        <section ref={sectionRefs['follow-up']} className="mb-12 scroll-mt-6 pb-20">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-pink-100 flex items-center justify-center">
                                    <Bell size={18} className="text-pink-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Follow-up Messages
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Automated patient check-ins
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Schedule Type
                                    </label>
                                    <div className="inline-flex rounded-lg bg-gray-100 p-1">
                                        <button
                                            onClick={() => userRole !== 'clinic' && setFollowupType('periodical')}
                                            disabled={userRole === 'clinic'}
                                            className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all ${followupType === 'periodical' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'} ${userRole === 'clinic' ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                            Periodic
                                        </button>
                                        <button
                                            onClick={() => userRole !== 'clinic' && setFollowupType('eventual')}
                                            disabled={userRole === 'clinic'}
                                            className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all ${followupType === 'eventual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'} ${userRole === 'clinic' ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                            Event-based
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3">
                                        {followupType === 'periodical' ?
                                            'Send messages on a regular schedule' :
                                            'Send messages triggered by specific events'}
                                    </p>
                                </div>

                                {followupType === 'periodical' && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Message Content
                                            </label>
                                            {userRole === 'admin' && (
                                                <button
                                                    onClick={() => openSheet('followups')}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-lg transition-all"
                                                >
                                                    <Plus size={14} />
                                                    Select from Library
                                                </button>
                                            )}
                                        </div>

                                        <textarea
                                            value={followupMessage}
                                            onChange={(e) =>
                                                setFollowupMessage(e.target.value.slice(0, 500))
                                            }
                                            disabled={userRole === 'clinic'}
                                            placeholder="Hi! Just checking in on how you're feeling today..."
                                            className="w-full p-4 min-h-[120px] text-sm text-gray-900 border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all disabled:bg-gray-50 disabled:text-gray-500" />

                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xs text-gray-500">
                                                Personalized messages improve engagement
                                            </p>
                                            <span
                                                className={`text-xs font-medium ${followupMessage.length > 450 ? 'text-orange-500' : 'text-gray-500'}`}>
                                                {followupMessage.length}/500
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {followupType === 'periodical' ? (
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                                                <Clock size={14} />
                                                Frequency
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={frequency}
                                                    onChange={(e) => setFrequency(e.target.value)}
                                                    disabled={userRole === 'clinic'}
                                                    className="w-full appearance-none px-3 py-2.5 pr-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all disabled:bg-gray-50 disabled:text-gray-500">
                                                    <option value="daily">Daily</option>
                                                    <option value="weekly">Weekly</option>
                                                    <option value="monthly">Monthly</option>
                                                </select>
                                                <ChevronDown
                                                    size={16}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                                                <Calendar size={14} />
                                                Duration (days)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="50"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                disabled={userRole === 'clinic'}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:bg-gray-50 disabled:text-gray-500" />
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                                                <Clock size={14} />
                                                Preferred Time
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={preferredTime}
                                                    onChange={(e) => setPreferredTime(e.target.value)}
                                                    disabled={userRole === 'clinic'}
                                                    className="w-full appearance-none px-3 py-2.5 pr-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all disabled:bg-gray-50 disabled:text-gray-500">
                                                    <option value="09:00">09:00 (9:00 AM)</option>
                                                    <option value="10:00">10:00 (10:00 AM)</option>
                                                    <option value="12:00">12:00 (12:00 PM)</option>
                                                    <option value="14:00">14:00 (2:00 PM)</option>
                                                    <option value="16:00">16:00 (4:00 PM)</option>
                                                    <option value="18:00">18:00 (6:00 PM)</option>
                                                </select>
                                                <ChevronDown
                                                    size={16}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {userRole === 'admin' && (
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setScheduledEvents([{ date: '', time: '09:00', content: '' }, ...scheduledEvents]);
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all shadow-sm border border-blue-100"
                                                >
                                                    <Plus size={14} />
                                                    Add Another Event
                                                </button>
                                            </div>
                                        )}

                                        {scheduledEvents.map((event, index) => (
                                            <div key={index} className="p-4 bg-gray-50/50 border border-gray-200 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 relative group">
                                                {scheduledEvents.length > 1 && userRole === 'admin' && (
                                                    <button
                                                        onClick={() => setScheduledEvents(scheduledEvents.filter((_, i) => i !== index))}
                                                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Remove event"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}

                                                <div className="grid grid-cols-2 gap-4 mr-10">
                                                    <div>
                                                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                                                            <Calendar size={14} />
                                                            Event Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={event.date}
                                                            onChange={(e) => {
                                                                const newEvents = [...scheduledEvents];
                                                                newEvents[index].date = e.target.value;
                                                                setScheduledEvents(newEvents);
                                                            }}
                                                            disabled={userRole === 'clinic'}
                                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all shadow-sm disabled:bg-gray-50 disabled:text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                                                            <Clock size={14} />
                                                            Preferred Time
                                                        </label>
                                                        <div className="relative">
                                                            <select
                                                                value={event.time}
                                                                onChange={(e) => {
                                                                    const newEvents = [...scheduledEvents];
                                                                    newEvents[index].time = e.target.value;
                                                                    setScheduledEvents(newEvents);
                                                                }}
                                                                disabled={userRole === 'clinic'}
                                                                className="w-full appearance-none px-3 py-2.5 pr-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all shadow-sm disabled:bg-gray-50 disabled:text-gray-500">
                                                                <option value="09:00">09:00 (9:00 AM)</option>
                                                                <option value="10:00">10:00 (10:00 AM)</option>
                                                                <option value="12:00">12:00 (12:00 PM)</option>
                                                                <option value="14:00">14:00 (2:00 PM)</option>
                                                                <option value="16:00">16:00 (4:00 PM)</option>
                                                                <option value="18:00">18:00 (6:00 PM)</option>
                                                            </select>
                                                            <ChevronDown
                                                                size={16}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message Content</label>
                                                    <textarea
                                                        value={event.content}
                                                        onChange={(e) => {
                                                            const newEvents = [...scheduledEvents];
                                                            newEvents[index].content = e.target.value.slice(0, 500);
                                                            setScheduledEvents(newEvents);
                                                        }}
                                                        disabled={userRole === 'clinic'}
                                                        placeholder="Enter custom content for this event..."
                                                        className="w-full p-3 min-h-[80px] text-sm text-gray-900 border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white resize-none transition-all shadow-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                    />
                                                    <div className="flex justify-end mt-1">
                                                        <span className={`text-[10px] font-medium ${event.content.length > 450 ? 'text-orange-500' : 'text-gray-400'}`}>
                                                            {event.content.length}/500
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Right sidebar: Test Chatbot - Minimized */}
                <div className="w-64 border-l border-gray-200 bg-gray-50 flex flex-col pt-3">
                    <div className="px-4 mb-4">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Preview</h3>
                        </div>
                        <p className="text-[10px] text-gray-500">Test protocol</p>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 space-y-3">
                        {testMessages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[90%] rounded-xl px-3 py-2 text-xs ${msg.sender === 'bot' ? 'bg-white text-gray-900 border border-gray-200 shadow-sm' : 'bg-gray-900 text-white'}`}>
                                    {msg.content}
                                </div>
                                <span className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">{msg.sender === 'bot' ? 'AI' : 'User'}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 bg-white border-t border-gray-200">
                        <div className="relative flex items-end gap-1.5 bg-gray-50 border border-gray-200 rounded-xl p-1.5">
                            <textarea
                                value={testInput}
                                onChange={(e) => setTestInput(e.target.value)}
                                disabled={isNewProtocol}
                                placeholder={isNewProtocol ? 'Save first' : 'Type...'}
                                className="flex-1 min-h-[32px] max-h-24 bg-transparent border-none focus:ring-0 text-xs py-1.5 px-1 resize-none"
                            />
                            <button onClick={handleSendTestMessage} disabled={!testInput.trim() || isNewProtocol} className="h-8 w-8 rounded-lg flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 transition-all flex-shrink-0">
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sheets */}
            <SideSheet isOpen={activeSheet === 'shortcuts'} onClose={() => setActiveSheet(null)} title="Add Shortcuts" description="Select shortcuts" items={shortcutItems} selectedIds={tempSelection} onSelectionChange={setTempSelection} onConfirm={handleSheetConfirm} searchPlaceholder="Search..." />
            <SideSheet isOpen={activeSheet === 'documents'} onClose={() => setActiveSheet(null)} title="Add Knowledge" description="Select documents" items={documentItems} selectedIds={tempSelection} onSelectionChange={setTempSelection} onConfirm={handleSheetConfirm} searchPlaceholder="Search..." />
            <SideSheet isOpen={activeSheet === 'plans'} onClose={() => setActiveSheet(null)} title="Link Plans" description="Connect plans" items={planItems} selectedIds={tempSelection} onSelectionChange={setTempSelection} onConfirm={handleSheetConfirm} searchPlaceholder="Search..." />
            <SideSheet isOpen={activeSheet === 'templates'} onClose={() => setActiveSheet(null)} title="Templates" description="Select template" items={templateItems} selectedIds={tempSelection} onSelectionChange={(ids) => setTempSelection(ids.slice(-1))} onConfirm={handleSheetConfirm} searchPlaceholder="Search..." />
            <SideSheet isOpen={activeSheet === 'followups'} onClose={() => setActiveSheet(null)} title="Follow-up Library" description="Choose message" items={followupItems} selectedIds={tempSelection} onSelectionChange={setTempSelection} onConfirm={handleSheetConfirm} searchPlaceholder="Search..." />
        </div>
    );
}
