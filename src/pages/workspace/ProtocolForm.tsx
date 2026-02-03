import { useState, useRef, useEffect } from 'react';
import {
    Plus,
    Clock,
    Calendar,
    ChevronDown,
    Check,
    BookOpen,
    Zap,
    Brain,
    FileText,
    Bell,
    X,
    ExternalLink,
    Link2,
    Send,
    Bot,
    Trash2,
    User
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SideSheet, SideSheetItem } from '../../components/ui/SideSheet';

interface TestMessage {
    id: string;
    sender: 'user' | 'bot';
    content: string;
    timestamp: string;
}

interface ProtocolFormProps {
    onClose: () => void;
    onSave: () => void;
    initialData?: any;
}

type FormSection =
    | 'protocol-type'
    | 'intent-shortcut'
    | 'ai-rules'
    | 'knowledge-base'
    | 'plan-links'
    | 'follow-up';

type SheetType = 'shortcuts' | 'documents' | 'plans' | 'templates' | 'followups' | null;

const followupItems: (SideSheetItem & { config?: { content: string; frequency: string; duration: string; time: string } })[] = [
    {
        id: 'f1',
        name: 'Weekly Health Check',
        description: 'Periodic check-in on general wellness',
        category: 'Routine',
        config: {
            content: "Hi! I'm checking in to see how your week has been. How are you feeling overall?",
            frequency: 'weekly',
            duration: '30',
            time: '10:00'
        }
    },
    {
        id: 'f2',
        name: 'Medication Adherence',
        description: 'Verify patient is taking prescribed meds',
        category: 'Adherence',
        config: {
            content: "Just a reminder to take your prescribed medications. Have you been able to follow your schedule today?",
            frequency: 'daily',
            duration: '14',
            time: '09:00'
        }
    },
    {
        id: 'f3',
        name: 'Post-Op Monitoring',
        description: 'Monitor recovery progress after surgery',
        category: 'Recovery',
        config: {
            content: "I'm monitoring your post-op recovery. Are you experiencing any unusual pain or symptoms today?",
            frequency: 'daily',
            duration: '7',
            time: '12:00'
        }
    },
    {
        id: 'f4',
        name: 'Dietary Log Reminder',
        description: 'Remind patient to log their meals',
        category: 'Nutrition',
        config: {
            content: "Don't forget to log your meals for today! Keeping an accurate record helps us monitor your nutritional progress.",
            frequency: 'daily',
            duration: '30',
            time: '18:00'
        }
    }
];

// Sample data for the side sheets
const shortcutItems: SideSheetItem[] = [
    {
        id: 's1',
        name: 'Check Symptoms',
        description: 'Ask about current symptoms and severity',
        category: 'Triage'
    },
    {
        id: 's2',
        name: 'Medication Reminder',
        description: 'Remind patient about medication schedule',
        category: 'Adherence'
    },
    {
        id: 's3',
        name: 'Schedule Appointment',
        description: 'Help patient book a follow-up visit',
        category: 'Scheduling'
    },
    {
        id: 's4',
        name: 'Emergency Escalation',
        description: 'Detect and escalate emergency situations',
        category: 'Safety'
    },
    {
        id: 's5',
        name: 'Pain Assessment',
        description: 'Evaluate pain levels using standard scales',
        category: 'Assessment'
    },
    {
        id: 's6',
        name: 'Diet Tracking',
        description: 'Log and monitor dietary intake',
        category: 'Nutrition'
    },
    {
        id: 's7',
        name: 'Exercise Log',
        description: 'Track physical activity and exercise',
        category: 'Fitness'
    },
    {
        id: 's8',
        name: 'Mood Check',
        description: 'Assess emotional wellbeing and mood',
        category: 'Mental Health'
    }
];

