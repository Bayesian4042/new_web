import { useState } from 'react';
import { MessageSquare, Search, Clock, ArrowUpDown, ArrowUp, ArrowDown, Eye, Building2, User, Filter } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

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

const mockConversations: Conversation[] = [
  {
    id: '1',
    patientName: 'Michael Chen',
    patientPhone: '+1 (555) 234-5678',
    patientEmail: 'mchen@email.com',
    lastMessage: "I'm very disappointed with the service.",
    timestamp: '2026-02-04T13:00:00',
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
    timestamp: '2026-02-04T16:30:00',
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
    timestamp: '2026-02-03T14:15:00',
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
    timestamp: '2026-02-04T09:30:00',
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
    timestamp: '2026-02-04T11:45:00',
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
    timestamp: '2026-02-02T15:20:00',
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

interface ConversationsTableProps {
  userRole?: 'admin' | 'clinic';
  onViewConversation: (conversation: Conversation) => void;
}

export function ConversationsTable({ userRole = 'clinic', onViewConversation }: ConversationsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [activitySort, setActivitySort] = useState<'none' | 'asc' | 'desc'>('none');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Get unique clinics for filter
  const clinics = Array.from(new Set(mockConversations.map(c => ({ name: c.clinicName, id: c.clinicId })).filter(c => c.name)));

  const filteredConversations = mockConversations
    .filter(conv => {
      const matchesSearch =
        conv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesClinic = selectedClinic === 'all' || conv.clinicId === selectedClinic;
      const matchesStatus = selectedStatus === 'all' || conv.status.toLowerCase() === selectedStatus.toLowerCase();
      
      return matchesSearch && matchesClinic && matchesStatus;
    })
    .sort((a, b) => {
      if (activitySort === 'none') return 0;

      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();

      if (activitySort === 'desc') {
        return dateB - dateA; // Most recent first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

  const handleActivitySort = () => {
    if (activitySort === 'none') {
      setActivitySort('desc'); // Most recent first
    } else if (activitySort === 'desc') {
      setActivitySort('asc'); // Oldest first
    } else {
      setActivitySort('none'); // Reset to default
    }
  };

  const toggleRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleAll = (checked: boolean) => {
    setSelectedRows(checked ? mockConversations.map(c => c.id) : []);
  };

  const needsAttentionCount = filteredConversations.filter(c => c.status === 'Needs Attention').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {userRole === 'admin' ? 'All Conversations' : 'Conversations'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {userRole === 'admin'
              ? 'Monitor platform-wide patient interactions across all clinics'
              : 'Monitor and manage patient conversations'}
          </p>
        </div>
        {needsAttentionCount > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-bold text-red-700">
              {needsAttentionCount} conversation{needsAttentionCount > 1 ? 's' : ''} need{needsAttentionCount === 1 ? 's' : ''} attention
            </span>
          </div>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {userRole === 'admin' && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  showFilters
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Filter size={14} />
                Filters
              </button>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all"
              />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Showing <span className="font-bold text-gray-900">{filteredConversations.length}</span> of <span className="font-bold text-gray-900">{mockConversations.length}</span> conversations
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && userRole === 'admin' && (
          <div className="bg-gray-50 border-b border-gray-100 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-4">
              {/* Clinic Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Filter by Clinic
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={selectedClinic}
                    onChange={(e) => setSelectedClinic(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="all">All Clinics</option>
                    {clinics.map((clinic, idx) => (
                      <option key={idx} value={clinic.id}>
                        {clinic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Filter by Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="all">All Statuses</option>
                  <option value="needs attention">🔴 Needs Attention</option>
                  <option value="active">🔵 Active</option>
                  <option value="resolved">🟢 Resolved</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Showing <span className="font-bold text-gray-900">{filteredConversations.length}</span> of{' '}
                <span className="font-bold text-gray-900">{mockConversations.length}</span> conversations
              </p>
              <button
                onClick={() => {
                  setSelectedClinic('all');
                  setSelectedStatus('all');
                }}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-4 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === mockConversations.length}
                    onChange={(e) => toggleAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-3 text-left">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Patient</span>
                </th>
                {userRole === 'admin' && (
                  <th className="py-3 px-3 text-left">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Clinic</span>
                  </th>
                )}
                <th className="py-3 px-3 text-left">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Message</span>
                </th>
                <th className="py-3 px-3 text-left">
                  <button
                    onClick={handleActivitySort}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
                  >
                    Last Activity
                    {activitySort === 'none' && <ArrowUpDown size={12} className="text-gray-300" />}
                    {activitySort === 'desc' && <ArrowDown size={12} className="text-blue-600" />}
                    {activitySort === 'asc' && <ArrowUp size={12} className="text-blue-600" />}
                  </button>
                </th>
                <th className="py-3 px-3 text-left">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
                </th>
                <th className="py-3 px-3 text-left">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sentiment</span>
                </th>
                <th className="py-3 px-3 text-right">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredConversations.map((conv) => (
                <tr
                  key={conv.id}
                  onClick={() => onViewConversation(conv)}
                  className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                >
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(conv.id)}
                      onChange={() => toggleRow(conv.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        conv.status === 'Needs Attention' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-gray-900">{conv.patientName}</p>
                        </div>
                        <p className="text-xs text-gray-500">{conv.patientEmail}</p>
                      </div>
                    </div>
                  </td>
                  {userRole === 'admin' && (
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{conv.clinicName}</span>
                      </div>
                    </td>
                  )}
                  <td className="py-3 px-3">
                    <div className="max-w-xs">
                      <p className="text-xs text-gray-500 mb-0.5">via {conv.assistantName}</p>
                      <p className="text-sm text-gray-700 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{conv.messageCount} messages</p>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-700">
                          {new Date(conv.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      className={`text-xs font-bold ${
                        conv.status === 'Needs Attention'
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : conv.status === 'active'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-green-50 text-green-700 border border-green-100'
                      }`}
                    >
                      {conv.status === 'Needs Attention' ? 'Needs Attention' : conv.status === 'active' ? 'Active' : 'Resolved'}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <Badge className={`text-xs font-bold flex items-center gap-1.5 w-fit border ${sentimentConfig[conv.sentiment].color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${sentimentConfig[conv.sentiment].dot}`} />
                      {sentimentConfig[conv.sentiment].label}
                    </Badge>
                  </td>
                  <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewConversation(conv)}
                        className="h-8 w-8 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center"
                        title="View Conversation"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredConversations.length === 0 && (
          <div className="py-12 text-center">
            <MessageSquare className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500 font-medium">No conversations found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
