import { useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  LayoutTemplate,
  ArrowUpDown,
  Copy,
  Filter,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { TEXT_BLOCK_CATEGORIES } from '../../lib/textBlocks';
import type { TextBlock } from '../../lib/textBlocks';

interface TextBlocksProps {
  blocks: TextBlock[];
  onSave: (blocks: TextBlock[]) => void;
}

const CATEGORY_OPTIONS = TEXT_BLOCK_CATEGORIES.filter((c) => c !== 'All');

const CATEGORY_COLORS: Record<string, string> = {
  General: 'bg-gray-100 text-gray-600',
  'Post-Op': 'bg-rose-50 text-rose-700',
  Diet: 'bg-emerald-50 text-emerald-700',
  Exercise: 'bg-blue-50 text-blue-700',
  Medication: 'bg-amber-50 text-amber-700',
  'Mental Health': 'bg-violet-50 text-violet-700',
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] || 'bg-gray-100 text-gray-600';
}

export function TextBlocks({ blocks, onSave }: TextBlocksProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filterActive, setFilterActive] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [editingBlock, setEditingBlock] = useState<TextBlock | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form state
  const [formLabel, setFormLabel] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORY_OPTIONS[0]);
  const [formHtml, setFormHtml] = useState('');
  const [formError, setFormError] = useState('');

  const filtered = blocks.filter((b) => {
    const q = search.toLowerCase();
    const matchesCat = activeCategory === 'All' || b.category === activeCategory;
    const matchesSearch =
      !q ||
      b.label.toLowerCase().includes(q) ||
      b.preview.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === filtered.length ? [] : filtered.map((b) => b.id)
    );
  };

  const openNew = () => {
    setEditingBlock(null);
    setFormLabel('');
    setFormCategory(CATEGORY_OPTIONS[0]);
    setFormHtml('');
    setFormError('');
    setIsFormOpen(true);
  };

  const openEdit = (block: TextBlock) => {
    setEditingBlock(block);
    setFormLabel(block.label);
    setFormCategory(block.category);
    setFormHtml(block.html);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleCopy = (block: TextBlock, e: React.MouseEvent) => {
    e.stopPropagation();
    const copy: TextBlock = {
      ...block,
      id: `tb-custom-${Date.now()}`,
      label: `${block.label} (Copy)`,
    };
    onSave([...blocks, copy]);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBlock(null);
    setFormError('');
  };

  const handleSave = () => {
    if (!formLabel.trim()) { setFormError('Title is required.'); return; }
    if (!formHtml.trim()) { setFormError('Content is required.'); return; }

    const preview = formHtml.replace(/<[^>]+>/g, '').slice(0, 120) + '…';

    if (editingBlock) {
      onSave(blocks.map((b) =>
        b.id === editingBlock.id
          ? { ...b, label: formLabel.trim(), category: formCategory, preview, html: formHtml.trim() }
          : b
      ));
    } else {
      const newBlock: TextBlock = {
        id: `tb-custom-${Date.now()}`,
        category: formCategory,
        label: formLabel.trim(),
        preview,
        html: formHtml.trim(),
      };
      onSave([...blocks, newBlock]);
    }
    closeForm();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this text block?')) return;
    onSave(blocks.filter((b) => b.id !== id));
    setSelectedRows((prev) => prev.filter((r) => r !== id));
  };

  // ── Form view ──────────────────────────────────────────────────────────────
  if (isFormOpen) {
    return (
      <div className="space-y-6 max-w-2xl">
        {/* Back + breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={closeForm}
            className="flex items-center gap-1 hover:text-gray-900 transition-colors font-medium"
          >
            <ChevronLeft size={15} />
            Text Blocks
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold">
            {editingBlock ? editingBlock.label : 'New Block'}
          </span>
        </div>

        {/* Page title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {editingBlock ? 'Edit Block' : 'New Text Block'}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {editingBlock
                ? 'Update the title and content of this text block.'
                : 'Create a reusable text block for plan descriptions.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={closeForm}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className={editingBlock
                ? 'bg-green-600 hover:bg-green-700 text-white px-5'
                : 'bg-gray-900 hover:bg-black text-white px-5'}
            >
              {editingBlock ? 'Save Changes' : 'Create Block'}
            </Button>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">

          {/* Title */}
          <div className="px-6 py-5 space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
              placeholder="e.g. Wound care instructions"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>

          {/* Category */}
          <div className="px-6 py-5 space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormCategory(cat)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                    formCategory === cat
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
                >
                  {formCategory === cat && <Check size={10} />}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Content <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-gray-400">
              Write the content that will be inserted into plan descriptions.
            </p>
            <textarea
              value={formHtml}
              onChange={(e) => setFormHtml(e.target.value)}
              rows={12}
              placeholder={"<h2>Section title</h2>\n<p>Instructions for the patient...</p>\n<ul><li>Step one</li><li>Step two</li></ul>"}
              spellCheck={false}
              className="w-full px-3 py-2.5 text-xs font-mono border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 resize-none bg-gray-50 leading-relaxed mt-1"
            />
          </div>

          {/* Live preview */}
          {formHtml.trim() && (
            <div className="px-6 py-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Live Preview</p>
              <div
                className="prose prose-sm prose-gray max-w-none px-5 py-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
                dangerouslySetInnerHTML={{ __html: formHtml }}
              />
            </div>
          )}
        </div>

        {formError && (
          <p className="text-sm text-red-500 font-medium">{formError}</p>
        )}
      </div>
    );
  }

  // ── Table view ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Text Blocks</h1>
          <p className="text-gray-500 mt-1">Reusable content blocks that can be inserted into plan descriptions.</p>
        </div>
        <Button
          onClick={openNew}
          size="sm"
          className="bg-gray-900 hover:bg-black text-white rounded-xl shadow-sm px-4 py-2 flex items-center gap-2"
        >
          <Plus size={16} />
          New Block
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blocks…"
            className="w-full pl-9 pr-4 py-2 text-sm border-none focus:ring-0 text-gray-900 placeholder-gray-400 bg-transparent"
          />
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <button
          onClick={() => setFilterActive(!filterActive)}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 ${filterActive ? 'bg-gray-50' : ''}`}
        >
          <Filter size={16} />
          <span>Filter</span>
          {filterActive && <X size={14} className="ml-1 text-gray-400" />}
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
          <ArrowUpDown size={16} />
          <span>Sort</span>
        </button>
      </div>

      {/* Category filter pills */}
      {filterActive && (
        <div className="flex items-center gap-1.5 flex-wrap -mt-2">
          {TEXT_BLOCK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/30">
                <th className="w-10 py-3 px-4">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedRows.length === filtered.length}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Title
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Preview</th>
                <th className="py-3 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <LayoutTemplate size={28} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-400">No blocks found</p>
                    <p className="text-xs text-gray-300 mt-1">
                      {search || activeCategory !== 'All'
                        ? 'Try clearing your search or filter.'
                        : 'Click "New Block" to create the first one.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((block) => (
                  <tr
                    key={block.id}
                    onClick={() => openEdit(block)}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(block.id)}
                        onChange={(e) => toggleRow(block.id, e as any)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-indigo-50 flex items-center justify-center shrink-0">
                          <LayoutTemplate size={13} className="text-indigo-500" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">{block.label}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${categoryColor(block.category)}`}>
                        {block.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <p className="text-sm text-gray-500 truncate">{block.preview}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => handleCopy(block, e)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Copy"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(block); }}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(block.id, e)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
