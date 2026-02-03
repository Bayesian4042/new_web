import { useState } from 'react';
<<<<<<< Updated upstream
import { Filter, X, ArrowUpDown, MessageSquare, Bot, Copy, Trash2, Send } from 'lucide-react';
=======
import { Filter, X, ArrowUpDown, Bot, Copy, Trash2, Edit2 } from 'lucide-react';
>>>>>>> Stashed changes
import { Button } from '../../components/ui/Button';

export interface Companion {
  id: string;
  name: string;
  type: string;
  role: string;
  status: 'Active' | 'Draft' | 'Archived';
  users: number;
  createdOn: string;
  createdBy: string;
}

interface CompanionsProps {
  onAddCompanion: () => void;
  onEditCompanion: (companion: Companion) => void;
  onCopyCompanion: (companion: Companion) => void;
  onDeleteCompanion: (id: string) => void;
  companions: Companion[];
}
<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes

export function Companions({ onAddCompanion, onEditCompanion, onCopyCompanion, onDeleteCompanion, companions }: CompanionsProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState(false);

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

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between py-4 border-b border-gray-100 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">All Companions</h2>
        <div className="flex items-center gap-2">
          {filterActive ?
          <button
            onClick={() => setFilterActive(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-transparent">
              <Filter size={16} />
              Filter
              <X size={16} className="text-gray-500 hover:text-gray-900 ml-1" />
            </button> :

          <button
            onClick={() => setFilterActive(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-all shadow-sm">
              <Filter size={16} />
              Filter
            </button>
          }

          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-all shadow-sm">
            <ArrowUpDown size={16} />
            Sort by Date
          </button>
        </div>

        <Button onClick={onAddCompanion} size="sm" className="h-9 px-4 bg-gray-900 hover:bg-gray-800 text-white shadow-sm transition-all rounded-lg flex items-center gap-2">
          <Bot size={16} />
          Add Companion
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              <th className="w-12 py-4 px-4">
                <input
                  type="checkbox"
                  checked={selectedRows.length === companions.length}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer" />
              </th>
              <th className="py-4 px-4 text-left">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">
                  Code
                  <ArrowUpDown size={14} />
                </button>
              </th>
<<<<<<< Updated upstream
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Users
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="py-4 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {companions.map((companion) =>
            <tr
              key={companion.id}
              onClick={(e) => {
                // Don't trigger row click if clicking on checkbox or action buttons
                const target = e.target as HTMLElement;
                if (target.closest('input[type="checkbox"]') || target.closest('button')) {
                  return;
                }
                onEdit?.(companion);
              }}
              className={`border-b border-gray-100 last:border-0 hover:bg-blue-50/50 transition-all duration-200 group cursor-pointer ${selectedRows.includes(companion.id) ? 'bg-blue-50/30' : ''}`}>
                <td className="py-4 px-4">
                  <input
                  type="checkbox"
                  checked={selectedRows.includes(companion.id)}
                  onChange={() => toggleRow(companion.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer" />
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-gray-900 font-mono">
=======
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Role</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Users</th>
              <th className="py-3 px-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {companions.map((companion) => (
              <tr
                key={companion.id}
                onClick={() => onEditCompanion(companion)}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer"
              >
                <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(companion.id)}
                    onChange={() => toggleRow(companion.id)}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
>>>>>>> Stashed changes
                    {companion.id}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                      <Bot size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 block">
                        {companion.name}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-600 bg-gray-100/50 px-2.5 py-1 rounded-md border border-gray-200/50">
                    {companion.role}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${companion.status === 'Active' ?
                  'bg-green-50 text-green-700 border-green-200' :
                  companion.status === 'Draft' ?
                  'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {companion.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <span className="font-medium">{companion.users}</span>
                    <span className="text-gray-400 text-xs">users</span>
                  </div>
                </td>
<<<<<<< Updated upstream
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-600">
                    {companion.createdBy}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-500 tabular-nums">
                    {companion.createdOn}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-md text-gray-400 hover:text-gray-600 transition-all"
                      title="Copy">
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-red-100 rounded-md text-gray-400 hover:text-red-500 transition-all"
                      title="Delete">
                      <Trash2 size={16} />
=======
                <td className="py-3 px-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCompanion(companion);
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopyCompanion(companion);
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Copy"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCompanion(companion.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
>>>>>>> Stashed changes
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
<<<<<<< Updated upstream

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
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'bot' 
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

=======
    </div>
  );
>>>>>>> Stashed changes
}