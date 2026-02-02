import React, { useState } from 'react';
import { Filter, X, ArrowUpDown, MessageSquare, Heart, Bot, Copy, Edit, Trash2 } from 'lucide-react';
interface Companion {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Draft' | 'Archived';
  users: number;
  createdBy: string;
  createdOn: string;
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
              className={`border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-all duration-200 group ${selectedRows.includes(companion.id) ? 'bg-blue-50/30' : ''}`}>
                <td className="py-4 px-4">
                  <input
                  type="checkbox"
                  checked={selectedRows.includes(companion.id)}
                  onChange={() => toggleRow(companion.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer" />
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-gray-900 font-mono">
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
                      className="p-1.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-md text-gray-400 hover:text-gray-600 transition-all"
                      title="Copy">
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => onEdit?.(companion)}
                      className="p-1.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-md text-gray-400 hover:text-blue-600 transition-all"
                      title="Edit">
                      <Edit size={16} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-red-100 rounded-md text-gray-400 hover:text-red-500 transition-all"
                      title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}