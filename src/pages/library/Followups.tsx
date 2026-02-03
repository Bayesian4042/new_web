import React, { useState } from 'react';
import {
  Filter,
  X,
  ArrowUpDown,
  Plus,
  CalendarCheck,
  Copy,
  Pencil,
  Trash2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

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
    <div className="space-y-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterActive(!filterActive)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200 ${filterActive ? 'bg-gray-50' : ''}`}
          >
            <Filter size={14} />
            Filter
            {filterActive && <X size={14} className="text-gray-400" />}
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200">
            <ArrowUpDown size={14} />
            Sort by Date
          </button>
        </div>

        <Button onClick={onAddFollowup} size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus size={16} />
          Add Followup
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-10 py-3 px-3">
                <input
                  type="checkbox"
                  checked={followups.length > 0 && selectedRows.length === followups.length}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">ID</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Frequency</th>
              <th className="py-3 px-3 text-right text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {followups.map((followup) => (
              <tr
                key={followup.id}
                onClick={() => onEditFollowup(followup)}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer"
              >
                <td className="py-3 px-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(followup.id)}
                    onChange={() => toggleRow(followup.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm font-medium text-blue-600 cursor-pointer">
                    {followup.id}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center">
                      <CalendarCheck size={14} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-900">{followup.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${followup.type === 'Scheduled' ? 'bg-blue-50 text-blue-700' : followup.type === 'Triggered' ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                    {followup.type}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${followup.status === 'Active' ? 'bg-green-50 text-green-700' : followup.status === 'Draft' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                    {followup.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-600">{followup.frequency}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-end gap-2">
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
  );
}