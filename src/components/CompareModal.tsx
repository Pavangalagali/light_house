import React from 'react';
import { X, Scale, Trash2, Check, ShoppingBag, MessageCircle, Lightbulb, Zap, Plus } from 'lucide-react';
import { Product } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareProducts: Product[];
  onRemoveFromCompare: (productId: string) => void;
  onClearCompare: () => void;
  onAddToQuote: (product: Product) => void;
  quoteCartIds: string[];
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  compareProducts,
  onRemoveFromCompare,
  onClearCompare,
  onAddToQuote,
  quoteCartIds,
}) => {
  if (!isOpen) return null;

  // Extract all unique spec keys across compared products
  const allSpecKeys: string[] = Array.from(
    new Set(
      compareProducts.flatMap((p) => p.specifications?.map((s) => s.label) || [])
    )
  );

  const handleWhatsAppInquiry = (p: Product) => {
    const text = `Hi Light House & Electrical Shop! I am comparing products and would like more details about:\n\n` +
      `*Product:* ${p.title}\n` +
      `*Brand:* ${p.brand}\n` +
      `*Category:* ${p.category}\n` +
      `*Price:* ₹${(p.discountPrice || p.originalPrice).toLocaleString('en-IN')}\n\n` +
      `Please provide stock availability and final quotation.`;
    window.open(`https://wa.me/918088874239?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
              <Scale className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Side-by-Side Product Comparison
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparing {compareProducts.length} of 4 items max
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {compareProducts.length > 0 && (
              <button
                onClick={onClearCompare}
                className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        {compareProducts.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">No products selected for comparison</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Click the <span className="font-bold text-amber-600">"Compare"</span> checkbox on any product card in the store to compare features side by side.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto p-4 sm:p-6">
            <div className="min-w-[650px] space-y-6">
              
              {/* Product Cards Row */}
              <div className="grid grid-cols-12 gap-4 items-stretch">
                <div className="col-span-3 font-bold text-xs uppercase text-slate-400 dark:text-slate-500 pt-4 tracking-wider">
                  Product Overview
                </div>
                
                <div className="col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {compareProducts.map((p) => {
                    const isInCart = quoteCartIds.includes(p.id);
                    const hasDiscount = p.discountPrice && p.discountPrice < p.originalPrice;
                    return (
                      <div 
                        key={p.id}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3 relative group"
                      >
                        <button
                          onClick={() => onRemoveFromCompare(p.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-red-600 transition-colors z-10 cursor-pointer"
                          title="Remove from compare"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <div className="space-y-2">
                          <img src={p.imageUrl} alt={p.title} className="w-full h-28 object-cover rounded-xl" />
                          
                          <div>
                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">{p.brand}</span>
                            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-tight">{p.title}</h4>
                          </div>

                          <div className="pt-1">
                            <span className="text-sm font-black text-slate-900 dark:text-white block">
                              ₹{(p.discountPrice || p.originalPrice).toLocaleString('en-IN')}
                            </span>
                            {hasDiscount && (
                              <span className="text-[10px] text-slate-400 line-through">
                                ₹{p.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <button
                            onClick={() => onAddToQuote(p)}
                            className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              isInCart
                                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                            }`}
                          >
                            {isInCart ? <Check className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                            <span>{isInCart ? 'In Quote' : '+ Quote'}</span>
                          </button>

                          <button
                            onClick={() => handleWhatsAppInquiry(p)}
                            className="w-full py-1.5 px-2 rounded-xl text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}

                  {/* Empty slots up to 4 */}
                  {Array.from({ length: 4 - compareProducts.length }).map((_, idx) => (
                    <div 
                      key={idx}
                      className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2"
                    >
                      <Plus className="w-6 h-6 text-slate-300 dark:text-slate-700" />
                      <span className="text-xs font-semibold">Add another product</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attributes Comparison Table */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Detailed Specifications Comparison
                </h3>

                {/* Row: Shop Origin */}
                <div className="grid grid-cols-12 gap-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 items-center text-xs">
                  <div className="col-span-3 font-semibold text-slate-500 dark:text-slate-400">Showroom Origin</div>
                  <div className="col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {compareProducts.map((p) => (
                      <div key={p.id} className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        {p.shopOrigin === 'lighthouse' ? (
                          <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1"><Lightbulb className="w-3.5 h-3.5" /> Light House</span>
                        ) : (
                          <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Electrical Shop</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row: Category */}
                <div className="grid grid-cols-12 gap-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 items-center text-xs">
                  <div className="col-span-3 font-semibold text-slate-500 dark:text-slate-400">Category</div>
                  <div className="col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {compareProducts.map((p) => (
                      <div key={p.id} className="font-semibold text-slate-800 dark:text-slate-200">{p.category}</div>
                    ))}
                  </div>
                </div>

                {/* Row: Stock Availability */}
                <div className="grid grid-cols-12 gap-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 items-center text-xs">
                  <div className="col-span-3 font-semibold text-slate-500 dark:text-slate-400">Stock Status</div>
                  <div className="col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {compareProducts.map((p) => (
                      <div key={p.id}>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                          In Stock ({p.stockQuantity} units)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic Spec Rows */}
                {allSpecKeys.map((specLabel: string) => (
                  <div key={specLabel} className="grid grid-cols-12 gap-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 items-center text-xs">
                    <div className="col-span-3 font-semibold text-slate-500 dark:text-slate-400">{specLabel}</div>
                    <div className="col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {compareProducts.map((p) => {
                        const matchedSpec = p.specifications?.find((s) => s.label.toLowerCase() === specLabel.toLowerCase());
                        return (
                          <div key={p.id} className="font-semibold text-slate-800 dark:text-slate-200">
                            {matchedSpec ? matchedSpec.value : '—'}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
