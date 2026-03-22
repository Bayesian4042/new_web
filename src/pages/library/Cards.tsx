import { useState, useMemo } from 'react';
import {
  Search,
  FileText,
  Link as LinkIcon,
  Mic,
  LayoutTemplate,
  Filter,
  X,
  ClipboardList,
  LayoutGrid,
  List,
  ExternalLink,
  ArrowUpDown,
} from 'lucide-react';
import type { Plan, PlanArtifact } from '../otc/Plans';

// Replicate the card image builder from PlanForm2
const buildCardImages = (baseName: string): string[] =>
  Array.from({ length: 12 }).map(
    (_, i) =>
      new URL(
        `../../CARDS/${baseName}_${String(i + 1).padStart(2, '0')}.png`,
        import.meta.url,
      ).href,
  );

const ABSTRACT_IMAGES = buildCardImages('Card_Abstract');
const PEOPLE_IMAGES = buildCardImages('Card_People');
const EXERCISE_IMAGES = buildCardImages('Card_Exercise');
const DIET_IMAGES = buildCardImages('Card_Diet');
const OTC_IMAGES = buildCardImages('Card_OTC');
const VOICE_IMAGES = buildCardImages('Card_Sound');

const CARD_STYLES: Record<string, { id: string; img?: string; color?: string }[]> = {
  abstract: ABSTRACT_IMAGES.map((src, i) => ({ id: `abstract-${i + 1}`, img: src })),
  people: PEOPLE_IMAGES.map((src, i) => ({ id: `people-${i + 1}`, img: src })),
  exercise: EXERCISE_IMAGES.map((src, i) => ({ id: `exercise-${i + 1}`, img: src })),
  diet: DIET_IMAGES.map((src, i) => ({ id: `diet-${i + 1}`, img: src })),
  otc: OTC_IMAGES.map((src, i) => ({ id: `otc-${i + 1}`, img: src })),
  voice: VOICE_IMAGES.map((src, i) => ({ id: `voice-${i + 1}`, img: src })),
  colors: [
    '#e2cd65', '#b47fe2', '#1d5d9a', '#e2886d', '#78b7e2',
    '#6915a3', '#e23b34', '#86c568', '#1cc18d', '#ff63c8', '#e29446', '#1d5932',
  ].map((hex, i) => ({ id: `color-${i + 1}`, color: hex })),
};

