import { useState, useEffect } from 'react';
import { Search, Plus, X, ExternalLink, Check } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface OTCProduct {
    id: string;
    name: string;
    category: string;
    price: string;
    manufacturer: string;
    image: string;
}

interface OTCListFormProps {
    initialData?: {
        id: string;
        name: string;
        products?: OTCProduct[];
    } | null;
    onChange: (data: any) => void;
}

const AVAILABLE_OTC_PRODUCTS: OTCProduct[] = [
    { id: 'otc1', name: 'Aspirin 325mg', category: 'Pain Relief', price: '8.99 €', manufacturer: 'Bayer', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=aspirin&backgroundColor=f0f0f0' },
    { id: 'otc2', name: 'Ibuprofen 200mg', category: 'Pain Relief', price: '12.50 €', manufacturer: 'Advil', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=ibuprofen&backgroundColor=f0f0f0' },
    { id: 'otc3', name: 'Acetaminophen 500mg', category: 'Pain Relief', price: '9.99 €', manufacturer: 'Tylenol', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=acetaminophen&backgroundColor=f0f0f0' },
    { id: 'otc4', name: 'Diphenhydramine 25mg', category: 'Allergy', price: '14.99 €', manufacturer: 'Benadryl', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=diphenhydramine&backgroundColor=f0f0f0' },
    { id: 'otc5', name: 'Loratadine 10mg', category: 'Allergy', price: '18.99 €', manufacturer: 'Claritin', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=loratadine&backgroundColor=f0f0f0' },
    { id: 'otc6', name: 'Cetirizine 10mg', category: 'Allergy', price: '16.50 €', manufacturer: 'Zyrtec', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=cetirizine&backgroundColor=f0f0f0' },
    { id: 'otc7', name: 'Omeprazole 20mg', category: 'Digestive', price: '22.99 €', manufacturer: 'Prilosec', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=omeprazole&backgroundColor=f0f0f0' },
    { id: 'otc8', name: 'Ranitidine 150mg', category: 'Digestive', price: '19.99 €', manufacturer: 'Zantac', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=ranitidine&backgroundColor=f0f0f0' },
    { id: 'otc9', name: 'Vitamin D3 1000 IU', category: 'Vitamin', price: '15.99 €', manufacturer: 'Nature Made', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=vitamind&backgroundColor=f0f0f0' },
    { id: 'otc10', name: 'Vitamin C 1000mg', category: 'Vitamin', price: '12.99 €', manufacturer: 'Nature Made', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=vitaminc&backgroundColor=f0f0f0' },
    { id: 'otc11', name: 'Multivitamin Complex', category: 'Vitamin', price: '24.99 €', manufacturer: 'Centrum', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=multivitamin&backgroundColor=f0f0f0' },
    { id: 'otc12', name: 'Omega-3 Fish Oil', category: 'Supplement', price: '28.99 €', manufacturer: 'Nordic Naturals', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=omega3&backgroundColor=f0f0f0' },
    { id: 'otc13', name: 'Probiotic 10B CFU', category: 'Digestive', price: '32.99 €', manufacturer: 'Garden of Life', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=probiotic&backgroundColor=f0f0f0' },
    { id: 'otc14', name: 'Melatonin 5mg', category: 'Sleep Aid', price: '11.99 €', manufacturer: 'Natrol', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=melatonin&backgroundColor=f0f0f0' },
    { id: 'otc15', name: 'Hydrocortisone Cream 1%', category: 'Topical', price: '8.99 €', manufacturer: 'Cortizone', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=hydrocortisone&backgroundColor=f0f0f0' }
];

export function OTCListForm({ initialData, onChange }: OTCListFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [selectedProducts, setSelectedProducts] = useState<OTCProduct[]>(initialData?.products || []);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    useEffect(() => {
        onChange({
            name,
            products: selectedProducts
        });
    }, [name, selectedProducts, onChange]);

    const categories = ['All', ...Array.from(new Set(AVAILABLE_OTC_PRODUCTS.map(p => p.category)))];

    const filteredProducts = AVAILABLE_OTC_PRODUCTS.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const notSelected = !selectedProducts.find(p => p.id === product.id);
        return matchesSearch && matchesCategory && notSelected;
    });

    const addProduct = (product: OTCProduct) => {
        setSelectedProducts([...selectedProducts, product]);
    };

    const removeProduct = (productId: string) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    };

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
                {/* Product Selection Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - Available Products (8 columns) */}
                    <Card className="lg:col-span-8 h-[calc(100vh-180px)] flex flex-col">
                        <div className="space-y-4 flex flex-col h-full">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-3">Available OTC Products</h3>
                                <div className="space-y-3">
                                    <Input
                                        type="text"
                                        icon={<Search size={16} />}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="text-sm"
                                    />
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                                    selectedCategory === cat
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-1">
                                {filteredProducts.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-center">
                                        <p className="text-sm text-gray-400">No products found</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                        {filteredProducts.map(product => (
                                            <div
                                                key={product.id}
                                                className="group flex flex-col p-4 bg-gray-50 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-200 transition-all cursor-pointer"
                                                onClick={() => addProduct(product)}
                                            >
                                                <div className="flex items-start gap-3 mb-3">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-16 h-16 rounded-lg bg-white border border-gray-200 object-cover shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 leading-tight mb-1">{product.name}</p>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                                                {product.category}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400">{product.manufacturer}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200/50">
                                                    <span className="text-sm font-bold text-gray-900">{product.price}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-100"
                                                    >
                                                        <Plus size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Right Column - Selected Products (4 columns) */}
                    <Card className="lg:col-span-4 h-[calc(100vh-180px)] flex flex-col">
                        <div className="space-y-4 flex flex-col h-full">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-semibold text-gray-900">
                                        List Name <span className="text-red-500">*</span>
                                    </label>
                                    
                                </div>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Cold & Flu Bundle"
                                    className="text-sm"
                                />
                            </div>

                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold text-gray-900">Chosen Products</h3>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                                        {selectedProducts.length}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                                {selectedProducts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-gray-200 rounded-xl p-4">
                                        <p className="text-sm text-gray-400 font-medium">No products selected yet</p>
                                        <p className="text-xs text-gray-300 mt-1">Click products from the left to add them</p>
                                    </div>
                                ) : (
                                    selectedProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="group flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 hover:border-green-300 transition-all"
                                        >
                                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-600 text-white text-xs font-bold shrink-0">
                                                <Check size={14} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate leading-tight">{product.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                                                        {product.category}
                                                    </span>
                                                    <span className="text-[10px] font-medium text-gray-600">{product.price}</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeProduct(product.id)}
                                                className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {selectedProducts.length > 0 && (
                                <div className="pt-3 border-t border-gray-200">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold text-gray-700">Total Products:</span>
                                        <span className="font-bold text-gray-900">{selectedProducts.length}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
