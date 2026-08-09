import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, Zap, Tag, Sparkles, Filter, SlidersHorizontal, 
  Search, ShieldCheck, ShoppingBag, MapPin, Store, CheckCircle 
} from 'lucide-react';
import { Product, ProductType, ShopOrigin, QuoteItem } from './types';
import { INITIAL_PRODUCTS, LIGHT_CATEGORIES, APPLIANCE_CATEGORIES } from './data/initialData';
import { Header, ThemeMode } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminPortal } from './components/AdminPortal';
import { QuoteCartDrawer } from './components/QuoteCartDrawer';
import { StoreLocationsSection } from './components/StoreLocationsSection';
import { Footer } from './components/Footer';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('lighthouse_theme_v3');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('lighthouse_theme_v3', theme);
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light-showroom' : 'dark-obsidian');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Local Storage for Products Catalog
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('lighthouse_products_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved products:', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Local Storage for Quote Cart
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('lighthouse_quote_cart_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse quote cart:', e);
    }
    return [];
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('lighthouse_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lighthouse_quote_cart_v2', JSON.stringify(quoteItems));
  }, [quoteItems]);

  // Filtering & Search State
  const [selectedShop, setSelectedShop] = useState<ShopOrigin | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'discount'>('featured');
  
  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'catalog' | 'stores'>('catalog');
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState<boolean>(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Cart Handlers
  const handleAddToQuote = (product: Product) => {
    setQuoteItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsQuoteDrawerOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromQuote(productId);
      return;
    }
    setQuoteItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromQuote = (productId: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setQuoteItems([]);
  };

  // Product Catalog Handlers (Admin)
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleResetData = () => {
    if (confirm('Reset catalog back to initial showroom defaults? Any custom added items will be restored.')) {
      setProducts(INITIAL_PRODUCTS);
      localStorage.removeItem('lighthouse_products_v2');
    }
  };

  // Active Category Options depending on selected shop
  const activeCategoryList =
    selectedShop === 'lighthouse'
      ? LIGHT_CATEGORIES
      : selectedShop === 'electrical_shop'
      ? APPLIANCE_CATEGORIES
      : ['All Categories', ...LIGHT_CATEGORIES.filter((c) => !c.startsWith('All')), ...APPLIANCE_CATEGORIES.filter((c) => !c.startsWith('All'))];

  // Filtered & Sorted Products
  const filteredProducts = products.filter((product) => {
    // Shop filter
    if (selectedShop !== 'all' && product.shopOrigin !== selectedShop) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && selectedCategory !== 'All Categories') {
      if (product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
    }

    // Discount filter
    if (onlyDiscounted) {
      const hasDiscount = product.discountPrice && product.discountPrice < product.originalPrice;
      if (!hasDiscount) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchTags = product.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchBrand && !matchCategory && !matchDesc && !matchTags) {
        return false;
      }
    }

    return true;
  });

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.originalPrice;
    const priceB = b.discountPrice || b.originalPrice;

    if (sortBy === 'price_low') return priceA - priceB;
    if (sortBy === 'price_high') return priceB - priceA;
    if (sortBy === 'discount') {
      const discA = a.discountPrice ? a.originalPrice - a.discountPrice : 0;
      const discB = b.discountPrice ? b.originalPrice - b.discountPrice : 0;
      return discB - discA;
    }
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const totalQuoteCount = quoteItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 selection:bg-blue-600 selection:text-white ${
      theme === 'light' 
        ? 'bg-slate-50 text-slate-900' 
        : 'bg-[#080C14] text-gray-100'
    }`}>
      
      {/* Glassmorphic Header */}
      <Header
        selectedShop={selectedShop}
        onSelectShop={(shop) => {
          setSelectedShop(shop);
          setSelectedCategory('all');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        quoteCount={totalQuoteCount}
        onOpenQuoteDrawer={() => setIsQuoteDrawerOpen(true)}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        onChangeTheme={setTheme}
      />

      <main className="flex-1">
        {/* Main Hero Header */}
        <HeroBanner
          onSelectShop={(shop) => {
            setSelectedShop(shop);
            setSelectedCategory('all');
            setActiveTab('catalog');
          }}
          onOpenAdmin={() => setIsAdminPortalOpen(true)}
        />

        {/* Content View Switcher */}
        {activeTab === 'stores' ? (
          <StoreLocationsSection />
        ) : (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5">
            
            {/* Filter & Controls Bar - Uncluttered, Spacious, & Modern */}
            <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                
                {/* Shop Origin Selector Tabs */}
                <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl inline-flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => {
                      setSelectedShop('all');
                      setSelectedCategory('all');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      selectedShop === 'all'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-extrabold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>All Items ({products.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedShop('lighthouse');
                      setSelectedCategory('all');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      selectedShop === 'lighthouse'
                        ? 'bg-amber-600 text-white shadow-sm font-extrabold'
                        : 'text-amber-700 dark:text-amber-400 hover:bg-amber-200/50 dark:hover:bg-amber-950/40'
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Light House</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedShop('electrical_shop');
                      setSelectedCategory('all');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      selectedShop === 'electrical_shop'
                        ? 'bg-blue-600 text-white shadow-sm font-extrabold'
                        : 'text-blue-700 dark:text-blue-400 hover:bg-blue-200/50 dark:hover:bg-blue-950/40'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Electrical Shop</span>
                  </button>
                </div>

                {/* Additional Toggles & Sorting */}
                <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                  
                  {/* Only Discounted Toggle */}
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 cursor-pointer px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:border-emerald-500 transition-all">
                    <input
                      type="checkbox"
                      checked={onlyDiscounted}
                      onChange={(e) => setOnlyDiscounted(e.target.checked)}
                      className="rounded accent-emerald-600 w-3.5 h-3.5 cursor-pointer"
                    />
                    <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="whitespace-nowrap">Discount Offers Only</span>
                  </label>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer text-slate-800 dark:text-slate-200"
                    >
                      <option value="featured">Sort: Featured</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="discount">Biggest Discount</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* Category Pills Bar */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
                <span className="text-slate-400 dark:text-slate-500 font-bold text-[11px] shrink-0 mr-1 uppercase tracking-wider">Category:</span>
                
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                    selectedCategory === 'all'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All Categories
                </button>

                {activeCategoryList
                  .filter((cat) => !cat.startsWith('All'))
                  .map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
              </div>

            </div>

            {/* Products Grid Header */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Showing {sortedProducts.length} product(s)
                {selectedShop !== 'all' && ` for ${selectedShop === 'lighthouse' ? 'Light House' : 'Electrical Shop'}`}
                {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
                >
                  Clear search "{searchQuery}"
                </button>
              )}
            </div>

            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
              <div className="glass-panel p-12 rounded-3xl text-center space-y-4 my-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Products Found</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  No items match your active filters or search query. Try switching shop categories or resetting the search bar.
                </p>
                <button
                  onClick={() => {
                    setSelectedShop('all');
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setOnlyDiscounted(false);
                  }}
                  className="px-4 py-2 rounded-xl glass-button-primary font-bold text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => {
                  const isInCart = quoteItems.some((item) => item.product.id === product.id);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setSelectedProductModal(p)}
                      onAddToQuote={handleAddToQuote}
                      isInQuoteCart={isInCart}
                      isAdminLoggedIn={isAdminLoggedIn}
                      onEditProduct={() => setIsAdminPortalOpen(true)}
                    />
                  );
                })}
              </div>
            )}

          </section>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectShop={(shop) => {
          setSelectedShop(shop);
          setSelectedCategory('all');
          setActiveTab('catalog');
        }}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
        onAddToQuote={handleAddToQuote}
        isInQuoteCart={
          selectedProductModal
            ? quoteItems.some((item) => item.product.id === selectedProductModal.id)
            : false
        }
      />

      <QuoteCartDrawer
        isOpen={isQuoteDrawerOpen}
        onClose={() => setIsQuoteDrawerOpen(false)}
        quoteItems={quoteItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromQuote}
        onClearCart={handleClearCart}
      />

      <AdminPortal
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetData={handleResetData}
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />

    </div>
  );
}
