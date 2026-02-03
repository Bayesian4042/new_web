import { useState, useEffect } from 'react';
import {
  Search,
  MessageSquare,
  Clock,
  Phone,
  Bot,
  User as UserIcon,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Send,
  Calendar,
  User,
  Edit2,
  Filter,
  Building2,
  ExternalLink
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
  assistantName: string;
  status: 'Needs Attention' | 'active' | 'resolved';
  sentiment: 'happy' | 'sad' | 'angry' | 'neutral' | 'anxious';
  context: string;
  nextAppointment: string;
  messages: Message[];
  clinicName?: string;
  clinicId?: string;
  protocolName?: string;
  companionName?: string;
}

const sentimentConfig = {
  happy: { label: 'Positive', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
  sad: { label: 'Low Mood', color: 'bg-slate-50 text-slate-700 border-slate-100', dot: 'bg-slate-400' },
  angry: { label: 'Distressed', color: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' },
  neutral: { label: 'Neutral', color: 'bg-gray-50 text-gray-700 border-gray-100', dot: 'bg-gray-400' },
  anxious: { label: 'Concern', color: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
};

interface ConversationsProps {
  userRole?: 'admin' | 'clinic';
  initialConversationId?: string | null;
  onConversationChange?: () => void;
}

export function Conversations({
  userRole = 'clinic',
  initialConversationId = null,
  onConversationChange
}: ConversationsProps) {
  const [view, setView] = useState<'list' | 'detail' | 'profile'>('list');
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<string>('all');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('all');
  const [selectedCompanion, setSelectedCompanion] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Auto-open conversation when navigating from patient details
  useEffect(() => {
    if (initialConversationId) {
      const conversation = mockConversations.find(c => c.id === initialConversationId);
      if (conversation) {
        setSelectedConv(conversation);
        setView('detail');
      }
      // Clear the initial conversation ID after opening
      if (onConversationChange) {
        onConversationChange();
      }
    }
  }, [initialConversationId, onConversationChange]);

  const mockConversations: Conversation[] = [
    {
      id: '1',
      patientName: 'Michael Chen',
      patientPhone: '+1 (555) 234-5678',
      patientEmail: 'mchen@email.com',
      lastMessage: "I'm very disappointed with the service.",
      timestamp: 'Jan 25, 1:00 PM',
      messageCount: 4,
      assistantName: 'General Health Assistant',
      status: 'Needs Attention',
      sentiment: 'angry',
      context: 'Regular checkup patient. Diabetic, monitors blood sugar.',
      nextAppointment: 'Feb 20, 2024 11:00 AM',
      clinicName: 'Downtown Medical Center',
      clinicId: 'clinic-1',
      protocolName: 'Diabetes Management',
      companionName: 'Diabetes Care Companion',
      messages: [
        { id: 'm1', sender: 'bot', content: 'Hello Michael! How can I help you today?', timestamp: '12:00 PM' },
        { id: 'm2', sender: 'user', content: "I've been waiting 30 minutes for a callback. This is unacceptable!", timestamp: '12:30 PM' },
        { id: 'm3', sender: 'bot', content: 'I sincerely apologize for the delay. Let me escalate this immediately.', timestamp: '12:31 PM' },
        { id: 'm4', sender: 'user', content: "I'm very disappointed with the service.", timestamp: '1:00 PM' },
      ]
    },
    {
      id: '2',
      patientName: 'Sarah Johnson',
      patientPhone: '+1 (555) 123-4567',
      patientEmail: 'sjohnson@email.com',
      lastMessage: "That's great to hear! Remember to continue taking your medicatio...",
      timestamp: 'Jan 25, 4:30 PM',
      messageCount: 3,
      assistantName: "Sarah's Recovery Companion",
      status: 'active',
      sentiment: 'happy',
      context: 'Post-surgery recovery. Needs periodic check-ins.',
      nextAppointment: 'Mar 05, 2024 2:00 PM',
      clinicName: 'Westside Health Clinic',
      clinicId: 'clinic-2',
      protocolName: 'Post-Surgery Recovery',
      companionName: 'Recovery Support Bot',
      messages: [
        { id: 's1', sender: 'bot', content: 'Hi Sarah, how is your recovery going?', timestamp: '4:15 PM' },
        { id: 's2', sender: 'user', content: 'Doing well, pain is manageable now.', timestamp: '4:20 PM' },
        { id: 's3', sender: 'bot', content: "That's great to hear! Remember to continue taking your medication as prescribed.", timestamp: '4:30 PM' },
      ]
    },
    {
      id: '3',
      patientName: 'James Rodriguez',
      patientPhone: '+1 (555) 987-6543',
      patientEmail: 'jrodriguez@email.com',
      lastMessage: 'Thank you for the quick response!',
      timestamp: 'Jan 24, 2:15 PM',
      messageCount: 5,
      assistantName: 'General Health Assistant',
      status: 'resolved',
      sentiment: 'happy',
      context: 'Follow-up after physical therapy session.',
      nextAppointment: 'Feb 15, 2024 3:00 PM',
      clinicName: 'Downtown Medical Center',
      clinicId: 'clinic-1',
      protocolName: 'Physical Therapy Follow-up',
      companionName: 'PT Recovery Assistant',
      messages: [
        { id: 'j1', sender: 'bot', content: 'Hi James, how did your therapy session go?', timestamp: '2:00 PM' },
        { id: 'j2', sender: 'user', content: 'It went well, feeling much better!', timestamp: '2:10 PM' },
        { id: 'j3', sender: 'bot', content: 'That\'s wonderful to hear!', timestamp: '2:15 PM' },
      ]
    },
    {
      id: '4',
      patientName: 'Emily Davis',
      patientPhone: '+1 (555) 456-7890',
      patientEmail: 'edavis@email.com',
      lastMessage: 'I have some questions about my medication.',
      timestamp: 'Jan 26, 9:30 AM',
      messageCount: 2,
      assistantName: 'Medication Support Bot',
      status: 'active',
      sentiment: 'neutral',
      context: 'New patient, starting medication regimen.',
      nextAppointment: 'Feb 10, 2024 10:00 AM',
      clinicName: 'Westside Health Clinic',
      clinicId: 'clinic-2',
      protocolName: 'Medication Management',
      companionName: 'Med Adherence Helper',
      messages: [
        { id: 'e1', sender: 'user', content: 'I have some questions about my medication.', timestamp: '9:30 AM' },
        { id: 'e2', sender: 'bot', content: 'Of course! I\'m here to help. What would you like to know?', timestamp: '9:31 AM' },
      ]
    },
    {
      id: '5',
      patientName: 'Robert Martinez',
      patientPhone: '+1 (555) 321-6547',
      patientEmail: 'rmartinez@email.com',
      lastMessage: 'I need to reschedule my appointment urgently!',
      timestamp: 'Jan 26, 11:45 AM',
      messageCount: 6,
      assistantName: 'Scheduling Assistant',
      status: 'Needs Attention',
      sentiment: 'anxious',
      context: 'Urgent appointment rescheduling needed.',
      nextAppointment: 'Jan 28, 2024 2:00 PM',
      clinicName: 'Downtown Medical Center',
      clinicId: 'clinic-1',
      protocolName: 'Appointment Management',
      companionName: 'Scheduling Bot',
      messages: [
        { id: 'r1', sender: 'user', content: 'I need to reschedule my appointment urgently!', timestamp: '11:45 AM' },
        { id: 'r2', sender: 'bot', content: 'I understand. Let me help you find a new time.', timestamp: '11:46 AM' },
      ]
    },
    {
      id: '6',
      patientName: 'Lisa Anderson',
      patientPhone: '+1 (555) 789-0123',
      patientEmail: 'landerson@email.com',
      lastMessage: 'Everything is going well, thank you!',
      timestamp: 'Jan 23, 3:20 PM',
      messageCount: 4,
      assistantName: 'Wellness Coach',
      status: 'resolved',
      sentiment: 'happy',
      context: 'Wellness program participant, regular check-ins.',
      nextAppointment: 'Mar 01, 2024 1:00 PM',
      clinicName: 'Westside Health Clinic',
      clinicId: 'clinic-2',
      protocolName: 'Wellness Program',
      companionName: 'Wellness Guide',
      messages: [
        { id: 'l1', sender: 'bot', content: 'How are you feeling today?', timestamp: '3:15 PM' },
        { id: 'l2', sender: 'user', content: 'Everything is going well, thank you!', timestamp: '3:20 PM' },
      ]
    }
  ];

  // Get unique values for filters
  const clinics = Array.from(new Set(mockConversations.map(c => c.clinicName).filter(Boolean)));
  const patients = Array.from(new Set(mockConversations.map(c => c.patientName)));
  const protocols = Array.from(new Set(mockConversations.map(c => c.protocolName).filter(Boolean)));
  const companions = Array.from(new Set(mockConversations.map(c => c.companionName).filter(Boolean)));

  const filteredConversations = mockConversations.filter(c => {
    const matchesSearch = c.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClinic = selectedClinic === 'all' || c.clinicId === selectedClinic;
    const matchesStatus = selectedStatus === 'all' || c.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesPatient = selectedPatient === 'all' || c.patientName === selectedPatient;
    const matchesProtocol = selectedProtocol === 'all' || c.protocolName === selectedProtocol;
    const matchesCompanion = selectedCompanion === 'all' || c.companionName === selectedCompanion;
    return matchesSearch && matchesClinic && matchesStatus && matchesPatient && matchesProtocol && matchesCompanion;
  });

  const needsAttentionCount = mockConversations.filter(c => c.status === 'Needs Attention').length;

  // --- RENDERING HELPERS ---

  const renderListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {userRole === 'admin' ? 'All Conversations' : 'Patient Conversations'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {userRole === 'admin'
              ? 'Monitor platform-wide patient interactions across all clinics'
              : 'Monitor and respond to patient interactions'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${showFilters ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            <Filter size={16} />
            Filters
          </button>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-4">
            {/* Clinic Filter - Only for Super Admin */}
            {userRole === 'admin' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Filter by Clinic
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={selectedClinic}
                    onChange={(e) => setSelectedClinic(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="all">All Clinics</option>
                    {clinics.map((clinic, idx) => (
                      <option key={idx} value={`clinic-${idx + 1}`}>{clinic}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Status Filter - Both Roles */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="needs attention">🔴 Needs Attention (Red)</option>
                <option value="active">🔵 Active (Blue)</option>
                <option value="resolved">🟢 Resolved (Green)</option>
              </select>
            </div>

            {/* Patient Filter - Both Roles */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Filter by Patient
              </label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="all">All Patients</option>
                {patients.map((patient, idx) => (
                  <option key={idx} value={patient}>{patient}</option>
                ))}
              </select>
            </div>

            {/* Protocol Filter - Both Roles */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Filter by Protocol
              </label>
              <select
                value={selectedProtocol}
                onChange={(e) => setSelectedProtocol(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="all">All Protocols</option>
                {protocols.map((protocol, idx) => (
                  <option key={idx} value={protocol}>{protocol}</option>
                ))}
              </select>
            </div>

            {/* Companion Filter - Both Roles */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Filter by Companion
              </label>
              <select
                value={selectedCompanion}
                onChange={(e) => setSelectedCompanion(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="all">All Companions</option>
                {companions.map((companion, idx) => (
                  <option key={idx} value={companion}>{companion}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing <span className="font-bold text-gray-900">{filteredConversations.length}</span> of <span className="font-bold text-gray-900">{mockConversations.length}</span> conversations
            </p>
            <button
              onClick={() => {
                setSelectedClinic('all');
                setSelectedStatus('all');
                setSelectedPatient('all');
                setSelectedProtocol('all');
                setSelectedCompanion('all');
              }}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {needsAttentionCount > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <span className="text-red-700 font-bold text-sm">
            {needsAttentionCount} conversation{needsAttentionCount > 1 ? 's' : ''} needs attention
          </span>
        </div>
      )}

      <div className="space-y-2">
        {filteredConversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => {
              setSelectedConv(conv);
              setView('detail');
            }}
            className={`group p-3 rounded-xl border transition-all cursor-pointer ${conv.status === 'Needs Attention'
              ? 'bg-red-50/40 border-red-100/60 hover:border-red-200'
              : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md'
              }`}
          >
            <div className="flex items-start gap-3">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${conv.status === 'Needs Attention' ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400'
                }`}>
                {conv.status === 'Needs Attention' ? <AlertCircle size={18} /> : <MessageSquare size={18} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-bold text-gray-900 truncate">{conv.patientName}</h3>
                    <Badge className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${conv.status === 'Needs Attention'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : conv.status === 'active'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                      {conv.status === 'Needs Attention' ? '🔴 Needs Attention' : conv.status === 'active' ? '🔵 Active' : '🟢 Resolved'}
                    </Badge>
                    <Badge className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${sentimentConfig[conv.sentiment].color}`}>
                      <span className={`h-1 w-1 rounded-full ${sentimentConfig[conv.sentiment].dot}`} />
                      {sentimentConfig[conv.sentiment].label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                      <Clock size={12} />
                      {conv.timestamp}
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{conv.messageCount} messages</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 font-medium mb-2">with {conv.assistantName}</p>
                {userRole === 'admin' && conv.clinicName && (
                  <div className="flex items-center gap-1.5 text-gray-500 mb-2">
                    <Building2 size={12} className="text-gray-400" />
                    <span className="text-xs font-medium">{conv.clinicName}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-600 bg-gray-50/50 p-2 rounded-lg border border-gray-100/50 max-w-2xl">
                  <User size={12} className="text-gray-400 shrink-0" />
                  <p className="text-sm truncate">{conv.lastMessage}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetailView = () => {
    if (!selectedConv) return null;
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Detail Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Conversation with {selectedConv.patientName}</h2>
            <p className="text-sm text-gray-500 mt-1">via {selectedConv.assistantName}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl font-bold text-gray-600"
              onClick={() => setView('list')}
            >
              <ChevronLeft size={18} className="mr-1" />
              Back
            </Button>
            <Button className="bg-[#1e293b] hover:bg-slate-800 text-white rounded-xl font-bold gap-2">
              <CheckCircle2 size={18} />
              Mark Resolved
            </Button>
          </div>
        </div>

        <div className="flex-1 flex gap-6 min-h-0">
          {/* Main Message Area */}
          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">Messages</h3>
                <Badge className="bg-red-50 text-red-600 border-red-100 text-[10px] font-bold">Needs Attention</Badge>
                <Badge className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${sentimentConfig[selectedConv.sentiment].color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${sentimentConfig[selectedConv.sentiment].dot}`} />
                  Sentiment: {sentimentConfig[selectedConv.sentiment].label}
                </Badge>
              </div>
              <span className="text-xs font-bold text-gray-400">{selectedConv.messageCount} messages</span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/30">
              {selectedConv.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.sender === 'bot' ? 'bg-[#1e293b] text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                    {m.sender === 'bot' ? <Bot size={16} /> : <UserIcon size={16} />}
                  </div>

                  <div className={`max-w-[80%] space-y-1 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-5 py-3 rounded-2xl text-[14px] shadow-sm ${m.sender === 'bot'
                      ? 'bg-white border border-gray-100 text-gray-900'
                      : 'bg-[#1e293b] text-white'
                      }`}>
                      {m.content}
                    </div>
                    <span className={`text-[11px] font-bold text-gray-400 block ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-white border-t border-gray-50">
              <div className="relative flex items-center gap-3">
                <input
                  className="flex-1 px-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-indigo-100 outline-none transition-all placeholder:text-gray-400"
                  placeholder="Send a message as the assistant..."
                />
                <button className="h-10 w-10 bg-[#1e293b] text-white rounded-xl flex items-center justify-center shadow-lg shadow-gray-200">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - User Info */}
          <div className="w-72 space-y-4">
            <Card className=" border-gray-100 shadow-sm rounded-2xl">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">User Info</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Name</label>
                  <p className="text-sm font-bold text-gray-900">{selectedConv.patientName}</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Phone</label>
                  <p className="text-sm font-bold text-gray-900">{selectedConv.patientPhone}</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Context</label>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">{selectedConv.context}</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Next Appointment</label>
                  <p className="text-sm text-gray-900 font-bold">{selectedConv.nextAppointment}</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-5 rounded-xl font-bold text-gray-600 border-gray-100 py-3.5 h-auto text-xs"
                onClick={() => setView('profile')}
              >
                View Full Profile
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderProfileView = () => {
    if (!selectedConv) return null;
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{selectedConv.patientName}</h1>
            <p className="text-gray-500 mt-1">User details and assigned companion</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl font-bold text-gray-600"
              onClick={() => setView('detail')}
            >
              <ChevronLeft size={18} className="mr-1" />
              Back
            </Button>
            <Button className="bg-[#1e293b] hover:bg-slate-800 text-white rounded-xl font-bold gap-2">
              <Edit2 size={16} />
              Edit
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Contact Info */}
          <Card className=" border-gray-100 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-bold uppercase">Phone</p>
                  <p className="text-sm font-bold text-gray-900">{selectedConv.patientPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-bold uppercase">Next Appointment</p>
                  <p className="text-sm font-bold text-gray-900">{selectedConv.nextAppointment}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Context */}
          <Card className="border-gray-100 rounded-2xl shadow-sm space-y-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">Context</h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Additional AI Info</p>
            </div>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              {selectedConv.context}
            </p>
          </Card>

          {/* Assigned Companion */}
          <Card className=" border-gray-100 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-base font-bold text-gray-900 mb-4 w-full text-left">Assigned Companion</h3>

            <div className="flex-1 flex flex-col items-center justify-center py-2">
              <p className="text-xs text-gray-400 mb-3 font-medium text-pretty max-w-[120px]">No companion assigned</p>
              <Button variant="outline" className="rounded-lg font-bold text-gray-600 border-gray-200 text-xs h-9">
                Assign Companion
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Conversations List inside Profile */}
        <Card className="border border-gray-100 rounded-3xl shadow-sm overflow-hidden bg-white">
          <div className=" border-b border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-gray-400" size={20} />
              <div>
                <h2 className="text-lg font-bold text-gray-900">Conversations</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Recent conversations with this user</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div
              className="p-4 rounded-xl border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer"
              onClick={() => setView('detail')}
            >
              <div className="flex items-center gap-3">
                <Badge className="bg-red-50 text-red-600 border-red-100 text-[10px] font-bold">Needs Attention</Badge>
                <span className="text-xs font-bold text-gray-700">{selectedConv.messageCount} messages</span>
              </div>
              <span className="text-xs font-bold text-gray-400">{selectedConv.timestamp}</span>
            </div>
          </div>
        </Card>
      </div >
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {view === 'list' && renderListView()}
      {view === 'detail' && renderDetailView()}
      {view === 'profile' && renderProfileView()}
    </div>
  );
}