function getCardStyle(artifact: PlanArtifact): React.CSSProperties {
  const styles = CARD_STYLES[artifact.visualCategory] || [];
  const match = styles.find((s) => s.id === artifact.backgroundKey);
  if (artifact.visualCategory === 'colors' && artifact.backgroundColor)
    return { backgroundColor: artifact.backgroundColor };
  if (match?.img)
    return { backgroundImage: `url(${match.img})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  return { backgroundImage: 'linear-gradient(135deg, #111827, #4b5563)' };
}

const TYPE_ICONS: Record<PlanArtifact['type'], React.ReactNode> = {
  document: <FileText size={10} />,
  link: <LinkIcon size={10} />,
  voice: <Mic size={10} />,
};

const TYPE_LABEL: Record<PlanArtifact['type'], string> = {
  document: 'Document',
  link: 'Link',
  voice: 'Voice',
};

const TYPE_COLORS: Record<PlanArtifact['type'], string> = {
  document: 'bg-blue-50 text-blue-700 border-blue-200',
  link: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  voice: 'bg-violet-50 text-violet-700 border-violet-200',
};

const TYPE_FILTERS = ['All', 'document', 'link', 'voice'] as const;

interface CardWithSource extends PlanArtifact {
  planId: string;
  planName: string;
  planCategory: string;
}

interface CardsProps {
  plans: Plan[];
  onGoToPlan?: (plan: Plan) => void;
}

export function Cards({ plans, onGoToPlan }: CardsProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [sortField, setSortField] = useState<'title' | 'type'>('title');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const allCards = useMemo<CardWithSource[]>(() => {
    const result: CardWithSource[] = [];
    plans.forEach((plan) => {
      (plan.artifacts || []).forEach((artifact) => {
        result.push({
          ...artifact,
          planId: plan.id,
          planName: plan.name,
          planCategory: plan.category,
        });
      });
    });
    return result;
  }, [plans]);

  const filtered = allCards.filter((card) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      card.title.toLowerCase().includes(q) ||
      card.planName.toLowerCase().includes(q) ||
      card.planCategory.toLowerCase().includes(q) ||
      (card.fileName || '').toLowerCase().includes(q) ||
      (card.url || '').toLowerCase().includes(q);
    const matchesType = typeFilter === 'All' || card.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'title') cmp = a.title.localeCompare(b.title);
    else cmp = a.type.localeCompare(b.type);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  };

  // Group by plan for grid view
  const grouped = sorted.reduce<Record<string, CardWithSource[]>>((acc, card) => {
    if (!acc[card.planId]) acc[card.planId] = [];
    acc[card.planId].push(card);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Cards</h1>
          <p className="text-gray-500 mt-1">
            All attachments collected from your plans — documents, links and voice notes
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <LayoutTemplate size={14} className="text-indigo-400" />
          <span className="font-semibold text-gray-900">{allCards.length}</span>
          <span>card{allCards.length !== 1 ? 's' : ''}</span>
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
            placeholder="Search by title, plan or file name…"
            className="w-full pl-9 pr-4 py-2 text-sm border-none focus:ring-0 text-gray-900 placeholder-gray-400 bg-transparent"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
              <X size={13} />
            </button>
          )}
        </div>
        <div className="h-6 w-px bg-gray-200" />
        {/* Type filters */}
        <div className="flex items-center gap-1">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                typeFilter === f
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              {f === 'All' ? <><Filter size={11} /> All</>
                : f === 'document' ? <><FileText size={11} /> Docs</>
                : f === 'link' ? <><LinkIcon size={11} /> Links</>
                : <><Mic size={11} /> Voice</>}
            </button>
          ))}
        </div>
        <div className="h-6 w-px bg-gray-200" />
        {/* View toggle */}
        <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            title="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            title="Table view"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Empty state */}
      {allCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <LayoutTemplate size={26} className="text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-500">No cards yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Attach documents, links or voice notes to a plan and they'll appear here.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-semibold text-gray-500">No matching cards</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filter.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* ── Table view ── */
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="py-3 px-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest w-40">
                    Card
                  </th>
                  <th className="py-3 px-5 text-left">
                    <button onClick={() => toggleSort('title')} className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-gray-800">
                      Title <ArrowUpDown size={10} className={sortField === 'title' ? 'text-indigo-500' : 'text-gray-300'} />
                    </button>
                  </th>
                  <th className="py-3 px-5 text-left">
                    <button onClick={() => toggleSort('type')} className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-gray-800">
                      Type <ArrowUpDown size={10} className={sortField === 'type' ? 'text-indigo-500' : 'text-gray-300'} />
                    </button>
                  </th>
                  <th className="py-3 px-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    File / URL
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((card) => (
                    <tr key={card.id} className="hover:bg-indigo-50/20 transition-colors group">

                      {/* Card visual column — the actual card rendered tall */}
                      <td className="py-3 px-5">
                        <div
                          className="relative rounded-xl overflow-hidden shadow-sm"
                          style={{ ...getCardStyle(card), width: 120, height: 72 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-black/30 backdrop-blur-sm text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-full">
                            {TYPE_ICONS[card.type]}
                            <span className="capitalize ml-0.5">{card.type}</span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <p className="text-white text-[10px] font-bold leading-tight line-clamp-2 drop-shadow">
                              {card.title}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="py-3 px-5">
                        <p className="text-sm font-semibold text-gray-900 leading-snug max-w-[180px]">{card.title}</p>
                        {card.type === 'voice' && (
                          <p className="text-[10px] text-gray-400 mt-0.5 italic">Voice recording</p>
                        )}
                      </td>

                      {/* Type */}
                      <td className="py-3 px-5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${TYPE_COLORS[card.type]}`}>
                          {TYPE_ICONS[card.type]}
                          {TYPE_LABEL[card.type]}
                        </span>
                      </td>

                      {/* File / URL */}
                      <td className="py-3 px-5 max-w-[180px]">
                        {card.type === 'document' && card.fileName ? (
                          <div className="flex items-start gap-1.5">
                            <FileText size={12} className="text-blue-400 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-700 truncate">{card.fileName}</p>
                              {card.fileSize && <p className="text-[10px] text-gray-400">{card.fileSize}</p>}
                            </div>
                          </div>
                        ) : card.type === 'link' && card.url ? (
                          <a
                            href={card.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline truncate"
                          >
                            <ExternalLink size={11} className="shrink-0" />
                            <span className="truncate">{card.url.replace(/^https?:\/\//, '')}</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-gray-400">—</span>
                        )}
                      </td>


                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── Grid view ── */
        <div className="space-y-8">
          {Object.entries(grouped).map(([planId, cards]) => {
            const first = cards[0];
            return (
              <div key={planId}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <ClipboardList size={13} className="text-indigo-500" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {first.planName}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{first.planCategory}</span>
                  <span className="text-[10px] text-gray-300 mx-1">·</span>
                  <span className="text-[10px] text-gray-400">{cards.length} card{cards.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {cards.map((card) => (
                    <ArtifactCard key={card.id} card={card} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ArtifactCard({ card }: { card: CardWithSource }) {
  const style = getCardStyle(card);
  return (
    <div
      className="relative rounded-xl overflow-hidden min-h-[100px] flex flex-col justify-end shadow-sm hover:shadow-md transition-shadow cursor-default"
      style={style}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

      <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-black/30 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
        {TYPE_ICONS[card.type]}
        <span className="capitalize ml-0.5">{card.type}</span>
      </div>

      <div className="relative z-10 p-2.5">
        <p className="text-white text-xs font-bold leading-snug line-clamp-2 drop-shadow">
          {card.title}
        </p>
        {card.fileName && (
          <p className="text-white/60 text-[9px] mt-0.5 truncate">{card.fileSize}</p>
        )}
        {card.url && (
          <p className="text-white/60 text-[9px] mt-0.5 truncate">{card.url.replace(/^https?:\/\//, '')}</p>
        )}
      </div>
    </div>
  );
}
