import { useState } from 'react';
import {
  Filter,
  X,
  ArrowUpDown,
  FileText,
  Edit2,
  Trash2,
  Copy,
  UserPlus,
  Plus
} from 'lucide-react';

export interface Protocol {
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
                    </div>
                    <span className="text-sm font-medium text-gray-900">{protocol.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-sm text-gray-600">{protocol.category}</td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${protocol.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : protocol.status === 'Review'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}
                  >
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