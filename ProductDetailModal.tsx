import React from 'react';
import { Lightbulb, Zap, MapPin, Phone, Clock, Mail, ExternalLink, CheckCircle } from 'lucide-react';
import { STORES_INFO } from '../data/initialData';

export const StoreLocationsSection: React.FC = () => {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge-gold text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          Physical Showroom Locations
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Visit Our Showrooms in Person
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Walk into our stores for live product demonstrations, custom lighting consultations, and instant bulk discount quotes.
        </p>
      </div>

      {/* Store Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STORES_INFO.map((store) => {
          const isLighthouse = store.id === 'lighthouse';
          return (
            <div
              key={store.id}
              className="glass-panel rounded-3xl overflow-hidden border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all group bg-white shadow-sm"
            >
              
              {/* Banner Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={store.bannerImage}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                  {isLighthouse ? (
                    <span className="glass-badge-gold px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Light House Showroom
                    </span>
                  ) : (
                    <span className="glass-badge-blue px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                      <Zap className="w-3.5 h-3.5 text-blue-600" /> Electrical Shop
                    </span>
                  )}
                </div>
              </div>

              {/* Details Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    {store.name}
                  </h3>
                  <p className="text-xs text-amber-600 font-medium">{store.tagline}</p>

                  <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <span>{store.address}, {store.city}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>{store.operatingHours}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>{store.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>{store.email}</span>
                    </div>
                  </div>

                  {/* Specialties List */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Showroom Specialties</span>
                    <div className="flex flex-wrap gap-1.5">
                      {store.specialties.map((spec, i) => (
                        <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Google Maps External Button */}
                <div className="pt-4 border-t border-slate-200">
                  <a
                    href={store.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm glass-button-primary flex items-center justify-center gap-2 text-white shadow-sm"
                  >
                    <MapPin className="w-4 h-4 text-white" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </a>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
