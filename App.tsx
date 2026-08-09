import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, ShieldCheck, Lock, X, RefreshCw, Upload, 
  Lightbulb, Zap, DollarSign, Tag, Check, Image as ImageIcon, AlertCircle
} from 'lucide-react';
import { Product, ProductType, ShopOrigin, StockStatus } from '../types';
import { LIGHT_CATEGORIES, APPLIANCE_CATEGORIES } from '../data/initialData';

interface AdminPortalProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetData: () => void;
  isOpen: boolean;
  onClose: () => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetData,
  isOpen,
  onClose,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
}) => {
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState<ProductType>('light');
  const [shopOrigin, setShopOrigin] = useState<ShopOrigin>('lighthouse');
  const [category, setCategory] = useState(LIGHT_CATEGORIES[1]);
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [discountPrice, setDiscountPrice] = useState<string>('');
  const [stockStatus, setStockStatus] = useState<StockStatus>('in_stock');
  const [stockQuantity, setStockQuantity] = useState<string>('10');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [specWattage, setSpecWattage] = useState('');
  const [specMaterial, setSpecMaterial] = useState('');
  const [specWarranty, setSpecWarranty] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const [filterShop, setFilterShop] = useState<ShopOrigin | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1234' || passcode === 'admin' || passcode === 'admin123') {
      setIsAdminLoggedIn(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Incorrect Passcode. Try 1234 or click Quick Login.');
    }
  };

  const handleQuickLogin = () => {
    setIsAdminLoggedIn(true);
    setPasscodeError('');
  };

  const resetForm = () => {
    setTitle('');
    setBrand('');
    setType('light');
    setShopOrigin('lighthouse');
    setCategory(LIGHT_CATEGORIES[1]);
    setOriginalPrice('');
    setDiscountPrice('');
    setStockStatus('in_stock');
    setStockQuantity('10');
    setImageUrl('');
    setDescription('');
    setSpecWattage('');
    setSpecMaterial('');
    setSpecWarranty('');
    setTagsInput('');
    setEditingProduct(null);
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setBrand(prod.brand);
    setType(prod.type);
    setShopOrigin(prod.shopOrigin);
    setCategory(prod.category);
    setOriginalPrice(prod.originalPrice.toString());
    setDiscountPrice(prod.discountPrice ? prod.discountPrice.toString() : '');
    setStockStatus(prod.stockStatus);
    setStockQuantity(prod.stockQuantity.toString());
    setImageUrl(prod.imageUrl);
    setDescription(prod.description);
    
    // Find specs
    const w = prod.specifications.find(s => s.label.toLowerCase().includes('wattage') || s.label.toLowerCase().includes('capacity'))?.value || '';
    const m = prod.specifications.find(s => s.label.toLowerCase().includes('material') || s.label.toLowerCase().includes('finish'))?.value || '';
    const war = prod.specifications.find(s => s.label.toLowerCase().includes('warranty'))?.value || '';
    setSpecWattage(w);
    setSpecMaterial(m);
    setSpecWarranty(war);

    setTagsInput(prod.tags ? prod.tags.join(', ') : '');
    setActiveTab('add');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !originalPrice) {
      alert('Please provide at least a Title and Original Price.');
      return;
    }

    const origP = parseFloat(originalPrice);
    const discP = discountPrice ? parseFloat(discountPrice) : undefined;

    // Default image if missing
    let finalImg = imageUrl.trim();
    if (!finalImg) {
      finalImg =
        shopOrigin === 'lighthouse'
          ? 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80';
    }

    const specifications = [];
    if (specWattage) specifications.push({ label: type === 'light' ? 'Wattage' : 'Capacity / Power', value: specWattage });
    if (specMaterial) specifications.push({ label: 'Material / Finish', value: specMaterial });
    if (specWarranty) specifications.push({ label: 'Warranty', value: specWarranty });
    if (specifications.length === 0) {
      specifications.push({ label: 'Origin', value: shopOrigin === 'lighthouse' ? 'Light House Showroom' : 'Electrical Shop Hub' });
    }

    const tagsArr = tagsInput
      ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      : ['New Arrival'];

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        title,
        brand: brand || (shopOrigin === 'lighthouse' ? 'Lumina Lux' : 'PowerTech'),
        type,
        shopOrigin,
        category,
        originalPrice: origP,
        discountPrice: discP,
        stockStatus,
        stockQuantity: parseInt(stockQuantity) || 5,
        imageUrl: finalImg,
        description: description || `${title} available at discount prices at our ${shopOrigin === 'lighthouse' ? 'Light House' : 'Electrical Shop'} showroom.`,
        specifications,
        tags: tagsArr,
        updatedAt: new Date().toISOString(),
      };
      onUpdateProduct(updated);
      setNotification(`Updated "${title}" successfully!`);
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        title,
        brand: brand || (shopOrigin === 'lighthouse' ? 'Lumina Lux' : 'PowerTech'),
        type,
        shopOrigin,
        category,
        originalPrice: origP,
        discountPrice: discP,
        isFeatured: true,
        stockStatus,
        stockQuantity: parseInt(stockQuantity) || 10,
        imageUrl: finalImg,
        description: description || `${title} available at discount prices at our ${shopOrigin === 'lighthouse' ? 'Light House' : 'Electrical Shop'} showroom.`,
        specifications,
        tags: tagsArr,
        rating: 5.0,
        reviewsCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAddProduct(newProd);
      setNotification(`Added new product "${title}" to catalog!`);
    }

    resetForm();
    setTimeout(() => setNotification(null), 4000);
  };

  const sampleImages = shopOrigin === 'lighthouse' 
    ? [
        { label: 'Pendant Lamp', url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80' },
        { label: 'Chandelier', url: 'https://images.unsplash.com/photo-1543198181-e619b695113c?auto=format&fit=crop&w=800&q=80' },
        { label: 'Track Light', url: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80' },
        { label: 'Wall Sconce', url: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80' },
      ]
    : [
        { label: 'Air Conditioner', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80' },
        { label: 'Refrigerator', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80' },
        { label: 'Ceiling Fan', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80' },
        { label: 'Washing Machine', url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80' },
      ];

  const filteredProducts = products.filter((p) => {
    const matchesShop = filterShop === 'all' || p.shopOrigin === filterShop;
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesShop && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg overflow-y-auto">
      <div 
        className="glass-panel w-full max-w-4xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative my-6 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Owner & Admin Management Portal</h2>
              <p className="text-xs text-gray-400">Upload and adjust lights & appliance prices and catalog</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Login Gate */}
        {!isAdminLoggedIn ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Admin Authentication Required</h3>
              <p className="text-xs text-gray-400 mt-1">
                Enter your owner passcode to manage inventory, discount prices, and upload images.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter passcode (e.g. 1234)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-center font-bold tracking-widest text-lg glass-input"
                />
                {passcodeError && (
                  <p className="text-xs text-amber-500 mt-2 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {passcodeError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl glass-button-primary font-bold text-sm"
              >
                Authenticate Passcode
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickLogin}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                >
                  Click Here for Instant Demo Admin Access &rarr;
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Content */
          <div className="p-6 space-y-6">
            
            {/* Notification Banner */}
            {notification && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{notification}</span>
              </div>
            )}

            {/* Portal Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setActiveTab('add'); resetForm(); }}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    activeTab === 'add' && !editingProduct
                      ? 'bg-amber-600 text-white shadow-lg border border-amber-500/40'
                      : 'glass-button-secondary text-gray-300'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload New Product</span>
                </button>

                <button
                  onClick={() => setActiveTab('list')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    activeTab === 'list'
                      ? 'bg-amber-600 text-white shadow-lg border border-amber-500/40'
                      : 'glass-button-secondary text-gray-300'
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Catalog List ({products.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onResetData}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white glass-button-secondary flex items-center gap-1"
                  title="Reset to sample products"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Default Data
                </button>
                <button
                  onClick={() => setIsAdminLoggedIn(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* TAB 1: ADD OR EDIT PRODUCT */}
            {activeTab === 'add' && (
              <form onSubmit={handleSubmit} className="space-y-5 max-h-[65vh] overflow-y-auto pr-2">
                
                {editingProduct && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs flex items-center justify-between">
                    <span>Editing Product: <strong>{editingProduct.title}</strong></span>
                    <button type="button" onClick={resetForm} className="underline text-gray-300">Cancel Edit</button>
                  </div>
                )}

                {/* Shop Origin & Product Type Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Select Target Shop</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShopOrigin('lighthouse');
                          setType('light');
                          setCategory(LIGHT_CATEGORIES[1]);
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                          shopOrigin === 'lighthouse'
                            ? 'bg-amber-600 border-amber-500 text-white'
                            : 'glass-button-secondary text-gray-400'
                        }`}
                      >
                        <Lightbulb className="w-4 h-4 text-amber-500" /> Light House
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShopOrigin('electrical_shop');
                          setType('appliance');
                          setCategory(APPLIANCE_CATEGORIES[1]);
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                          shopOrigin === 'electrical_shop'
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'glass-button-secondary text-gray-400'
                        }`}
                      >
                        <Zap className="w-4 h-4 text-blue-500" /> Electrical Shop
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Product Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl text-xs glass-input text-white focus:outline-none"
                    >
                      {(shopOrigin === 'lighthouse' ? LIGHT_CATEGORIES : APPLIANCE_CATEGORIES)
                        .filter((c) => !c.startsWith('All'))
                        .map((cat, idx) => (
                          <option key={idx} value={cat} className="bg-gray-900 text-white">
                            {cat}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Title & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-300 mb-1">Product Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Imperial K9 Crystal Chandelier 12-Arm"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl text-xs glass-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Glow / LG / Voltas"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full p-2.5 rounded-xl text-xs glass-input"
                    />
                  </div>
                </div>

                {/* Price Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Original Price (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-gray-400">₹</span>
                      <input
                        type="number"
                        placeholder="45000"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 rounded-xl text-xs glass-input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-500 mb-1">Discount Price (₹) [Optional]</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-amber-500">₹</span>
                      <input
                        type="number"
                        placeholder="32999"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 rounded-xl text-xs glass-input border-amber-500/50 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-400 mb-1">Savings Preview</label>
                    <div className="p-2 text-xs font-bold text-emerald-300 pt-3">
                      {originalPrice && discountPrice && parseFloat(originalPrice) > parseFloat(discountPrice) ? (
                        <span>
                          Save ₹{(parseFloat(originalPrice) - parseFloat(discountPrice)).toLocaleString('en-IN')} (
                          {Math.round(
                            ((parseFloat(originalPrice) - parseFloat(discountPrice)) / parseFloat(originalPrice)) * 100
                          )}
                          % OFF)
                        </span>
                      ) : (
                        <span className="text-gray-500 font-normal">No discount active</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image URL & Presets */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Product Image URL</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full p-2.5 rounded-xl text-xs glass-input"
                    />
                  </div>

                  {/* Preset quick image buttons */}
                  <div className="flex items-center gap-2 overflow-x-auto pt-1">
                    <span className="text-[11px] text-gray-400 whitespace-nowrap">Quick Image Presets:</span>
                    {sampleImages.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(s.url)}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 whitespace-nowrap"
                      >
                        + {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description & Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Product Description</label>
                    <textarea
                      rows={3}
                      placeholder="Enter highlights, finishes, recommended installation settings..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2.5 rounded-xl text-xs glass-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Quick Specifications</label>
                    <input
                      type="text"
                      placeholder={type === 'light' ? 'Wattage (e.g. 45W Warm White)' : 'Capacity (e.g. 1.5 Ton 5-Star)'}
                      value={specWattage}
                      onChange={(e) => setSpecWattage(e.target.value)}
                      className="w-full p-2 rounded-xl text-xs glass-input"
                    />
                    <input
                      type="text"
                      placeholder="Material / Finish (e.g. Anodized Brass / Copper Coil)"
                      value={specMaterial}
                      onChange={(e) => setSpecMaterial(e.target.value)}
                      className="w-full p-2 rounded-xl text-xs glass-input"
                    />
                    <input
                      type="text"
                      placeholder="Warranty (e.g. 2 Years Manufacturer Warranty)"
                      value={specWarranty}
                      onChange={(e) => setSpecWarranty(e.target.value)}
                      className="w-full p-2 rounded-xl text-xs glass-input"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl glass-button-primary text-black font-extrabold text-sm shadow-xl flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{editingProduct ? 'Save Product Changes' : 'Upload Product to Showroom Portfolio'}</span>
                  </button>
                </div>

              </form>
            )}

            {/* TAB 2: MANAGE LIST */}
            {activeTab === 'list' && (
              <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 p-2 rounded-xl text-xs glass-input"
                  />

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-gray-400">Filter Shop:</span>
                    <button
                      onClick={() => setFilterShop('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        filterShop === 'all' ? 'bg-white/20 text-white' : 'text-gray-400'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterShop('lighthouse')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        filterShop === 'lighthouse' ? 'bg-amber-600 text-white' : 'text-gray-400'
                      }`}
                    >
                      Light House
                    </button>
                    <button
                      onClick={() => setFilterShop('electrical_shop')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        filterShop === 'electrical_shop' ? 'bg-blue-600 text-white' : 'text-gray-400'
                      }`}
                    >
                      Electrical Shop
                    </button>
                  </div>
                </div>

                {/* Table of Products */}
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/40 text-xs">
                  <div className="divide-y divide-white/10">
                    {filteredProducts.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">No products match your filter criteria.</div>
                    ) : (
                      filteredProducts.map((p) => {
                        const hasDisc = p.discountPrice && p.discountPrice < p.originalPrice;
                        return (
                          <div key={p.id} className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                            
                            <div className="flex items-center gap-3">
                              <img
                                src={p.imageUrl}
                                alt={p.title}
                                className="w-12 h-12 rounded-xl object-cover border border-white/10"
                              />
                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  {p.shopOrigin === 'lighthouse' ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-600 text-white">
                                      Light House
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white">
                                      Electrical Shop
                                    </span>
                                  )}
                                  <span className="text-gray-400">{p.category}</span>
                                </div>
                                <h4 className="font-bold text-white text-sm">{p.title}</h4>
                                <span className="text-[11px] text-gray-400">{p.brand}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                              <div className="text-left sm:text-right">
                                <div className="font-extrabold text-sm text-white">
                                  ₹{(p.discountPrice || p.originalPrice).toLocaleString('en-IN')}
                                </div>
                                {hasDisc && (
                                  <div className="text-[10px] text-gray-400 line-through">
                                    ₹{p.originalPrice.toLocaleString('en-IN')}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleStartEdit(p)}
                                  className="p-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white border border-amber-500/40"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                                      onDeleteProduct(p.id);
                                    }
                                  }}
                                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
