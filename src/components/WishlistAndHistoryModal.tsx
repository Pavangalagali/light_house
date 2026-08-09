import React from 'react';
import { X, Heart, Clock, Trash2, ShoppingBag, MessageCircle, Check, Lightbulb, Zap, ShieldCheck, Phone } from 'lucide-react';
import { Product, UserProfile } from '../types';

interface WishlistAndHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'wishlist' | 'history';
  setActiveTab: (tab: 'wishlist' | 'history') => void;
  wishlistProducts: Product[];
  onToggleWishlist: (product: Product) => void;
  onClearWishlist: () => void;
  recentlyViewedProducts: Product[];
  onClearHistory: () => void;
  onQuickView: (product: Product) => void;
  onAddToQuote: (product: Product) => void;
  quoteCartIds: string[];
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
}

export const WishlistAndHistoryModal: React.FC<WishlistAndHistoryModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  wishlistProducts,
  onToggleWishlist,
  onClearWishlist,
  recentlyViewedProducts,
  onClearHistory,
  onQuickView,
  onAddToQuote,
  quoteCartIds,
  currentUser,
  onOpenAuthModal,
}) => {
  if (!isOpen) return null;

  const currentList = activeTab === 'wishlist' ? wishlistProducts : recentlyViewedProducts;

  const handleWhatsAppInquiry = (product: Product) => {
    const text = `Hi Light House & Electrical Shop! I am interested in this product from my ${activeTab === 'wishlist' ? 'wishlist' : 'history'}:\n\n` +
      `*Product:* ${product.title}\n` +
      `*Brand:* ${product.brand}\n` +
      `*Price:* ₹${(product.discountPrice || product.originalPrice).toLocaleString('en-IN')}\n\n` +
      `Please let me know stock availability.`;
    window.open(`https://wa.me/918088874239?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header & Tabs */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-20 backdrop-blur-md">
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${activeTab === 'wishlist' ? 'fill-white' : ''}`} />
                <span>My Wishlist ({wishlistProducts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Recently Viewed ({recentlyViewedProducts.length})</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {currentUser ? (
              <button
                onClick={onOpenAuthModal}
                className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
                title="Click to view or edit account details"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>+91 {currentUser.phone}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Login with Phone to Save</span>
              </button>
            )}

            {currentList.length > 0 && (
              <button
                onClick={activeTab === 'wishlist' ? onClearWishlist : onClearHistory}
                className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 px-2.5 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
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

        {/* List Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {currentList.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                {activeTab === 'wishlist' ? <Heart className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
              </div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                {activeTab === 'wishlist' ? 'Your Wishlist is Empty' : 'No Recently Viewed Products'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {activeTab === 'wishlist' 
                  ? 'Click the heart icon on any product card or detail view to save items for quick access during your session.'
                  : 'Products you inspect or view will automatically appear here for quick reference.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentList.map((p) => {
                const isInCart = quoteCartIds.includes(p.id);
                const isWishlisted = wishlistProducts.some((item) => item.id === p.id);
                const hasDiscount = p.discountPrice && p.discountPrice < p.originalPrice;

                return (
                  <div
                    key={p.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-amber-500/50 transition-all"
                  >
                    <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      
                      <button
                        onClick={() => onToggleWishlist(p)}
                        className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer z-10 ${
                          isWishlisted
                            ? 'bg-rose-600 text-white border-rose-500'
                            : 'bg-slate-900/60 text-white hover:bg-rose-600 border-white/20'
                        }`}
                        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
                      </button>

                      <div className="absolute top-2 left-2 z-10">
                        {p.shopOrigin === 'lighthouse' ? (
                          <span className="glass-badge-gold px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                            <Lightbulb className="w-2.5 h-2.5 text-amber-600" />
                            Light House
                          </span>
                        ) : (
                          <span className="glass-badge-blue px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                            <Zap className="w-2.5 h-2.5 text-blue-600" />
                            Electrical Shop
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{p.brand}</span>
                      <h4 
                        onClick={() => { onQuickView(p); onClose(); }}
                        className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-tight cursor-pointer hover:text-amber-600 transition-colors"
                      >
                        {p.title}
                      </h4>

                      <div className="pt-1 flex items-baseline gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          ₹{(p.discountPrice || p.originalPrice).toLocaleString('en-IN')}
                        </span>
                        {hasDiscount && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => onAddToQuote(p)}
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
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
                        className="py-2 px-2 rounded-xl text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Inquire</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
