import { useState } from 'react';
import {
  Filter,
  X,
  ArrowUpDown,
  Plus,
  CalendarCheck,
  Copy,
  Pencil,
  Trash2,
  Search
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface FollowupMessage {
  id: string;
  content: string;
  triggerType: 'day-after-share' | 'specific-date';
  startDay?: number;
  specificDate?: string;
  repeatDays: number;
  repeatCount: number;
  sendTime?: string;
}

export interface Followup {
  id: string;
  name: string;
  type: 'Scheduled' | 'Triggered' | 'Manual';
  status: 'Active' | 'Draft' | 'Disabled';
  frequency: string;
  linkedProtocols: number;
  createdOn: string;
  content?: string;
  duration?: string;
  time?: string;
  messages?: FollowupMessage[];
  totalDuration?: number;
  totalMessages?: number;
}

interface FollowupsProps {
  onAddFollowup: () => void;
  onEditFollowup: (followup: Followup) => void;
  onCopyFollowup: (followup: Followup) => void;
  onDeleteFollowup: (id: string) => void;
  followups: Followup[];
}

export function Followups({ onAddFollowup, onEditFollowup, onCopyFollowup, onDeleteFollowup, followups }: FollowupsProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState(false);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === followups.length ? [] : followups.map((f) => f.id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Followups</h1>
          <p className="text-gray-500 mt-1">Manage automated patient followup sequences</p>
        </div>
        <Button onClick={onAddFollowup} size="sm" className="bg-gray-900 hover:bg-black text-white rounded-xl shadow-sm px-4 py-2 flex items-center gap-2">
          <Plus size={16} />
          Add Followup
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search followups..."
            className="w-full pl-9 pr-4 py-2 text-sm border-none focus:ring-0 text-gray-900 placeholder-gray-400"
          />
        </div>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterActive(!filterActive)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 ${filterActive ? 'bg-gray-50' : ''}`}
          >
            <Filter size={16} />
            <span>Filter</span>
            {filterActive && <X size={14} className="ml-1 text-gray-400" />}
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
            <ArrowUpDown size={16} />
            <span>Sort by Date</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/30">
                <th className="w-10 py-3 px-4">
                  <input
                    type="checkbox"
                    checked={followups.length > 0 && selectedRows.length === followups.length}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ID
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Name
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Frequency</th>
                <th className="py-3 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {followups.map((followup) => (
                <tr
                  key={followup.id}
                  onClick={() => onEditFollowup(followup)}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(followup.id)}
                      onChange={() => toggleRow(followup.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-bold text-blue-600 cursor-pointer">
                      {followup.id}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center">
                        <CalendarCheck size={14} className="text-gray-500" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{followup.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${followup.type === 'Scheduled' ? 'bg-blue-50 text-blue-700' : followup.type === 'Triggered' ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                      {followup.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${followup.status === 'Active' ? 'bg-green-50 text-green-700' : followup.status === 'Draft' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                      {followup.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {followup.messages && followup.messages.length > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">Dynamic</span>
                        <span className="text-xs text-gray-500 font-medium">
                          {followup.totalMessages || 0} msgs / {followup.totalDuration || 0}d
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-600 font-bold">{followup.frequency}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); onCopyFollowup(followup); }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Copy"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditFollowup(followup); }}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteFollowup(followup.id); }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}