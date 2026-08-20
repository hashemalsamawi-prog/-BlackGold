import React from 'react';
import { Flame, ShieldCheck, Truck, Clock, Sparkles, Award, Store, Calculator } from 'lucide-react';
import { Language } from '../types';
import { ASSETS } from '../assets/images';
import { getTimeGreeting } from '../utils/greeting';

interface HeroBannerProps {
  lang: Language;
  onOpenAiAdvisor: () => void;
  onSelectCategory: (category: string) => void;
  onScrollToCalculator?: () => void;
  userName?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  lang,
  onOpenAiAdvisor,
  onSelectCategory,
  userName = 'هاشم السماوي'
}) => {
  const timeInfo = getTimeGreeting(userName, lang);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0F0F14] via-[#0A0A0C] to-[#0A0A0C] py-10 lg:py-14 border-b border-amber-500/10">
      
      {/* Background Glow Overlay */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-right">
            
            {/* Tagline Badges & Personalized Customer Greeting */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              
              {/* Personalized Customer Greeting Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black shadow-md">
                <span className="text-sm">{timeInfo.icon}</span>
                <span>{timeInfo.greeting}</span>
                <span className="text-amber-400/60 font-mono text-[10px] hidden sm:inline">({timeInfo.formattedTime})</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold shadow-inner">
                <Award className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>
                  {lang === 'ar' ? 'الذهب الأسود | الفحم النباتي الأجود في اليمن' : 'Black Gold - Yemen Premium Charcoal'}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? '+10g مجاناً في كل كيس (ضمان الثقة)' : '+10g Free Overpack Guarantee'}</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              {lang === 'ar' ? (
                <>
                  حرارة ناعمة ونقية بدون أدخنة مع <span className="gold-gradient-text">الذهب الأسود</span>
                </>
              ) : (
                <>
                  Pure Heat & Long Burn with <span className="gold-gradient-text">Black Gold Charcoal</span>
                </>
              )}
            </h1>

            {/* Subtext */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {lang === 'ar'
                ? 'فحم نباتي طبيعي فاخر معالج ومغربل ميكانيكياً بدون أدخنة أو روائح. أكياس Zipper عازلة للرطوبة (250g، 500g، 1kg) مع خدمة التوصيل الفوري السريع لباب منزلك في صنعاء خلال 45 دقيقة.'
                : 'Premium mechanically-screened charcoal with zero smoke or odors. Moisture-proof Zipper pouches (250g, 500g, 1kg) with express 45-min delivery in Sanaa.'}
            </p>

            {/* Clean Direct Buttons Row */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={() => onSelectCategory('all')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-slate-950" />
                <span>{lang === 'ar' ? 'اطلب فحم الذهب الأسود الملكي' : 'Shop Charcoal Pouches'}</span>
              </button>

              <button
                onClick={() => onSelectCategory('wholesale')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-sm transition-all flex items-center justify-center gap-2 hover:border-amber-400 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <Store className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'قسم البقالات والجملة (B2B)' : 'Wholesale & B2B Supply'}</span>
              </button>

              <button
                onClick={onOpenAiAdvisor}
                className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ar' ? 'مساعد الاختيار الذكي' : 'AI Assistant'}</span>
              </button>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 text-right">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs sm:text-sm">
                  <Clock className="w-4 h-4" />
                  <span>45 دقيقة</span>
                </div>
                <p className="text-[11px] text-slate-400">توصيل سريع بصنعاء</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs sm:text-sm">
                  <Flame className="w-4 h-4" />
                  <span>6+ ساعات</span>
                </div>
                <p className="text-[11px] text-slate-400">احتراق متصل ورماد أبيض</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ضمان الاسترجاع</span>
                </div>
                <p className="text-[11px] text-slate-400">استرداد نقدي 100%</p>
              </div>
            </div>

          </div>

          {/* Hero Media Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden glass-panel-gold p-2 gold-border-glow">
              <img
                src={ASSETS.pouchPair}
                alt="فحم الذهب الأسود 250g و 500g"
                referrerPolicy="no-referrer"
                className="w-full h-[320px] sm:h-[400px] object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 right-6 left-6 p-4 rounded-xl bg-slate-950/90 backdrop-blur-md border border-amber-500/40 text-right space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                    المنتج المعتمد 2026
                  </span>
                  <span className="text-xs text-slate-300 font-bold">صنعاء - اليمن</span>
                </div>
                <h3 className="text-white font-black text-base">عبوات الذهب الأسود (250g - 500g - 1kg)</h3>
                <p className="text-xs text-slate-300">أقوى جودة واحتراق يدوم لأكثر من 6 ساعات بدون دخان أو رائحة</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

