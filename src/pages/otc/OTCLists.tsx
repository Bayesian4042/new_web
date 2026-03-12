import { useState } from 'react';
import { Plus, Search, Edit2, Copy, Trash2, Package, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import type { OTCProduct } from './OTCListForm';

export interface OTCList {
    id: string;
    name: string;
    productsCount: number;
    createdOn: string;
    lastUpdated: string;
    products?: OTCProduct[];
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

    const filteredLists = lists.filter(list =>
        list.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">OTC Lists</h1>
                    <p className="text-gray-500 mt-1">Manage and organize over-the-counter medicine bundles</p>
                </div>
                <Button 
                    onClick={onAddList} 
                    className="bg-gray-900 hover:bg-black text-white rounded-xl shadow-sm px-5 py-2.5 flex items-center gap-2 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    <span className="font-bold">New OTC List</span>
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search OTC lists..."
                        className="w-full pl-9 pr-4 py-2 text-sm border-none focus:ring-0 text-gray-900 placeholder-gray-400"
                    />
                </div>

                <div className="h-6 w-px bg-gray-200 mx-1" />

                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                    <Filter size={16} />
                    <span>Filter</span>
                </button>
            </div>



            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50/30">
                                <th className="text-left py-3 px-4">
                                    <div className="flex items-center gap-1 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        List Name
                                        <ArrowUpDown size={12} className="text-gray-400" />
                                    </div>
                                </th>
                                <th className="text-center py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Products
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Created
                                        <ArrowUpDown size={12} className="text-gray-400" />
                                    </div>
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
                                        onClick={() => onEditList(list)}
                                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                    >
                                        <td className="py-3 px-4">
                                            <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {list.name}
                                            </span>
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
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEditList(list);
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onCopyList(list)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Duplicate"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onDeleteList(list.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
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
