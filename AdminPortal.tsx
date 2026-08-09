import React from 'react';
import { Lightbulb, Zap, ShoppingBag, ShieldCheck, MapPin, Search, Store, Sun, Moon, Palette } from 'lucide-react';
import { ShopOrigin } from '../types';

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
  activeTab: 'catalog' | 'stores';
  setActiveTab: (tab: 'catalog' | 'stores') => void;
  theme: ThemeMode;
  onChangeTheme: (theme: ThemeMode) => void;
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
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10">
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
                <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  Light House <span className="text-amber-600">&</span> Electrical Shop
                </h1>
                <p className="text-xs text-slate-500 font-medium">Dual Showroom & Appliance Catalog</p>
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
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chandeliers, LED tracks, ACs, fridges..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm glass-input text-gray-100 placeholder-gray-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Actions & Navigation */}
          <div className="flex items-center justify-center md:justify-end space-x-2 sm:space-x-3 text-sm">
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => onChangeTheme(theme === 'dark' ? 'light' : 'dark')}
              className="glass-button-secondary text-xs px-2.5 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5 font-medium cursor-pointer"
              aria-label="Toggle Theme"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            {/* View Stores Link */}
            <button
              onClick={() => setActiveTab(activeTab === 'stores' ? 'catalog' : 'stores')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'stores' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'glass-button-secondary text-slate-700'
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline font-medium">Store Locations</span>
            </button>

            {/* Quote Request Cart */}
            <button
              onClick={onOpenQuoteDrawer}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-button-primary text-white font-semibold text-xs sm:text-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>Quote List</span>
              <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-md text-xs font-bold">
                {quoteCount}
              </span>
            </button>

            {/* Admin Portal Toggle */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-xs sm:text-sm ${
                isAdminLoggedIn
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-medium'
                  : 'glass-button-secondary text-slate-700'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${isAdminLoggedIn ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isAdminLoggedIn ? 'Admin Active' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>

        {/* Shop Filter Sub-bar */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 text-xs sm:text-sm overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium mr-1 hidden sm:inline">Browse Shop:</span>
            
            <button
              onClick={() => { onSelectShop('all'); setActiveTab('catalog'); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedShop === 'all' && activeTab === 'catalog'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              All
            </button>

            <button
              onClick={() => { onSelectShop('lighthouse'); setActiveTab('catalog'); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedShop === 'lighthouse' && activeTab === 'catalog'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              Light House
            </button>

            <button
              onClick={() => { onSelectShop('electrical_shop'); setActiveTab('catalog'); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedShop === 'electrical_shop' && activeTab === 'catalog'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              Electrical Shop
            </button>
          </div>

          {/* Quick Direct Map Links */}
          <div className="flex items-center gap-3 text-xs text-slate-500 hidden lg:flex">
            <span className="text-slate-400">Maps:</span>
            <a
              href="https://maps.app.goo.gl/oX5BepWoruLiGGxa6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700 flex items-center gap-1 hover:underline font-medium"
            >
              <MapPin className="w-3 h-3 text-amber-600" /> Light House
            </a>
            <span className="text-slate-300">|</span>
            <a
              href="https://maps.app.goo.gl/ie2eCof9c5GmTpdaA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline font-medium"
            >
              <MapPin className="w-3 h-3 text-blue-600" /> Electrical Shop
            </a>
          </div>
        </div>

      </div>
    </header>
  );
};
