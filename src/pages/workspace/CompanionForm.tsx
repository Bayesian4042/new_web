import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
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
  User as UserIcon,
  Trash2,
  Edit2,
  ChevronRight,
  Phone
} from
  'lucide-react';
import { Button } from '../../components/ui/Button';
import { SideSheet, SideSheetItem } from '../../components/ui/SideSheet';

interface TestMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}
interface CompanionFormProps {
  onClose: () => void;
  onChange: (data: any) => void;
  initialData?: any;
  userRole: 'admin' | 'clinic';
}
type FormSection =
  'companion-type' |
  'patient-details' |
  'intent-shortcut' |
  'ai-prompt' |
  'knowledge-base' |
  'plan-links' |
  'follow-up';
type SheetType = 'shortcuts' | 'documents' | 'plans' | 'templates' | 'followups' | null;

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
  }];

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
  }];

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
  }];

const templateItems: SideSheetItem[] = [
  {
    id: 't1',
    name: 'General Health Assistant',
    description: 'Friendly, supportive health companion',
    category: 'General'
  },
  {
    id: 't2',
    name: 'Post-Surgery Coach',
    description: 'Recovery-focused with milestone tracking',
    category: 'Surgery'
  },
  {
    id: 't3',
    name: 'Medication Adherence',
    description: 'Reminder-focused with gentle nudges',
    category: 'Adherence'
  },
  {
    id: 't4',
    name: 'Mental Health Support',
    description: 'Empathetic, CBT-informed responses',
    category: 'Mental Health'
  },
  {
    id: 't5',
    name: 'Chronic Care Manager',
    description: 'Long-term condition monitoring',
    category: 'Chronic Care'
  }];

