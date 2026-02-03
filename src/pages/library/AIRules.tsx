import { useState } from 'react';
import {
  Filter,
  X,
  ArrowUpDown,
  BrainCircuit,
  Plus,
  Copy,
  Pencil,
  Trash2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface AIRule {
  id: string;
  name: string;
  type: 'Safety' | 'Adherence' | 'Engagement';
  status: 'Active' | 'Testing' | 'Disabled';
  triggers: number;
  lastUpdated: string;
  createdOn: string;
  content?: string;
  assignedClinics?: string[];
  assignedCategories?: string[];
}

interface AIRulesProps {
  onAddRule: () => void;
  onEditRule: (rule: AIRule) => void;
  onCopyRule: (rule: AIRule) => void;
  onDeleteRule: (id: string) => void;
  rules: AIRule[];
}

export function AIRules({ onAddRule, onEditRule, onCopyRule, onDeleteRule, rules }: AIRulesProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState(false);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === rules.length ? [] : rules.map((r) => r.id)
    );
  };

  return (
    <div className="space-y-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterActive(!filterActive)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200 ${filterActive ? 'bg-gray-50' : ''}`}>
            <Filter size={14} />
            Filter
            {filterActive && <X size={14} className="text-gray-400" />}
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200">
            <ArrowUpDown size={14} />
            Created On
          </button>
        </div>

        <Button onClick={onAddRule} size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus size={16} />
          Add AI Rule
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
                  checked={rules.length > 0 && selectedRows.length === rules.length}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500" />
              </th>
              <th className="py-3 px-3 text-left">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                  ID <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Triggers</th>
              <th className="py-3 px-3 text-right text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr
                key={rule.id}
                onClick={() => onEditRule(rule)}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer">
                <td className="py-3 px-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(rule.id)}
                    onChange={() => toggleRow(rule.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500" />
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm font-medium text-blue-600">{rule.id}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center">
                      <BrainCircuit size={14} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-900">{rule.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${rule.type === 'Safety' ? 'bg-red-50 text-red-700' : rule.type === 'Adherence' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                    {rule.type}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${rule.status === 'Active' ? 'bg-green-50 text-green-700' : rule.status === 'Testing' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                    {rule.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-600">{rule.triggers}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onCopyRule(rule); }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copy"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onEditRule(rule); }}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteRule(rule.id); }}
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