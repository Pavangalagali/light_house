import React from 'react';
import { Lightbulb, Zap, MapPin, Sparkles, ShieldCheck, Tag } from 'lucide-react';
import { ShopOrigin } from '../types';

interface HeroBannerProps {
  onSelectShop: (shop: ShopOrigin | 'all') => void;
  onOpenAdmin: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectShop }) => {
  return (
    <div className="relative overflow-hidden my-6">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden bg-white">
          
          <div className="relative z-10 max-w-4xl space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-badge-gold text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Authorized Dual-Showroom Portfolio</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Lighthouse <span className="text-amber-600">&</span> Electrical Shop
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Explore our dual showroom portfolio featuring architectural chandeliers, ambient LED tracks, and luxury lighting alongside top-rated 5-star energy appliances, ACs, refrigerators, and modular power solutions at verified discount prices.
            </p>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-3xl">
              
              {/* Lighthouse Store Box */}
              <div 
                onClick={() => onSelectShop('lighthouse')}
                className="glass-card p-4 rounded-2xl cursor-pointer hover:border-amber-500 transition-all group bg-slate-50 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Light House</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full glass-badge-gold">
                    Showroom 1
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Chandeliers, Pendant Lights, Track Systems, Profile LEDs & Outdoor Sconces.
                </p>
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                  <span className="text-amber-600 group-hover:underline font-medium">Browse Lights &rarr;</span>
                  <a
                    href="https://maps.app.goo.gl/oX5BepWoruLiGGxa6"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-amber-600" /> Map
                  </a>
                </div>
              </div>

              {/* Electrical Shop Box */}
              <div 
                onClick={() => onSelectShop('electrical_shop')}
                className="glass-card p-4 rounded-2xl cursor-pointer hover:border-blue-500 transition-all group bg-slate-50 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span>Electrical Shop</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full glass-badge-blue">
                    Showroom 2
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Inverter ACs, Smart Refrigerators, BLDC Fans, Geysers & Kitchen Appliances.
                </p>
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                  <span className="text-blue-600 group-hover:underline font-medium">Browse Appliances &rarr;</span>
                  <a
                    href="https://maps.app.goo.gl/ie2eCof9c5GmTpdaA"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-blue-600" /> Map
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
