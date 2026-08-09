import React from 'react';
import { Lightbulb, Zap, ShoppingBag, Eye, Edit2, Tag, Check, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToQuote: (product: Product) => void;
  isInQuoteCart: boolean;
  isAdminLoggedIn: boolean;
  onEditProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToQuote,
  isInQuoteCart,
  isAdminLoggedIn,
  onEditProduct,
}) => {
  const hasDiscount = product.discountPrice && product.discountPrice < product.originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.discountPrice!) / product.originalPrice) * 100)
    : 0;

  const savingsAmount = hasDiscount ? product.originalPrice - product.discountPrice! : 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 relative shadow-sm">
      
      {/* Top Image & Badges Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-900/10 dark:bg-black/40">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

        {/* Shop Origin Badge */}
        <div className="absolute top-3 left-3 z-10">
          {product.shopOrigin === 'lighthouse' ? (
            <span className="glass-badge-gold px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
              <Lightbulb className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              Light House
            </span>
          ) : (
            <span className="glass-badge-blue px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
              <Zap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              Electrical Shop
            </span>
          )}
        </div>

        {/* Discount Percentage Badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 z-10">
            <span className="discount-tag font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {discountPercent}% OFF
            </span>
          </div>
        )}

        {/* Quick View Floating Action */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute bottom-3 right-3 z-10 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all transform group-hover:translate-y-0"
          title="Quick View Details & Specs"
        >
          <Eye className="w-4 h-4 text-white" />
        </button>

        {/* Admin Quick Edit Button */}
        {isAdminLoggedIn && onEditProduct && (
          <button
            onClick={() => onEditProduct(product)}
            className="absolute bottom-3 left-3 z-10 p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold backdrop-blur-md border border-amber-500 shadow-lg"
            title="Admin Edit Price & Stock"
          >
            <Edit2 className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-bold text-amber-600 dark:text-amber-400 tracking-wide uppercase">{product.brand}</span>
            <span className="text-slate-500 dark:text-slate-400 truncate max-w-[140px] font-medium">{product.category}</span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {product.title}
          </h3>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {product.tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Savings Block */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
          
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  ₹{(product.discountPrice || product.originalPrice).toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-medium">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Save ₹{savingsAmount.toLocaleString('en-IN')}
                </p>
              )}
            </div>

            {/* Rating if present */}
            {product.rating && (
              <div className="flex items-center gap-1 text-xs text-[#BBA760] bg-[#BBA760]/15 px-2 py-0.5 rounded-lg border border-[#BBA760]/30 font-bold">
                <Star className="w-3 h-3 text-[#BBA760] fill-[#BBA760]" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>

          {/* Add to Quote Button */}
          <button
            onClick={() => onAddToQuote(product)}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              isInQuoteCart
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                : 'glass-button-primary'
            }`}
          >
            {isInQuoteCart ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Added to Quote List</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Quote Request</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
};
