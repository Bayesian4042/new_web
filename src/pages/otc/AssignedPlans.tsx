import { useState } from 'react';
import {
  Search,
  ArrowUpDown,
  ClipboardList,
  Pencil,
  Users,
  Filter,
  X,
} from 'lucide-react';
import type { Plan } from './Plans';

// Shape of a patient stored on a plan (matches what PlanForm2 emits)
interface AssignedPatient {
  id: string;
  name: string;
  dob?: string;
  email?: string;
  phone?: string;
}

// One row in the table = one patient ↔ plan assignment
interface AssignmentRow {
  patientId: string;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  planId: string;
  planName: string;
  planStatus: Plan['status'];
  planCategory: string;
  assignedOn: string;
  plan: Plan;
}

interface AssignedPlansProps {
  plans: Plan[];
  onEditPlan: (plan: Plan) => void;
}

export function AssignedPlans({ plans, onEditPlan }: AssignedPlansProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortField, setSortField] = useState<'patient' | 'plan' | 'date'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Flatten plans → patient assignments into rows
  const rows: AssignmentRow[] = [];
  plans.forEach((plan) => {
    const patients: AssignedPatient[] = (plan as any).assignedPatients || [];
    patients.forEach((p) => {
      rows.push({
        patientId: p.id,
        patientName: p.name,
        patientEmail: p.email,
        patientPhone: p.phone,
        planId: plan.id,
        planName: plan.name,
        planStatus: plan.status,
        planCategory: plan.category,
        assignedOn: plan.createdOn,
        plan,
      });
    });
  });

  // Filter
  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.patientName.toLowerCase().includes(q) ||
      r.planName.toLowerCase().includes(q) ||
      (r.patientEmail || '').toLowerCase().includes(q) ||
      r.planId.toLowerCase().includes(q);
    const matchesStatus =
      filterStatus === 'all' || r.planStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'patient') cmp = a.patientName.localeCompare(b.patientName);
    else if (sortField === 'plan') cmp = a.planName.localeCompare(b.planName);
    else cmp = a.assignedOn.localeCompare(b.assignedOn);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  };

  const statusColors: Record<Plan['status'], string> = {
    Active: 'bg-green-50 text-green-700',
    Draft: 'bg-yellow-50 text-yellow-700',
    Archived: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Assigned Plans</h1>
          <p className="text-gray-500 mt-1">
            All patient ↔ plan assignments — click a row to open the plan in edit mode.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <Users size={14} className="text-violet-500" />
          <span className="font-semibold text-gray-900">{sorted.length}</span>
          <span>assignment{sorted.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name, plan name or email…"
            className="w-full pl-9 pr-4 py-2 text-sm border-none focus:ring-0 text-gray-900 placeholder-gray-400 bg-transparent"
          />
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <div className="relative">
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 ${filterOpen ? 'bg-gray-50' : ''}`}
          >
            <Filter size={15} />
            {filterStatus !== 'all' ? (
              <>
                <span>{filterStatus}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setFilterStatus('all'); }}
                  className="ml-0.5 text-gray-400 hover:text-gray-700"
                >
                  <X size={13} />
                </button>
              </>
            ) : (
              <span>Filter</span>
            )}
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
              {(['all', 'Active', 'Draft', 'Archived'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { setFilterStatus(s); setFilterOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${filterStatus === s ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {s === 'all' ? 'All statuses' : s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Users size={22} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No assignments yet</p>
            <p className="text-xs text-gray-400 mt-1">
              {search || filterStatus !== 'all'
                ? 'Try clearing your search or filter.'
                : 'Assign patients to plans in Plans 2 to see them here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/30">
                  <th className="py-3 px-4 text-left">
                    <button
                      onClick={() => toggleSort('patient')}
                      className="flex items-center gap-1 text-xs font-bold text-gray-700 uppercase tracking-wider hover:text-gray-900"
                    >
                      Patient
                      <ArrowUpDown size={11} className={sortField === 'patient' ? 'text-indigo-500' : 'text-gray-400'} />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <button
                      onClick={() => toggleSort('plan')}
                      className="flex items-center gap-1 text-xs font-bold text-gray-700 uppercase tracking-wider hover:text-gray-900"
                    >
                      Plan
                      <ArrowUpDown size={11} className={sortField === 'plan' ? 'text-indigo-500' : 'text-gray-400'} />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left">
                    <button
                      onClick={() => toggleSort('date')}
                      className="flex items-center gap-1 text-xs font-bold text-gray-700 uppercase tracking-wider hover:text-gray-900"
                    >
                      Assigned On
                      <ArrowUpDown size={11} className={sortField === 'date' ? 'text-indigo-500' : 'text-gray-400'} />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.map((row, idx) => (
                  <tr
                    key={`${row.planId}-${row.patientId}-${idx}`}
                    onClick={() => onEditPlan(row.plan)}
                    className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                  >
                    {/* Patient */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {row.patientName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{row.patientName}</p>
                          <p className="text-[10px] text-gray-400 truncate">
                            {row.patientEmail || row.patientPhone || '—'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center shrink-0">
                          <ClipboardList size={13} className="text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{row.planName}</p>
                          <p className="text-[10px] text-blue-500 font-semibold">{row.planId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{row.planCategory}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${statusColors[row.planStatus]}`}>
                        {row.planStatus}
                      </span>
                    </td>

                    {/* Assigned On */}
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-500">{row.assignedOn}</span>
                    </td>

                    {/* Edit action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditPlan(row.plan); }}
                        className="p-1.5 text-gray-300 group-hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit plan"
                      >
                        <Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
