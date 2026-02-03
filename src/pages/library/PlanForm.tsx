import React, { useState, useEffect } from 'react';
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
    Globe,
    Files
} from 'lucide-react';
import { TiptapEditor } from '../../components/ui/TiptapEditor';
import { SideSheet, SideSheetItem } from '../../components/ui/SideSheet';
import { ClinicSelector } from '../../components/ui/ClinicSelector';

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
        assignedClinics?: string[];
        assignedCategories?: string[]; // Consistency check
    } | null;
    userRole: 'admin' | 'clinic';
    onChange: (data: any) => void;
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

const productItems: SideSheetItem[] = AVAILABLE_PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    description: p.price,
    category: p.type,
    icon: <Pill size={16} />
}));

export function PlanForm({ initialData, userRole, onChange }: PlanFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [documents, setDocuments] = useState<{ name: string; size: string }[]>(initialData?.documents || []);
    const [links, setLinks] = useState<string[]>(initialData?.links || []);
    const [products, setProducts] = useState<Product[]>(initialData?.products || []);
    const [newLink, setNewLink] = useState('');
    const [selectedClinics, setSelectedClinics] = useState<string[]>(initialData?.assignedClinics || []);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData?.assignedCategories || []);

    // SideSheet state
    const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
    const [tempProductIds, setTempProductIds] = useState<string[]>([]);

    useEffect(() => {
        onChange({
            name,
            content,
            documents,
            links,
            products,
            assignedClinics: selectedClinics,
            assignedCategories: selectedCategories
        });
    }, [name, content, documents, links, products, selectedClinics, selectedCategories, onChange]);

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

    const openProductSheet = () => {
        setTempProductIds(products.map(p => p.id));
        setIsProductSheetOpen(true);
    };

    const handleProductSheetConfirm = () => {
        const selectedProducts = AVAILABLE_PRODUCTS.filter(p => tempProductIds.includes(p.id))
            .map(p => {
                const existing = products.find(ep => ep.id === p.id);
                return existing || {
                    id: p.id,
                    name: p.name,
                    type: p.type,
                    price: p.price,
                    instruction: '',
                    timeOfDay: []
                };
            });
        setProducts(selectedProducts);
        setIsProductSheetOpen(false);
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
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 gap-8">
                {/* 1. Basic Information Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-8 space-y-6">
                        <div>
                            <label className="block text-[15px] font-semibold text-gray-900 mb-2.5">
                                Plan Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Post-Op Recovery Guide"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px] text-gray-700 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-[15px] font-semibold text-gray-900 mb-2.5">
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

                {/* 2. Package Items Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Pill size={18} className="text-blue-500" />
                            <h2 className="text-[16px] font-bold text-gray-900">Package Items</h2>
                        </div>
                        <button
                            onClick={openProductSheet}
                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
                        >
                            <Plus size={16} />
                            Add Product
                        </button>
                    </div>

                    <div className="p-8">
                        {products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                                <p className="text-sm text-gray-400 font-medium italic">No medical products selected for this plan</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {products.map((product, index) => (
                                    <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 transition-all hover:border-blue-200 hover:shadow-md group relative">
                                        {/* Sort Controls */}
                                        <div className="flex flex-col gap-1 shrink-0">
                                            <button onClick={() => moveProduct(index, 'up')} disabled={index === 0} className="p-1 text-gray-300 hover:text-blue-500 disabled:opacity-0 transition-colors">
                                                <ChevronUp size={20} />
                                            </button>
                                            <button onClick={() => moveProduct(index, 'down')} disabled={index === products.length - 1} className="p-1 text-gray-300 hover:text-blue-500 disabled:opacity-0 transition-colors">
                                                <ChevronDown size={20} />
                                            </button>
                                        </div>

                                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                                            <Pill size={24} />
                                        </div>

                                        <div className="flex-1 min-w-0 grid grid-cols-12 gap-6 items-center">
                                            <div className="col-span-3">
                                                <p className="text-[15px] font-bold text-gray-900 truncate tracking-tight">{product.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{product.type}</span>
                                                    <span className="text-[10px] font-medium text-gray-400">{product.price}</span>
                                                </div>
                                            </div>

                                            <div className="col-span-5">
                                                <input
                                                    type="text"
                                                    value={product.instruction}
                                                    onChange={(e) => updateProduct(product.id, { instruction: e.target.value })}
                                                    placeholder="Add dosage or usage instructions..."
                                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                                />
                                            </div>

                                            <div className="col-span-4 flex items-center gap-1.5 justify-end">
                                                {TIMES.map(t => (
                                                    <button
                                                        key={t.char}
                                                        onClick={() => toggleTime(product.id, t.char)}
                                                        title={t.label}
                                                        className={`w-9 h-9 rounded-lg text-[11px] font-black transition-all border ${product.timeOfDay.includes(t.char)
                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                            : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {t.char}
                                                    </button>
                                                ))}
                                                <div className="w-px h-8 bg-gray-100 mx-2" />
                                                <button
                                                    onClick={() => removeProduct(product.id)}
                                                    className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Reference Resources Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Files size={18} className="text-blue-500" />
                            <h2 className="text-[16px] font-bold text-gray-900">Reference Resources</h2>
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
                                        clinical documents
                                    </label>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{documents.length}/10 FILES</span>
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
                                        <div className="flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
                                            <PlusCircle size={18} className="text-gray-400 group-hover:text-blue-500" />
                                            <span className="text-sm font-bold text-gray-500 group-hover:text-blue-600">Add Clinical Document</span>
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
                                        reference links
                                    </label>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{links.length} ADDED</span>
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

                {/* Clinic & Category Selector */}
                <ClinicSelector
                    selectedClinics={selectedClinics}
                    onSelectionChange={setSelectedClinics}
                    selectedCategories={selectedCategories}
                    onCategoriesChange={setSelectedCategories}
                    userRole={userRole}
                />
            </div>

            {/* Product Selector SideSheet */}
            <SideSheet
                isOpen={isProductSheetOpen}
                onClose={() => setIsProductSheetOpen(false)}
                title="Add Product to Plan"
                description="Select medical products to include in this plan"
                items={productItems}
                selectedIds={tempProductIds}
                onSelectionChange={setTempProductIds}
                onConfirm={handleProductSheetConfirm}
                searchPlaceholder="Search products..."
            />
        </div>
    );
}
