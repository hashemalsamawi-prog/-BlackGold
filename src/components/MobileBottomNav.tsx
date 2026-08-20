import React from 'react';
import { Home, ShoppingBag, Truck, MessageSquare, ShieldAlert, Sun, Moon, User } from 'lucide-react';
import { ThemeMode } from '../types';

interface MobileBottomNavProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onScrollToProducts: () => void;
  onOpenAdmin?: () => void;
  onOpenAuth?: () => void;
  userName?: string;
  userRole?: 'customer' | 'owner' | 'mandoub';
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  onOpenCart,
  onOpenOrders,
  onScrollToProducts,
  onOpenAdmin,
  onOpenAuth,
  userName = '',
  userRole = 'customer',
  theme = 'dark',
  onToggleTheme
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E14]/95 backdrop-blur-md border-t border-amber-500/30 px-2 py-2 flex items-center justify-around text-slate-300 shadow-2xl">
      
      {/* Home */}
      <button
        onClick={onScrollToProducts}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-amber-400 active:scale-95 transition-all cursor-pointer"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold">الرئيسية</span>
      </button>

      {/* Cart */}
      <button
        onClick={onOpenCart}
        className="flex flex-col items-center gap-1 text-amber-400 relative active:scale-95 transition-all cursor-pointer"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-amber-400" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-black">السلة</span>
      </button>

      {/* Customer Account / Sign In */}
      {onOpenAuth && (
        <button
          onClick={onOpenAuth}
          className={`flex flex-col items-center gap-1 active:scale-95 transition-all cursor-pointer ${
            userName ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-amber-400 font-bold'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] truncate max-w-[65px]">
            {userName ? 'حسابي' : 'زائر / دخول'}
          </span>
        </button>
      )}

      {/* Order Tracking */}
      <button
        onClick={onOpenOrders}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-amber-400 active:scale-95 transition-all cursor-pointer"
      >
        <Truck className="w-5 h-5" />
        <span className="text-[10px] font-bold">تتبع الطلب</span>
      </button>

      {/* Owner Dashboard - Only shown when user is owner */}
      {userRole === 'owner' && onOpenAdmin && (
        <button
          onClick={onOpenAdmin}
          className="flex flex-col items-center gap-1 text-amber-300 active:scale-95 transition-all cursor-pointer"
        >
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-black text-amber-400">المالك 👑</span>
        </button>
      )}

      {/* Direct WhatsApp */}
      <a
        href="https://wa.me/967775000150"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 text-emerald-400 active:scale-95 transition-all cursor-pointer"
      >
        <MessageSquare className="w-5 h-5 text-emerald-400" />
        <span className="text-[10px] font-black text-emerald-400">واتساب</span>
      </a>

    </div>
  );
};
