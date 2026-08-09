import React from 'react';
import { Lightbulb, Zap, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { ShopOrigin } from '../types';

interface FooterProps {
  onSelectShop: (shop: ShopOrigin | 'all') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectShop, onOpenAdmin }) => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 glass-panel relative z-10 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Lightbulb className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">Lighthouse & Electrical Shop</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-md">
              Your premier dual-showroom destination for luxury lighting fixtures, modern chandeliers, architectural LED profile systems, and 5-star energy efficient major home appliances.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Authorized Dealer
              </span>
              <span className="text-[11px] text-slate-400">•</span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Direct Discount Pricing</span>
            </div>
          </div>

          {/* Quick Portfolio Switch */}
          <div className="space-y-3">
            <h4 className="text-slate-900 dark:text-white font-bold uppercase tracking-wider text-xs">Browse Showrooms</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectShop('all')}
                  className="hover:text-amber-500 transition-colors text-slate-600 dark:text-slate-300"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectShop('lighthouse')}
                  className="hover:text-amber-500 transition-colors flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium"
                >
                  <Lightbulb className="w-3 h-3" /> Light House Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectShop('electrical_shop')}
                  className="hover:text-blue-500 transition-colors flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium"
                >
                  <Zap className="w-3 h-3" /> Electrical Shop Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1 text-emerald-600 dark:text-emerald-400/90 font-medium"
                >
                  <ShieldCheck className="w-3 h-3" /> Owner & Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Store Maps Direct Links */}
          <div className="space-y-3">
            <h4 className="text-slate-900 dark:text-white font-bold uppercase tracking-wider text-xs">Showroom Locations</h4>
            <div className="space-y-2.5">
              <a
                href="https://maps.app.goo.gl/oX5BepWoruLiGGxa6"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/30 hover:border-amber-500 text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2 group transition-all"
              >
                <MapPin className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                <span>Light House Map Location</span>
              </a>

              <a
                href="https://maps.app.goo.gl/ie2eCof9c5GmTpdaA"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/30 hover:border-blue-500 text-xs font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2 group transition-all"
              >
                <MapPin className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <span>Electrical Shop Map Location</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Lighthouse & Electrical Shop. All Rights Reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline" />
            <span>for Premier Showrooms</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
