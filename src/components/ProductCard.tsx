import React, { useState } from 'react';
import { Product, Language } from '../types';
import { Flame, Star, ShoppingBag, Eye, Award, CheckCircle, MessageSquare, Plus, Minus } from 'lucide-react';
import { resolveAsset, ASSETS } from '../assets/images';

interface ProductCardProps {
  product: Product;
  lang: Language;
  onAddToCart: (product: Product, selectedWeight: string, quantity: number, price: number) => void;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  onAddToCart,
  onOpenDetails
}) => {
  // Default to 250g or first weight option
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const currentWeightOpt = product.weightOptions[selectedWeightIndex] || product.weightOptions[0];
  const currentPrice = currentWeightOpt ? currentWeightOpt.price : product.price;
  const totalPrice = currentPrice * quantity;

  const whatsappMessage = encodeURIComponent(
    `*طلب فحم الذهب الأسود (مباشر)* 👑\n-------------------------------\n*المنتج:* ${product.nameAr}\n*العبوة/الوزن:* ${currentWeightOpt?.weight || ''}\n*الكمية المطلوبة:* ${quantity}\n*السعر الإجمالي:* ${totalPrice.toLocaleString()} YER\n-------------------------------\nيرجى تأكيد التوصيل السريع لـ صنعاء.`
  );

  return (
    <div className="bg-[#121217] rounded-2xl border border-slate-800/80 hover:border-amber-500/50 transition-all duration-300 gold-card-hover flex flex-col justify-between overflow-hidden relative group">
      
      {/* Top Discount / Badge Ribbon */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
        {product.discountPercent && (
          <span className="bg-red-600 text-white font-black text-[11px] px-2 py-0.5 rounded-md shadow-md">
            خصم {product.discountPercent}%
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
            <Award className="w-3 h-3" />
            الأكثر مبيعاً
          </span>
        )}
      </div>

      {/* Product Image Container */}
      <div 
        onClick={() => onOpenDetails(product)}
        className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden cursor-pointer group-hover:brightness-105 transition-all"
      >
        <img
          src={resolveAsset(product.images?.[0] || (product as any).image || (product as any).imageUrl || ASSETS.pouchPair)}
          alt={product.nameAr}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = ASSETS.pouchPair;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-transparent opacity-80" />
        
        {/* Quick View Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(product);
          }}
          className="absolute bottom-3 left-3 bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700/60 p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'التفاصيل' : 'Details'}</span>
        </button>

        {/* Burn duration badge */}
        <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/30 text-[10px] font-bold text-amber-300 flex items-center gap-1">
          <Flame className="w-3 h-3 text-amber-400" />
          <span>{product.burnDurationHours}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Category & Origin */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
            <span className="text-amber-400/90 font-bold">
              {product.category === 'pouches' ? 'عبوة زيبر فاخرة' : product.category === 'wholesale' ? 'جملة وتوزيع' : 'فحم فاخر الذهب الأسود'}
            </span>
            <span>{product.origin}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetails(product)}
            className="text-white font-extrabold text-sm sm:text-base line-clamp-2 hover:text-amber-400 transition-colors cursor-pointer leading-snug"
          >
            {lang === 'ar' ? product.nameAr : product.nameEn}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold mr-1">{product.rating}</span>
            </div>
            <span className="text-slate-400 text-[11px]">({product.reviewCount} تقييم)</span>
            <span className="text-slate-500 mx-1">•</span>
            <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-0.5">
              <CheckCircle className="w-3 h-3" />
              رماد {product.ashPercentage}
            </span>
          </div>
        </div>

        {/* Weight Selector Pills */}
        {product.weightOptions && product.weightOptions.length > 0 && (
          <div className="space-y-1 pt-1">
            <label className="text-[11px] font-bold text-slate-400 block">
              {lang === 'ar' ? 'اختر الوزن / العبوة:' : 'Select Weight:'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {product.weightOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWeightIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                    selectedWeightIndex === idx
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {opt.weight}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector Counter (- / +) & Quick Presets */}
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-300">
              {lang === 'ar' ? 'الكمية (العدد):' : 'Quantity:'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-black text-xs flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center font-black text-xs text-amber-400">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-black text-xs flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Preset Pills */}
          <div className="flex items-center justify-end gap-1 text-[10px] pt-0.5">
            <button
              onClick={() => setQuantity(1)}
              className={`px-1.5 py-0.5 rounded ${quantity === 1 ? 'bg-amber-500/30 text-amber-300 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              1
            </button>
            <button
              onClick={() => setQuantity(5)}
              className={`px-1.5 py-0.5 rounded ${quantity === 5 ? 'bg-amber-500/30 text-amber-300 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              +5
            </button>
            <button
              onClick={() => setQuantity(10)}
              className={`px-1.5 py-0.5 rounded ${quantity === 10 ? 'bg-amber-500/30 text-amber-300 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              +10
            </button>
            <button
              onClick={() => setQuantity(20)}
              className={`px-1.5 py-0.5 rounded ${quantity === 20 ? 'bg-amber-500/40 text-amber-300 font-black' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              📦 كرتون
            </button>
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">الإجمالي:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-amber-400">
                {totalPrice.toLocaleString()}
              </span>
              <span className="text-[11px] font-extrabold text-amber-300">ريال YER</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart(product, currentWeightOpt.weight, quantity, currentPrice)}
              className="py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-black text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>إضافة السلة</span>
            </button>

            <a
              href={`https://wa.me/967775000150?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>طلب واتساب 💬</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
