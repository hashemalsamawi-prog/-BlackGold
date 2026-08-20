import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, Search, Sparkles, User, MapPin, Truck, ShieldAlert, 
  Globe, Smartphone, Layers, Flame, Menu, X, ArrowLeftRight, Check, ChevronLeft,
  Sun, Moon
} from 'lucide-react';
import { Language, Product, ThemeMode } from '../types';
import { Logo } from './Logo';
import { getTimeGreeting } from '../utils/greeting';

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
  userName?: string;
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
  userName,
  products = [],
  onSelectProduct,
  storeSettings,
  theme = 'dark',
  onToggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchDropdownRef = useRef<HTMLDivElement>(null);

  const timeInfo = getTimeGreeting(userName, lang);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (mobileSearchDropdownRef.current && !mobileSearchDropdownRef.current.contains(event.target as Node)) {
        setIsMobileSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products based on search query
  const matchingProducts = searchQuery.trim()
    ? products.filter(p => {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.nameAr.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.descriptionAr.toLowerCase().includes(q) ||
          p.descriptionEn.toLowerCase().includes(q) ||
          (p.features && p.features.some(f => f.toLowerCase().includes(q))) ||
          (p.weightOptions && p.weightOptions.some(w => w.weight.toLowerCase().includes(q)))
        );
      })
    : [];

  const handleProductClick = (product: Product) => {
    setIsSearchFocused(false);
    setIsMobileSearchFocused(false);
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

  const quickSearchTags = [
    { label: '👑 فحم فاخر 250g', query: '250g' },
    { label: '👑 فحم فاخر 500g', query: '500g' },
    { label: '🔥 فحم بلدي اقتصادي', query: 'بلدي' },
    { label: '📦 كرتون جملة 10kg', query: 'جملة' },
    { label: '⚡ مكعبات إشعال', query: 'إشعال' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0D0D12]/95 backdrop-blur-md border-b border-slate-200 dark:border-amber-500/20 shadow-sm transition-colors">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 px-4 py-1.5 text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-sm">
        <Flame className="w-4 h-4 animate-bounce text-slate-950" />
        <span>
          {storeSettings?.topBannerNoticeAr || (lang === 'ar' 
            ? '🔥 خدمة التوصيل السريع داخل العاصمة صنعاء خلال 45 دقيقة - الدفع عند الاستلام أو عبر حاسب / الكريمي' 
            : '🔥 Express delivery within Sanaa in 45 mins - Cash on delivery & Bank transfers')}
        </span>
        <span className="hidden md:inline bg-black/20 text-black px-2 py-0.5 rounded text-xs font-black">
          كوبون: {storeSettings?.defaultCouponCode || 'GOLD10'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
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

          {/* Search Bar with Interactive Dropdown - Desktop */}
          <div ref={searchDropdownRef} className="hidden lg:flex flex-1 max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              placeholder={lang === 'ar' ? 'ابحث عن فحم بلدي، عبوة 250جم، 500جم، فحم فاخر...' : 'Search local charcoal, 250g, 500g, premium...'}
              className="w-full bg-slate-100 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-xs sm:text-sm rounded-xl py-2.5 px-10 border border-slate-300 dark:border-slate-800 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
            />
            <Search className="w-4 h-4 text-amber-400 absolute right-3.5 top-3 pointer-events-none" />
            
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
                title="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Desktop Search Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#12121A] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-right">
                
                {/* Header info */}
                <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-amber-400" />
                    {searchQuery.trim() ? (
                      <span>نتائج البحث ({matchingProducts.length})</span>
                    ) : (
                      <span>الأكثر طلباً وبحثاً بصنعاء</span>
                    )}
                  </span>
                  {searchQuery.trim() && (
                    <span className="text-[11px] text-amber-400/80">اضغط للدخول المباشر للمنتج</span>
                  )}
                </div>

                {/* Quick Suggestion Pills if query is empty or short */}
                {(!searchQuery.trim() || matchingProducts.length === 0) && (
                  <div className="p-3 border-b border-slate-800/80 bg-slate-900/40">
                    <p className="text-[11px] text-slate-400 mb-2 font-medium">بحث سريع ومباشر:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {quickSearchTags.map((tag, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery(tag.query);
                            setIsSearchFocused(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/60 hover:border-amber-500/40 text-[11px] font-bold transition-all"
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results List */}
                {matchingProducts.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {matchingProducts.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleProductClick(prod)}
                        className="p-3 hover:bg-amber-500/15 cursor-pointer flex items-center justify-between gap-3 group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-amber-500/40 overflow-hidden flex items-center justify-center shrink-0 p-1">
                            <img
                              src={prod.image}
                              alt={prod.nameAr}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 flex items-center gap-1.5">
                              <span>{prod.nameAr}</span>
                              {prod.badge && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {prod.badge}
                                </span>
                              )}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {prod.descriptionAr}
                            </p>
                          </div>
                        </div>

                        <div className="text-left shrink-0">
                          <span className="text-xs font-mono font-black text-amber-400 block">
                            {prod.price.toLocaleString()} YER
                          </span>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-bold justify-end mt-0.5 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 group-hover:bg-emerald-500/20">
                            <span>عرض وشراء</span>
                            <ChevronLeft className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.trim() ? (
                  <div className="p-6 text-center text-slate-400 space-y-2">
                    <p className="text-xs font-bold text-slate-300">
                      لم يتم العثور على منتجات مطابقة لـ "{searchQuery}"
                    </p>
                    <p className="text-[11px] text-slate-500">
                      جرب البحث بكلمات مثل "فحم فاخر" أو "250g" أو "بلدي"
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Action Tools & Portals */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* AI Advisor Button */}
            <button
              onClick={onOpenAiAdvisor}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
              title="مستشار الفحم الذكي"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{lang === 'ar' ? 'مستشار الذكاء الاصطناعي' : 'AI Advisor'}</span>
            </button>

            {/* Android / Web Toggle */}
            <button
              onClick={onDeviceModeToggle}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
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

            {/* Delivery Locations Map */}
            <button
              onClick={onOpenMap}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-amber-500/40 transition-all relative group"
              title="تحديد موقع التوصيل في صنعاء"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
            </button>

            {/* Live Orders Track */}
            <button
              onClick={onOpenOrders}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-amber-500/40 transition-all"
              title="تتبع الطلبات"
            >
              <Truck className="w-4 h-4 text-amber-400" />
            </button>

            {/* Cart Drawer Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl gold-gradient-bg text-slate-950 font-bold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/10 active:scale-95"
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

            {/* Dark / Light Mode Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 hover:border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                title={theme === 'dark' ? 'التبديل إلى الوضع الفاتح (Light Mode)' : 'التبديل إلى الوضع الداكن (Dark Mode)'}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden xl:inline text-amber-400">الوضع الفاتح</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span className="hidden xl:inline text-indigo-300">الوضع الداكن</span>
                  </>
                )}
              </button>
            )}

            {/* Lang Switcher */}
            <button
              onClick={onLanguageToggle}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Owner Control Dashboard Button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 hover:to-amber-600/40 text-amber-300 border border-amber-500/50 text-xs font-black transition-all shadow-sm cursor-pointer active:scale-95"
              title="لوحة تحكم المالك وتعديل الأسعار والمناديب"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">لوحة المالك</span>
              <span className="sm:hidden">الإدارة</span>
              <span className="text-[11px]">👑</span>
            </button>

            {/* User Profile */}
            <button
              onClick={onOpenAuth}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center gap-1.5"
              title={timeInfo.greeting}
            >
              <User className="w-4 h-4 text-amber-400" />
              {userName && (
                <div className="text-right hidden xl:block">
                  <span className="text-[10px] text-amber-400/80 block leading-tight font-medium">
                    {timeInfo.salutation}
                  </span>
                  <span className="text-xs font-bold text-amber-300 max-w-[100px] truncate block leading-tight">
                    {userName}
                  </span>
                </div>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-300 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar with Interactive Dropdown */}
        <div ref={mobileSearchDropdownRef} className="pb-3 lg:hidden relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsMobileSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsMobileSearchFocused(true);
              }}
              placeholder={lang === 'ar' ? 'ابحث في منتجات الفحم، عبوة 250جم/500جم...' : 'Search charcoal 250g, 500g...'}
              className="w-full bg-slate-900 text-slate-100 placeholder-slate-400 text-xs rounded-xl py-2 px-9 border border-slate-800 focus:border-amber-500/60 outline-none"
            />
            <Search className="w-4 h-4 text-amber-400 absolute right-3 top-2.5 pointer-events-none" />
            
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-2 text-xs text-slate-400 hover:text-white p-1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Mobile Search Dropdown */}
          {isMobileSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#12121A] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden z-50 text-right">
              <div className="px-3 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">
                  {searchQuery.trim() ? `نتائج البحث (${matchingProducts.length})` : 'أصناف الفحم المقترحة'}
                </span>
                <button 
                  onClick={() => setIsMobileSearchFocused(false)} 
                  className="text-slate-400 hover:text-white text-[11px]"
                >
                  إغلاق ✕
                </button>
              </div>

              {/* Quick tags */}
              {(!searchQuery.trim() || matchingProducts.length === 0) && (
                <div className="p-2.5 border-b border-slate-800 bg-slate-900/40 flex flex-wrap gap-1">
                  {quickSearchTags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(tag.query);
                        setIsMobileSearchFocused(true);
                      }}
                      className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold"
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              )}

              {matchingProducts.length > 0 ? (
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
                  {matchingProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleProductClick(prod)}
                      className="p-2.5 hover:bg-amber-500/10 cursor-pointer flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={prod.image}
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
                        طلب الآن 👈
                      </span>
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  لا توجد نتائج مطابقة لـ "{searchQuery}"
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Mobile Extra Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-800 flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>لوحة تحكم وإدارة المالك 👑</span>
            </button>

            {onToggleTheme && (
              <button
                onClick={() => { onToggleTheme(); setMobileMenuOpen(false); }}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 text-amber-300 border border-amber-500/30 font-bold flex items-center justify-center gap-2"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>تفعيل الوضع الفاتح (Light Mode) ☀️</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>تفعيل الوضع الداكن (Dark Mode) 🌙</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => { onOpenAiAdvisor(); setMobileMenuOpen(false); }}
              className="flex-1 min-w-[130px] py-2 px-3 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 font-bold flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>مستشار الذكاء الاصطناعي</span>
            </button>
            <button
              onClick={() => { onOpenOrders(); setMobileMenuOpen(false); }}
              className="flex-1 min-w-[130px] py-2 px-3 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 font-bold flex items-center justify-center gap-1"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>تتبع الطلبات</span>
            </button>
          </div>
        )}
      </div>

      {/* Categories Sub-nav */}
      <div className="bg-[#08080A] border-t border-slate-900 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-start overflow-x-auto no-scrollbar py-2.5 gap-2 text-xs font-semibold text-slate-300">
          {[
            { id: 'all', nameAr: '✨ جميع الأصناف والعبوات', nameEn: 'All Products', icon: '✨' },
            { id: 'premium', nameAr: '👑 الخط الفاخر الملكي (Zipper)', nameEn: 'Premium Line', icon: '👑' },
            { id: 'local', nameAr: '🔥 الخط الشعبي الاقتصادي', nameEn: 'Standard Line', icon: '🔥' },
            { id: 'wholesale', nameAr: '📦 الجملة، البقالات، والمطاعم', nameEn: 'Wholesale & B2B', icon: '📦' },
            { id: 'bbq', nameAr: '⚡ مكعبات الإشعال السريع', nameEn: 'Ignition Cubes', icon: '⚡' }
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (searchQuery) setSearchQuery('');
                  // Smooth scroll to products section so the customer sees the list update immediately
                  const el = document.getElementById('products-grid-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{lang === 'ar' ? cat.nameAr : cat.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
