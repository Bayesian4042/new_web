import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit2, Copy, Trash2, Package } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export interface OTCList {
    id: string;
    name: string;
    productsCount: number;
    createdOn: string;
    lastUpdated: string;
}

interface OTCListsProps {
    onAddList: () => void;
    onEditList: (list: OTCList) => void;
    onCopyList: (list: OTCList) => void;
    onDeleteList: (id: string) => void;
    lists: OTCList[];
}

export function OTCLists({ onAddList, onEditList, onCopyList, onDeleteList, lists }: OTCListsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const filteredLists = lists.filter(list =>
        list.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search OTC lists..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
                <Button
                    onClick={onAddList}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                    <Plus size={18} />
                    New OTC List
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Total Lists</p>
                            <p className="text-2xl font-bold text-gray-900">{lists.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {lists.reduce((acc, list) => acc + list.productsCount, 0)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Avg Products/List</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {lists.length > 0 ? Math.round(lists.reduce((acc, list) => acc + list.productsCount, 0) / lists.length) : 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50/50">
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    List Name
                                </th>
                                <th className="text-center py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Products
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Last Updated
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLists.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Package size={48} className="mb-3 opacity-20" />
                                            <p className="text-sm font-medium text-gray-500">No OTC lists found</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {searchQuery ? 'Try adjusting your search' : 'Create your first OTC list to get started'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLists.map((list) => (
                                    <tr
                                        key={list.id}
                                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => onEditList(list)}
                                                className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors text-left"
                                            >
                                                {list.name}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                                                {list.productsCount}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs text-gray-500">{list.createdOn}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs text-gray-500">{list.lastUpdated}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onEditList(list)}
                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onCopyList(list)}
                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-green-600 hover:bg-green-50 opacity-0 group-hover:opacity-100 transition-all"
                                                    title="Duplicate"
                                                >
                                                    <Copy size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onDeleteList(list.id)}
                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
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
