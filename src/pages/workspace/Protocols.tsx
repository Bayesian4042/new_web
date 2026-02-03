import React, { useState } from 'react';
import {
  Filter,
  X,
  ArrowUpDown,
<<<<<<< Updated upstream
  MessageSquare,
  Heart,
  FileText } from
'lucide-react';
interface Protocol {
=======
  FileText,
  Edit2,
  Trash2,
  Copy,
  UserPlus,
  Plus
} from 'lucide-react';

export interface Protocol {
>>>>>>> Stashed changes
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Review' | 'Draft';
  enrolled: number;
  duration: string;
  createdOn: string;
  aiRules?: string;
  followupMessage?: string;
  assignedClinics?: string[];
  assignedPatients?: string[];
  selectedShortcuts?: string[];
  selectedDocuments?: string[];
  selectedPlans?: string[];
}
<<<<<<< Updated upstream
const protocols: Protocol[] = [
{
  id: 'PRT-0001',
  name: 'Post-Op Knee Recovery',
  category: 'Orthopedics',
  status: 'Active',
  enrolled: 45,
  duration: '6 weeks',
  createdOn: '02-02-2026 08:00:00'
},
{
  id: 'PRT-0002',
  name: 'Type 2 Diabetes Management',
  category: 'Chronic Care',
  status: 'Active',
  enrolled: 128,
  duration: 'Ongoing',
  createdOn: '01-02-2026 12:30:22'
},
{
  id: 'PRT-0003',
  name: 'Anxiety CBT Module 1',
  category: 'Mental Health',
  status: 'Review',
  enrolled: 32,
  duration: '4 weeks',
  createdOn: '30-01-2026 15:45:00'
},
{
  id: 'PRT-0004',
  name: 'Hypertension Monitoring',
  category: 'Cardiology',
  status: 'Draft',
  enrolled: 0,
  duration: '12 weeks',
  createdOn: '28-01-2026 10:15:10'
},
{
  id: 'PRT-0005',
  name: 'Prenatal Care - Trimester 1',
  category: 'Obstetrics',
  status: 'Active',
  enrolled: 67,
  duration: '12 weeks',
  createdOn: '25-01-2026 09:00:55'
}];

export function Protocols() {
=======

interface ProtocolsProps {
  onEdit: (protocol: Protocol) => void;
  onCopy?: (protocol: Protocol) => void;
  onDelete?: (id: string) => void;
  onAssignPatients?: (protocol: Protocol) => void;
  onAdd?: () => void;
  userRole: 'admin' | 'clinic';
  protocols: Protocol[];
}

export function Protocols({ onEdit, onCopy, onDelete, onAssignPatients, onAdd, userRole, protocols }: ProtocolsProps) {
>>>>>>> Stashed changes
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState(false);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows((prev) =>
    prev.length === protocols.length ? [] : protocols.map((p) => p.id)
    );
  };

  return (
    <div className="space-y-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
<<<<<<< Updated upstream
          {filterActive ?
          <button
            onClick={() => setFilterActive(false)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200">

              <Filter size={14} />
              Filter
              <X size={14} className="text-gray-400 hover:text-gray-600" />
            </button> :

          <button
            onClick={() => setFilterActive(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200">

=======
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
>>>>>>> Stashed changes
              <Filter size={14} />
              Filter
            </button>
          )}

          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200">
            <ArrowUpDown size={14} />
            Sort by Date
          </button>
        </div>

        {userRole === 'admin' && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-sm"
          >
            <Plus size={16} />
            Add Protocol
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-10 py-3 px-3">
                <input
                  type="checkbox"
                  checked={selectedRows.length === protocols.length}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
              </th>
              <th className="py-3 px-3 text-left">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Protocol Name
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="py-3 px-3 text-left">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Category
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Enrolled</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Duration</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Created</th>
              <th className="py-3 px-3 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
<<<<<<< Updated upstream
            {protocols.map((protocol) =>
            <tr
              key={protocol.id}
              className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">

                <td className="py-3 px-3">
                  <input
                  type="checkbox"
                  checked={selectedRows.includes(protocol.id)}
                  onChange={() => toggleRow(protocol.id)}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500" />

                </td>
                <td className="py-3 px-3">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                    {protocol.id}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center">
                      <FileText size={14} className="text-gray-500" />
=======
            {protocols.map((protocol) => (
              <tr
                key={protocol.id}
                onClick={() => onEdit(protocol)}
                className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors cursor-pointer ${selectedRows.includes(protocol.id) ? 'bg-blue-50/30' : ''
                  }`}
              >
                <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(protocol.id)}
                    onChange={() => toggleRow(protocol.id)}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <FileText size={18} />
>>>>>>> Stashed changes
                    </div>
                    <span className="text-sm font-medium text-gray-900">{protocol.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-sm text-gray-600">{protocol.category}</td>
                <td className="py-3 px-3">
                  <span
<<<<<<< Updated upstream
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${protocol.status === 'Active' ? 'bg-green-50 text-green-700' : protocol.status === 'Review' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>

=======
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${protocol.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : protocol.status === 'Review'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}
                  >
>>>>>>> Stashed changes
                    {protocol.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-sm text-gray-600 font-medium">{protocol.enrolled} patients</td>
                <td className="py-3 px-3 text-sm text-gray-600">{protocol.duration} days</td>
                <td className="py-3 px-3 text-sm text-gray-500">{protocol.createdOn}</td>
                <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    {userRole === 'admin' ? (
                      <>
                        <button
                          onClick={() => onEdit(protocol)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onCopy?.(protocol)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Copy"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => onDelete?.(protocol.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAssignPatients?.(protocol);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <UserPlus size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(protocol.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
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