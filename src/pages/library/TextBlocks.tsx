import { useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  LayoutTemplate,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { DEFAULT_TEXT_BLOCKS, TEXT_BLOCK_CATEGORIES } from '../../lib/textBlocks';
import type { TextBlock } from '../../lib/textBlocks';

interface TextBlocksProps {
  blocks: TextBlock[];
  onSave: (blocks: TextBlock[]) => void;
}

const CATEGORY_OPTIONS = TEXT_BLOCK_CATEGORIES.filter((c) => c !== 'All');

const CATEGORY_COLORS: Record<string, string> = {
  General: 'bg-gray-100 text-gray-600 border-gray-200',
  'Post-Op': 'bg-rose-50 text-rose-700 border-rose-200',
  Diet: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Exercise: 'bg-blue-50 text-blue-700 border-blue-200',
  Medication: 'bg-amber-50 text-amber-700 border-amber-200',
  'Mental Health': 'bg-violet-50 text-violet-700 border-violet-200',
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] || 'bg-gray-100 text-gray-600 border-gray-200';
}

export function TextBlocks({ blocks, onSave }: TextBlocksProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [editingBlock, setEditingBlock] = useState<TextBlock | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form state
  const [formLabel, setFormLabel] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORY_OPTIONS[0]);
  const [formPreview, setFormPreview] = useState('');
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

  const openNew = () => {
    setEditingBlock(null);
    setFormLabel('');
    setFormCategory(CATEGORY_OPTIONS[0]);
    setFormPreview('');
    setFormHtml('');
    setFormError('');
    setIsFormOpen(true);
  };

  const openEdit = (block: TextBlock) => {
    setEditingBlock(block);
    setFormLabel(block.label);
    setFormCategory(block.category);
    setFormPreview(block.preview);
    setFormHtml(block.html);
    setFormError('');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBlock(null);
    setFormError('');
  };

  const handleSave = () => {
    if (!formLabel.trim()) { setFormError('Title is required.'); return; }
    if (!formHtml.trim()) { setFormError('Content (HTML) is required.'); return; }

    const preview = formPreview.trim() || formHtml.replace(/<[^>]+>/g, '').slice(0, 120) + '…';

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

  const handleDelete = (id: string) => {
    if (!confirm('Delete this text block?')) return;
    onSave(blocks.filter((b) => b.id !== id));
  };

  // Group for display
  const grouped: Record<string, TextBlock[]> = {};
  filtered.forEach((b) => {
    if (!grouped[b.category]) grouped[b.category] = [];
    grouped[b.category].push(b);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <LayoutTemplate size={22} className="text-indigo-500" />
            Text Blocks
          </h1>
          <p className="text-gray-500 mt-1">
            Reusable content blocks that doctors can insert into plan descriptions.
          </p>
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
        <div className="flex items-center gap-1.5 flex-wrap pr-1">
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
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400 font-medium -mt-2">
        {filtered.length} block{filtered.length !== 1 ? 's' : ''}
        {activeCategory !== 'All' || search ? ` · filtered` : ''}
      </p>

      {/* Block groups */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
          <LayoutTemplate size={28} className="text-gray-200 mb-3" />
          <p className="text-sm font-semibold text-gray-400">No blocks found</p>
          <p className="text-xs text-gray-300 mt-1">
            {search || activeCategory !== 'All' ? 'Try clearing your search or filter.' : 'Click "New Block" to create the first one.'}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${categoryColor(category)}`}>
                  {category}
                </span>
                <span className="text-xs text-gray-400">{items.length}</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {items.map((block, idx) => (
                  <div
                    key={block.id}
                    className={`flex items-start gap-4 px-5 py-4 group hover:bg-gray-50/60 transition-colors cursor-pointer ${
                      idx < items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                    onClick={() => openEdit(block)}
                  >
                    {/* Icon */}
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                      <LayoutTemplate size={14} className="text-indigo-500" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{block.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {block.preview}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(block); }}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(block.id); }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <ChevronRight size={14} className="text-gray-300 shrink-0 mt-1 group-hover:text-gray-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Edit / New Block side sheet ── */}
      {isFormOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={closeForm} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">

            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingBlock ? 'Edit Block' : 'New Block'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {editingBlock ? 'Update the title, category, and content.' : 'Create a reusable text block for plan descriptions.'}
                </p>
              </div>
              <button
                onClick={closeForm}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  placeholder="e.g. Wound care instructions"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormCategory(cat)}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all ${
                        formCategory === cat
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : `${categoryColor(cat)} hover:border-indigo-400`
                      }`}
                    >
                      {formCategory === cat && <Check size={10} />}
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview / excerpt */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Preview text
                  <span className="text-gray-400 font-normal ml-1">(optional — auto-generated from content if left blank)</span>
                </label>
                <input
                  type="text"
                  value={formPreview}
                  onChange={(e) => setFormPreview(e.target.value)}
                  placeholder="Short excerpt shown in the picker…"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
                />
              </div>

              {/* HTML content */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Content (HTML) <span className="text-red-400">*</span>
                </label>
                <p className="text-[11px] text-gray-400 mb-1.5">
                  This HTML is inserted directly into the plan description editor.
                </p>
                <textarea
                  value={formHtml}
                  onChange={(e) => setFormHtml(e.target.value)}
                  rows={10}
                  placeholder={"<h2>Section title</h2>\n<p>Instructions for the patient...</p>\n<ul><li>Step one</li><li>Step two</li></ul>"}
                  spellCheck={false}
                  className="w-full px-3 py-2.5 text-xs font-mono border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 resize-none bg-gray-50 leading-relaxed"
                />
              </div>

              {/* Live preview */}
              {formHtml.trim() && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preview</p>
                  <div
                    className="prose prose-sm prose-gray max-w-none px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700"
                    dangerouslySetInnerHTML={{ __html: formHtml }}
                  />
                </div>
              )}

              {formError && (
                <p className="text-xs text-red-500 font-medium">{formError}</p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {editingBlock ? `Editing: ${editingBlock.label}` : 'New block'}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={closeForm}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-gray-900 hover:bg-black text-white"
                  >
                    {editingBlock ? 'Save Changes' : 'Create Block'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
