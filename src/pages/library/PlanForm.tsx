import React, { useState } from 'react';
import {
    FileText,
    Link as LinkIcon,
    Plus,
    Trash2,
    ExternalLink,
    PlusCircle,
    FileUp,
    Pill,
    ChevronUp,
    ChevronDown,
    Search,
    Globe,
    Files
} from 'lucide-react';
import { TiptapEditor } from '../../components/ui/TiptapEditor';

interface Product {
    id: string;
    name: string;
    type: string;
    instruction: string;
    timeOfDay: string[];
    price: string;
}

interface PlanFormProps {
    initialData?: {
        id: string;
        name: string;
        content?: string;
        documents?: { name: string; size: string }[];
        links?: string[];
        products?: Product[];
    } | null;
    onClose?: () => void;
}

const TIMES = [
    { label: 'Morning', char: 'M' },
    { label: 'Noon', char: 'N' },
    { label: 'Late', char: 'L' },
    { label: 'Evening', char: 'E' }
];

const AVAILABLE_PRODUCTS = [
    { id: 'p1', name: 'Amoxicillin 500mg', type: 'Antibiotic', price: '12.50 €' },
    { id: 'p2', name: 'Ibuprofen 400mg', type: 'Pain Relief', price: '8.20 €' },
    { id: 'p3', name: 'Vitamin D3', type: 'Supplement', price: '15.00 €' },
    { id: 'p4', name: 'Omega-3 Fish Oil', type: 'Supplement', price: '22.00 €' },
    { id: 'p5', name: 'Metformin', type: 'Diabetes', price: '10.00 €' },
];

