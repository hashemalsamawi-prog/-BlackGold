import React, { useState } from 'react';
import { Flame, Sparkles, Truck, Store, Package, Image as ImageIcon, CheckCircle2, Award, ExternalLink, X } from 'lucide-react';
import { Language } from '../types';
import { resolveAsset } from '../assets/images';

interface GalleryItem {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'pouches' | 'shisha' | 'retail' | 'delivery' | 'merch';
  categoryNameAr: string;
  categoryNameEn: string;
  image: string;
  descriptionAr: string;
  descriptionEn: string;
  badgeAr: string;
  badgeEn: string;
  highlights: string[];
}

interface MarketingGalleryProps {
  lang: Language;
}

export const MarketingGallery: React.FC<MarketingGalleryProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g1',
      titleAr: 'عبوات الذهب الأسود الفاخرة (250g و 500g)',
      titleEn: 'Black Gold Luxury Pouches (250g & 500g)',
      category: 'pouches',
      categoryNameAr: 'العبوات والتغليف',
      categoryNameEn: 'Packaging & Pouches',
      image: '/src/assets/images/black_gold_pouch_pair_1786125935649.jpg',
      descriptionAr: 'تغليف أسود فاخر بنظام القفل الحراري المزدوج (Zipper Lock) للحفاظ على جودة الفحم وجفافه التام من الرطوبة.',
      descriptionEn: 'Double Zipper-Lock moisture-proof matte black pouch bags for optimal charcoal preservation.',
      badgeAr: 'التصميم الرسمي للعبوات',
      badgeEn: 'Official Package Design',
      highlights: ['عبوة 250 جرام خفيفة محكمة', 'عبوة 500 جرام للمجالس', 'طباعة ذهبية بارزة شيك']
    },
    {
      id: 'g2',
      titleAr: 'تجربة الشيشة الفاخرة بمكعبات الفحم النقية',
      titleEn: 'Luxury Shisha Session with Pure Cubes',
      category: 'shisha',
      categoryNameAr: 'جلسات الشيشة والحرارة',
      categoryNameEn: 'Shisha & Heat Experience',
      image: '/src/assets/images/black_gold_shisha_session_1786125947470.jpg',
      descriptionAr: 'حرارة متوازنة وتوهج أحمر متواصل لأكثر من 5 ساعات بدون طعم أو رائحة تعكر صفو المعسل.',
      descriptionEn: 'Uniform glow and balanced heat lasting 5+ hours with zero taste or odor alteration.',
      badgeAr: 'أعلى تقييم من المقاهي',
      badgeEn: 'Top Lounge Choice',
      highlights: ['بدون أدخنة أو رائحة', 'رماد أبيض ناعم', 'حرارة متصلة حتى 750 درجة']
    },
    {
      id: 'g3',
      titleAr: 'منصات وعوارض العرض في منافذ البيع',
      titleEn: 'Luxury Retail Store Display Stands',
      category: 'retail',
      categoryNameAr: 'منافذ البيع والمتاجر',
      categoryNameEn: 'Retail & Store Displays',
      image: '/src/assets/images/black_gold_retail_stand_1786125959576.jpg',
      descriptionAr: 'حوامل عرض مضيئة وشاشات ستاند متطورة تزين كبرى السوبرماركت والمحلات التجارية في أمانة العاصمة صنعاء.',
      descriptionEn: 'Illuminated golden retail display stands showcased across major supermarkets and stores in Sanaa.',
      badgeAr: 'متوفر في 120+ نقطة بيع',
      badgeEn: 'Available in 120+ Stores',
      highlights: ['رفوف إضاءة ذهبية', 'صندوق حاوية العرض المتنقل', 'تسليم جملة وتجزئة']
    },
    {
      id: 'g4',
      titleAr: 'أسطول دراجات التوصيل المباشر بصنعاء',
      titleEn: 'Sanaa Express Motorbike Delivery Fleet',
      category: 'delivery',
      categoryNameAr: 'أسطول التوصيل والسائقين',
      categoryNameEn: 'Delivery Fleet & Drivers',
      image: '/src/assets/images/black_gold_delivery_fleet_1786125973582.jpg',
      descriptionAr: 'أسطول دراجات نارية حديث مجهز بصناديق حرارية تحافظ على جودة المنتج وتضمن وصوله خلال 45 دقيقة.',
      descriptionEn: 'Modern motorcycle delivery fleet equipped with thermal branded boxes for 45-minute Sanaa delivery.',
      badgeAr: 'توصيل سريع 45 دقيقة',
      badgeEn: '45-Min Fast Express',
      highlights: ['تتبع حي مباشر عبر الخريطة', 'صندوق حراري ضد الصدمات', 'مندوبون بدريس موحد']
    },
    {
      id: 'g5',
      titleAr: 'طقم الهوية البصرية والزي الموحد للشركة',
      titleEn: 'Official Brand Identity & Merchandise Kit',
      category: 'merch',
      categoryNameAr: 'الهوية والتسويق',
      categoryNameEn: 'Brand & Marketing',
      image: '/src/assets/images/black_gold_merch_kit_1786125990648.jpg',
      descriptionAr: 'هوية بصرية متكاملة تشمل سترة المندوب (Vest)، القبعة، التيشيرت الرسمي، تطبيق الهاتف، والشعار الذهبي الثلاثي الأبعاد.',
      descriptionEn: 'Comprehensive brand identity kit featuring courier uniform, cap, mobile app interface, and 3D gold logo.',
      badgeAr: 'هوية بصرية فاخرة',
      badgeEn: 'Luxury Identity',
      highlights: ['زي موحد معتمد للمندوبين', 'تطبيق أندرويد متكامل', 'تغليف هدايا وترويج']
    }
  ];

  const filteredItems = activeTab === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeTab);

  return (
    <section className="bg-gradient-to-b from-[#0A0A0C] via-[#111116] to-[#0A0A0C] py-12 border-t border-b border-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'معرض الهوية والتسويق الرقمي' : 'Brand & Product Gallery'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {lang === 'ar' ? 'صور المنتجات الواقعية وحوامل العرض واسطول التوصيل' : 'Real Product Shots, Retail Displays & Express Delivery'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              تصفح العبوات الواقعية بفئة 250 جرام و 500 جرام، صور تجارب الشيشة بالحرارة الذهبية، منصات العرض في المحلات، وحل التوصيل عبر المندوبين.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', labelAr: 'الكل', labelEn: 'All' },
              { id: 'pouches', labelAr: 'العبوات 250g / 500g', labelEn: 'Pouches' },
              { id: 'shisha', labelAr: 'جلسات الشيشة', labelEn: 'Shisha' },
              { id: 'retail', labelAr: 'منصات العرض', labelEn: 'Retail' },
              { id: 'delivery', labelAr: 'أسطول التوصيل', labelEn: 'Delivery' },
              { id: 'merch', labelAr: 'الهوية والزي', labelEn: 'Brand Kit' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'gold-gradient-bg text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {lang === 'ar' ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group bg-[#121218] rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between gold-card-hover"
            >
              <div className="relative h-60 bg-slate-900 overflow-hidden">
                <img
                  src={resolveAsset(item.image)}
                  alt={item.titleAr}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-transparent opacity-90" />
                
                {/* Badge Top Right */}
                <span className="absolute top-3 right-3 bg-slate-950/90 text-amber-400 border border-amber-500/40 text-[10px] font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-md">
                  {lang === 'ar' ? item.badgeAr : item.badgeEn}
                </span>

                {/* Category Label Top Left */}
                <span className="absolute top-3 left-3 bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded backdrop-blur-md">
                  {lang === 'ar' ? item.categoryNameAr : item.categoryNameEn}
                </span>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg">
                    <ImageIcon className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'عرض مكبر' : 'Enlarge'}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-white font-extrabold text-base group-hover:text-amber-400 transition-colors">
                    {lang === 'ar' ? item.titleAr : item.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {lang === 'ar' ? item.descriptionAr : item.descriptionEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                  {item.highlights.map((h, i) => (
                    <span key={i} className="text-[10px] text-slate-300 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-amber-400" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#121218] border border-amber-500/40 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-80 sm:h-96 bg-black">
                <img
                  src={resolveAsset(selectedImage.image)}
                  alt={selectedImage.titleAr}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 space-y-4 text-right">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full">
                    {lang === 'ar' ? selectedImage.categoryNameAr : selectedImage.categoryNameEn}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">الذهب الأسود - Black Gold</span>
                </div>

                <h3 className="text-xl font-black text-white">
                  {lang === 'ar' ? selectedImage.titleAr : selectedImage.titleEn}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {lang === 'ar' ? selectedImage.descriptionAr : selectedImage.descriptionEn}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
                  {selectedImage.highlights.map((h, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-amber-300 font-bold flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
