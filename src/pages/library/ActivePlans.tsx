import { useState } from 'react';
import {
  Search,
  ArrowUpDown,
  ClipboardList,
  Pencil,
  Users,
  Filter,
  X,
  Lock,
  AlertTriangle,
  UserCircle,
} from 'lucide-react';
import type { Plan } from '../otc/Plans';

interface AssignedPatient {
  id: string;
  name: string;
  dob?: string;
  email?: string;
  phone?: string;
}

interface ActivePlanRow {
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

interface ActivePlansProps {
  plans: Plan[];
  onEditPlan: (plan: Plan) => void;
  onNavigateToPatient?: (patientId: string) => void;
}

export function ActivePlans({ plans, onEditPlan, onNavigateToPatient }: ActivePlansProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortField, setSortField] = useState<'patient' | 'plan' | 'date'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [editConfirm, setEditConfirm] = useState<ActivePlanRow | null>(null);

  // Flatten assigned patients from plans into rows
  const rows: ActivePlanRow[] = [];
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

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.patientName.toLowerCase().includes(q) ||
      r.planName.toLowerCase().includes(q) ||
      (r.patientEmail || '').toLowerCase().includes(q) ||
      r.planId.toLowerCase().includes(q);
    const matchesStatus = filterStatus === 'all' || r.planStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Active Plans</h1>
          <p className="text-gray-500 mt-1">
            Plans currently assigned to patients — edits apply only to the individual patient's version.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <Lock size={13} className="text-amber-500" />
            <span className="font-semibold">Protected — edits are patient-specific</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <Users size={14} className="text-violet-500" />
            <span className="font-semibold text-gray-900">{sorted.length}</span>
            <span>assignment{sorted.length !== 1 ? 's' : ''}</span>
          </div>
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
            placeholder="Search by patient, plan name or email…"
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
            <p className="text-sm font-semibold text-gray-500">No active assignments</p>
            <p className="text-xs text-gray-400 mt-1">
              {search || filterStatus !== 'all'
                ? 'Try clearing your search or filter.'
                : 'Assign a plan to a patient from Built Plans to see it here.'}
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
                    className="hover:bg-amber-50/20 transition-colors group"
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
                        <div className="h-6 w-6 rounded bg-amber-50 flex items-center justify-center shrink-0">
                          <ClipboardList size={13} className="text-amber-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{row.planName}</p>
                          <div className="flex items-center gap-1">
                            <p className="text-[10px] text-blue-500 font-semibold">{row.planId}</p>
                            <Lock size={9} className="text-amber-400" />
                          </div>
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

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onNavigateToPatient && (
                          <button
                            onClick={() => onNavigateToPatient(row.patientId)}
                            className="p-1.5 text-gray-300 hover:text-violet-500 hover:bg-violet-50 rounded-lg transition-colors"
                            title="View patient"
                          >
                            <UserCircle size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => setEditConfirm(row)}
                          className="p-1.5 text-gray-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit patient plan"
                        >
                          <Pencil size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit confirmation dialog */}
      {editConfirm && (
        <EditConfirmDialog
          row={editConfirm}
          onConfirm={() => {
            onEditPlan(editConfirm.plan);
            setEditConfirm(null);
          }}
          onNavigateToPatient={
            onNavigateToPatient
              ? () => {
                  onNavigateToPatient(editConfirm.patientId);
                  setEditConfirm(null);
                }
              : undefined
          }
          onCancel={() => setEditConfirm(null)}
        />
      )}
    </div>
  );
}

function EditConfirmDialog({
  row,
  onConfirm,
  onNavigateToPatient,
  onCancel,
}: {
  row: ActivePlanRow;
  onConfirm: () => void;
  onNavigateToPatient?: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900">Edit Active Plan</h3>
            <p className="text-sm text-gray-500 mt-1">
              You are about to edit{' '}
              <span className="font-semibold text-gray-700">"{row.planName}"</span> which is currently
              assigned to{' '}
              <span className="font-semibold text-gray-700">{row.patientName}</span>.
            </p>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
              Changes will only affect this patient's version of the plan, not the original in Built Plans.
            </p>
          </div>
          <button onClick={onCancel} className="text-gray-300 hover:text-gray-500 shrink-0">
            <X size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-2 pt-1">
          {onNavigateToPatient && (
            <button
              onClick={onNavigateToPatient}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors"
            >
              <UserCircle size={15} />
              Go to Patient Page
            </button>
          )}
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors"
          >
            Edit Here (Active Plans)
          </button>
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