export function PlanForm({ initialData }: PlanFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [documents, setDocuments] = useState<{ name: string; size: string }[]>(initialData?.documents || []);
    const [links, setLinks] = useState<string[]>(initialData?.links || []);
    const [products, setProducts] = useState<Product[]>(initialData?.products || []);
    const [newLink, setNewLink] = useState('');
    const [showSelector, setShowSelector] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddLink = () => {
        if (newLink && !links.includes(newLink)) {
            setLinks([...links, newLink]);
            setNewLink('');
        }
    };

    const removeDocument = (index: number) => setDocuments(documents.filter((_, i) => i !== index));
    const removeLink = (index: number) => setLinks(links.filter((_, i) => i !== index));

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newDocs = Array.from(files).map(file => ({
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
            }));
            setDocuments([...documents, ...newDocs]);
        }
    };

    const addProductFromLibrary = (libProduct: any) => {
        if (products.some(p => p.id === libProduct.id)) return;
        setProducts([...products, {
            ...libProduct,
            instruction: '',
            timeOfDay: ['M']
        }]);
        setShowSelector(false);
    };

    const moveProduct = (index: number, direction: 'up' | 'down') => {
        const newProducts = [...products];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= products.length) return;
        [newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]];
        setProducts(newProducts);
    };

    const removeProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

    const updateProduct = (id: string, updates: Partial<Product>) => {
        setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const toggleTime = (productId: string, timeChar: string) => {
        setProducts(products.map(p => {
            if (p.id === productId) {
                const times = p.timeOfDay.includes(timeChar)
                    ? p.timeOfDay.filter(t => t !== timeChar)
                    : [...p.timeOfDay, timeChar];
                return { ...p, timeOfDay: times };
            }
            return p;
        }));
    };

    return (
        <div className="bg-gray-50/50 min-h-full">
            <div className="max-w-4xl mx-auto space-y-6 pb-12">
                {/* Basic Information Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Plan Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Post-Op Recovery Guide"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Plan Content Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Plan Description & Instructions
                            </label>
                            <TiptapEditor
                                content={content}
                                onChange={setContent}
                                placeholder="Describe the clinical goals and steps..."
                            />
                        </div>
                    </div>
                </div>

                {/* Package Items Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Pill size={16} className="text-blue-500" />
                            Package Items
                        </label>
                        <button
                            onClick={() => setShowSelector(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-all shadow-sm"
                        >
                            <Plus size={14} />
                            Add Product
                        </button>
                    </div>

                    <div className="p-6 space-y-3">
                        {products.map((product, index) => (
                            <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 transition-all hover:border-blue-300 group">
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => moveProduct(index, 'up')} disabled={index === 0} className="text-gray-300 hover:text-blue-600 disabled:opacity-0">
                                        <ChevronUp size={16} />
                                    </button>
                                    <button onClick={() => moveProduct(index, 'down')} disabled={index === products.length - 1} className="text-gray-300 hover:text-blue-600 disabled:opacity-0">
                                        <ChevronDown size={16} />
                                    </button>
                                </div>

                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 border border-gray-200">
                                    <Pill size={18} />
                                </div>

                                <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-3">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase mt-0.5">{product.type}</p>
                                    </div>

                                    <div className="col-span-5">
                                        <input
                                            type="text"
                                            value={product.instruction}
                                            onChange={(e) => updateProduct(product.id, { instruction: e.target.value })}
                                            placeholder="Add instructions..."
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="col-span-3 flex items-center gap-1 justify-center">
                                        {TIMES.map(t => (
                                            <button
                                                key={t.char}
                                                onClick={() => toggleTime(product.id, t.char)}
                                                title={t.label}
                                                className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold transition-all border ${product.timeOfDay?.includes(t.char)
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                                    : 'bg-white border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-600'
                                                    }`}
                                            >
                                                {t.char}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="col-span-1 flex items-center justify-end">
                                        <button onClick={() => removeProduct(product.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {products.length === 0 && (
                            <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-lg">
                                <p className="text-xs text-gray-400">No medical products selected for this plan</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Attachments & Resources Card - MATCHING KNOWLEDGE BASE UI */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden font-sans">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Files size={16} className="text-blue-500" />
                            <h2 className="text-sm font-medium text-gray-700">Reference Resources</h2>
                        </div>
                        <p className="text-xs text-gray-400">External files and links</p>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                            {/* Documents Column */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 lowercase tracking-tight">
                                        <FileUp size={16} className="text-orange-500" />
                                        Clinical Documents
                                    </label>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{documents.length}/10 Files</span>
                                </div>

                                <div className="space-y-2.5">
                                    {documents.map((doc, index) => (
                                        <div key={index} className="group flex items-center justify-between p-3 bg-gray-50 hover:bg-orange-50/50 rounded-xl border border-transparent hover:border-orange-100 transition-all">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-orange-600 shrink-0">
                                                    <FileText size={14} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-gray-800 truncate leading-tight">{doc.name}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">{doc.size}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeDocument(index)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    <label className="cursor-pointer block relative">
                                        <div className="flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
                                            <PlusCircle size={18} className="text-gray-400 group-hover:text-indigo-500" />
                                            <span className="text-sm font-bold text-gray-500 group-hover:text-indigo-600">Add Clinical Document</span>
                                        </div>
                                        <input type="file" multiple className="sr-only" onChange={handleFileUpload} />
                                    </label>
                                </div>
                            </div>

                            {/* Links Column */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 lowercase tracking-tight">
                                        <Globe size={16} className="text-blue-500" />
                                        Reference Links
                                    </label>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{links.length} Added</span>
                                </div>

                                <div className="space-y-2.5">
                                    {links.map((link, index) => (
                                        <div key={index} className="group flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50/50 rounded-xl border border-transparent hover:border-blue-100 transition-all">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-blue-500 shrink-0">
                                                    <LinkIcon size={14} />
                                                </div>
                                                <span className="text-xs text-gray-600 truncate text-pretty">{link}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <a href={link} target="_blank" rel="noreferrer" className="p-1 text-gray-400 hover:text-blue-600">
                                                    <ExternalLink size={14} />
                                                </a>
                                                <button onClick={() => removeLink(index)} className="p-1 text-gray-400 hover:text-red-500">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex gap-2 pt-2">
                                        <div className="relative flex-1">
                                            <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="url"
                                                value={newLink}
                                                onChange={(e) => setNewLink(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                                                placeholder="Paste reference URL..."
                                                className="w-full pl-9 pr-3 py-3 bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl transition-all text-xs"
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddLink}
                                            className="px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Product Selector */}
            {showSelector && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-sm font-bold text-gray-900">Add Product to Plan</h3>
                            <button onClick={() => setShowSelector(false)} className="text-gray-400 hover:text-gray-900">
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>

                        <div className="p-6 bg-white space-y-4">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                                {AVAILABLE_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => addProductFromLibrary(product)}
                                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100 group transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-blue-600 shadow-sm">
                                                <Pill size={14} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[13px] font-semibold text-gray-900 leading-none">{product.name}</p>
                                                <p className="text-[10px] text-gray-400 uppercase mt-1">{product.type}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">{product.price}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
