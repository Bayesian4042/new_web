import { useState } from 'react';
import {
  Plus,
  Search,
  FolderOpen,
  ClipboardList,
  Pencil,
  Copy,
  Trash2,
  Tag,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  AlertTriangle,
  X,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import type { Plan } from '../otc/Plans';

const CATEGORIES = ['All', 'Orthopedics', 'Chronic Care', 'Mental Health', 'Cardiology', 'Nutrition', 'Pediatrics', 'General'];

const TAG_COLORS: Record<string, string> = {
  nutrition: 'bg-green-50 text-green-700 border-green-200',
  exercises: 'bg-blue-50 text-blue-700 border-blue-200',
  other: 'bg-gray-100 text-gray-600 border-gray-200',
  medication: 'bg-purple-50 text-purple-700 border-purple-200',
  diet: 'bg-orange-50 text-orange-700 border-orange-200',
  cardiology: 'bg-red-50 text-red-700 border-red-200',
};

interface BuiltPlansProps {
  plans: Plan[];
  onAdd: () => void;
  onEdit: (plan: Plan) => void;
  onCopy: (plan: Plan) => void;
  onDelete: (id: string) => void;
  onAssign: (plan: Plan) => void;
}

export function BuiltPlans({ plans, onAdd, onEdit, onCopy, onDelete, onAssign }: BuiltPlansProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [assignConfirm, setAssignConfirm] = useState<Plan | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = plans.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const grouped = filtered.reduce<Record<string, Plan[]>>((acc, plan) => {
    const cat = plan.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(plan);
    return acc;
  }, {});

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const isCategoryExpanded = (cat: string) => expandedCategories[cat] !== false;

  const tags = (plan: Plan): string[] => (plan as any).tags || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Built Plans</h1>
          <p className="text-gray-500 mt-1">
            Your plan library — organize by category and assign to patients
          </p>
        </div>
        <Button
          onClick={onAdd}
          size="sm"
          className="bg-gray-900 hover:bg-black text-white rounded-xl shadow-sm px-4 py-2 flex items-center gap-2"
        >
          <Plus size={16} />
          New Plan
        </Button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              activeCategory === cat
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search toolbar */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plans..."
            className="w-full pl-9 pr-4 py-2 text-sm border-none focus:ring-0 text-gray-900 placeholder-gray-400 bg-transparent"
          />
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            List
          </button>
        </div>
        <span className="text-xs text-gray-400 font-medium pr-1">
          {filtered.length} plan{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <FolderOpen size={26} className="text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-500">No plans found</p>
          <p className="text-xs text-gray-400 mt-1">
            {search ? 'Try clearing your search.' : 'Create your first plan to get started.'}
          </p>
          {!search && (
            <button
              onClick={onAdd}
              className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus size={13} /> New Plan
            </button>
          )}
        </div>
      ) : viewMode === 'list' ? (
        /* List view grouped by category */
        <div className="space-y-3">
          {Object.entries(grouped).map(([cat, catPlans]) => (
            <div key={cat} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FolderOpen size={15} className="text-indigo-400" />
                  <span className="text-sm font-bold text-gray-800">{cat}</span>
                  <span className="text-xs text-gray-400 font-medium">{catPlans.length}</span>
                </div>
                {isCategoryExpanded(cat) ? (
                  <ChevronDown size={15} className="text-gray-400" />
                ) : (
                  <ChevronRight size={15} className="text-gray-400" />
                )}
              </button>

              {isCategoryExpanded(cat) && (
                <div className="divide-y divide-gray-50">
                  {catPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-indigo-50/20 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <ClipboardList size={15} className="text-indigo-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{plan.name}</p>
                        <p className="text-[11px] text-gray-400">
                          {plan.steps} steps · {plan.duration} · Created {plan.createdOn}
                        </p>
                      </div>
                      {tags(plan).length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          {tags(plan).slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${TAG_COLORS[tag] || TAG_COLORS.other}`}
                            >
                              <Tag size={9} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <StatusBadge status={plan.status} />
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(plan)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => onCopy(plan)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Duplicate"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => setAssignConfirm(plan)}
                          className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Grid view */
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, catPlans]) => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen size={15} className="text-indigo-400" />
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">{cat}</h3>
                <span className="text-xs text-gray-400">{catPlans.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    tags={tags(plan)}
                    menuOpen={menuOpen === plan.id}
                    onMenuToggle={(id) => setMenuOpen(menuOpen === id ? null : id)}
                    onEdit={onEdit}
                    onCopy={onCopy}
                    onDelete={onDelete}
                    onAssign={() => setAssignConfirm(plan)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign confirmation dialog */}
      {assignConfirm && (
        <AssignConfirmDialog
          plan={assignConfirm}
          onConfirm={() => {
            onAssign(assignConfirm);
            setAssignConfirm(null);
          }}
          onCancel={() => setAssignConfirm(null)}
        />
      )}
    </div>
  );
}

function PlanCard({
  plan,
  tags,
  menuOpen,
  onMenuToggle,
  onEdit,
  onCopy,
  onDelete,
  onAssign,
}: {
  plan: Plan;
  tags: string[];
  menuOpen: boolean;
  onMenuToggle: (id: string) => void;
  onEdit: (plan: Plan) => void;
  onCopy: (plan: Plan) => void;
  onDelete: (id: string) => void;
  onAssign: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all group relative">
      <div className="flex items-start justify-between mb-3">
        <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
          <ClipboardList size={17} className="text-indigo-500" />
        </div>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={plan.status} />
          <div className="relative">
            <button
              onClick={() => onMenuToggle(plan.id)}
              className="p-1 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <MoreHorizontal size={15} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                <button
                  onClick={() => { onEdit(plan); onMenuToggle(plan.id); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => { onCopy(plan); onMenuToggle(plan.id); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Copy size={13} /> Duplicate
                </button>
                <div className="h-px bg-gray-100 mx-2" />
                <button
                  onClick={() => { onDelete(plan.id); onMenuToggle(plan.id); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug">{plan.name}</h3>
      <p className="text-[11px] text-gray-400 mb-3">
        {plan.steps} steps · {plan.duration}
      </p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${TAG_COLORS[tag] || TAG_COLORS.other}`}
            >
              <Tag size={9} />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span className="text-[10px] text-gray-400">{plan.createdOn}</span>
        <button
          onClick={onAssign}
          className="px-3 py-1 text-[11px] font-bold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
        >
          Assign to Patient
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Plan['status'] }) {
  const colors: Record<Plan['status'], string> = {
    Active: 'bg-green-50 text-green-700',
    Draft: 'bg-yellow-50 text-yellow-700',
    Archived: 'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${colors[status]}`}>
      {status}
    </span>
  );
}

function AssignConfirmDialog({
  plan,
  onConfirm,
  onCancel,
}: {
  plan: Plan;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-amber-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Assign Plan to Patient</h3>
            <p className="text-sm text-gray-500 mt-1">
              Once assigned, <span className="font-semibold text-gray-700">"{plan.name}"</span> will move to{' '}
              <span className="font-semibold text-gray-700">Active Plans</span> and can only be edited from the
              patient's page or Active Plans to prevent accidental changes.
            </p>
          </div>
          <button onClick={onCancel} className="text-gray-300 hover:text-gray-500 ml-auto shrink-0">
            <X size={16} />
          </button>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
          >
            Assign & Move to Active
          </button>
        </div>
      </div>
    </div>
  );
}