const documentItems: SideSheetItem[] = [
    {
        id: 'd1',
        name: 'Diabetes Care Guidelines',
        description: 'Standard protocols for diabetes management',
        category: 'Guidelines'
    },
    {
        id: 'd2',
        name: 'Medication Reference',
        description: 'Common medications and interactions',
        category: 'Reference'
    },
    {
        id: 'd3',
        name: 'Post-Surgery Care',
        description: 'Recovery instructions after surgery',
        category: 'Instructions'
    },
    {
        id: 'd4',
        name: 'Nutrition Guide',
        description: 'Dietary recommendations and meal plans',
        category: 'Nutrition'
    },
    {
        id: 'd5',
        name: 'Exercise Programs',
        description: 'Physical therapy and exercise routines',
        category: 'Fitness'
    },
    {
        id: 'd6',
        name: 'FAQ Document',
        description: 'Frequently asked questions and answers',
        category: 'FAQ'
    }
];

const planItems: SideSheetItem[] = [
    {
        id: 'p1',
        name: 'Diabetes Management Plan',
        description: '12-week comprehensive care plan',
        category: 'Chronic Care'
    },
    {
        id: 'p2',
        name: 'Post-Op Recovery',
        description: '6-week surgical recovery protocol',
        category: 'Surgery'
    },
    {
        id: 'p3',
        name: 'Weight Loss Program',
        description: '16-week weight management plan',
        category: 'Wellness'
    },
    {
        id: 'p4',
        name: 'Cardiac Rehab',
        description: '8-week heart health program',
        category: 'Cardiology'
    },
    {
        id: 'p5',
        name: 'Mental Health Support',
        description: '4-week anxiety management plan',
        category: 'Mental Health'
    }
];

const templateItems: SideSheetItem[] = [
    {
        id: 't1',
        name: 'General Health Protocol',
        description: 'Standard empathetic health guidance',
        category: 'General'
    },
    {
        id: 't2',
        name: 'Post-Surgery Recovery',
        description: 'Focus on medication, activity, and wound care',
        category: 'Surgery'
    },
    {
        id: 't3',
        name: 'Medication Adherence',
        description: 'Reminder-focused with education components',
        category: 'Adherence'
    },
    {
        id: 't4',
        name: 'Mental Wellbeing',
        description: 'Supportive, mindfulness-oriented approach',
        category: 'Mental Health'
    },
    {
        id: 't5',
        name: 'Chronic Care Protocol',
        description: 'Long-term monitoring and lifestyle coaching',
        category: 'Chronic Care'
    }
];