export function CompanionForm({ onClose, onChange, initialData, userRole }: CompanionFormProps) {
  console.log('User Role in CompanionForm:', userRole); // Use userRole to fix lint
  const isNewCompanion = !initialData;
  const [companionType, setCompanionType] = useState<
    'general' | 'personalized'>(
      'general');
  const [companionTitle, setCompanionTitle] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [followupType, setFollowupType] = useState<'periodical' | 'eventual'>(
    'periodical'
  );
  const [followupMessage, setFollowupMessage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [duration, setDuration] = useState('7');
  const [preferredTime, setPreferredTime] = useState('09:00');
  const [scheduledEvents, setScheduledEvents] = useState<{ date: string; time: string; content: string }[]>([
    { date: '', time: '09:00', content: '' }
  ]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editingPatientIndex, setEditingPatientIndex] = useState<number | null>(0);
  // Selected items for each section
  const [selectedShortcuts, setSelectedShortcuts] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [selectedClinics, setSelectedClinics] = useState<string[]>(initialData?.assignedClinics || []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData?.assignedCategories || []);
  // Side sheet state
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const [tempSelection, setTempSelection] = useState<string[]>([]);
  // Track which sections have been visited
  const [visitedSections, setVisitedSections] = useState<Set<FormSection>>(
    new Set(['companion-type'])
  );
  // Test chatbot state
  const [testMessages, setTestMessages] = useState<TestMessage[]>([
    {
      id: '1',
      sender: 'bot',
      content: `Hello! I'm your AI companion. Type a message to see how I'll interact with patients.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [testInput, setTestInput] = useState('');
  // Refs for scrolling
  const sectionRefs = {
    'companion-type': useRef<HTMLElement>(null),
    'patient-details': useRef<HTMLElement>(null),
    'intent-shortcut': useRef<HTMLElement>(null),
    'ai-prompt': useRef<HTMLElement>(null),
    'knowledge-base': useRef<HTMLElement>(null),
    'plan-links': useRef<HTMLElement>(null),
    'follow-up': useRef<HTMLElement>(null)
  };

  useEffect(() => {
    if (initialData) {
      setCompanionTitle(initialData.name || '');
      if (initialData.type) {
        setCompanionType(initialData.type);
      }
      if (initialData.patients && Array.isArray(initialData.patients) && initialData.patients.length > 0) {
        setPatients(initialData.patients);
      }
      if (initialData.aiPrompt) {
        setAiPrompt(initialData.aiPrompt);
      }
      if (initialData.selectedShortcuts) {
        setSelectedShortcuts(initialData.selectedShortcuts);
      }
      if (initialData.selectedDocuments) {
        setSelectedDocuments(initialData.selectedDocuments);
      }
      if (initialData.selectedPlans) {
        setSelectedPlans(initialData.selectedPlans);
      }
      if (initialData.followupMessage) {
        setFollowupMessage(initialData.followupMessage);
      }
      if (initialData.assignedClinics) {
        setSelectedClinics(initialData.assignedClinics);
      }
      if (initialData.assignedCategories) {
        setSelectedCategories(initialData.assignedCategories);
      }
    }
  }, [initialData]);

  useEffect(() => {
    onChange({
      name: companionTitle,
      type: companionType,
      patients,
      selectedShortcuts,
      selectedDocuments,
      selectedPlans,
      aiPrompt,
      followupMessage,
      frequency,
      duration,
      preferredTime,
      assignedClinics: selectedClinics,
      assignedCategories: selectedCategories
    });
  }, [
    companionTitle, companionType, patients, selectedShortcuts,
    selectedDocuments, selectedPlans, aiPrompt, followupMessage,
    frequency, duration, preferredTime, selectedClinics, selectedCategories, onChange
  ]);

  const sections = [
    {
      id: 'companion-type' as const,
      label: 'Companion Type',
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
      id: 'ai-prompt' as const,
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
    }];

  const isSectionComplete = (sectionId: FormSection): boolean => {
    switch (sectionId) {
      case 'companion-type':
        return companionTitle.trim().length > 0;
      case 'patient-details':
        return patients.length > 0 && patients.every(p => p.name.trim() && p.phoneNumber.trim());
      case 'intent-shortcut':
        return selectedShortcuts.length > 0;
      case 'ai-prompt':
        return aiPrompt.trim().length > 0;
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
  const progress = completedCount / sections.length * 100;
  // Sheet handlers
  const openSheet = (type: SheetType) => {
    setActiveSheet(type);
    // Initialize temp selection with current selection
    if (type === 'shortcuts') setTempSelection([...selectedShortcuts]); else
      if (type === 'documents') setTempSelection([...selectedDocuments]); else
        if (type === 'plans') setTempSelection([...selectedPlans]); else
          if (type === 'followups') setTempSelection([]); else
            setTempSelection([]);
  };
  const handleSheetConfirm = () => {
    if (activeSheet === 'shortcuts') setSelectedShortcuts(tempSelection); else
      if (activeSheet === 'documents') setSelectedDocuments(tempSelection); else
        if (activeSheet === 'plans') setSelectedPlans(tempSelection); else
          if (activeSheet === 'followups') {
            if (tempSelection.length > 0) {
              const item = followupItems.find(f => f.id === tempSelection[tempSelection.length - 1]);
              if (item?.config) {
                setFollowupMessage(item.config.content);
                setFrequency(item.config.frequency);
                setDuration(item.config.duration);
                setPreferredTime(item.config.time);
              }
            }
          } else
            if (activeSheet === 'templates' && tempSelection.length > 0) {
              const template = templateItems.find((t) => t.id === tempSelection[0]);
              if (template) {
                setAiPrompt(
                  `You are a ${template.name.toLowerCase()}. ${template.description}. Your role is to provide helpful, accurate, and empathetic support to patients.`
                );
              }
            }
    setActiveSheet(null);
  };
  const removeItem = (
    type: 'shortcuts' | 'documents' | 'plans',
    id: string) => {
    if (type === 'shortcuts')
      setSelectedShortcuts((prev) => prev.filter((i) => i !== id)); else
      if (type === 'documents')
        setSelectedDocuments((prev) => prev.filter((i) => i !== id)); else
        if (type === 'plans')
          setSelectedPlans((prev) => prev.filter((i) => i !== id));
  };

  const handleSendTestMessage = () => {
    if (!testInput.trim() || isNewCompanion) return;

    const userMessage: TestMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: testInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTestMessages((prev) => [...prev, userMessage]);
    setTestInput('');

    // Simulate bot response based on companion title
    setTimeout(() => {
      const botMessage: TestMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: `This is a simulated response from ${companionTitle || 'your companion'}. In production, responses will be generated based on your AI rules and configuration.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setTestMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleAddPatient = () => {
    if (companionType === 'personalized' && patients.length >= 1) return;
    const newIndex = patients.length;
    setPatients([...patients, { name: '', countryCode: '+1', phoneNumber: '' }]);
    setEditingPatientIndex(newIndex);
  };

  const handleRemovePatient = (index: number) => {
    setPatients(patients.filter((_, i) => i !== index));
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

  useEffect(() => {
    if (companionType === 'personalized' && patients.length > 1) {
      setPatients([patients[0]]);
    } else if (patients.length === 0) {
      handleAddPatient();
    }
  }, [companionType]);
  const getItemById = (
    type: 'shortcuts' | 'documents' | 'plans',
    id: string) => {
    if (type === 'shortcuts') return shortcutItems.find((i) => i.id === id);
    if (type === 'documents') return documentItems.find((i) => i.id === id);
    if (type === 'plans') return planItems.find((i) => i.id === id);
    return null;
  };
  // Render selected items list
  const renderSelectedItems = (
    type: 'shortcuts' | 'documents' | 'plans',
    ids: string[]) => {
    if (ids.length === 0) return null;
    return (
      <div className="space-y-3">
        {ids.map((id) => {
          const item = getItemById(type, id);
          if (!item) return null;
          return (
            <div
              key={id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg group hover:border-gray-300 hover:shadow-sm transition-all">

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gray-50 flex items-center justify-center">
                  {type === 'shortcuts' &&
                    <Zap size={16} className="text-gray-600" />
                  }
                  {type === 'documents' &&
                    <FileText size={16} className="text-gray-600" />
                  }
                  {type === 'plans' &&
                    <Link2 size={16} className="text-gray-600" />
                  }
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.name}
                    </p>
                    {type === 'plans' &&
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Navigate to plan', item.id);
                        }}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                        title="View Plan Details">
                        <ExternalLink size={13} />
                      </a>
                    }
                  </div>
                  {item.description &&
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  }
                </div>
              </div>
              <button
                onClick={() => removeItem(type, id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">

                <X size={16} />
              </button>
            </div>);

        })}
      </div>);

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
              style={{
                width: `${progress}%`
              }} />

          </div>
        </div>

        <div className="px-5 mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Setup Steps
          </h2>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {sections.map((section, index) => {
            const isComplete = isSectionComplete(section.id);
            const isVisited = visitedSections.has(section.id);
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${isVisited ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>

                <div
                  className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${isComplete ? 'bg-green-100 text-green-700' : isVisited ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'}`}>

                  {isComplete ? <Check size={16} /> : index + 1}
                </div>
                <span className={`font-medium flex-1 text-left ${isComplete || isVisited ? 'text-gray-900' : 'text-gray-500'}`}>
                  {section.label}
                </span>
                {section.required && !isComplete &&
                  <span className="text-red-500 text-xs font-bold">*</span>
                }
              </button>);

          })}
        </nav>

        <div className="px-5 pt-4 border-t border-gray-100 mt-4">
          <p className="text-xs text-gray-500">
            <span className="text-red-500 font-bold">*</span> Required fields
          </p>
        </div>
      </div>

      {/* Middle content area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 relative">
        {/* Form Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isNewCompanion ? 'New Companion' : 'Edit Companion'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Data is already synced via onChange
                onClose();
              }}
              className="bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
            >
              Save Changes
            </Button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto py-8 px-8">
          {/* Section 1: Companion Type */}
          <section
            ref={sectionRefs['companion-type']}
            className="mb-12 scroll-mt-6">

            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Zap size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Companion Type
                </h3>
                <p className="text-sm text-gray-500">
                  Define the basic configuration
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Type
                </label>
                <div className="inline-flex rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setCompanionType('general')}
                    className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all ${companionType === 'general' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>

                    General
                  </button>
                  <button
                    onClick={() => setCompanionType('personalized')}
                    className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all ${companionType === 'personalized' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>

                    Personalized
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {companionType === 'general' ?
                    'General companions work for all patients' :
                    'Personalized companions adapt to individual patient data'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Companion Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companionTitle}
                  onChange={(e) => setCompanionTitle(e.target.value)}
                  placeholder="e.g. Diabetes Monitoring Assistant"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm placeholder:text-gray-400 transition-all" />

              </div>
            </div>
          </section>

          <div className="h-8" />

          {/* Section: Patient Details */}
          <section
            ref={sectionRefs['patient-details']}
            className="mb-12 scroll-mt-6">

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <UserIcon size={18} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Patient Details {companionType === 'personalized' ? '' : '(Multiple)'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {companionType === 'personalized'
                      ? 'Add the specific patient for this companion'
                      : 'Add patients who will use this companion'}
                  </p>
                </div>
              </div>
              {companionType === 'general' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 shadow-sm"
                  onClick={handleAddPatient}>
                  <Plus size={14} />
                  Add Patient
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {patients.map((patient, index) => {
                const isEditing = companionType === 'personalized' || editingPatientIndex === index;

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
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 relative group transition-all animate-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                          <Edit2 size={16} />
                        </div>
                        <h4 className="font-semibold text-gray-900">
                          {companionType === 'personalized' ? 'Patient Information' : 'Patient Details'}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {companionType === 'general' && (
                          <>
                            {patients.length > 1 && (
                              <button
                                onClick={() => handleRemovePatient(index)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Remove patient">
                                <Trash2 size={18} />
                              </button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingPatientIndex(null)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50 font-bold h-9">
                              Save
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Patient Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={patient.name}
                          onChange={(e) => handleUpdatePatient(index, 'name', e.target.value)}
                          placeholder="Full Name"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Country Code
                        </label>
                        <div className="relative">
                          <select
                            value={patient.countryCode}
                            onChange={(e) => handleUpdatePatient(index, 'countryCode', e.target.value)}
                            className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all">
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                            <option value="+91">+91</option>
                            <option value="+61">+61</option>
                            <option value="+34">+34</option>
                            <option value="+52">+52</option>
                          </select>
                          <ChevronDown
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={patient.phoneNumber}
                          onChange={(e) => handleUpdatePatient(index, 'phoneNumber', e.target.value)}
                          placeholder="123 456 7890"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm transition-all"
                        />
                      </div>
                    </div>

                    {/* Appointment Details Section */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
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
                            onClick={() => toggleAppointment(index)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 outline-none focus:ring-2 focus:ring-blue-500/20 ${patient.appointment ? 'bg-blue-600' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${patient.appointment ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>

                      {patient.appointment && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 mt-4 p-4 bg-gray-50/30 rounded-xl border border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                                Appointment Title
                              </label>
                              <input
                                type="text"
                                value={patient.appointment.title}
                                onChange={(e) => handleUpdateAppointment(index, 'title', e.target.value)}
                                placeholder="e.g. Initial Consultation"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm transition-all bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                                Date
                              </label>
                              <input
                                type="date"
                                value={patient.appointment.date}
                                onChange={(e) => handleUpdateAppointment(index, 'date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm transition-all bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                                Time
                              </label>
                              <input
                                type="time"
                                value={patient.appointment.time}
                                onChange={(e) => handleUpdateAppointment(index, 'time', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm transition-all bg-white"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                                Cancellation Phone Number
                              </label>
                              <input
                                type="tel"
                                value={patient.appointment.cancellationPhone}
                                onChange={(e) => handleUpdateAppointment(index, 'cancellationPhone', e.target.value)}
                                placeholder="Phone for rescheduling"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm transition-all bg-white"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                                Instructions
                              </label>
                              <textarea
                                value={patient.appointment.instructions}
                                onChange={(e) => handleUpdateAppointment(index, 'instructions', e.target.value)}
                                placeholder="e.g. Please bring your medical records..."
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm transition-all resize-none bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="h-8" />

          {/* Section 2: Intent Shortcut */}
          <section
            ref={sectionRefs['intent-shortcut']}
            className="mb-12 scroll-mt-6">

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <FileText size={18} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Intent Shortcut
                  </h3>
                  <p className="text-sm text-gray-500">
                    Quick actions the AI can recognize
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 shadow-sm"
                onClick={() => openSheet('shortcuts')}>

                <Plus size={14} />
                Add Shortcut
              </Button>
            </div>

            {selectedShortcuts.length === 0 ?
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-10 text-center hover:border-gray-300 transition-colors">
                <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText size={22} className="text-purple-400" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  No intent shortcuts added
                </p>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Shortcuts help the AI quickly understand patient requests
                </p>
              </div> :

              renderSelectedItems('shortcuts', selectedShortcuts)
            }
          </section>

          <div className="h-8" />

          {/* Section 3: AI Rules */}
          <section ref={sectionRefs['ai-prompt']} className="mb-12 scroll-mt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Brain size={18} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    AI Rules <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-sm text-gray-500">
                    Define how the AI should behave
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 shadow-sm"
                onClick={() => openSheet('templates')}>

                <BookOpen size={14} />
                Templates
              </Button>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="You are a helpful medical assistant. Your role is to support patients with their health journey. Be empathetic, clear, and professional in all interactions..."
                className="w-full p-5 min-h-[200px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none leading-relaxed" />

              <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Tip: Be specific about tone, boundaries, and disclaimers
                </p>
                <span className="text-xs font-medium text-gray-500">
                  {aiPrompt.length} characters
                </span>
              </div>
            </div>
          </section>

          <div className="h-8" />

          {/* Section 4: Knowledge Base */}
          <section
            ref={sectionRefs['knowledge-base']}
            className="mb-12 scroll-mt-6">

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <BookOpen size={18} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Knowledge Base
                  </h3>
                  <p className="text-sm text-gray-500">
                    Reference materials for the AI
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 shadow-sm"
                onClick={() => openSheet('documents')}>

                <Plus size={14} />
                Add Document
              </Button>
            </div>

            {selectedDocuments.length === 0 ?
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-10 text-center hover:border-gray-300 transition-colors">
                <div className="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={22} className="text-orange-400" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  No knowledge base items
                </p>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Add documents, FAQs, or guidelines for the AI to reference
                </p>
              </div> :

              renderSelectedItems('documents', selectedDocuments)
            }
          </section>

          <div className="h-8" />

          {/* Section 5: Plan Links */}
          <section
            ref={sectionRefs['plan-links']}
            className="mb-12 scroll-mt-6">

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Link2 size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Plan Links
                  </h3>
                  <p className="text-sm text-gray-500">Connect treatment plans</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 shadow-sm"
                onClick={() => openSheet('plans')}>

                <Plus size={14} />
                Link Plan
              </Button>
            </div>

            {selectedPlans.length === 0 ?
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-10 text-center hover:border-gray-300 transition-colors">
                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Link2 size={22} className="text-indigo-400" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">No plans linked</p>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  The AI can reference linked plans when discussing treatments
                </p>
              </div> :

              renderSelectedItems('plans', selectedPlans)
            }
          </section>

          <div className="h-8" />

          {/* Section 6: Follow-up */}
          <section ref={sectionRefs['follow-up']} className="mb-12 scroll-mt-6">
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
                    onClick={() => setFollowupType('periodical')}
                    className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all ${followupType === 'periodical' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>

                    Periodic
                  </button>
                  <button
                    onClick={() => setFollowupType('eventual')}
                    className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all ${followupType === 'eventual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>

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
                    onChange={(e) =>
                      setFollowupMessage(e.target.value.slice(0, 500))
                    }
                    placeholder="Hi! Just checking in on how you're feeling today..."
                    className="w-full p-4 min-h-[120px] text-sm text-gray-900 border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all" />

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
                        className="w-full appearance-none px-3 py-2.5 pr-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all">

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
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />

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
                        className="w-full appearance-none px-3 py-2.5 pr-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all">

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
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all shadow-sm" />
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
                              className="w-full appearance-none px-3 py-2.5 pr-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all shadow-sm">
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
            <h3 className="text-sm font-bold text-gray-900">Live Preview</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Test your companion's behavior in real-time</p>
          </div>
          {!isNewCompanion && (
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500" />
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
                        {companionTitle || 'AI Assistant'}
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
                      <UserIcon size={18} />
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
            <div className={`relative flex items-end gap-2 p-1.5 bg-gray-50 border border-gray-200 rounded-2xl transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 ${isNewCompanion ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
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
                placeholder={isNewCompanion ? 'Save companion to start testing' : 'Ask anything...'}
                className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 text-sm text-gray-900 placeholder:text-gray-400 py-2.5 px-3 resize-none scrollbar-hide focus:outline-none"
              />
              <button
                onClick={handleSendTestMessage}
                disabled={!testInput.trim() || isNewCompanion}
                className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:shadow-none transition-all"
              >
                <Send size={18} />
              </button>
            </div>
            {isNewCompanion && (
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
        description="Select shortcuts for quick AI actions"
        items={shortcutItems}
        selectedIds={tempSelection}
        onSelectionChange={setTempSelection}
        onConfirm={handleSheetConfirm}
        searchPlaceholder="Search shortcuts..." />


      <SideSheet
        isOpen={activeSheet === 'documents'}
        onClose={() => setActiveSheet(null)}
        title="Add Knowledge Base"
        description="Select documents for AI reference"
        items={documentItems}
        selectedIds={tempSelection}
        onSelectionChange={setTempSelection}
        onConfirm={handleSheetConfirm}
        searchPlaceholder="Search documents..." />


      <SideSheet
        isOpen={activeSheet === 'plans'}
        onClose={() => setActiveSheet(null)}
        title="Link Treatment Plans"
        description="Connect plans for AI context"
        items={planItems}
        selectedIds={tempSelection}
        onSelectionChange={setTempSelection}
        onConfirm={handleSheetConfirm}
        searchPlaceholder="Search plans..." />


      <SideSheet
        isOpen={activeSheet === 'templates'}
        onClose={() => setActiveSheet(null)}
        title="AI Rules Templates"
        description="Start with a pre-built template"
        items={templateItems}
        selectedIds={tempSelection}
        onSelectionChange={(ids) => setTempSelection(ids.slice(-1))} // Single select for templates
        onConfirm={handleSheetConfirm}
        searchPlaceholder="Search templates..." />

      <SideSheet
        isOpen={activeSheet === 'followups'}
        onClose={() => setActiveSheet(null)}
        title="Select Follow-up Message"
        description="Choose a pre-defined message from your library"
        items={followupItems}
        selectedIds={tempSelection}
        onSelectionChange={setTempSelection}
        onConfirm={handleSheetConfirm}
        searchPlaceholder="Search follow-up messages..." />

    </div>);

}