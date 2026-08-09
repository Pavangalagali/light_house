import React, { useState } from 'react';
import { Lightbulb, Zap, ShoppingBag, ShieldCheck, MapPin, Search, Store, Sun, Moon, Calculator, Scale, Wrench, ChevronDown, Heart, Clock, Phone, UserCheck, User } from 'lucide-react';
import { ShopOrigin, UserProfile } from '../types';

export type ThemeMode = 'dark' | 'light';

interface HeaderProps {
  selectedShop: ShopOrigin | 'all';
  onSelectShop: (shop: ShopOrigin | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  quoteCount: number;
  onOpenQuoteDrawer: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  activeTab: 'catalog' | 'stores' | 'account';
  setActiveTab: (tab: 'catalog' | 'stores' | 'account') => void;
  theme: ThemeMode;
  onChangeTheme: (theme: ThemeMode) => void;
  onOpenCalculator: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  historyCount: number;
  onOpenHistory: () => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedShop,
  onSelectShop,
  searchQuery,
  onSearchChange,
  quoteCount,
  onOpenQuoteDrawer,
  onOpenAdmin,
  isAdminLoggedIn,
  activeTab,
  setActiveTab,
  theme,
  onChangeTheme,
  onOpenCalculator,
  compareCount,
  onOpenCompare,
  wishlistCount,
  onOpenWishlist,
  historyCount,
  onOpenHistory,
  currentUser,
  onOpenAuthModal,
}) => {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Shops Switcher */}
          <div className="flex items-center justify-between">
            <div 
              onClick={() => { setActiveTab('catalog'); onSelectShop('all'); }}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  Light House <span className="text-amber-600">&</span> Electrical Shop
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dual Showroom & Appliance Catalog</p>
              </div>
            </div>

            {/* Mobile Quote Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onOpenQuoteDrawer}
                className="relative p-2 rounded-lg glass-button-secondary text-amber-600"
                aria-label="Quote Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {quoteCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {quoteCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-auto w-full">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search chandeliers, LED tracks, ACs, fridges..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm glass-input text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Actions & Navigation */}
          <div className="flex items-center justify-center md:justify-end space-x-2 sm:space-x-2 text-sm">
            
            {/* Icon-Only Theme Toggle Button */}
            <button
              onClick={() => onChangeTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl glass-button-secondary text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-300 transform active:scale-90 cursor-pointer"
              aria-label="Toggle Theme"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 transition-transform duration-500 rotate-0 hover:rotate-90" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 transition-transform duration-500 rotate-0 hover:-rotate-12" />
                )}
              </div>
            </button>

            {/* Tools & Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl glass-button-secondary text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">Tools</span>
                {compareCount > 0 && (
                  <span className="bg-amber-600 text-white px-1.5 py-0.2 rounded-full text-[10px] font-extrabold">
                    {compareCount}
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsToolsDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-20 space-y-1 animate-fade-in">
                    <button
                      onClick={() => { setActiveTab('account'); setIsToolsDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer border-b border-slate-100 dark:border-slate-800 pb-2 mb-1"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">My Account & Details</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">View tab with profile, address & orders</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { onOpenCalculator(); setIsToolsDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Room Lumens Calculator</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Calculate recommended wattage & lights</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { onOpenWishlist(); setIsToolsDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 shrink-0">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">Saved Wishlist</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Dedicated per-user saved items</div>
                        </div>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                          {wishlistCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => { onOpenHistory(); setIsToolsDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">Recently Viewed</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Dedicated user browsing history</div>
                        </div>
                      </div>
                      {historyCount > 0 && (
                        <span className="bg-amber-600 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                          {historyCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => { onOpenCompare(); setIsToolsDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                          <Scale className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">Product Comparison</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Compare up to 4 items side-by-side</div>
                        </div>
                      </div>
                      {compareCount > 0 && (
                        <span className="bg-amber-600 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                          {compareCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => { setActiveTab('stores'); setIsToolsDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Showroom Locations</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Light House & Electrical Shop</div>
                      </div>
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                    <button
                      onClick={() => { onOpenAdmin(); setIsToolsDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">Admin Portal</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Manage inventory & products</div>
                        </div>
                      </div>
                      {isAdminLoggedIn && (
                        <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md">Active</span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Quote Request Cart (Icon & Count Only) */}
            <button
              onClick={onOpenQuoteDrawer}
              className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-2 rounded-xl glass-button-primary text-white font-semibold text-xs cursor-pointer shadow-md shrink-0"
              title={`Quote List (${quoteCount} items)`}
              aria-label="Quote List"
            >
              <ShoppingBag className="w-4 h-4 text-white shrink-0" />
              <span className="bg-white/25 text-white px-1.5 py-0.5 rounded-md text-xs font-extrabold shrink-0">
                {quoteCount}
              </span>
            </button>

            {/* Profile Icon Button - EXTREME RIGHT END */}
            <button
              onClick={() => setActiveTab('account')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer relative flex items-center justify-center shrink-0 ${
                activeTab === 'account'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-500/50 shadow-md'
                  : currentUser
                  ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                  : 'glass-button-secondary text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
              title={currentUser ? `User Profile: ${currentUser.name || '+91 ' + currentUser.phone}` : 'User Profile & Details Tab'}
              aria-label="User Details & Profile Tab"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              {currentUser && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
