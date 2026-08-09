import React from 'react';
import { X, Lightbulb, Zap, ShoppingBag, MessageCircle, MapPin, CheckCircle, Tag, Share2 } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToQuote: (product: Product) => void;
  isInQuoteCart: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToQuote,
  isInQuoteCart,
}) => {
  if (!product) return null;

  const storeMapUrl =
    product.shopOrigin === 'lighthouse'
      ? 'https://maps.app.goo.gl/oX5BepWoruLiGGxa6'
      : 'https://maps.app.goo.gl/ie2eCof9c5GmTpdaA';

  const storePhone = '918088874239';

  const hasDiscount = product.discountPrice && product.discountPrice < product.originalPrice;
  const savings = hasDiscount ? product.originalPrice - product.discountPrice! : 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.discountPrice!) / product.originalPrice) * 100)
    : 0;

  const handleWhatsAppInquiry = () => {
    const text = `Hello! I am inquiring about *${product.title}* from *${
      product.shopOrigin === 'lighthouse' ? 'Light House' : 'Electrical Shop'
    }*.\nBrand: ${product.brand}\nDiscount Price: ₹${(
      product.discountPrice || product.originalPrice
    ).toLocaleString('en-IN')}\nPlease share availability and delivery options.`;

    window.open(`https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareOnWhatsApp = () => {
    const specsText = product.specifications && product.specifications.length > 0
      ? product.specifications.map(s => `• ${s.label}: ${s.value}`).join('\n')
      : '';

    const text = `Check out this product from *${product.shopOrigin === 'lighthouse' ? 'Light House' : 'Electrical Shop'}*!\n\n` +
      `*${product.title}*\n` +
      `• *Brand:* ${product.brand}\n` +
      `• *Category:* ${product.category}\n` +
      `• *Price:* ₹${(product.discountPrice || product.originalPrice).toLocaleString('en-IN')}${hasDiscount ? ` (MRP ₹${product.originalPrice.toLocaleString('en-IN')})` : ''}\n\n` +
      `*Description:*\n${product.description}\n` +
      (specsText ? `\n*Specifications:*\n${specsText}\n` : '') +
      `\nFor inquiries or orders, contact: 8088874239`;

    window.open(`https://wa.me/918088874239?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="glass-panel w-full max-w-3xl rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative my-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-black/60 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-black transition-all border border-slate-200 dark:border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image Side */}
          <div className="relative bg-slate-100 dark:bg-black/50 p-6 flex items-center justify-center min-h-[300px] border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="max-h-[350px] w-auto object-contain rounded-2xl shadow-xl"
            />
            
            {/* Shop Badge */}
            <div className="absolute top-4 left-4 z-10">
              {product.shopOrigin === 'lighthouse' ? (
                <span className="glass-badge-gold px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  Light House
                </span>
              ) : (
                <span className="glass-badge-blue px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  Electrical Shop
                </span>
              )}
            </div>

            {hasDiscount && (
              <div className="absolute bottom-4 left-4 z-10">
                <span className="discount-tag px-3 py-1 rounded-full text-xs font-extrabold shadow-lg flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Save {discountPercent}%
                </span>
              </div>
            )}
          </div>

          {/* Details Side */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-5 max-h-[80vh] overflow-y-auto">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase">{product.brand}</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">{product.category}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {product.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Price Quote</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      ₹{(product.discountPrice || product.originalPrice).toLocaleString('en-IN')}
                    </span>
                    {hasDiscount && (
                      <span className="ml-2 text-xs text-slate-400 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {hasDiscount && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold text-right">
                    Total Savings: ₹{savings.toLocaleString('en-IN')} ({discountPercent}% Discount)
                  </p>
                )}
              </div>

              {/* Specifications Table */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Specifications</h4>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="flex justify-between p-2.5">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{spec.label}</span>
                        <span className="text-slate-900 dark:text-slate-100 font-semibold text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Store & Warranty Info */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> In Stock & Ready
                </span>
                <a
                  href={storeMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <MapPin className="w-3 h-3" /> View Showroom Location
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => onAddToQuote(product)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isInQuoteCart
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                    : 'glass-button-primary'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isInQuoteCart ? 'In Your Quote Request List' : 'Add to Quote Request'}</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full py-3 px-3 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct WhatsApp Inquiry</span>
                </button>

                <button
                  onClick={handleShareOnWhatsApp}
                  className="w-full py-3 px-3 rounded-xl font-bold text-xs sm:text-sm bg-teal-700 hover:bg-teal-600 text-white flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
