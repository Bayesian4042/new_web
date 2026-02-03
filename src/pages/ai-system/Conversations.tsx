<<<<<<< Updated upstream
import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
=======
import { useState, useEffect } from 'react';
>>>>>>> Stashed changes
import {
  Search,
  MessageSquare,
  Clock,
  Phone,
  Mail,
  X,
  Bot,
<<<<<<< Updated upstream
  User as UserIcon
=======
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
>>>>>>> Stashed changes
} from 'lucide-react';

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
  channel: 'native' | 'whatsapp';
  isAlert: boolean;
  messages: Message[];
  clinicName?: string;
  clinicId?: string;
  protocolName?: string;
  companionName?: string;
}

<<<<<<< Updated upstream
export function Conversations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
=======
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
>>>>>>> Stashed changes

  const conversations: Conversation[] = [
    {
      id: '1',
<<<<<<< Updated upstream
      patientName: 'Sarah Johnson',
      patientPhone: '+1 (555) 123-4567',
      patientEmail: 'sarah.j@email.com',
      lastMessage: "I'm feeling severe chest pain. Should I be worried?",
      timestamp: '10:05 AM',
      messageCount: 12,
      channel: 'native',
      isAlert: true,
=======
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
>>>>>>> Stashed changes
      messages: [
        { id: '1', sender: 'bot', content: 'Hello Sarah! How are you feeling today?', timestamp: '10:00 AM' },
        { id: '2', sender: 'user', content: "I'm feeling severe chest pain. Should I be worried?", timestamp: '10:05 AM' },
        { id: '3', sender: 'bot', content: 'I understand your concern. Chest pain can be serious. Please contact your healthcare provider immediately or call emergency services if the pain is severe.', timestamp: '10:05 AM' }
      ]
    },
    {
      id: '2',
<<<<<<< Updated upstream
      patientName: 'Michael Chen',
      patientPhone: '+1 (555) 234-5678',
      patientEmail: 'mchen@email.com',
      lastMessage: 'Thank you for the reminder about my appointment!',
      timestamp: 'Yesterday',
      messageCount: 8,
      channel: 'whatsapp',
      isAlert: false,
=======
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
>>>>>>> Stashed changes
      messages: [
        { id: '1', sender: 'bot', content: 'Hi Michael! Reminder: You have an appointment tomorrow at 2 PM.', timestamp: 'Yesterday 9:00 AM' },
        { id: '2', sender: 'user', content: 'Thank you for the reminder about my appointment!', timestamp: 'Yesterday 9:30 AM' },
        { id: '3', sender: 'bot', content: "You're welcome! See you tomorrow.", timestamp: 'Yesterday 9:31 AM' }
      ]
    },
    {
      id: '3',
      patientName: 'Emily Rodriguez',
      patientPhone: '+1 (555) 345-6789',
      patientEmail: 'emily.r@email.com',
      lastMessage: 'Can I reschedule my follow-up appointment?',
      timestamp: '2 days ago',
      messageCount: 5,
      channel: 'native',
      isAlert: false,
      messages: [
        { id: '1', sender: 'user', content: 'Can I reschedule my follow-up appointment?', timestamp: '2 days ago 3:00 PM' },
        { id: '2', sender: 'bot', content: 'Of course! I can help you with that. What date works better for you?', timestamp: '2 days ago 3:01 PM' },
        { id: '3', sender: 'user', content: 'How about next Tuesday?', timestamp: '2 days ago 3:05 PM' }
      ]
    },
    {
      id: '4',
      patientName: 'David Park',
      patientPhone: '+1 (555) 456-7890',
      patientEmail: 'dpark@email.com',
      lastMessage: 'All good! Medication is working well.',
      timestamp: '3 days ago',
      messageCount: 15,
      channel: 'whatsapp',
      isAlert: false,
      messages: [
        { id: '1', sender: 'bot', content: 'Hi David! How are you feeling with the new medication?', timestamp: '3 days ago 11:00 AM' },
        { id: '2', sender: 'user', content: 'All good! Medication is working well.', timestamp: '3 days ago 11:30 AM' },
        { id: '3', sender: 'bot', content: "That's great to hear! Keep taking it as prescribed.", timestamp: '3 days ago 11:31 AM' }
      ]
    },
    {
      id: '5',
      patientName: 'Lisa Thompson',
      patientPhone: '+1 (555) 567-8901',
      patientEmail: 'lisa.t@email.com',
      lastMessage: "I forgot to take my medication this morning.",
      timestamp: '4 days ago',
      messageCount: 6,
      channel: 'native',
      isAlert: true,
      messages: [
        { id: '1', sender: 'user', content: "I forgot to take my medication this morning.", timestamp: '4 days ago 2:00 PM' },
        { id: '2', sender: 'bot', content: 'No worries! Take it as soon as you remember. If it\'s close to your next dose time, skip the missed dose.', timestamp: '4 days ago 2:01 PM' },
        { id: '3', sender: 'user', content: 'Thank you! I just took it.', timestamp: '4 days ago 2:15 PM' }
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

<<<<<<< Updated upstream
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
=======
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
>>>>>>> Stashed changes
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
<<<<<<< Updated upstream
          <h2 className="text-2xl font-semibold text-gray-900">Patient Conversations</h2>
          <p className="text-sm text-gray-500 mt-1">
            View all patient interactions with the AI assistant
          </p>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredConversations.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-600">No conversations found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
=======
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
>>>>>>> Stashed changes
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-5 hover:bg-gray-50 cursor-pointer transition-colors ${
                  conversation.isAlert ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${
                      conversation.isAlert ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}>
                      {conversation.patientName.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {conversation.patientName}
                            </h4>
                            {conversation.isAlert && (
                              <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 border-red-200">
                                Alert
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone size={11} />
                              {conversation.patientPhone}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail size={11} />
                              {conversation.patientEmail}
                            </span>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200 flex-shrink-0"
                        >
                          {conversation.channel === 'native' ? 'App' : 'WhatsApp'}
                        </Badge>
                      </div>

                      <p className={`text-sm mt-2 ${conversation.isAlert ? 'text-gray-900 font-medium' : 'text-gray-500'} line-clamp-1`}>
                        {conversation.lastMessage}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {conversation.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={11} />
                          {conversation.messageCount} messages
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Conversation Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-center justify-between ${
              selectedConversation.isAlert ? 'bg-red-50 border-red-100' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                  selectedConversation.isAlert ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                  {selectedConversation.patientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedConversation.patientName}
                    </h3>
                    {selectedConversation.isAlert && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 bg-red-100 text-red-700 border-red-200">
                        Alert
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone size={11} />
                      {selectedConversation.patientPhone}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail size={11} />
                      {selectedConversation.patientEmail}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedConversation(null)}
                className="h-8 w-8 p-0"
              >
                <X size={18} />
              </Button>
            </div>

            {/* Modal Content - Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'bot' 
                      ? 'bg-gray-900 text-white' 
                      : selectedConversation.isAlert 
                        ? 'bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold text-xs'
                        : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-xs'
                  }`}>
                    {message.sender === 'bot' ? (
                      <Bot size={16} />
                    ) : (
                      <UserIcon size={16} />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[70%] ${message.sender === 'user' ? 'items-end' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'bot'
                        ? 'bg-white text-gray-900 border border-gray-200'
                        : 'bg-gray-900 text-white'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block px-1">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
<<<<<<< Updated upstream
      )}
=======
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
        <div className="grid grid-cols-3 gap-4">
          {/* Contact Information */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Contact Information</h3>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 flex-shrink-0">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Phone</p>
                  <p className="text-sm font-semibold text-gray-900 leading-none">{selectedConv.patientPhone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 flex-shrink-0">
                  <Calendar size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Next Appointment</p>
                  <p className="text-sm font-semibold text-gray-900 leading-none">{selectedConv.nextAppointment}</p>
                </div>
              </div>

              {/* Clinic Information - Show for Admin or if conversation has clinic */}
              {(userRole === 'admin' || selectedConv.clinicName) && selectedConv.clinicName && (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 flex-shrink-0">
                    <Building2 size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Clinic</p>
                    <p className="text-sm font-semibold text-gray-900 leading-none">{selectedConv.clinicName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Context */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Context</h3>
            <div className="flex-1">
              <div className="flex items-start gap-2 mb-2">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                <p className="text-sm text-gray-700 font-medium">{selectedConv.protocolName || 'General Care'}</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed pl-3.5 border-l-2 border-gray-100">
                {selectedConv.context}
              </p>
            </div>
          </div>

          {/* Active Care - Assigned Companion */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Active Care</h3>
            <div className="space-y-3 flex-1">
              {selectedConv.companionName ? (
                <div className="flex items-center justify-between group p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/50">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{selectedConv.companionName}</p>
                      <p className="text-[10px] text-gray-400 font-medium">Companion</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600">
                    <ExternalLink size={18} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded-lg border border-dashed border-gray-200 text-gray-400">
                  <User size={14} />
                  <span className="text-xs">No companion assigned</span>
                </div>
              )}
            </div>
          </div>
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
>>>>>>> Stashed changes
    </div>
  );
}
