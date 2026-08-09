import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, MessageCircle, Send, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product, QuoteItem, ShopOrigin } from '../types';

interface QuoteCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  quoteItems: QuoteItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const QuoteCartDrawer: React.FC<QuoteCartDrawerProps> = ({
  isOpen,
  onClose,
  quoteItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [preferredStore, setPreferredStore] = useState<ShopOrigin | 'both'>('both');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const totalOriginalPrice = quoteItems.reduce((acc, item) => {
    return acc + item.product.originalPrice * item.quantity;
  }, 0);

  const totalNetPrice = quoteItems.reduce((acc, item) => {
    const unitPrice = item.product.discountPrice || item.product.originalPrice;
    return acc + unitPrice * item.quantity;
  }, 0);

  const totalSavings = totalOriginalPrice - totalNetPrice;

  const handleWhatsAppQuote = () => {
    if (!customerName || !customerPhone) {
      alert('Please fill in your Name and Mobile Phone number so our team can follow up.');
      return;
    }

    let text = `*NEW QUOTE / INQUIRY REQUEST*\n`;
    text += `------------------------------\n`;
    text += `*Customer Name:* ${customerName}\n`;
    text += `*Phone:* ${customerPhone}\n`;
    text += `*Preferred Store:* ${
      preferredStore === 'lighthouse'
        ? 'Light House'
        : preferredStore === 'electrical_shop'
        ? 'Electrical Shop'
        : 'Both Showrooms'
    }\n`;

    if (notes) text += `*Customer Note:* ${notes}\n`;

    text += `\n*REQUESTED ITEMS (${quoteItems.length}):*\n`;
    quoteItems.forEach((item, idx) => {
      const price = item.product.discountPrice || item.product.originalPrice;
      text += `${idx + 1}. *${item.product.title}* [${
        item.product.shopOrigin === 'lighthouse' ? 'Light House' : 'Electrical Shop'
      }]\n   Qty: ${item.quantity} x ₹${price.toLocaleString('en-IN')} = ₹${(
        price * item.quantity
      ).toLocaleString('en-IN')}\n`;
    });

    text += `\n------------------------------\n`;
    text += `*Total List Price:* ₹${totalOriginalPrice.toLocaleString('en-IN')}\n`;
    if (totalSavings > 0) {
      text += `*Total Discount Savings:* ₹${totalSavings.toLocaleString('en-IN')}\n`;
    }
    text += `*Estimated Total Net:* ₹${totalNetPrice.toLocaleString('en-IN')}\n`;

    const targetPhone = preferredStore === 'electrical_shop' ? '919876543211' : '919876543210';
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`, '_blank');

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-2xl relative text-left">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Quote Request List</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{quoteItems.length} product(s) selected</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 flex-1 overflow-y-auto space-y-5">
            
            {submitted ? (
              <div className="p-8 text-center space-y-4 my-auto">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">Quote Request Sent!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Your quote has been redirected to our WhatsApp store representative. We will respond with finalized availability and instant pricing confirmation shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClearCart();
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl glass-button-primary font-bold text-xs"
                >
                  Return to Store Portfolio
                </button>
              </div>
            ) : quoteItems.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Your Quote List is Empty</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Browse our chandeliers, profile lights, or major appliances and click "Add to Quote Request" to build your custom price inquiry.
                </p>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Selected Items</span>
                    <button
                      onClick={onClearCart}
                      className="text-amber-600 dark:text-amber-400 hover:underline text-[11px] font-semibold"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {quoteItems.map((item) => {
                      const unitPrice = item.product.discountPrice || item.product.originalPrice;
                      return (
                        <div
                          key={item.product.id}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                        >
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          />

                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.product.title}</h5>
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                              ₹{unitPrice.toLocaleString('en-IN')} / unit
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 bg-slate-200/60 dark:bg-slate-900 p-1 rounded-xl border border-slate-300 dark:border-slate-700">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white px-1.5">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Contact Details */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Contact & Preferred Store</h4>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2 rounded-xl text-xs glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 00000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-2 rounded-xl text-xs glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Preferred Showroom</label>
                    <select
                      value={preferredStore}
                      onChange={(e) => setPreferredStore(e.target.value as any)}
                      className="w-full p-2 rounded-xl text-xs glass-input"
                    >
                      <option value="both">Both Showrooms</option>
                      <option value="lighthouse">Light House Showroom</option>
                      <option value="electrical_shop">Electrical Shop</option>
                    </select>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Footer Summary & Action */}
          {!submitted && quoteItems.length > 0 && (
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>List Price Total:</span>
                  <span>₹{totalOriginalPrice.toLocaleString('en-IN')}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount Savings:</span>
                    <span>- ₹{totalSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>Estimated Total:</span>
                  <span className="text-amber-600 dark:text-amber-400">₹{totalNetPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleWhatsAppQuote}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-all shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp Quote Request</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
