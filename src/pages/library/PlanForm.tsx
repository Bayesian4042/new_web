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

interface PackageProduct {
    id: string;
    name: string;
    price: string;
}

interface Package {
    id: string;
    name: string;
    type: string;
    totalPrice: string;
    products: PackageProduct[];
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
        assignedCategories?: string[];
    } | null;
    userRole: 'admin' | 'clinic';
    onChange: (data: any) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

const TIMES = [
    { label: 'Morning', char: 'M' },
    { label: 'Noon', char: 'N' },
    { label: 'Late', char: 'L' },
    { label: 'Evening', char: 'E' }
];

const AVAILABLE_PACKAGES: Package[] = [
    { 
        id: 'pkg1', 
        name: 'Cold & Flu Bundle', 
        type: 'Wellness',
        totalPrice: '35.70 €',
        products: [
            { id: 'p1', name: 'Paracetamol 500mg', price: '8.50 €' },
            { id: 'p2', name: 'Vitamin C 1000mg', price: '12.00 €' },
            { id: 'p3', name: 'Zinc Lozenges', price: '15.20 €' },
        ]
    },
    { 
        id: 'pkg2', 
        name: 'Pain Management Kit', 
        type: 'Pain Relief',
        totalPrice: '32.70 €',
        products: [
            { id: 'p4', name: 'Ibuprofen 400mg', price: '8.20 €' },
            { id: 'p5', name: 'Muscle Relaxant Gel', price: '14.50 €' },
            { id: 'p6', name: 'Heat Patches (5 pack)', price: '10.00 €' },
        ]
    },
    { 
        id: 'pkg3', 
        name: 'Digestive Health Pack', 
        type: 'Digestive',
        totalPrice: '45.00 €',
        products: [
            { id: 'p7', name: 'Probiotic Complex', price: '25.00 €' },
            { id: 'p8', name: 'Digestive Enzymes', price: '12.00 €' },
            { id: 'p9', name: 'Fiber Supplement', price: '8.00 €' },
        ]
    },
    { 
        id: 'pkg4', 
        name: 'Diabetes Care Bundle', 
        type: 'Chronic Care',
        totalPrice: '52.00 €',
        products: [
            { id: 'p10', name: 'Metformin 500mg', price: '10.00 €' },
            { id: 'p11', name: 'Blood Glucose Strips (50)', price: '25.00 €' },
            { id: 'p12', name: 'Diabetic Multivitamin', price: '17.00 €' },
        ]
    },
    { 
        id: 'pkg5', 
        name: 'Heart Health Package', 
        type: 'Cardiovascular',
        totalPrice: '58.50 €',
        products: [
            { id: 'p13', name: 'Omega-3 Fish Oil', price: '22.00 €' },
            { id: 'p14', name: 'CoQ10 100mg', price: '18.50 €' },
            { id: 'p15', name: 'Low-dose Aspirin', price: '6.00 €' },
            { id: 'p16', name: 'Magnesium 400mg', price: '12.00 €' },
        ]
    },
    { 
        id: 'pkg6', 
        name: 'Immunity Booster Set', 
        type: 'Wellness',
        totalPrice: '42.00 €',
        products: [
            { id: 'p17', name: 'Vitamin D3 2000IU', price: '15.00 €' },
            { id: 'p18', name: 'Elderberry Extract', price: '18.00 €' },
            { id: 'p19', name: 'Echinacea Capsules', price: '9.00 €' },
        ]
    },
];

const packageItems: SideSheetItem[] = AVAILABLE_PACKAGES.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    price: pkg.totalPrice,
    category: pkg.type,
    icon: <Pill size={16} />,
    products: pkg.products
}));

