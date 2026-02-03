import { useState } from 'react';
import {
  Filter,
  X,
  ArrowUpDown,
<<<<<<< Updated upstream
  MessageSquare,
  Heart,
  ClipboardList } from
'lucide-react';
interface Plan {
=======
  ClipboardList,
  Plus,
  Copy,
  Pencil,
  Trash2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface Plan {
>>>>>>> Stashed changes
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Draft' | 'Archived';
  duration: string;
  steps: number;
  createdOn: string;
<<<<<<< Updated upstream
}
const plans: Plan[] = [
{
  id: 'PLAN-0001',
  name: 'Post-Surgery Recovery',
  category: 'Orthopedics',
  status: 'Active',
  duration: '6 weeks',
  steps: 12,
  createdOn: '02-02-2026 08:30:00'
},
{
  id: 'PLAN-0002',
  name: 'Diabetes Management',
  category: 'Chronic Care',
  status: 'Active',
  duration: 'Ongoing',
  steps: 8,
  createdOn: '01-02-2026 10:15:00'
},
{
  id: 'PLAN-0003',
  name: 'Weight Loss Program',
  category: 'Wellness',
  status: 'Draft',
  duration: '12 weeks',
  steps: 16,
  createdOn: '28-01-2026 14:00:00'
},
{
  id: 'PLAN-0004',
  name: 'Cardiac Rehabilitation',
  category: 'Cardiology',
  status: 'Active',
  duration: '8 weeks',
  steps: 10,
  createdOn: '25-01-2026 09:45:00'
},
{
  id: 'PLAN-0005',
  name: 'Mental Health Support',
  category: 'Psychology',
  status: 'Archived',
  duration: '4 weeks',
  steps: 6,
  createdOn: '20-01-2026 11:30:00'
}];

export function Plans() {
=======
  content?: string;
  documents?: { name: string; size: string }[];
  links?: string[];
  products?: { id: string; name: string; type: string; instruction: string; timeOfDay: string[]; price: string }[];
  assignedClinics?: string[];
  assignedCategories?: string[];
}

interface PlansProps {
  onAdd: () => void;
  onEdit: (plan: Plan) => void;
  onCopy: (plan: Plan) => void;
  onDelete: (id: string) => void;
  plans: Plan[];
}

export function Plans({ onAdd, onEdit, onCopy, onDelete, plans }: PlansProps) {
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
    prev.length === plans.length ? [] : plans.map((p) => p.id)
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

              <Filter size={14} />
              Filter
            </button>
          }

=======
          <button
            onClick={() => setFilterActive(!filterActive)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200 ${filterActive ? 'bg-gray-50' : ''}`}
          >
            <Filter size={14} />
            Filter
            {filterActive && <X size={14} className="text-gray-400" />}
          </button>
>>>>>>> Stashed changes
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200">
            <ArrowUpDown size={14} />
            Created On
          </button>
        </div>
<<<<<<< Updated upstream
=======

        <Button onClick={onAdd} size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus size={16} />
          Add Treatment Plan
        </Button>
>>>>>>> Stashed changes
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-10 py-3 px-3">
                <input
                  type="checkbox"
<<<<<<< Updated upstream
                  checked={selectedRows.length === plans.length}
=======
                  checked={plans.length > 0 && selectedRows.length === plans.length}
>>>>>>> Stashed changes
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500" />

              </th>
<<<<<<< Updated upstream
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
                Category
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Duration
              </th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                Steps
              </th>
              <th className="py-3 px-3 text-right text-sm font-medium text-gray-500"></th>
=======
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">ID</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Category</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">Duration</th>
              <th className="py-3 px-3 text-right text-sm font-medium text-gray-500">Action</th>
>>>>>>> Stashed changes
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) =>
            <tr
              key={plan.id}
              className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">

                <td className="py-3 px-3">
                  <input
                  type="checkbox"
                  checked={selectedRows.includes(plan.id)}
                  onChange={() => toggleRow(plan.id)}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500" />

                </td>
                <td className="py-3 px-3">
<<<<<<< Updated upstream
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                    {plan.id}
                  </span>
=======
                  <span className="text-sm font-medium text-blue-600">{plan.id}</span>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                  <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${plan.status === 'Active' ? 'bg-green-50 text-green-700' : plan.status === 'Draft' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>

=======
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${plan.status === 'Active' ? 'bg-green-50 text-green-700' : plan.status === 'Draft' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
>>>>>>> Stashed changes
                    {plan.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm text-gray-600">{plan.duration}</span>
                </td>
                <td className="py-3 px-3">
<<<<<<< Updated upstream
                  <span className="text-sm text-gray-600">{plan.steps}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-end gap-3 text-gray-400">
                    <span className="text-xs text-gray-400">
                      {plan.createdOn}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="flex items-center gap-1 text-xs hover:text-gray-600">
                        <MessageSquare size={14} />
                        <span>0</span>
                      </button>
                      <button className="hover:text-red-500">
                        <Heart size={14} />
                      </button>
                    </div>
=======
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
>>>>>>> Stashed changes
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}