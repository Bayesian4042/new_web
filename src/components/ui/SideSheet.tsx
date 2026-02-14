import React, { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Button } from './Button';
export interface SideSheetItem {
  id: string;
  name: string;
  description?: string;
  price?: string;
  category?: string;
  icon?: React.ReactNode;
  products?: { id: string; name: string; price: string }[];
}
interface SideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  items: SideSheetItem[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onConfirm: () => void;
  searchPlaceholder?: string;
}
export function SideSheet({
  isOpen,
  onClose,
  title,
  description,
  items,
  selectedIds,
  onSelectionChange,
  onConfirm,
  searchPlaceholder = 'Search...'
}: SideSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredItems = items.filter(
    (item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  if (!isOpen) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose} />


      {/* Side Sheet */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {description &&
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            }
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">

            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />

          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredItems.length === 0 ?
          <div className="py-12 text-center text-gray-400">
              <p className="text-sm">No items found</p>
              {searchQuery &&
            <p className="text-xs mt-1">Try a different search term</p>
            }
            </div> :

          <div className="space-y-2">
              {filteredItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-gray-100'}`}>

                    {/* Header Row */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                      
                      {item.icon &&
                        <span className={`flex-shrink-0 p-2 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{item.icon}</span>
                      }
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                            {item.name}
                          </span>
                          {item.category &&
                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">
                              {item.category}
                            </span>
                          }
                        </div>
                        {item.description &&
                          <p className={`text-xs mt-0.5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                            {item.description}
                          </p>
                        }
                      </div>
                      
                      {item.price &&
                        <span className={`text-sm font-bold flex-shrink-0 ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                          {item.price}
                        </span>
                      }
                    </div>
                    
                    {/* Products Inside Package */}
                    {item.products && item.products.length > 0 && (
                      <div className={`mt-3 pt-3 border-t ${isSelected ? 'border-blue-200' : 'border-gray-100'}`}>
                        <p className={`text-[10px] font-semibold uppercase tracking-wide mb-2 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}>
                          Contains {item.products.length} products
                        </p>
                        <div className="space-y-1.5">
                          {item.products.map((product) => (
                            <div key={product.id} className={`flex items-center justify-between py-1 px-2 rounded ${isSelected ? 'bg-blue-100/50' : 'bg-gray-50'}`}>
                              <span className={`text-xs ${isSelected ? 'text-blue-800' : 'text-gray-600'}`}>
                                {product.name}
                              </span>
                              <span className={`text-xs font-medium ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                                {product.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </button>);

            })}
            </div>
          }
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {selectedIds.length} selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={selectedIds.length === 0}
                className="bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50">

                Add Selected
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>);

}