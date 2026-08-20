import React from 'react';
import { Scale, Flame, Sparkles, ShieldCheck, Wind, CheckCircle2, Award, Droplets } from 'lucide-react';
import { Language } from '../types';

interface QualityProtocolSectionProps {
  lang: Language;
}

export const QualityProtocolSection: React.FC<QualityProtocolSectionProps> = ({ lang }) => {
  return (
    <div className="relative rounded-3xl bg-[#0F0F14] border border-amber-500/20 p-6 sm:p-10 shadow-2xl overflow-hidden text-right my-12">
      
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black">
            <Award className="w-4 h-4 text-amber-400" />
            <span>معايير الجودة الصارمة 2026</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white">
            بروتوكول الذهب الأسود للجودة الفائقة وضمان الـ (+10g مجاناً)
          </h2>

          <p className="text-slate-400 text-xs sm:text-base leading-relaxed">
            نخضع كل حبة فحم لـ 3 مراحل تنقية وفرز ميكانيكي لضمان فحم نقي خالي من الدخان والفرقعة بنسبة رطوبة أقل من 2%.
          </p>
        </div>

        {/* 3 Interactive Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Moisture & Source */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Droplets className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black text-amber-400 uppercase">المعيار الأول</span>
              <h3 className="text-lg font-black text-white">جفاف فائق ورطوبة أقل من 2%</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              فحم منتقى من أجود أخشاب الطلح الطبيعي المعالج، يضمن اشتعالاً سريعاً في أقل من 5 دقائق بدون فرقعة أو تطاير للشرار.
            </p>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300/90 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>اشتعال هادئ بدون أي دخان</span>
            </div>
          </div>

          {/* Pillar 2: Mechanical Screening */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Wind className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black text-blue-400 uppercase">المعيار الثاني</span>
              <h3 className="text-lg font-black text-white">الغربلة الميكانيكية المزدوجة</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              تمر الشحنة عبر غرابيل آلية مخصصة لفصل الأتربة والشوائب والرماد تماماً، ليبقى الكيس نظيفاً يمكنك لمسه دون تلطيخ.
            </p>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-blue-300/90 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>0% تراب داخل أكياس الزيبر</span>
            </div>
          </div>

          {/* Pillar 3: Overpack Guarantee */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Scale className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black text-emerald-400 uppercase">المعيار الثالث</span>
              <h3 className="text-lg font-black text-white">ميزان الكرم (+10g مجانية)</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              الموازين الرقمية في المصنع مبرمجة هندسياً لإضافة 10 إلى 15 جراماً إضافية في كل كيس فوق الوزن الاسمي كحق وضمان لثقة المستهلك.
            </p>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-300/90 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>كيس الـ 250g يزن 260g فعلياً</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