export function PlanForm({ initialData, userRole, onChange, onSubmit, onCancel }: PlanFormProps) {
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
                    <Card noPadding className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
                        <div className="space-y-4 p-6">
                            {/* Plan Name & Mode Selection */}
                            <div className="flex items-end gap-3">
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
                                <div className="bg-gray-100/50 p-1 rounded-lg inline-flex border border-gray-200/50">
                                    <button
                                        onClick={() => setMode('create')}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === 'create'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        Create
                                    </button>
                                    <button
                                        onClick={() => setMode('import')}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === 'import'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        Import
                                    </button>
                                </div>
                                <Button
                                    variant="outline"
                                    className="gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                    onClick={() => window.open('#', '_blank')}
                                    title="Preview plan"
                                >
                                    <ExternalLink size={14} />
                                </Button>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    {mode === 'create' ? 'Description' : 'Description (Optional)'}
                                </label>
                                <div className="min-h-[120px]">
                                    <TiptapEditor
                                        content={content}
                                        onChange={setContent}
                                        placeholder={mode === 'create' ? "Describe the clinical goals..." : "Add notes..."}
                                    />
                                </div>
                            </div>

                            {mode === 'import' ? (
                                <div className="border-t border-gray-100 pt-4">
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Import Source URL</label>
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
                            ) : (
                                <>
                                    {/* Package Items Section */}
                                    <div className="border-t border-gray-100 pt-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                <Pill size={14} className="text-blue-500" />
                                                Package Items
                                            </h2>
                                            <Button
                                                onClick={openProductSheet}
                                                size="sm"
                                                className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700 h-8 text-xs"
                                            >
                                                <Plus size={14} />
                                                Add
                                            </Button>
                                        </div>

                                        {products.length === 0 ? (
                                            <div className="flex items-center justify-center py-6 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50">
                                                <p className="text-xs text-gray-400 font-medium">No products selected</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {products.map((product, index) => (
                                                    <div key={product.id} className="bg-white border border-gray-100 rounded-lg p-3 hover:border-blue-200 transition-all group">
                                                        <div className="flex items-center gap-3">
                                                            {/* Sort Controls */}
                                                            <div className="flex flex-col gap-0.5 shrink-0">
                                                                <button 
                                                                    onClick={() => moveProduct(index, 'up')} 
                                                                    disabled={index === 0} 
                                                                    className="p-0.5 text-gray-300 hover:text-blue-500 disabled:opacity-0"
                                                                >
                                                                    <ChevronUp size={14} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => moveProduct(index, 'down')} 
                                                                    disabled={index === products.length - 1} 
                                                                    className="p-0.5 text-gray-300 hover:text-blue-500 disabled:opacity-0"
                                                                >
                                                                    <ChevronDown size={14} />
                                                                </button>
                                                            </div>

                                                            {/* Product Info */}
                                                            <div className="min-w-0 w-48">
                                                                <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                                                                <span className="text-[10px] text-gray-500">{product.type}</span>
                                                            </div>

                                                            {/* Dosage Input */}
                                                            <input
                                                                type="text"
                                                                value={product.instruction}
                                                                onChange={(e) => updateProduct(product.id, { instruction: e.target.value })}
                                                                placeholder="Dosage..."
                                                                className="flex-1 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                            />

                                                            {/* Time of Day */}
                                                            <div className="flex items-center gap-1">
                                                                {TIMES.map(t => (
                                                                    <button
                                                                        key={t.char}
                                                                        onClick={() => toggleTime(product.id, t.char)}
                                                                        title={t.label}
                                                                        className={`w-7 h-7 rounded text-[10px] font-black transition-all border ${product.timeOfDay.includes(t.char)
                                                                            ? 'bg-blue-600 border-blue-600 text-white'
                                                                            : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                                                                            }`}
                                                                    >
                                                                        {t.char}
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            {/* Delete Button */}
                                                            <button
                                                                onClick={() => removeProduct(product.id)}
                                                                className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all shrink-0"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Attachments Section */}
                                    <div className="border-t border-gray-100 pt-4">
                                        <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <Files size={14} className="text-indigo-500" />
                                            Attachments
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {/* Documents Section */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                                        <FileUp size={12} className="text-orange-500" />
                                                        Files ({documents.length})
                                                    </label>
                                                </div>

                                                <div className="space-y-1.5">
                                                    {documents.map((doc, index) => (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 hover:bg-orange-50/50 rounded border border-gray-100 hover:border-orange-200 transition-all group">
                                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                                <FileText size={12} className="text-orange-600 shrink-0" />
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-xs font-medium text-gray-800 truncate">{doc.name}</p>
                                                                    <p className="text-[10px] text-gray-400">{doc.size}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => removeDocument(index)}
                                                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    <label className="cursor-pointer block">
                                                        <div className="flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-gray-200 rounded hover:border-orange-400 hover:bg-orange-50/30 transition-all group">
                                                            <PlusCircle size={14} className="text-gray-400 group-hover:text-orange-500" />
                                                            <span className="text-xs font-semibold text-gray-500 group-hover:text-orange-600">Upload</span>
                                                        </div>
                                                        <input type="file" multiple className="sr-only" onChange={handleFileUpload} />
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Links Section */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                                        <Globe size={12} className="text-blue-500" />
                                                        Links ({links.length})
                                                    </label>
                                                </div>

                                                <div className="space-y-1.5">
                                                    {links.map((link, index) => (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 hover:bg-blue-50/50 rounded border border-gray-100 hover:border-blue-200 transition-all group">
                                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                                <LinkIcon size={12} className="text-blue-500 shrink-0" />
                                                                <span className="text-xs text-gray-600 truncate">{link}</span>
                                                            </div>
                                                            <div className="flex items-center gap-0.5 shrink-0">
                                                                <a 
                                                                    href={link} 
                                                                    target="_blank" 
                                                                    rel="noreferrer" 
                                                                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                                                                >
                                                                    <ExternalLink size={12} />
                                                                </a>
                                                                <button
                                                                    onClick={() => removeLink(index)}
                                                                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <div className="flex gap-1.5">
                                                        <Input
                                                            type="url"
                                                            icon={<LinkIcon size={12} />}
                                                            value={newLink}
                                                            onChange={(e) => setNewLink(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                                                            placeholder="URL..."
                                                            className="text-xs flex-1"
                                                        />
                                                        <Button
                                                            onClick={handleAddLink}
                                                            size="sm"
                                                            className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3"
                                                        >
                                                            <Plus size={14} />
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

                    {/* Action Buttons - Fixed at Bottom */}
                    <div className="flex items-center justify-end gap-3 bg-white border-t border-gray-200 py-3 px-6 rounded-lg shadow-sm">
                        <Button
                            onClick={onCancel}
                            variant="outline"
                            className="px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onSubmit}
                            className="bg-gray-900 hover:bg-gray-800 text-white px-6"
                        >
                            {initialData ? 'Save Changes' : 'Create Plan'}
                        </Button>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
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
