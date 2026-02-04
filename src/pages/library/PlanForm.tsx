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
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

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
    const [mode, setMode] = useState<'create' | 'import'>('create');
    const [name, setName] = useState(initialData?.name || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [documents, setDocuments] = useState<{ name: string; size: string }[]>(initialData?.documents || []);
    const [links, setLinks] = useState<string[]>(initialData?.links || []);
    const [products, setProducts] = useState<Product[]>(initialData?.products || []);
    const [newLink, setNewLink] = useState('');
    const [importUrl, setImportUrl] = useState('');
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
            importUrl: mode === 'import' ? importUrl : undefined,
            isImport: mode === 'import',
            assignedClinics: selectedClinics,
            assignedCategories: selectedCategories
        });
    }, [name, content, documents, links, products, importUrl, mode, selectedClinics, selectedCategories, onChange]);

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
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="h-full">
                        <div className="space-y-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Plan Name
                                        </label>
                                        <Input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g., Post-Op Recovery Guide"
                                        />
                                    </div>
                                    <div className="pl-4 pt-7">
                                        <Button
                                            variant="outline"
                                            className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                            onClick={() => window.open('#', '_blank')}
                                            title="Preview how this plan will look to patients"
                                        >
                                            <ExternalLink size={16} />
                                            Preview Plan
                                        </Button>
                                    </div>
                                </div>

                                {/* Mode Selection */}
                                <div className="bg-gray-100/50 p-1 rounded-lg inline-flex w-fit border border-gray-200/50">
                                    <button
                                        onClick={() => setMode('create')}
                                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === 'create'
                                            ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        Create Manually
                                    </button>
                                    <button
                                        onClick={() => setMode('import')}
                                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === 'import'
                                            ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        Import from Link
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    {mode === 'create' ? 'Plan Description & Instructions' : 'Description (Optional)'}
                                </label>
                                <div className="min-h-[200px]">
                                    <TiptapEditor
                                        content={content}
                                        onChange={setContent}
                                        placeholder={mode === 'create' ? "Describe the clinical goals and steps..." : "Add any notes about this imported plan..."}
                                    />
                                </div>
                            </div>

                            {mode === 'import' ? (
                                <div className="pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <LinkIcon size={18} />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold text-gray-900">Import Source</h2>
                                                <p className="text-xs text-gray-500">Enter the URL to import the plan from</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                type="url"
                                                icon={<Globe size={16} />}
                                                value={importUrl}
                                                onChange={(e) => setImportUrl(e.target.value)}
                                                placeholder="https://..."
                                                className="pl-10"
                                            />
                                            {importUrl && (
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                    <a
                                                        href={importUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-md transition-all block"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Package Items Section */}
                                    <div className="pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Pill size={16} className="text-blue-500" />
                                                <h2 className="text-sm font-bold text-gray-900">Package Items</h2>
                                            </div>
                                            <Button
                                                onClick={openProductSheet}
                                                size="sm"
                                                className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
                                            >
                                                <Plus size={14} />
                                                Add Product
                                            </Button>
                                        </div>

                                        {products.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                                                <p className="text-xs text-gray-400 font-medium italic">No medical products selected</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {products.map((product, index) => (
                                                    <div key={product.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 transition-all hover:border-blue-200 hover:shadow-sm group relative">
                                                        {/* Sort Controls */}
                                                        <div className="flex flex-col gap-0.5 shrink-0">
                                                            <button onClick={() => moveProduct(index, 'up')} disabled={index === 0} className="p-0.5 text-gray-300 hover:text-blue-500 disabled:opacity-0 transition-colors">
                                                                <ChevronUp size={16} />
                                                            </button>
                                                            <button onClick={() => moveProduct(index, 'down')} disabled={index === products.length - 1} className="p-0.5 text-gray-300 hover:text-blue-500 disabled:opacity-0 transition-colors">
                                                                <ChevronDown size={16} />
                                                            </button>
                                                        </div>

                                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                                                            <Pill size={20} />
                                                        </div>

                                                        <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
                                                            <div className="col-span-4">
                                                                <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{product.name}</p>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{product.type}</span>
                                                                    <span className="text-[10px] font-medium text-gray-400">{product.price}</span>
                                                                </div>
                                                            </div>

                                                            <div className="col-span-4">
                                                                <input
                                                                    type="text"
                                                                    value={product.instruction}
                                                                    onChange={(e) => updateProduct(product.id, { instruction: e.target.value })}
                                                                    placeholder="Dosage..."
                                                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-lg px-3 py-2 text-xs text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                                                                />
                                                            </div>

                                                            <div className="col-span-4 flex items-center gap-1 justify-end">
                                                                {TIMES.map(t => (
                                                                    <button
                                                                        key={t.char}
                                                                        onClick={() => toggleTime(product.id, t.char)}
                                                                        title={t.label}
                                                                        className={`w-7 h-7 rounded-md text-[10px] font-black transition-all border ${product.timeOfDay.includes(t.char)
                                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                                                            : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'
                                                                            }`}
                                                                    >
                                                                        {t.char}
                                                                    </button>
                                                                ))}
                                                                <div className="w-px h-6 bg-gray-100 mx-1.5" />
                                                                <button
                                                                    onClick={() => removeProduct(product.id)}
                                                                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Attachments Section */}
                                    <div className="pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Files size={16} className="text-indigo-500" />
                                            <h2 className="text-sm font-bold text-gray-900">Attachments & Resources</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Documents Section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                        <FileUp size={14} className="text-orange-500" />
                                                        Files
                                                    </label>
                                                    <span className="text-[10px] font-bold text-gray-400">{documents.length}</span>
                                                </div>

                                                <div className="space-y-2">
                                                    {documents.map((doc, index) => (
                                                        <div key={index} className="group flex items-center justify-between p-2 bg-gray-50 hover:bg-orange-50/50 rounded-lg border border-transparent hover:border-orange-100 transition-all">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className="h-7 w-7 rounded bg-white border border-gray-100 flex items-center justify-center text-orange-600 shrink-0">
                                                                    <FileText size={12} />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-medium text-gray-800 truncate">{doc.name}</p>
                                                                    <p className="text-[10px] text-gray-400">{doc.size}</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeDocument(index)}
                                                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                            >
                                                                <Trash2 size={12} />
                                                            </Button>
                                                        </div>
                                                    ))}

                                                    <label className="cursor-pointer block">
                                                        <div className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
                                                            <PlusCircle size={16} className="text-gray-400 group-hover:text-indigo-500" />
                                                            <span className="text-xs font-semibold text-gray-500 group-hover:text-indigo-600">Upload File</span>
                                                        </div>
                                                        <input type="file" multiple className="sr-only" onChange={handleFileUpload} />
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Links Section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide">
                                                        <Globe size={14} className="text-blue-500" />
                                                        Links
                                                    </label>
                                                    <span className="text-[10px] font-bold text-gray-400">{links.length}</span>
                                                </div>

                                                <div className="space-y-2">
                                                    {links.map((link, index) => (
                                                        <div key={index} className="group flex items-center justify-between p-2 bg-gray-50 hover:bg-blue-50/50 rounded-lg border border-transparent hover:border-blue-100 transition-all">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className="h-7 w-7 rounded bg-white border border-gray-100 flex items-center justify-center text-blue-500 shrink-0">
                                                                    <LinkIcon size={12} />
                                                                </div>
                                                                <span className="text-xs text-gray-600 truncate max-w-[150px]">{link}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <a href={link} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                                                    <ExternalLink size={12} />
                                                                </a>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeLink(index)}
                                                                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <div className="flex gap-2 items-center">
                                                        <div className="flex-1">
                                                            <Input
                                                                type="url"
                                                                icon={<LinkIcon size={12} />}
                                                                value={newLink}
                                                                onChange={(e) => setNewLink(e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                                                                placeholder="URL..."
                                                                className="text-xs h-9"
                                                            />
                                                        </div>
                                                        <Button
                                                            onClick={handleAddLink}
                                                            variant="primary"
                                                            className="bg-indigo-600 hover:bg-indigo-700 h-9 w-9 p-0 rounded-lg"
                                                        >
                                                            <Plus size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    <ClinicSelector
                        selectedClinics={selectedClinics}
                        onSelectionChange={setSelectedClinics}
                        selectedCategories={selectedCategories}
                        onCategoriesChange={setSelectedCategories}
                        userRole={userRole}
                    />
                </div>
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
