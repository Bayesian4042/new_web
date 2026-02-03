import { useState } from 'react';
import { Filter, X, ArrowUpDown, Bot, Copy, Trash2, Edit2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface Companion {
  id: string;
  name: string;
  type?: string;
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

        <Button onClick={onAddCompanion} size="sm" className="h-9 px-4 bg-gray-900 hover:bg-gray-800 text-white shadow-sm transition-all rounded-lg flex items-center gap-2">
          <Bot size={16} />
          Add Companion
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
                  checked={companions.length > 0 && selectedRows.length === companions.length}
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