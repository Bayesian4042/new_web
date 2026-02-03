import { useState } from 'react';
import { Filter, X, ArrowUpDown, Bot, Copy, Trash2, Send, Play } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Companion {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Draft' | 'Archived';
  users: number;
  createdBy: string;
  createdOn: string;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}
const companions: Companion[] = [
  {
    id: 'CMP-0001',
    name: 'Recovery Coach',
    role: 'Post-Op Support',
    status: 'Active',
    users: 124,
    createdBy: 'Dr. Sarah Smith',
    createdOn: '02-02-2026'
  },
  {
    id: 'CMP-0002',
    name: 'Medication Reminder',
    role: 'Adherence',
    status: 'Active',
    users: 856,
    createdBy: 'Nurse Johnson',
    createdOn: '01-02-2026'
  },
  {
    id: 'CMP-0003',
    name: 'Anxiety Support',
    role: 'Mental Health',
    status: 'Draft',
    users: 0,
    createdBy: 'Dr. Mike Wilson',
    createdOn: '31-01-2026'
  },
  {
    id: 'CMP-0004',
    name: 'Dietary Assistant',
    role: 'Nutrition',
    status: 'Archived',
    users: 45,
    createdBy: 'Nutritionist Jane',
    createdOn: '28-01-2026'
  },
  {
    id: 'CMP-0005',
    name: 'Symptom Checker',
    role: 'Triage',
    status: 'Active',
    users: 342,
    createdBy: 'Dr. Sarah Smith',
    createdOn: '25-01-2026'
  }];

export function Companions({ onEdit }: { onEdit?: (companion: Companion) => void }) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState(false);
  const [testingCompanion, setTestingCompanion] = useState<Companion | null>(null);
  const [testMessages, setTestMessages] = useState<Message[]>([]);
  const [testInput, setTestInput] = useState('');
  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };
  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === companions.length ? [] : companions.map((c) => c.id)
    );
  };

  const handleTestCompanion = (companion: Companion) => {
    setTestingCompanion(companion);
    // Initialize with a welcome message
    setTestMessages([
      {
        id: '1',
        sender: 'bot',
        content: `Hello! I'm ${companion.name}, your ${companion.role} companion. How can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendTestMessage = () => {
    if (!testInput.trim() || !testingCompanion) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: testInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTestMessages((prev) => [...prev, userMessage]);
    setTestInput('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: `This is a simulated response from ${testingCompanion.name}. In the real implementation, this would be an AI-generated response based on the companion's configuration and rules.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setTestMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleCloseTest = () => {
    setTestingCompanion(null);
    setTestMessages([]);
    setTestInput('');
  };
  return (
    <div className="space-y-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {filterActive ? (
            <button
              onClick={() => setFilterActive(false)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200"
            >
              <Filter size={14} />
              Filter
              <X size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
          ) : (
            <button
              onClick={() => setFilterActive(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200"
            >
              <Filter size={14} />
              Filter
            </button>
          )}

          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200">
            <ArrowUpDown size={14} />
            Sort by Date
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-10 py-3 px-3">
                <input
                  type="checkbox"
                  checked={selectedRows.length === companions.length}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
              </th>
              <th className="py-3 px-3 text-left">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                  ID
                  <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Role
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Users
              </th>
              <th className="py-3 px-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {companions.map((companion) => (
              <tr
                key={companion.id}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('input[type="checkbox"]') || target.closest('button')) {
                    return;
                  }
                  onEdit?.(companion);
                }}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer"
              >
                <td className="py-3 px-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(companion.id)}
                    onChange={() => toggleRow(companion.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                    {companion.id}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center">
                      <Bot size={14} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-900">{companion.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-600">{companion.role}</span>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${companion.status === 'Active'
                      ? 'bg-green-50 text-green-700'
                      : companion.status === 'Draft'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    {companion.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-600">{companion.users}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-end gap-3 text-gray-400">
                    <span className="text-xs text-gray-400">
                      {companion.createdOn}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestCompanion(companion);
                        }}
                        className="p-1 hover:text-blue-600"
                        title="Test Companion"
                      >
                        <Play size={14} />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 hover:text-gray-600"
                        title="Copy"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Test Chatbot Modal */}
      {testingCompanion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Test: {testingCompanion.name}
                  </h3>
                  <p className="text-xs text-gray-500">{testingCompanion.role}</p>
                </div>
              </div>
              <button
                onClick={handleCloseTest}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {testMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'bot'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-900 text-white'
                    }`}>
                    {message.sender === 'bot' ? (
                      <Bot size={16} />
                    ) : (
                      <span className="text-xs font-semibold">U</span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[70%] ${message.sender === 'user' ? 'items-end' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 ${message.sender === 'bot'
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

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendTestMessage()}
                  placeholder="Type a message to test the companion..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
                />
                <Button
                  onClick={handleSendTestMessage}
                  disabled={!testInput.trim()}
                  className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This is a simulation. Real responses will be generated based on the companion's AI rules and configuration.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>);

}