export function ProtocolForm({ onClose, onSave, initialData }: ProtocolFormProps) {
    const isNewProtocol = !initialData;
    const [protocolType, setProtocolType] = useState<'general' | 'personalized'>('general');
    const [protocolTitle, setProtocolTitle] = useState('');
    const [aiRules, setAiRules] = useState('');
    const [followupType, setFollowupType] = useState<'periodical' | 'eventual'>('periodical');
    const [followupMessage, setFollowupMessage] = useState('');
    const [frequency, setFrequency] = useState('daily');
    const [duration, setDuration] = useState('7');
    const [preferredTime, setPreferredTime] = useState('09:00');
    const [scheduledEvents, setScheduledEvents] = useState<{ date: string; time: string; content: string }[]>([
        { date: '', time: '09:00', content: '' }
    ]);

    // Selected items for each section
    const [selectedShortcuts, setSelectedShortcuts] = useState<string[]>([]);
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
    const [selectedPlans, setSelectedPlans] = useState<string[]>([]);

    // Side sheet state
    const [activeSheet, setActiveSheet] = useState<SheetType>(null);
    const [tempSelection, setTempSelection] = useState<string[]>([]);

    // Track which sections have been visited
    const [visitedSections, setVisitedSections] = useState<Set<FormSection>>(
        new Set(['protocol-type'])
    );

    // Test chatbot state
    const [testMessages, setTestMessages] = useState<TestMessage[]>([
        {
            id: '1',
            sender: 'bot',
            content: `Hello! I'm your AI health assistant. I'll be guiding you through this protocol. How can I help you today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [testInput, setTestInput] = useState('');

    // Refs for scrolling
    const sectionRefs = {
        'protocol-type': useRef<HTMLElement>(null),
        'intent-shortcut': useRef<HTMLElement>(null),
        'ai-rules': useRef<HTMLElement>(null),
        'knowledge-base': useRef<HTMLElement>(null),
        'plan-links': useRef<HTMLElement>(null),
        'follow-up': useRef<HTMLElement>(null)
    };

    useEffect(() => {
        if (initialData) {
            setProtocolTitle(initialData.name || '');
            // Additional mapping if needed
        }
    }, [initialData]);

    const sections = [
        {
            id: 'protocol-type' as const,
            label: 'Protocol Style',
            icon: Zap,
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

    const isSectionComplete = (sectionId: FormSection): boolean => {
        switch (sectionId) {
            case 'protocol-type':
                return protocolTitle.trim().length > 0;
            case 'intent-shortcut':
                return selectedShortcuts.length > 0;
            case 'ai-rules':
                return aiRules.trim().length > 0;
            case 'knowledge-base':
                return selectedDocuments.length > 0;
            case 'plan-links':
                return selectedPlans.length > 0;
            case 'follow-up':
                return followupMessage.trim().length > 0;
            default:
                return visitedSections.has(sectionId);
        }
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

    // Sheet handlers
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
                setAiRules(
                    `Protocol: ${template.name}. ${template.description}. AI behavior: Support patients during their health journey following these specific clinical guidelines...`
                );
            }
        }
        setActiveSheet(null);
    };

    const removeItem = (type: 'shortcuts' | 'documents' | 'plans', id: string) => {
        if (type === 'shortcuts') setSelectedShortcuts((prev) => prev.filter((i) => i !== id));
        else if (type === 'documents') setSelectedDocuments((prev) => prev.filter((i) => i !== id));
        else if (type === 'plans') setSelectedPlans((prev) => prev.filter((i) => i !== id));
    };

    const handleSendTestMessage = () => {
        if (!testInput.trim() || isNewProtocol) return;

        const userMessage: TestMessage = {
            id: Date.now().toString(),
            sender: 'user',
            content: testInput,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setTestMessages((prev) => [...prev, userMessage]);
        setTestInput('');

        setTimeout(() => {
            const botMessage: TestMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                content: `Simulated Response: Based on the ${protocolTitle || 'selected'} protocol rules, I'll assist you with your health monitoring task.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setTestMessages((prev) => [...prev, botMessage]);
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
                        <div
                            key={id}
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg group hover:border-gray-300 hover:shadow-sm transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-gray-50 flex items-center justify-center">
                                    {type === 'shortcuts' && <Zap size={16} className="text-gray-600" />}
                                    {type === 'documents' && <FileText size={16} className="text-gray-600" />}
                                    {type === 'plans' && <Link2 size={16} className="text-gray-600" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                        {type === 'plans' && (
                                            <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                                                <ExternalLink size={13} />
                                            </a>
                                        )}
                                    </div>
                                    {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                                </div>
                            </div>
                            <button
                                onClick={() => removeItem(type, id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex h-full bg-gray-50">
            {/* Left sidebar */}
            <div className="w-60 bg-white border-r border-gray-200 py-6 flex-shrink-0 flex flex-col">
                <div className="px-5 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Progress</span>
                        <span className="text-sm font-bold text-gray-900">
                            {completedCount}/{sections.length}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="px-5 mb-4">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Setup Steps</h2>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    {sections.map((section, index) => {
                        const isComplete = isSectionComplete(section.id);
                        const isVisited = visitedSections.has(section.id);
                        return (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${isVisited ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <div
                                    className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${isComplete ? 'bg-green-100 text-green-700' : isVisited ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'
                                        }`}
                                >
                                    {isComplete ? <Check size={16} /> : index + 1}
                                </div>
                                <span className={`font-medium flex-1 text-left ${isComplete || isVisited ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {section.label}
                                </span>
                                {section.required && !isComplete && <span className="text-red-500 text-xs font-bold">*</span>}
                            </button>
                        );
                    })}
                </nav>

                <div className="px-5 pt-4 border-t border-gray-100 mt-4">
                    <p className="text-xs text-gray-500">
                        <span className="text-red-500 font-bold">*</span> Required fields
                    </p>
                </div>
            </div>

            {/* Middle content area */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="max-w-3xl mx-auto py-8 px-8">
                    {/* Section 1: Protocol Style */}
                    <section ref={sectionRefs['protocol-type']} className="mb-12 scroll-mt-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Zap size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Protocol Style</h3>
                                <p className="text-sm text-gray-500">Define the basic configuration</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Type</label>
                                <div className="inline-flex rounded-lg bg-gray-100 p-1">
                                    <button
                                        onClick={() => setProtocolType('general')}
                                        className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all ${protocolType === 'general' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        General
                                    </button>
                                    <button
                                        onClick={() => setProtocolType('personalized')}
                                        className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all ${protocolType === 'personalized' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Personalized
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                    {protocolType === 'general'
                                        ? 'General protocols apply standard rules for all patients'
                                        : 'Personalized protocols adapt clinical rules to individual needs'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Protocol Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={protocolTitle}
                                    onChange={(e) => setProtocolTitle(e.target.value)}
                                    placeholder="e.g. Chronic Care Management"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm placeholder:text-gray-400 transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="h-8" />

                    {/* Section 2: Intent Shortcut */}
                    <section ref={sectionRefs['intent-shortcut']} className="mb-12 scroll-mt-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <FileText size={18} className="text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Intent Shortcut</h3>
                                    <p className="text-sm text-gray-500">Quick actions the AI can recognize</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2 shadow-sm" onClick={() => openSheet('shortcuts')}>
                                <Plus size={14} />
                                Add Shortcut
                            </Button>
                        </div>

                        {selectedShortcuts.length === 0 ? (
                            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-10 text-center hover:border-gray-300 transition-colors">
                                <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <FileText size={22} className="text-purple-400" />
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mb-1">No intent shortcuts added</p>
                                <p className="text-xs text-gray-500 max-w-md mx-auto">Shortcuts help the AI quickly recognize clinical intent</p>
                            </div>
                        ) : (
                            renderSelectedItems('shortcuts', selectedShortcuts)
                        )}
                    </section>

                    <div className="h-8" />

                    {/* Section 3: AI Rules */}
                    <section ref={sectionRefs['ai-rules']} className="mb-12 scroll-mt-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                                    <Brain size={18} className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        AI Rules <span className="text-red-500">*</span>
                                    </h3>
                                    <p className="text-sm text-gray-500">Define how the AI handles this protocol</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2 shadow-sm" onClick={() => openSheet('templates')}>
                                <BookOpen size={14} />
                                Templates
                            </Button>
                        </div>

                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                            <textarea
                                value={aiRules}
                                onChange={(e) => setAiRules(e.target.value)}
                                placeholder="Define protocol clinical logic and behavior..."
                                className="w-full p-5 min-h-[200px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none leading-relaxed"
                            />
                            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                                <p className="text-xs text-gray-500">Tip: Include clinical boundaries and escalation criteria</p>
                                <span className="text-xs font-medium text-gray-500">{aiRules.length} characters</span>
                            </div>
                        </div>
                    </section>

                    <div className="h-8" />

                    {/* Section 4: Knowledge Base */}
                    <section ref={sectionRefs['knowledge-base']} className="mb-12 scroll-mt-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <BookOpen size={18} className="text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Knowledge Base</h3>
                                    <p className="text-sm text-gray-500">Clinical reference materials</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2 shadow-sm" onClick={() => openSheet('documents')}>
                                <Plus size={14} />
                                Add Document
                            </Button>
                        </div>

                        {selectedDocuments.length === 0 ? (
                            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-10 text-center hover:border-gray-300 transition-colors">
                                <div className="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <BookOpen size={22} className="text-orange-400" />
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mb-1">No knowledge base items</p>
                                <p className="text-xs text-gray-500 max-w-md mx-auto">Add clinical guidelines or reference docs for AI use</p>
                            </div>
                        ) : (
                            renderSelectedItems('documents', selectedDocuments)
                        )}
                    </section>

                    <div className="h-8" />

                    {/* Section 5: Plan Links */}
                    <section ref={sectionRefs['plan-links']} className="mb-12 scroll-mt-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                    <Link2 size={18} className="text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Plan Links</h3>
                                    <p className="text-sm text-gray-500">Connect care plans to this protocol</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2 shadow-sm" onClick={() => openSheet('plans')}>
                                <Plus size={14} />
                                Link Plan
                            </Button>
                        </div>

                        {selectedPlans.length === 0 ? (
                            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-10 text-center hover:border-gray-300 transition-colors">
                                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Link2 size={22} className="text-indigo-400" />
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mb-1">No plans linked</p>
                                <p className="text-xs text-gray-500 max-w-md mx-auto">Link treatment plans for context-aware AI interactions</p>
                            </div>
                        ) : (
                            renderSelectedItems('plans', selectedPlans)
                        )}
                    </section>

                    <div className="h-8" />

                    {/* Section 6: Follow-up */}
                    <section ref={sectionRefs['follow-up']} className="mb-12 scroll-mt-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-pink-100 flex items-center justify-center">
                                <Bell size={18} className="text-pink-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Follow-up Messages</h3>
                                <p className="text-sm text-gray-500">Automated protocol check-ins</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Schedule Type</label>
                                <div className="inline-flex rounded-lg bg-gray-100 p-1">
                                    <button
                                        onClick={() => setFollowupType('periodical')}
                                        className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all ${followupType === 'periodical' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Periodic
                                    </button>
                                    <button
                                        onClick={() => setFollowupType('eventual')}
                                        className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all ${followupType === 'eventual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Event-based
                                    </button>
                                </div>
                            </div>

                            {followupType === 'periodical' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-semibold text-gray-700">Message Content</label>
                                        <button
                                            onClick={() => openSheet('followups')}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-lg transition-all"
                                        >
                                            <Plus size={14} />
                                            Select from Library
                                        </button>
                                    </div>



                                    <textarea
                                        value={followupMessage}
                                        onChange={(e) => setFollowupMessage(e.target.value.slice(0, 500))}
                                        placeholder="Checking in on your progress with the protocol..."
                                        className="w-full p-4 min-h-[120px] text-sm text-gray-900 border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                                    />
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-xs text-gray-500">Messages keep patients engaged with the protocol</p>
                                        <span className={`text-xs font-medium ${followupMessage.length > 450 ? 'text-orange-500' : 'text-gray-500'}`}>
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
                                                className="w-full appearance-none px-3 py-2.5 pr-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all"
                                            >
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                                            <Calendar size={14} />
                                            Duration (days)
                                        </label>
                                        <input
                                            type="number"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        />
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
                                                className="w-full appearance-none px-3 py-2.5 pr-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all"
                                            >
                                                <option value="09:00">09:00 (9:00 AM)</option>
                                                <option value="10:00">10:00 (10:00 AM)</option>
                                                <option value="12:00">12:00 (12:00 PM)</option>
                                                <option value="14:00">14:00 (2:00 PM)</option>
                                                <option value="16:00">16:00 (4:00 PM)</option>
                                                <option value="18:00">18:00 (6:00 PM)</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
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

                                    {scheduledEvents.map((event, index) => (
                                        <div key={index} className="p-4 bg-gray-50/50 border border-gray-200 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 relative group">
                                            {scheduledEvents.length > 1 && (
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
                                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all shadow-sm"
                                                    />
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
                                                            className="w-full appearance-none px-3 py-2.5 pr-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all shadow-sm"
                                                        >
                                                            <option value="09:00">09:00 (9:00 AM)</option>
                                                            <option value="10:00">10:00 (10:00 AM)</option>
                                                            <option value="12:00">12:00 (12:00 PM)</option>
                                                            <option value="14:00">14:00 (2:00 PM)</option>
                                                            <option value="16:00">16:00 (4:00 PM)</option>
                                                            <option value="18:00">18:00 (6:00 PM)</option>
                                                        </select>
                                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                                                    placeholder="Enter custom content for this event..."
                                                    className="w-full p-3 min-h-[80px] text-sm text-gray-900 border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white resize-none transition-all shadow-sm"
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

                    <div className="h-12" />
                </div>
            </div>

            {/* Right Test Panel */}
            <div className="w-[420px] bg-white border-l border-gray-200 flex-shrink-0 flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Protocol Preview</h3>
                        <p className="text-[10px] text-gray-500 mt-0.5">Test your protocol logic in real-time</p>
                    </div>
                    {!isNewProtocol && (
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Active Workspace</span>
                        </div>
                    )}
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white overflow-y-auto overflow-x-hidden">
                    <div className="max-w-xl mx-auto py-8 px-6 space-y-8">
                        {testMessages.map((message) => (
                            <div key={message.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {message.sender === 'bot' ? (
                                    <div className="flex gap-4 group">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-blue-600 shadow-sm">
                                            <Bot size={18} />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                {protocolTitle || 'AI Assistant'}
                                            </p>
                                            <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100">
                                                {message.content}
                                            </div>
                                            <p className="text-[9px] text-gray-400 font-medium">{message.timestamp}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-4 flex-row-reverse group">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-gray-900 shadow-sm">
                                            <User size={18} />
                                        </div>
                                        <div className="flex-1 space-y-1 text-right">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">You</p>
                                            <div className="inline-block text-left max-w-full p-4 rounded-2xl rounded-tr-none bg-blue-600 text-white shadow-sm border border-blue-700/10">
                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                            </div>
                                            <p className="text-[9px] text-gray-400 font-medium">{message.timestamp}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-gray-100">
                    <div className="max-w-xl mx-auto relative">
                        <div className={`relative flex items-end gap-2 p-1.5 bg-gray-50 border border-gray-200 rounded-2xl transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 ${isNewProtocol ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                            <textarea
                                rows={1}
                                value={testInput}
                                onChange={(e) => {
                                    setTestInput(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendTestMessage();
                                    }
                                }}
                                placeholder={isNewProtocol ? 'Save protocol to start testing' : 'Ask anything...'}
                                className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 text-sm text-gray-900 placeholder:text-gray-400 py-2.5 px-3 resize-none focus:outline-none"
                            />
                            <button
                                onClick={handleSendTestMessage}
                                disabled={!testInput.trim() || isNewProtocol}
                                className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:shadow-none transition-all"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        {isNewProtocol && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                                    <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Form locked until save</p>
                                </div>
                            </div>
                        )}
                        <p className="text-[9px] text-gray-400 mt-3 text-center uppercase font-bold tracking-widest">
                            Shift + Enter for new line • Press Enter to send
                        </p>
                    </div>
                </div>
            </div>

            {/* Side Sheets */}
            <SideSheet
                isOpen={activeSheet === 'shortcuts'}
                onClose={() => setActiveSheet(null)}
                title="Add Intent Shortcuts"
                description="Select shortcuts for protocol-specific actions"
                items={shortcutItems}
                selectedIds={tempSelection}
                onSelectionChange={setTempSelection}
                onConfirm={handleSheetConfirm}
                searchPlaceholder="Search shortcuts..."
            />

            <SideSheet
                isOpen={activeSheet === 'documents'}
                onClose={() => setActiveSheet(null)}
                title="Add Knowledge Base"
                description="Select clinical reference documents"
                items={documentItems}
                selectedIds={tempSelection}
                onSelectionChange={setTempSelection}
                onConfirm={handleSheetConfirm}
                searchPlaceholder="Search documents..."
            />

            <SideSheet
                isOpen={activeSheet === 'plans'}
                onClose={() => setActiveSheet(null)}
                title="Link Treatment Plans"
                description="Connect care plans for protocol context"
                items={planItems}
                selectedIds={tempSelection}
                onSelectionChange={setTempSelection}
                onConfirm={handleSheetConfirm}
                searchPlaceholder="Search plans..."
            />

            <SideSheet
                isOpen={activeSheet === 'templates'}
                onClose={() => setActiveSheet(null)}
                title="Protocol Templates"
                description="Start with a pre-built clinical protocol"
                items={templateItems}
                selectedIds={tempSelection}
                onSelectionChange={(ids) => setTempSelection(ids.slice(-1))}
                onConfirm={handleSheetConfirm}
                searchPlaceholder="Search templates..."
            />

            <SideSheet
                isOpen={activeSheet === 'followups'}
                onClose={() => setActiveSheet(null)}
                title="Select Follow-up Message"
                description="Choose a pre-defined message from your library"
                items={followupItems}
                selectedIds={tempSelection}
                onSelectionChange={setTempSelection}
                onConfirm={handleSheetConfirm}
                searchPlaceholder="Search follow-up messages..."
            />
        </div>
    );
}
