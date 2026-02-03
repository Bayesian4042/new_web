import { useState } from 'react';
import {
  Filter,
  X,
  ArrowUpDown,
  ClipboardList,
  Plus,
  Copy,
  Pencil,
  Trash2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface Plan {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Draft' | 'Archived';
  duration: string;
  steps: number;
  createdOn: string;
  assignedCategories?: string[];
  content?: string;
  products?: any[];
}

interface PlansProps {
  onAdd: () => void;
  onEdit: (plan: Plan) => void;
  onCopy: (plan: Plan) => void;
  onDelete: (id: string) => void;
  plans: Plan[];
}

export function Plans({ onAdd, onEdit, onCopy, onDelete, plans }: PlansProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState(false);

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === plans.length ? [] : plans.map((p) => p.id)
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

        <Button onClick={onAdd} size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus size={16} />
          Add Treatment Plan
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
                  checked={plans.length > 0 && selectedRows.length === plans.length}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">ID</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Category</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Duration</th>
              <th className="py-3 px-3 text-right text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {plans.map((plan) => (
              <tr
                key={plan.id}
                onClick={() => onEdit(plan)}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer"
              >
                <td className="py-3 px-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(plan.id)}
                    onChange={(e) => toggleRow(plan.id, e as any)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm font-medium text-blue-600">{plan.id}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center">
                      <ClipboardList size={14} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-900">{plan.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-600">{plan.category}</span>
                </td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${plan.status === 'Active' ? 'bg-green-50 text-green-700' : plan.status === 'Draft' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                    {plan.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-600">{plan.duration}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onCopy(plan); }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copy"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(plan); }}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(plan.id); }}
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