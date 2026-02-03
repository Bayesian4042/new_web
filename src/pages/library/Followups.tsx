import React, { useState } from 'react';
import {
  Filter,
  X,
  ArrowUpDown,
  MessageSquare,
  Heart,
  Plus,
  CalendarCheck
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Followup {
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

const followups: Followup[] = [
  {
    id: 'FUP-0001',
    name: 'Post-Op Day 1 Check',
    type: 'Scheduled',
    status: 'Active',
    frequency: 'Daily',
    duration: '7',
    time: '9:00 AM',
    linkedProtocols: 5,
    createdOn: '02-02-2026 07:00:00',
    content: "Hi Sarah! Checking in on your recovery after yesterday's procedure. How is your pain level today?"
  },
  {
    id: 'FUP-0002',
    name: 'Weekly Progress Review',
    type: 'Scheduled',
    status: 'Active',
    frequency: 'Weekly',
    duration: '30',
    time: '10:00 AM',
    linkedProtocols: 12,
    createdOn: '01-02-2026 09:30:00',
    content: "Time for your weekly review! How has your mood and energy been over the past 7 days?"
  },
  {
    id: 'FUP-0003',
    name: 'Missed Dose Alert',
    type: 'Triggered',
    status: 'Active',
    frequency: 'On Event',
    linkedProtocols: 8,
    createdOn: '28-01-2026 11:45:00'
  },
  {
    id: 'FUP-0004',
    name: 'Monthly Assessment',
    type: 'Scheduled',
    status: 'Draft',
    frequency: 'Monthly',
    duration: '90',
    time: '11:00 AM',
    linkedProtocols: 0,
    createdOn: '25-01-2026 14:20:00'
  }
];

interface FollowupsProps {
  onAddFollowup: () => void;
  onEditFollowup: (followup: Followup) => void;
}

export function Followups({ onAddFollowup, onEditFollowup }: FollowupsProps) {
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
            Created On
          </button>
        </div>

        <Button
          onClick={onAddFollowup}
          size="sm"
          className="bg-gray-900 hover:bg-gray-800 text-white"
        >
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
                  checked={selectedRows.length === followups.length}
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
                Type
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Frequency
              </th>
              <th className="py-3 px-3 text-right text-sm font-medium text-gray-500"></th>
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
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                    {followup.id}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center">
                      <CalendarCheck size={14} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-900">
                      {followup.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${followup.type === 'Scheduled'
                        ? 'bg-blue-50 text-blue-700'
                        : followup.type === 'Triggered'
                          ? 'bg-orange-50 text-orange-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    {followup.type}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${followup.status === 'Active'
                        ? 'bg-green-50 text-green-700'
                        : followup.status === 'Draft'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    {followup.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-600">
                    {followup.frequency}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-end gap-3 text-gray-400">
                    <span className="text-xs text-gray-400">
                      {followup.createdOn}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs hover:text-gray-600"
                      >
                        <MessageSquare size={14} />
                        <span>0</span>
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-red-500"
                      >
                        <Heart size={14} />
                      </button>
                    </div>
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