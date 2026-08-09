import React, { useState, useMemo } from 'react';
import { X, Calculator, Lightbulb, Check, Sparkles, Sliders, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface RoomCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToQuote: (product: Product) => void;
  quoteCartIds: string[];
}

interface RoomTypeConfig {
  id: string;
  name: string;
  fcMin: number; // foot-candles min
  fcMax: number; // foot-candles max
  description: string;
  recommendedType: string;
  ambientPct: number;
  taskPct: number;
}

const ROOM_TYPES: RoomTypeConfig[] = [
  { id: 'living', name: 'Living Room', fcMin: 15, fcMax: 20, description: 'Warm, cozy, layered ambient & accent lighting', recommendedType: 'Chandeliers, COB Spotlights, LED Strips', ambientPct: 60, taskPct: 40 },
  { id: 'bedroom', name: 'Bedroom', fcMin: 10, fcMax: 15, description: 'Soft, relaxing light with bedside reading task lights', recommendedType: 'Pendant Lights, Dimmable Panels, Wall Sconces', ambientPct: 70, taskPct: 30 },
  { id: 'kitchen', name: 'Kitchen & Dining', fcMin: 30, fcMax: 40, description: 'Bright, high-clarity lighting for cooking & dining', recommendedType: 'High-Lumen Panels, Under-Cabinet Profile Lights', ambientPct: 50, taskPct: 50 },
  { id: 'office', name: 'Home Office / Study', fcMin: 40, fcMax: 50, description: 'Glare-free focus lighting to reduce eyestrain', recommendedType: 'Architectural Track Lights, Desk Lights, LED Panels', ambientPct: 40, taskPct: 60 },
  { id: 'bathroom', name: 'Bathroom & Vanity', fcMin: 50, fcMax: 70, description: 'High brightness moisture-resistant vanity lighting', recommendedType: 'IP-Rated Downlights, Mirror Profile Lights', ambientPct: 50, taskPct: 50 },
  { id: 'outdoor', name: 'Outdoor & Facade', fcMin: 10, fcMax: 20, description: 'Weatherproof accent & safety illumination', recommendedType: 'Facade Up-down Lights, Garden Spike Spotlights', ambientPct: 80, taskPct: 20 },
];

