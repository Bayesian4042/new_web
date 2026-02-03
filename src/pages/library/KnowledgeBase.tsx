import { useState } from 'react';
import {
    Search,
    Filter,
    X,
    ArrowUpDown,
    FileText,
    Link as LinkIcon,
    Plus,
    Download,
    Trash2,
    Paperclip
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface KBItem {
    id: string;
    name: string;
    addedOn: string;
    lastUpdated: string;
    documents?: { name: string; size: string }[];
    links?: string[];
    content?: string;
}

const kbItems: KBItem[] = [
    {
        id: 'KB-0001',
        name: 'Post-Op Recovery Guide',
        addedOn: '02-02-2026',
        lastUpdated: '2h ago',
        documents: [
            { name: 'Recovery_Basic.pdf', size: '1.2 MB' },
            { name: 'Exercises.pdf', size: '2.4 MB' }
        ],
        links: ['https://med.edu/post-op'],
        content: '<h2>Introduction</h2><p>This guide covers essential recovery steps.</p>'
    },
    {
        id: 'KB-0002',
        name: 'Diabetes Management Protocol',
        addedOn: '01-02-2026',
        lastUpdated: '1d ago',
        links: ['https://clinical-docs.med/diabetes'],
        content: 'Official protocol for type 2 diabetes management at MediCore.'
    },
    {
        id: 'KB-0003',
        name: 'Mental Health Assessment FAQ',
        addedOn: '28-01-2026',
        lastUpdated: '1w ago',
        documents: [{ name: 'MH_FAQ_2026.pdf', size: '1.1 MB' }]
    },
    {
        id: 'KB-0004',
        name: 'General Policy Handbook',
        addedOn: '25-01-2026',
        lastUpdated: '2w ago',
        documents: [{ name: 'Handbook_V1.pdf', size: '4.5 MB' }],
        links: ['https://internal.portal/handbook']
    }
];

interface KnowledgeBaseProps {
    onAddItem: () => void;
    onEditItem: (item: KBItem) => void;
}

export function KnowledgeBase({ onAddItem, onEditItem }: KnowledgeBaseProps) {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [filterActive, setFilterActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleRow = (id: string) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        setSelectedRows((prev) =>
            prev.length === kbItems.length ? [] : kbItems.map((k) => k.id)
        );
    };

    return (
        <div className="space-y-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 flex-1">
                    <div className="relative max-w-xs w-full">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search library..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-lg transition-all"
                        />
                    </div>

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
                        Added On
                    </button>
                </div>

                <Button
                    onClick={onAddItem}
                    size="sm"
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                    <Plus size={16} />
                    Add To Library
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
                                    checked={selectedRows.length === kbItems.length}
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
                            <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                                Resource Name
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-medium text-gray-500">
                                Attachments
                            </th>
                            <th className="py-3 px-3 text-left text-sm font-medium text-gray-500">
                                Added On
                            </th>
                            <th className="py-3 px-3 text-right text-sm font-medium text-gray-500"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {kbItems.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => onEditItem(item)}
                                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer"
                            >
                                <td className="py-3 px-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(item.id)}
                                        onChange={() => toggleRow(item.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                                    />
                                </td>
                                <td className="py-3 px-3">
                                    <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                                        {item.id}
                                    </span>
                                </td>
                                <td className="py-3 px-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center">
                                            <Paperclip size={14} className="text-gray-500" />
                                        </div>
                                        <span className="text-sm text-gray-900">{item.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-3">
                                    <div className="flex items-center justify-center gap-2">
                                        {item.documents && item.documents.length > 0 && (
                                            <div className="flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                                <FileText size={10} />
                                                {item.documents.length}
                                            </div>
                                        )}
                                        {item.links && item.links.length > 0 && (
                                            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                                <LinkIcon size={10} />
                                                {item.links.length}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-3 text-sm text-gray-500">
                                    {item.addedOn}
                                </td>
                                <td className="py-3 px-3">
                                    <div className="flex items-center justify-end gap-3 text-gray-400">
                                        <span className="text-xs text-gray-400">
                                            {item.lastUpdated}
                                        </span>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-1 hover:text-gray-600"
                                                title="Download All"
                                            >
                                                <Download size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-1 hover:text-red-500"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
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
