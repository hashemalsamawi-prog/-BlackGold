import React, { useState, useEffect } from 'react';
import { Product, Language, Review } from '../types';
import { X, Flame, Star, ShieldCheck, CheckCircle2, ShoppingBag, Send, Upload, Award, ChevronRight } from 'lucide-react';
import { resolveAsset } from '../assets/images';

interface ProductDetailModalProps {
  product: Product | null;
  lang: Language;
  onClose: () => void;
  onAddToCart: (product: Product, selectedWeight: string, quantity: number, price: number) => void;
  reviews: Review[];
  onAddReview: (productId: string, rating: number, comment: string, name: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  lang,
  onClose,
  onAddToCart,
  reviews,
  onAddReview
}) => {
  const [selectedWeightIdx, setSelectedWeightIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  
  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && product) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const currentOpt = product.weightOptions[selectedWeightIdx] || product.weightOptions[0];
  const unitPrice = currentOpt ? currentOpt.price : product.price;

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim() || !reviewName.trim()) return;
    onAddReview(product.id, reviewRating, reviewComment, reviewName);
    setReviewSubmitted(true);
    setReviewComment('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-[#121218] border border-amber-500/30 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto relative shadow-2xl text-slate-100 p-4 sm:p-7 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar with Back Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 hover:border-amber-500/40 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
            title="الرجوع لقائمة المنتجات"
          >
            <ChevronRight className="w-4 h-4 text-amber-400" />
            <span>رجوع للمتجر</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

          
          {/* Image & Main Badges */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 h-72 sm:h-80">
              <img
                src={resolveAsset(product.images[0])}
                alt={product.nameAr}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                <Award className="w-3.5 h-3.5" />
                منتج أصلي مضمون 100%
              </div>
            </div>

            {/* Technical Highlights Quick Row */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <div className="text-amber-400 font-bold">مدة الاحتراق</div>
                <div className="text-slate-300 font-extrabold mt-0.5">{product.burnDurationHours}</div>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <div className="text-amber-400 font-bold">نسبة الرماد</div>
                <div className="text-slate-300 font-extrabold mt-0.5">{product.ashPercentage}</div>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <div className="text-amber-400 font-bold">بلد المنشأ</div>
                <div className="text-slate-300 font-extrabold mt-0.5">{product.origin}</div>
              </div>
            </div>
          </div>

          {/* Details & Options */}
          <div className="space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                <span>الذهب الأسود Black Gold</span>
                <span>•</span>
                <span>فحم خالي من الدخان والشرار</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {lang === 'ar' ? product.nameAr : product.nameEn}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                {lang === 'ar' ? product.descriptionAr : product.descriptionEn}
              </p>

              {/* Weight Selector */}
              <div className="mt-5 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  اختر الحجم / العبوة المناسبة:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.weightOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedWeightIdx(idx)}
                      className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                        selectedWeightIdx === idx
                          ? 'bg-amber-500/20 border-amber-500 text-white font-black shadow-md'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold">{opt.weight}</span>
                      <span className="text-xs font-black text-amber-400">{opt.price.toLocaleString()} YER</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Controls & Quick Bulk Presets */}
              <div className="mt-5 space-y-2">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold">إجمالي المبلغ بالريال اليمني:</div>
                    <div className="text-lg sm:text-2xl font-black text-amber-400">
                      {(unitPrice * quantity).toLocaleString()} <span className="text-xs">YER</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-900 text-slate-200 font-black text-base hover:bg-slate-800 active:scale-95 transition-all"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-black text-base text-amber-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-900 text-slate-200 font-black text-base hover:bg-slate-800 active:scale-95 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Presets Row */}
                <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
                  <span className="text-slate-400">اختيار سريع للكمية:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setQuantity(5)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700/80 transition-all active:scale-95"
                    >
                      +5 عبوات
                    </button>
                    <button
                      onClick={() => setQuantity(10)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700/80 transition-all active:scale-95"
                    >
                      +10 عبوات
                    </button>
                    <button
                      onClick={() => setQuantity(20)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all active:scale-95 font-black"
                    >
                      📦 كرتون (20)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buy Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  onAddToCart(product, currentOpt.weight, quantity, unitPrice);
                  onClose();
                }}
                className="w-full py-3.5 rounded-xl gold-gradient-bg text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5 fill-slate-950" />
                <span>إضافة للسلة بـ {(unitPrice * quantity).toLocaleString()} ريال يمني</span>
              </button>

              <a
                href={`https://wa.me/967775000150?text=${encodeURIComponent(
                  `*طلب فحم الذهب الأسود (تفصيلي)* 👑\n-------------------------------\n*المنتج:* ${product.nameAr}\n*الوزن/العبوة:* ${currentOpt.weight}\n*الكمية المطلوبة:* ${quantity}\n*الإجمالي:* ${(unitPrice * quantity).toLocaleString()} YER\n-------------------------------\nيرجى الاعتماد والتوصيل السريع لـ صنعاء.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <span>طلب وإرسال فوري إلى رقم الواتساب (775000150) 💬</span>
              </a>
            </div>
          </div>

        </div>

        {/* Specs & Reviews Tabs */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('specs')}
              className={`text-sm font-bold pb-2 transition-all ${
                activeTab === 'specs'
                  ? 'text-amber-400 border-b-2 border-amber-500 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              المواصفات الفنية المعتمدة
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-sm font-bold pb-2 transition-all ${
                activeTab === 'reviews'
                  ? 'text-amber-400 border-b-2 border-amber-500 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              آراء وتقييمات العملاء ({productReviews.length})
            </button>
          </div>

          {activeTab === 'specs' ? (
            <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {product.specs.map((s, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                  <span className="text-slate-400 font-semibold">{s.labelAr}:</span>
                  <span className="text-amber-300 font-bold">{s.valueAr}</span>
                </div>
              ))}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400 font-semibold">حالة المخزون:</span>
                <span className="text-emerald-400 font-bold">متوفر في مستودعات صنعاء ({product.stock} عبوة)</span>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              
              {/* Existing Reviews */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {productReviews.length === 0 ? (
                  <p className="text-xs text-slate-400">لا توجد تقييمات حالياً، كن أول من يضيف تقييماً لهذا المنتج!</p>
                ) : (
                  productReviews.map((r) => (
                    <div key={r.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{r.userName}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: r.rating }).map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300">{r.comment}</p>
                      <span className="text-[10px] text-slate-500 block">{r.date}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleSubmitReview} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-amber-400">أضف تقييمك وتجربتك لـ {product.nameAr}:</h4>
                
                {reviewSubmitted && (
                  <div className="p-2 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                    تم إضافة تقييمك بنجاح! شرفتنا بملاحظاتك.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="اسمك الكريم"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-white text-xs p-2.5 rounded-lg outline-none focus:border-amber-500"
                  />
                  
                  <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400 font-bold">التقييم:</span>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="bg-transparent text-amber-400 text-xs font-bold outline-none cursor-pointer"
                    >
                      <option value={5} className="bg-slate-900">5 نجوم - ممتاز جداً</option>
                      <option value={4} className="bg-slate-900">4 نجوم - جيد جداً</option>
                      <option value={3} className="bg-slate-900">3 نجوم - مقبول</option>
                    </select>
                  </div>
                </div>

                <textarea
                  rows={2}
                  required
                  placeholder="اكتب انطباعك عن الفحم وحرارته ومدته..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white text-xs p-2.5 rounded-lg outline-none focus:border-amber-500"
                />

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال التقييم</span>
                </button>
              </form>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