export const RoomCalculatorModal: React.FC<RoomCalculatorModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToQuote,
  quoteCartIds,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('living');
  const [lengthFt, setLengthFt] = useState<number>(14);
  const [widthFt, setWidthFt] = useState<number>(12);
  const [ceilingHeight, setCeilingHeight] = useState<'standard' | 'high'>('standard');
  const [wallColor, setWallColor] = useState<'light' | 'medium' | 'dark'>('light');
  const [fixtureWattage, setFixtureWattage] = useState<number>(12); // e.g. 12W LED downlights

  // Matching light products from catalog
  const matchingProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      if (p.type !== 'light') return false;
      const tagsStr = Array.isArray(p.tags) ? p.tags.join(' ') : '';
      const lowerCat = ((p.category || '') + ' ' + (p.title || '') + ' ' + tagsStr).toLowerCase();
      if (selectedRoom === 'living' && (lowerCat.includes('chandelier') || lowerCat.includes('crystal') || lowerCat.includes('spotlight') || lowerCat.includes('pendant'))) return true;
      if (selectedRoom === 'bedroom' && (lowerCat.includes('pendant') || lowerCat.includes('sconce') || lowerCat.includes('hanging') || lowerCat.includes('panel'))) return true;
      if (selectedRoom === 'kitchen' && (lowerCat.includes('panel') || lowerCat.includes('profile') || lowerCat.includes('track') || lowerCat.includes('led'))) return true;
      if (selectedRoom === 'office' && (lowerCat.includes('track') || lowerCat.includes('spotlight') || lowerCat.includes('panel'))) return true;
      if (selectedRoom === 'outdoor' && (lowerCat.includes('outdoor') || lowerCat.includes('landscape') || lowerCat.includes('sconce'))) return true;
      return true;
    }).slice(0, 4);

    if (filtered.length > 0) return filtered;
    return products.filter((p) => p.type === 'light').slice(0, 4);
  }, [products, selectedRoom]);

  if (!isOpen) return null;

  const roomConfig = ROOM_TYPES.find((r) => r.id === selectedRoom) || ROOM_TYPES[0];

  // Calculations
  const areaSqFt = Math.max(1, lengthFt * widthFt);
  
  // Reflection multiplier based on wall colors
  const colorMultiplier = wallColor === 'light' ? 1.0 : wallColor === 'medium' ? 1.15 : 1.35;
  const heightMultiplier = ceilingHeight === 'standard' ? 1.0 : 1.25;

  const targetFC = (roomConfig.fcMin + roomConfig.fcMax) / 2;
  const totalLumensNeeded = Math.round(areaSqFt * targetFC * colorMultiplier * heightMultiplier);
  
  // LED Efficiency ~90 lumens/watt average
  const totalWattsNeeded = Math.round(totalLumensNeeded / 90);
  
  // Recommended quantity of chosen fixture wattage
  const recommendedFixturesCount = Math.max(1, Math.round(totalWattsNeeded / fixtureWattage));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
              <Calculator className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Room Lighting & Lumens Calculator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculate required lumens, wattage, and recommended fixtures for any space
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Grid Content */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column (Left) */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Room Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                1. Select Room Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ROOM_TYPES.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex flex-col justify-between ${
                      selectedRoom === room.id
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span>{room.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal mt-1">{room.fcMin}-{room.fcMax} Foot-candles</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Room Dimensions */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                2. Room Dimensions (Feet)
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Length: {lengthFt} ft</span>
                  <input
                    type="range"
                    min="6"
                    max="50"
                    value={lengthFt}
                    onChange={(e) => setLengthFt(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>

                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Width: {widthFt} ft</span>
                  <input
                    type="range"
                    min="6"
                    max="50"
                    value={widthFt}
                    onChange={(e) => setWidthFt(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
                <span>Calculated Floor Area:</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400">{areaSqFt} sq. ft. (~{(areaSqFt * 0.092903).toFixed(1)} m²)</span>
              </div>
            </div>

            {/* Ceiling & Wall Adjustments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ceiling Height
                </label>
                <select
                  value={ceilingHeight}
                  onChange={(e) => setCeilingHeight(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="standard">Standard (8ft - 10ft)</option>
                  <option value="high">High Ceiling (10ft - 14ft+)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Wall & Ceiling Shade
                </label>
                <select
                  value={wallColor}
                  onChange={(e) => setWallColor(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="light">Light / White (High Reflectivity)</option>
                  <option value="medium">Medium Colors (Neutral)</option>
                  <option value="dark">Dark / Wood Tones (Absorptive)</option>
                </select>
              </div>
            </div>

            {/* Fixture Wattage Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred Fixture Wattage (e.g. per LED Downlight/COB)
              </label>
              <div className="flex items-center gap-2">
                {[7, 12, 18, 24, 36].map((watts) => (
                  <button
                    key={watts}
                    onClick={() => setFixtureWattage(watts)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fixtureWattage === watts
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {watts}W
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Results & Product Suggestions Column (Right) */}
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
            
            {/* Calculation Cards */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-900/5 dark:from-amber-950/40 dark:to-slate-900 border border-amber-500/30 rounded-3xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Lighting Recommendation
                </span>
                <span className="text-xs font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full">
                  {roomConfig.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-amber-500/20">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Total Lumens Required</span>
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {totalLumensNeeded.toLocaleString('en-IN')} <span className="text-xs font-bold">lm</span>
                  </span>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-amber-500/20">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Estimated LED Power</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    ~{totalWattsNeeded} <span className="text-xs font-bold">Watts</span>
                  </span>
                </div>
              </div>

              {/* Quantity Breakdown */}
              <div className="bg-amber-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
                <div>
                  <span className="text-xs opacity-90 font-medium block">Suggested Fixture Setup</span>
                  <span className="text-lg font-extrabold">
                    {recommendedFixturesCount} × {fixtureWattage}W LED Fixtures
                  </span>
                </div>
                <Lightbulb className="w-8 h-8 opacity-90" />
              </div>

              {/* Layer Guidance */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                💡 <strong>Design Advice:</strong> Blend {roomConfig.ambientPct}% ambient background light with {roomConfig.taskPct}% dedicated accent/task fixtures ({roomConfig.recommendedType}).
              </p>
            </div>

            {/* Suggested Catalog Products */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Light House Products</span>
                <span className="text-amber-600 dark:text-amber-400 text-[11px] normal-case">Top Choices</span>
              </h3>

              <div className="grid grid-cols-2 gap-2.5">
                {matchingProducts.map((p) => {
                  const isInCart = quoteCartIds.includes(p.id);
                  return (
                    <div 
                      key={p.id}
                      className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-2 group"
                    >
                      <div className="flex gap-2.5 items-center">
                        <img src={p.imageUrl} alt={p.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600">{p.title}</p>
                          <p className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                            ₹{(p.discountPrice || p.originalPrice).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToQuote(p)}
                        className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isInCart
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-600 hover:bg-amber-500 text-white'
                        }`}
                      >
                        {isInCart ? <Check className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                        <span>{isInCart ? 'In Quote List' : '+ Add to Quote'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
