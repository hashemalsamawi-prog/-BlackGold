import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, Search, Sparkles, User, MapPin, Truck, ShieldAlert, 
  Globe, Smartphone, Layers, Flame, Menu, X, Check, ChevronLeft,
  Sun, Moon, MessageSquare, Home, ChevronDown, Award, Store, Tag,
  SlidersHorizontal, ArrowUpDown, Filter, RotateCcw, TrendingUp, Sparkle
} from 'lucide-react';
import { Language, Product, ThemeMode, ProductSortOption } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  lang: Language;
  onLanguageToggle: () => void;
  deviceMode: 'web' | 'android';
  onDeviceModeToggle: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenMap: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  onOpenMandoub: () => void;
  onOpenAiAdvisor: () => void;
  onOpenAuth: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  minPrice?: number | '';
  setMinPrice?: (val: number | '') => void;
  maxPrice?: number | '';
  setMaxPrice?: (val: number | '') => void;
  sortBy?: ProductSortOption;
  setSortBy?: (sort: ProductSortOption) => void;
  onResetFilters?: () => void;
  userName?: string;
  userRole?: 'customer' | 'owner' | 'mandoub';
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  storeSettings?: any;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageToggle,
  deviceMode,
  onDeviceModeToggle,
  cartCount,
  onOpenCart,
  onOpenMap,
  onOpenOrders,
  onOpenAdmin,
  onOpenMandoub,
  onOpenAiAdvisor,
  onOpenAuth,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  minPrice = '',
  setMinPrice,
  maxPrice = '',
  setMaxPrice,
  sortBy = 'popular',
  setSortBy,
  onResetFilters,
  userName = '',
  userRole = 'customer',
  products = [],
  onSelectProduct,
  storeSettings,
  theme = 'dark',
  onToggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [showPriceFilterPanel, setShowPriceFilterPanel] = useState(false);
  
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchDropdownRef = useRef<HTMLDivElement>(null);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);

  const isPriceFilterActive = (minPrice !== '' && minPrice !== undefined) || (maxPrice !== '' && maxPrice !== undefined);
  const isSortActive = sortBy !== 'popular';
  const activeFiltersCount = (isPriceFilterActive ? 1 : 0) + (isSortActive ? 1 : 0) + (searchQuery.trim() ? 1 : 0);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
        setShowPriceFilterPanel(false);
      }
      if (mobileSearchDropdownRef.current && !mobileSearchDropdownRef.current.contains(event.target as Node)) {
        setIsMobileSearchFocused(false);
      }
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products based on search query, price range, and sorting
  const matchingProducts = products
    .filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesText = !q || (
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.descriptionAr.toLowerCase().includes(q) ||
        p.descriptionEn.toLowerCase().includes(q) ||
        (p.features && p.features.some(f => f.toLowerCase().includes(q))) ||
        (p.weightOptions && p.weightOptions.some(w => w.weight.toLowerCase().includes(q)))
      );
      const matchesMin = minPrice === '' || minPrice === undefined || p.price >= Number(minPrice);
      const matchesMax = maxPrice === '' || maxPrice === undefined || p.price <= Number(maxPrice);
      return matchesText && matchesMin && matchesMax;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      if (sortBy === 'newest') {
        return b.id.localeCompare(a.id);
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      return 0;
    });

  const handleProductClick = (product: Product) => {
    setIsSearchFocused(false);
    setIsMobileSearchFocused(false);
    setShowPriceFilterPanel(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    }
    setActiveCategory(product.category);
    // Smooth scroll to product grid
    const el = document.getElementById('products-grid-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePricePreset = (min: number | '', max: number | '') => {
    if (setMinPrice) setMinPrice(min);
    if (setMaxPrice) setMaxPrice(max);
  };

  const handleReset = () => {
    if (setSearchQuery) setSearchQuery('');
    if (setMinPrice) setMinPrice('');
    if (setMaxPrice) setMaxPrice('');
    if (setSortBy) setSortBy('popular');
    if (onResetFilters) onResetFilters();
  };

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCategoriesDropdownOpen(false);
    setMobileMenuOpen(false);
    if (searchQuery) setSearchQuery('');
    const el = document.getElementById('products-grid-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const categoriesList = [
    { 
      id: 'all', 
      nameAr: 'جميع المنتجات والعبوات', 
      nameEn: 'All Products', 
      icon: '✨', 
      descAr: 'استعراض كامل تشكيلة الفحم الملكي والبلدي والجملة',
      badge: 'الكل'
    },
    { 
      id: 'premium', 
      nameAr: 'الفحم الملكي الفاخر (Zipper)', 
      nameEn: 'Premium Zipper Line', 
      icon: '👑', 
      descAr: 'أكياس محكمة الغلق 250g، 500g، 1kg مع (+10g مجاناً)',
      badge: 'الأكثر طلباً'
    },
    { 
      id: 'local', 
      nameAr: 'الفحم البلدي الاقتصادي', 
      nameEn: 'Standard Local Charcoal', 
      icon: '🔥', 
      descAr: 'فحم نباتي طبيعي مغربل ميكانيكياً للاستخدام اليومي',
      badge: 'اقتصادي'
    },
    { 
      id: 'wholesale', 
      nameAr: 'قسم الجملة والتوريد (B2B)', 
      nameEn: 'Wholesale & Stores', 
      icon: '📦', 
      descAr: 'صناديق نقاط البيع وتجهيز البقالات وشوالات المطاعم 20kg',
      badge: 'أسعار خاصة'
    },
    { 
      id: 'bbq', 
      nameAr: 'مكعبات ومستلزمات الإشعال', 
      nameEn: 'Ignition Cubes & Tools', 
      icon: '⚡', 
      descAr: 'مكعبات إشعال فورية آمنة وبدون روائح تدوم طويلاً',
      badge: 'سريع'
    }
  ];

  const quickSearchTags = [
    { label: '👑 فحم فاخر 250g', query: '250g' },
    { label: '👑 فحم فاخر 500g', query: '500g' },
    { label: '🔥 فحم بلدي اقتصادي', query: 'بلدي' },
    { label: '📦 كرتون جملة 10kg', query: 'جملة' },
    { label: '⚡ مكعبات إشعال', query: 'إشعال' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0D0D12]/95 backdrop-blur-md border-b border-slate-200 dark:border-amber-500/20 shadow-sm transition-colors">
      
      {/* Top Banner Notice with Live Status */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 px-4 py-1.5 text-xs sm:text-sm font-bold text-center flex items-center justify-between shadow-sm">
        <div className="hidden lg:flex items-center gap-2 text-slate-950 font-extrabold text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping" />
          <span>🟢 المتجر متاح للطلب الآن بصنعاء</span>
        </div>

        <div className="flex items-center justify-center gap-2 mx-auto">
          <Flame className="w-4 h-4 animate-bounce text-slate-950" />
          <span>
            {storeSettings?.topBannerNoticeAr || (lang === 'ar' 
              ? '🔥 خدمة التوصيل السريع داخل العاصمة صنعاء خلال 45 دقيقة - الدفع عند الاستلام أو عبر حاسب / الكريمي' 
              : '🔥 Express delivery within Sanaa in 45 mins - Cash on delivery & Bank transfers')}
          </span>
          <span className="hidden sm:inline bg-black/20 text-black px-2 py-0.5 rounded text-xs font-black">
            كوبون: {storeSettings?.defaultCouponCode || 'GOLD10'}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-slate-950 text-[11px] font-bold">
          <span>📞 خدمة العملاء: 775000150</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 group text-right focus:outline-none cursor-pointer"
            >
              <Logo 
                variant="horizontal" 
                size="md" 
                customLogoUrl={storeSettings?.customLogoUrl} 
                titleAr={storeSettings?.logoText || storeSettings?.storeNameAr} 
              />
            </button>
          </div>

          {/* Search Bar with Interactive Dropdown & Price Filter & Sorting - Desktop */}
          <div ref={searchDropdownRef} className="hidden lg:flex flex-1 max-w-lg relative">
            <div className="w-full flex items-center relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder={lang === 'ar' ? 'ابحث عن فحم بلدي، عبوة 250جم، 500جم، فحم فاخر...' : 'Search local charcoal, 250g, 500g, premium...'}
                className="w-full bg-slate-100 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-xs sm:text-sm rounded-xl py-2.5 pr-10 pl-24 border border-slate-300 dark:border-slate-800 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
              />
              <Search className="w-4 h-4 text-amber-400 absolute right-3.5 pointer-events-none" />
              
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute left-20 text-xs text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
                  title="مسح البحث"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Filter & Sort Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  setIsSearchFocused(true);
                  setShowPriceFilterPanel(!showPriceFilterPanel);
                }}
                className={`absolute left-1.5 top-1.5 bottom-1.5 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeFiltersCount > 0
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
                title="تصفية نطاق السعر وترتيب المنتجات"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تصفية' : 'Filter'}</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] flex items-center justify-center font-black">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Desktop Search & Filter Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#12121A] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-right">
                
                {/* Header info & active filters summary */}
                <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-amber-400" />
                      <span>نتائج التصفية ({matchingProducts.length})</span>
                    </span>
                    {sortBy === 'popular' && (
                      <span className="text-[10px] text-amber-400/90 font-medium">🔥 الأكثر طلباً</span>
                    )}
                    {sortBy === 'newest' && (
                      <span className="text-[10px] text-blue-400 font-medium">🆕 الأحدث وصولاً</span>
                    )}
                    {sortBy === 'price-asc' && (
                      <span className="text-[10px] text-emerald-400 font-medium">📈 الأقل سعراً</span>
                    )}
                    {sortBy === 'price-desc' && (
                      <span className="text-[10px] text-purple-400 font-medium">📉 الأعلى سعراً</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={handleReset}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline font-bold"
                        title="إلغاء جميع الفلاتر"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>إلغاء التصفية</span>
                      </button>
                    )}
                    <button 
                      onClick={() => setIsSearchFocused(false)} 
                      className="text-slate-400 hover:text-white text-[11px] p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Filter Control Section: Sorting & Price Range */}
                <div className="p-3.5 bg-slate-900/60 border-b border-slate-800/80 space-y-3">
                  {/* Sorting Options */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                        <ArrowUpDown className="w-3 h-3 text-amber-400" />
                        <span>ترتيب المنتجات:</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                      {[
                        { id: 'popular', label: '🔥 الأكثر طلباً' },
                        { id: 'newest', label: '🆕 الأحدث وصولاً' },
                        { id: 'price-asc', label: '📈 الأقل سعراً' },
                        { id: 'price-desc', label: '📉 الأعلى سعراً' },
                        { id: 'rating', label: '⭐ الأعلى تقييماً' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSortBy && setSortBy(item.id as ProductSortOption)}
                          className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all text-center border truncate cursor-pointer ${
                            sortBy === item.id
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60 hover:border-amber-500/30'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-2 pt-1 border-t border-slate-800/60">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                        <span>💰 نطاق السعر (ريال يمني YER):</span>
                      </span>
                      {isPriceFilterActive && (
                        <button
                          onClick={() => {
                            if (setMinPrice) setMinPrice('');
                            if (setMaxPrice) setMaxPrice('');
                          }}
                          className="text-[10px] text-amber-400 hover:underline"
                        >
                          مسح نطاق السعر
                        </button>
                      )}
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => handlePricePreset('', '')}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all border ${
                          minPrice === '' && maxPrice === ''
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800/80 text-slate-400 border-slate-700/50 hover:text-white'
                        }`}
                      >
                        الكل
                      </button>
                      <button
                        onClick={() => handlePricePreset('', 1000)}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all border ${
                          minPrice === '' && Number(maxPrice) === 1000
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700/50 hover:border-amber-500/40'
                        }`}
                      >
                        أقل من 1,000 ر.ي
                      </button>
                      <button
                        onClick={() => handlePricePreset(1000, 2000)}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all border ${
                          Number(minPrice) === 1000 && Number(maxPrice) === 2000
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700/50 hover:border-amber-500/40'
                        }`}
                      >
                        1,000 - 2,000 ر.ي
                      </button>
                      <button
                        onClick={() => handlePricePreset(2000, 5000)}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all border ${
                          Number(minPrice) === 2000 && Number(maxPrice) === 5000
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700/50 hover:border-amber-500/40'
                        }`}
                      >
                        2,000 - 5,000 ر.ي
                      </button>
                      <button
                        onClick={() => handlePricePreset(5000, '')}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all border ${
                          Number(minPrice) === 5000 && maxPrice === ''
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700/50 hover:border-amber-500/40'
                        }`}
                      >
                        أكثر من 5,000 ر.ي
                      </button>
                    </div>

                    {/* Custom Min / Max Inputs */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="relative">
                        <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">من (الحد الأدنى):</span>
                        <input
                          type="number"
                          placeholder="مثال: 500"
                          value={minPrice}
                          onChange={(e) => setMinPrice && setMinPrice(e.target.value ? Number(e.target.value) : '')}
                          className="w-full bg-slate-950 text-white text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:border-amber-500 outline-none"
                        />
                      </div>
                      <div className="relative">
                        <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">إلى (الحد الأعلى):</span>
                        <input
                          type="number"
                          placeholder="مثال: 2000"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice && setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                          className="w-full bg-slate-950 text-white text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Suggestion Pills if query is empty */}
                {!searchQuery.trim() && (
                  <div className="p-2.5 border-b border-slate-800/80 bg-slate-950/40">
                    <p className="text-[10px] text-slate-400 mb-1.5 font-medium">أصناف الفحم الشائعة:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {quickSearchTags.map((tag, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery(tag.query);
                            setIsSearchFocused(true);
                          }}
                          className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/60 hover:border-amber-500/40 text-[10px] font-bold transition-all cursor-pointer"
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results List */}
                {matchingProducts.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                    {matchingProducts.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleProductClick(prod)}
                        className="p-2.5 hover:bg-amber-500/15 cursor-pointer flex items-center justify-between gap-3 group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-amber-500/40 overflow-hidden flex items-center justify-center shrink-0 p-1">
                            <img
                              src={prod.images && prod.images[0] ? prod.images[0] : ''}
                              alt={prod.nameAr}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 flex items-center gap-1.5">
                              <span>{prod.nameAr}</span>
                              {prod.isBestSeller && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  الأكثر طلباً 🔥
                                </span>
                              )}
                            </h4>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                              {prod.descriptionAr}
                            </p>
                          </div>
                        </div>
                        <div className="text-left shrink-0">
                          <span className="font-mono font-black text-amber-400 text-xs sm:text-sm block">
                            {prod.price.toLocaleString()} YER
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold">عرض المنتج 👈</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                    <p>لا توجد منتجات مطابقة للشروط المحددة</p>
                    <button
                      onClick={handleReset}
                      className="text-amber-400 underline font-bold"
                    >
                      إعادة ضبط الفلاتر وعرض الكل
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Tools & Navigation Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* AI Advisor Button - Tablet & Desktop */}
            <button
              onClick={onOpenAiAdvisor}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              title="مستشار الفحم الذكي"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{lang === 'ar' ? 'مستشار الذكاء' : 'AI Advisor'}</span>
            </button>

            {/* Android / Web Toggle - Desktop */}
            <button
              onClick={onDeviceModeToggle}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                deviceMode === 'android'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
              title="محاكي تطبيق أندرويد"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {deviceMode === 'android' ? 'معاينة التطبيق' : 'تطبيق Android'}
              </span>
            </button>

            {/* Delivery Locations Map - Desktop */}
            <button
              onClick={onOpenMap}
              className="hidden sm:flex p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-amber-500/40 transition-all relative group active:scale-95 cursor-pointer"
              title="تحديد موقع التوصيل في صنعاء"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
            </button>

            {/* Live Orders Track - Desktop */}
            <button
              onClick={onOpenOrders}
              className="hidden sm:flex p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-amber-500/40 transition-all active:scale-95 cursor-pointer"
              title="تتبع مسار الطلب والمندوب (GPS)"
            >
              <Truck className="w-4 h-4 text-amber-400" />
            </button>

            {/* Cart Drawer Button */}
            <button
              onClick={onOpenCart}
              className="relative px-3 py-2 rounded-xl gold-gradient-bg text-slate-950 font-bold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/10 active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-black">
                {lang === 'ar' ? 'السلة' : 'Cart'}
              </span>
              {cartCount > 0 && (
                <span className="bg-slate-950 text-amber-400 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-amber-400/50">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Theme Mode Toggle (نهاري / ليلي) */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 hover:border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
                title={theme === 'dark' ? 'التبديل إلى المظهر النهاري' : 'التبديل إلى المظهر الليلي'}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden md:inline font-bold">نهاري ☀️</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span className="hidden md:inline font-bold">ليلي 🌙</span>
                  </>
                )}
              </button>
            )}

            {/* Lang Switcher - Desktop */}
            <button
              onClick={onLanguageToggle}
              className="hidden md:flex px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all items-center gap-1 active:scale-95 cursor-pointer"
              title="تغيير اللغة"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Owner Control Dashboard Button */}
            {userRole === 'owner' && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 hover:to-amber-600/40 text-amber-300 border border-amber-500/50 text-xs font-black transition-all shadow-sm cursor-pointer active:scale-95"
                title="لوحة تحكم المالك وتعديل الأسعار والمناديب"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>لوحة المالك</span>
                <span className="text-[11px]">👑</span>
              </button>
            )}

            {/* User Profile / Customer Login */}
            <button
              onClick={onOpenAuth}
              className={`flex p-2 sm:px-3.5 sm:py-2 rounded-xl border transition-all items-center gap-2 active:scale-95 cursor-pointer ${
                userName
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-amber-500/40'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
              }`}
              title={userName ? `حساب العميل: ${userName}` : 'تسجيل الدخول أو حسابي'}
            >
              <User className="w-4 h-4 text-amber-400" />
              {userName ? (
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-amber-400/80 block leading-tight font-medium">
                    حسابي
                  </span>
                  <span className="text-xs font-bold text-amber-300 max-w-[110px] truncate block leading-tight">
                    {userName}
                  </span>
                </div>
              ) : (
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-amber-300 block leading-tight whitespace-nowrap">
                    {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  </span>
                </div>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 lg:hidden active:scale-95 cursor-pointer"
              title="القائمة الإضافية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar with Interactive Dropdown & Filters */}
        <div ref={mobileSearchDropdownRef} className="pb-3 lg:hidden relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsMobileSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsMobileSearchFocused(true);
              }}
              placeholder={lang === 'ar' ? 'ابحث في أصناف الفحم، عبوات 250g، 500g...' : 'Search charcoal 250g, 500g...'}
              className="w-full bg-slate-900 text-slate-100 placeholder-slate-400 text-xs rounded-xl py-2.5 pr-9 pl-20 border border-slate-800 focus:border-amber-500/60 outline-none"
            />
            <Search className="w-4 h-4 text-amber-400 absolute right-3 pointer-events-none" />
            
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-16 text-xs text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMobileSearchFocused(true)}
              className={`absolute left-1.5 top-1.5 bottom-1.5 px-2 rounded-lg flex items-center gap-1 text-[11px] font-bold ${
                activeFiltersCount > 0
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>تصفية</span>
              {activeFiltersCount > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-slate-950 text-amber-400 text-[9px] flex items-center justify-center font-black">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Search & Filter Dropdown */}
          {isMobileSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#12121A] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden z-50 text-right">
              <div className="px-3 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-amber-400" />
                  <span>نتائج التصفية ({matchingProducts.length})</span>
                </span>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <button 
                      onClick={handleReset}
                      className="text-[10px] text-rose-400 hover:underline font-bold"
                    >
                      إلغاء الكل
                    </button>
                  )}
                  <button 
                    onClick={() => setIsMobileSearchFocused(false)} 
                    className="text-slate-400 hover:text-white text-[11px]"
                  >
                    إغلاق ✕
                  </button>
                </div>
              </div>

              {/* Mobile Filter Controls: Sort & Price */}
              <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 space-y-2.5">
                {/* Sort selector */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">الترتيب:</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: 'popular', label: '🔥 الأكثر طلباً' },
                      { id: 'newest', label: '🆕 الأحدث' },
                      { id: 'price-asc', label: '📈 الأقل سعراً' },
                      { id: 'price-desc', label: '📉 الأعلى سعراً' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSortBy && setSortBy(item.id as ProductSortOption)}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                          sortBy === item.id
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">نطاق السعر (ريال):</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="الحد الأدنى (من)"
                      value={minPrice}
                      onChange={(e) => setMinPrice && setMinPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-slate-950 text-white text-[11px] rounded-lg px-2 py-1 border border-slate-700 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="الحد الأعلى (إلى)"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice && setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-slate-950 text-white text-[11px] rounded-lg px-2 py-1 border border-slate-700 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Quick tags */}
              {!searchQuery.trim() && (
                <div className="p-2 border-b border-slate-800 bg-slate-900/40 flex flex-wrap gap-1">
                  {quickSearchTags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(tag.query);
                        setIsMobileSearchFocused(true);
                      }}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold"
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              )}

              {matchingProducts.length > 0 ? (
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60">
                  {matchingProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleProductClick(prod)}
                      className="p-2.5 hover:bg-amber-500/10 cursor-pointer flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={prod.images && prod.images[0] ? prod.images[0] : ''}
                          alt={prod.nameAr}
                          className="w-10 h-10 object-contain rounded bg-slate-900 p-0.5 border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-xs font-black text-white">{prod.nameAr}</h4>
                          <span className="text-[10px] text-amber-400 font-mono font-bold">
                            {prod.price.toLocaleString()} YER
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                        عرض 👈
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 space-y-2">
                  <p>لا توجد نتائج مطابقة للتصفية</p>
                  <button onClick={handleReset} className="text-amber-400 underline font-bold text-[11px]">
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Extra Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-800 space-y-2 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Customer Profile / Sign in / Guest Bar */}
            <button
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
              className={`w-full py-2.5 px-3 rounded-xl border font-bold flex items-center justify-between shadow-sm active:scale-98 transition-transform cursor-pointer ${
                userName
                  ? 'bg-slate-900 text-amber-300 border-amber-500/30'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>{userName ? `حسابي: ${userName}` : 'تسجيل الدخول / حسابي'}</span>
              </div>
              <span className="text-xs text-amber-400 underline">
                {userName ? 'إدارة الحساب' : 'دخول'}
              </span>
            </button>

            {/* Owner Admin Entry */}
            {userRole === 'owner' ? (
              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 text-amber-300 border border-amber-500/50 font-black flex items-center justify-between shadow-sm active:scale-98 transition-transform cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>لوحة تحكم وإدارة المالك</span>
                </div>
                <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-md">👑 دخول</span>
              </button>
            ) : null}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { onOpenAiAdvisor(); setMobileMenuOpen(false); }}
                className="py-2.5 px-3 rounded-xl bg-slate-900 text-amber-300 border border-slate-800 font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>مستشار الذكاء</span>
              </button>

              <button
                onClick={() => { onOpenOrders(); setMobileMenuOpen(false); }}
                className="py-2.5 px-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Truck className="w-4 h-4 text-amber-400" />
                <span>تتبع الطلبات</span>
              </button>

              <button
                onClick={() => { onOpenMap(); setMobileMenuOpen(false); }}
                className="py-2.5 px-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>مواقع التوصيل</span>
              </button>

              <button
                onClick={() => { onLanguageToggle(); setMobileMenuOpen(false); }}
                className="py-2.5 px-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Globe className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
              </button>
            </div>

            {/* Android Simulator Toggle */}
            <button
              onClick={() => { onDeviceModeToggle(); setMobileMenuOpen(false); }}
              className={`w-full py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 active:scale-98 transition-all ${
                deviceMode === 'android'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>{deviceMode === 'android' ? 'إيقاف إطار المحاكي (عرض ملء الشاشة)' : 'محاكي تطبيق أندرويد 📱'}</span>
            </button>

            {/* Direct WhatsApp Help */}
            <a
              href="https://wa.me/967775000150"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>تواصل مباشر مع خدمة العملاء (واتساب: 775000150)</span>
            </a>

          </div>
        )}
      </div>

      {/* Main Categories & Navigation Sub-Bar (تحت الهيدر الرئيسي) */}
      <div className="bg-[#08080A] dark:bg-[#08080A] border-t border-slate-200 dark:border-slate-900 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 text-xs font-semibold">
          
          {/* Right Navigation: Home + Categories Menu + Direct Category Links */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 py-1">
            
            {/* 1. الرئيسية (Home) */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-bold shrink-0 ${
                activeCategory === 'all' && !searchQuery
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800'
              }`}
              title="الصفحة الرئيسية للمتجر"
            >
              <Home className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
            </button>

            {/* 2. تصفح الأقسام (Dropdown Menu) */}
            <div ref={categoriesDropdownRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
                  categoriesDropdownOpen
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/30 hover:border-amber-400'
                }`}
                title="استعراض قائمة الأقسام والتصنيفات"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'الأقسام والتصنيفات' : 'Categories'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriesDropdownOpen ? 'rotate-180 text-slate-950' : 'text-amber-400'}`} />
              </button>

              {/* Dropdown Menu Panel */}
              {categoriesDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-[#12121A] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-right p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px] font-bold">
                    <span>أقسام فحم الذهب الأسود:</span>
                    <span className="text-amber-400">توصيل فوري ⚡</span>
                  </div>

                  {categoriesList.map((cat) => {
                    const isSelected = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`w-full text-right p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer group ${
                          isSelected 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                            : 'hover:bg-slate-900 text-slate-200 hover:text-white'
                        }`}
                      >
                        <span className="text-lg mt-0.5">{cat.icon}</span>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs group-hover:text-amber-300">
                              {lang === 'ar' ? cat.nameAr : cat.nameEn}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400/90 font-mono">
                              {cat.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            {cat.descAr}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Direct Category Quick Pills beside Home & Categories */}
            {categoriesList.slice(1).map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{lang === 'ar' ? cat.nameAr.split('(')[0].trim() : cat.nameEn}</span>
                </button>
              );
            })}

            {/* Quick Link to Order Tracker */}
            <button
              type="button"
              onClick={onOpenOrders}
              className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800/80 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 font-medium"
              title="تتبع مسار شحنتك"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>تتبع الطلب (GPS)</span>
            </button>

          </div>

          {/* Left Side Status Badge (Desktop) */}
          <div className="hidden xl:flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl shrink-0 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>صنعاء: التوصيل مباشر لبابك 🛵</span>
          </div>

        </div>
      </div>

    </header>
  );
};
