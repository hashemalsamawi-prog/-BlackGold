import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, CheckCircle, Sparkles } from 'lucide-react';

interface SaleNotification {
  id: string;
  city: string;
  item: string;
  timeAgo: string;
}

const RECENT_SALES: SaleNotification[] = [
  { id: '1', city: 'حضرموت', item: 'فحم الذهب الأسود (عبوة 500g)', timeAgo: 'منذ 3 دقائق' },
  { id: '2', city: 'ذمار', item: 'طقم الجملة والكراتين 500 جرام', timeAgo: 'منذ دقيقة واحدة' },
  { id: '3', city: 'صنعاء (حدة)', item: '3 عبوات فحم شيشة فاخر 250g', timeAgo: 'منذ 5 دقائق' },
  { id: '4', city: 'تعز', item: 'كرتون الجملة والتوزيع 24 عبوة', timeAgo: 'منذ 7 دقائق' },
  { id: '5', city: 'عدن', item: 'فحم بلدي أحجار فاخر', timeAgo: 'منذ دقيقتين' },
  { id: '6', city: 'إب', item: 'عرض 6 عبوات فحم الذهب الأسود', timeAgo: 'منذ 4 دقائق' },
];

export const LiveSalesTicker: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show first ticker after 2 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Rotate every 12 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % RECENT_SALES.length);
        setIsVisible(true);
      }, 800);
    }, 11000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const currentSale = RECENT_SALES[currentIdx];

  if (!isVisible || !currentSale) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 sm:bottom-6 z-40 max-w-xs sm:max-w-sm w-full animate-slideUp">
      <div className="bg-[#121219]/95 backdrop-blur-md border border-amber-500/50 rounded-2xl p-3 shadow-2xl text-slate-100 flex items-start justify-between gap-3 relative overflow-hidden group">
        
        {/* Subtle Gold Pulse Background Glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 font-bold">
            <ShoppingBag className="w-5 h-5 animate-pulse" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-400">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>عميل من {currentSale.city}</span>
              <span className="text-[10px] text-slate-400 font-normal">({currentSale.timeAgo})</span>
            </div>
            <p className="text-xs font-bold text-slate-200 leading-tight">
              أتم شراء <span className="text-white font-extrabold">{currentSale.item}</span> للتو!
            </p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
              <CheckCircle className="w-3 h-3" />
              <span>تم التأكيد والتجهيز للشحن المباشر</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-all shrink-0"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
