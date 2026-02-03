import { useState } from 'react';
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
  Edit2
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
}

const sentimentConfig = {
  happy: { label: 'Positive', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
  sad: { label: 'Low Mood', color: 'bg-slate-50 text-slate-700 border-slate-100', dot: 'bg-slate-400' },
  angry: { label: 'Distressed', color: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' },
  neutral: { label: 'Neutral', color: 'bg-gray-50 text-gray-700 border-gray-100', dot: 'bg-gray-400' },
  anxious: { label: 'Concern', color: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
};

export function Conversations() {
  const [view, setView] = useState<'list' | 'detail' | 'profile'>('list');
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      messages: [
        { id: 's1', sender: 'bot', content: 'Hi Sarah, how is your recovery going?', timestamp: '4:15 PM' },
        { id: 's2', sender: 'user', content: 'Doing well, pain is manageable now.', timestamp: '4:20 PM' },
        { id: 's3', sender: 'bot', content: "That's great to hear! Remember to continue taking your medication as prescribed.", timestamp: '4:30 PM' },
      ]
    }
  ];

  const filteredConversations = mockConversations.filter(c =>
    c.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const needsAttentionCount = mockConversations.filter(c => c.status === 'Needs Attention').length;

  // --- RENDERING HELPERS ---

  const renderListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Conversations</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor and respond to patient interactions</p>
        </div>
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
                    <Badge className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${conv.status === 'Needs Attention' ? 'bg-red-100 text-red-700' : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                      {conv.status === 'active' ? 'active' : conv.status}
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
