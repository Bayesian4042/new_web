import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Search,
  MessageSquare,
  Clock,
  Phone,
  Mail,
  X,
  Bot,
  User as UserIcon
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
}

export function Conversations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const conversations: Conversation[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      patientPhone: '+1 (555) 123-4567',
      patientEmail: 'sarah.j@email.com',
      lastMessage: "I'm feeling severe chest pain. Should I be worried?",
      timestamp: '10:05 AM',
      messageCount: 12,
      channel: 'native',
      isAlert: true,
      messages: [
        { id: '1', sender: 'bot', content: 'Hello Sarah! How are you feeling today?', timestamp: '10:00 AM' },
        { id: '2', sender: 'user', content: "I'm feeling severe chest pain. Should I be worried?", timestamp: '10:05 AM' },
        { id: '3', sender: 'bot', content: 'I understand your concern. Chest pain can be serious. Please contact your healthcare provider immediately or call emergency services if the pain is severe.', timestamp: '10:05 AM' }
      ]
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      patientPhone: '+1 (555) 234-5678',
      patientEmail: 'mchen@email.com',
      lastMessage: 'Thank you for the reminder about my appointment!',
      timestamp: 'Yesterday',
      messageCount: 8,
      channel: 'whatsapp',
      isAlert: false,
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
    }
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
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
      )}
    </div>
  );
}
