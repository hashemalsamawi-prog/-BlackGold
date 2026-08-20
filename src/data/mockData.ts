import { Product, DeliveryAddress, Coupon, Order, Review } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Premium Line 250g
  {
    id: "bg-prem-250g",
    nameAr: "فحم الذهب الأسود الفاخر (250g + 10g مجاناً)",
    nameEn: "Black Gold Premium Charcoal - 250g Pouch",
    category: "premium",
    price: 600,
    originalPrice: 700,
    discountPercent: 14,
    weightOptions: [
      { weight: "250g (ربع كيلو)", price: 600 },
      { weight: "500g (نصف كيلو)", price: 1000 },
      { weight: "1kg (كيلو كامل)", price: 1600 }
    ],
    descriptionAr: "الخط الفاخر الملكي من فحم الذهب الأسود. عبوة محكمة الإغلاق بنظام Zipper Lock عازل للرطوبة. اشتعال فوري فائق النقاء يدوم حتى 6 ساعات بدون أدخنة أو روائح أو شرار مع رماد أبيض ناصع. مبرمجة بوزن 260 جرام (+10 جرام هدية مجانية).",
    descriptionEn: "Luxury moisture-proof Zipper pouch of pure premium charcoal. 6+ hours burn duration with zero smoke, odor, or sparks. Features +10g gold guarantee.",
    origin: "الذهب الأسود - مصنع صنعاء",
    burnDurationHours: "6+ ساعات متواصلة",
    ashPercentage: "أقل من 1.5% رماد أبيض",
    moisture: "< 2% فائق الجفاف",
    rating: 5.0,
    reviewCount: 230,
    images: [
      "/src/assets/images/black_gold_pouch_pair_1786125935649.jpg",
      "/src/assets/images/black_gold_shisha_session_1786125947470.jpg",
      "/src/assets/images/black_gold_retail_stand_1786125959576.jpg"
    ],
    specs: [
      { labelAr: "نوع التغليف", labelEn: "Packaging", valueAr: "كيس حراري فاخر Zipper Lock عازل للرطوبة", valueEn: "Moisture-Proof Zipper Pouch" },
      { labelAr: "ضمان الوزن", labelEn: "Weight Guarantee", valueAr: "260g (250g + 10g هدية ذهبية مجانية)", valueEn: "260g (250g + 10g Free Bonus)" },
      { labelAr: "الحرارة والرماد", labelEn: "Heat & Ash", valueAr: "حرارة مستقرة قوية ورماد أبيض ثلجي", valueEn: "Stable High Heat & Snow White Ash" },
      { labelAr: "سعر التاجر / الجملة", labelEn: "Wholesale Margin", valueAr: "480 ريال (ربح التاجر 120 ريال للكيس)", valueEn: "480 YER (120 YER Trader Profit)" }
    ],
    isFeatured: true,
    isBestSeller: true,
    stock: 800
  },

  // 2. Premium Line 500g
  {
    id: "bg-prem-500g",
    nameAr: "فحم الذهب الأسود الفاخر (500g + 10g مجاناً)",
    nameEn: "Black Gold Premium Charcoal - 500g Pouch",
    category: "premium",
    price: 1000,
    originalPrice: 1200,
    discountPercent: 17,
    weightOptions: [
      { weight: "250g (ربع كيلو)", price: 600 },
      { weight: "500g (نصف كيلو)", price: 1000 },
      { weight: "1kg (كيلو كامل)", price: 1600 }
    ],
    descriptionAr: "العبوة الملكية العائلية سعة 500 جرام من الفحم الفاخر المصفى. مثالية للمجالس الفاخرة، ديوان الضيافة، وجلسات الشيشة الممتدة. حرارة مستمرة حتى 6 ساعات ونقاء مطلق.",
    descriptionEn: "Royal 500g Zipper pack of Black Gold Premium Charcoal. Supreme choice for luxury lounges and extended smoking sessions.",
    origin: "الذهب الأسود - صنعاء",
    burnDurationHours: "6+ ساعات متواصلة",
    ashPercentage: "أقل من 1.5% رماد أبيض",
    moisture: "< 2%",
    rating: 5.0,
    reviewCount: 310,
    images: [
      "/src/assets/images/black_gold_pouch_pair_1786125935649.jpg",
      "/src/assets/images/black_gold_shisha_session_1786125947470.jpg",
      "/src/assets/images/black_gold_delivery_fleet_1786125973582.jpg"
    ],
    specs: [
      { labelAr: "نوع التغليف", labelEn: "Packaging", valueAr: "كيس حراري متعدد الطبقات عازل 510g", valueEn: "Multi-layer Sealed Zipper Pouch 510g" },
      { labelAr: "ضمان الوزن", labelEn: "Weight Guarantee", valueAr: "510g (500g + 10g هدية ذهبية مجانية)", valueEn: "510g (500g + 10g Free Bonus)" },
      { labelAr: "مدة الجمرة", labelEn: "Burn Duration", valueAr: "أكثر من 6 ساعات نار هادئة نقية", valueEn: "6+ Hours Continuous Gentle Heat" },
      { labelAr: "سعر التاجر / الجملة", labelEn: "Wholesale Margin", valueAr: "800 ريال (ربح التاجر 200 ريال للكيس)", valueEn: "800 YER (200 YER Trader Profit)" }
    ],
    isFeatured: true,
    isBestSeller: true,
    stock: 650
  },

  // 3. Premium Line 1kg
  {
    id: "bg-prem-1kg",
    nameAr: "فحم الذهب الأسود الفاخر (1 كجم كامل + 10g مجاناً)",
    nameEn: "Black Gold Premium Charcoal - 1kg Pouch",
    category: "premium",
    price: 1600,
    originalPrice: 1900,
    discountPercent: 15,
    weightOptions: [
      { weight: "250g (ربع كيلو)", price: 600 },
      { weight: "500g (نصف كيلو)", price: 1000 },
      { weight: "1kg (كيلو كامل)", price: 1600 }
    ],
    descriptionAr: "العبوة الكبرى من خط الفحم الفاخر (1 كجم صافي + 10g هدية). مناسبة للاستخدام المنزلي المكثف والمقاهي الراقية. تعبئة خاصة بأعلى مواصفات الفرز النقي.",
    descriptionEn: "1kg Master Premium Charcoal Pouch. Built for frequent connoisseurs, luxury cafes, and major guest events.",
    origin: "الذهب الأسود - صنعاء",
    burnDurationHours: "6+ ساعات متواصلة",
    ashPercentage: "أقل من 1.5%",
    moisture: "< 2%",
    rating: 4.9,
    reviewCount: 185,
    images: [
      "/src/assets/images/black_gold_pouch_pair_1786125935649.jpg",
      "/src/assets/images/black_gold_merch_kit_1786125990648.jpg",
      "/src/assets/images/black_gold_retail_stand_1786125959576.jpg"
    ],
    specs: [
      { labelAr: "نوع التغليف", labelEn: "Packaging", valueAr: "كيس سميك مقوى مع يد حمل وقفل Zipper", valueEn: "Heavy-Duty Reinforced Zipper Bag" },
      { labelAr: "سعر التاجر / الجملة", labelEn: "Wholesale Margin", valueAr: "1,300 ريال (ربح التاجر 300 ريال للكيس)", valueEn: "1,300 YER (300 YER Trader Profit)" }
    ],
    isFeatured: true,
    isBestSeller: false,
    stock: 400
  },

  // 4. Standard Line 250g (الفحم الشعبي الاقتصادي)
  {
    id: "bg-std-250g",
    nameAr: "فحم الذهب الأسود الشعبي (250g + 10g مجاناً)",
    nameEn: "Black Gold Standard Charcoal - 250g Pack",
    category: "local",
    price: 500,
    originalPrice: 600,
    discountPercent: 16,
    weightOptions: [
      { weight: "250g (ربع كيلو)", price: 500 },
      { weight: "500g (نصف كيلو)", price: 800 },
      { weight: "1kg (كيلو كامل)", price: 1200 }
    ],
    descriptionAr: "الخيار الاقتصادي اليومي عالي الجودة والمغربل ميكانيكياً بدون أتربة. سعر مناسب للجميع مع نفس الجودة والاشتغال السريع (أقل من 5 دقائق) وبدون فرقعة أو روائح.",
    descriptionEn: "High-value daily standard charcoal, mechanically screened with zero dust and quick 5-min lighting.",
    origin: "الذهب الأسود - صنعاء",
    burnDurationHours: "4 - 5 ساعات",
    ashPercentage: "< 2.5%",
    moisture: "< 3%",
    rating: 4.8,
    reviewCount: 420,
    images: [
      "/src/assets/images/local_charcoal_pack_1786118685561.jpg",
      "/src/assets/images/black_gold_pouch_pair_1786125935649.jpg"
    ],
    specs: [
      { labelAr: "الاستخدام اليومي", labelEn: "Usage", valueAr: "للمنازل والمشاوي اليومية والمباخر", valueEn: "Daily Home & Incense" },
      { labelAr: "سعر التاجر / الجملة", labelEn: "Wholesale Margin", valueAr: "380 ريال (ربح التاجر 120 ريال للكيس)", valueEn: "380 YER (120 YER Trader Profit)" }
    ],
    isFeatured: false,
    isBestSeller: true,
    stock: 1200
  },

  // 5. Standard Line 500g & 1kg
  {
    id: "bg-std-500g",
    nameAr: "فحم الذهب الأسود الشعبي (500g + 10g مجاناً)",
    nameEn: "Black Gold Standard Charcoal - 500g Pack",
    category: "local",
    price: 800,
    originalPrice: 950,
    discountPercent: 15,
    weightOptions: [
      { weight: "250g (ربع كيلو)", price: 500 },
      { weight: "500g (نصف كيلو)", price: 800 },
      { weight: "1kg (كيلو كامل)", price: 1200 }
    ],
    descriptionAr: "عبوة النصف كيلو الاقتصادية من الفحم الشعبي النظيف. توفير عالي وعمر جمرة طويل ومواصفات خاضعة للفرز الصارم.",
    descriptionEn: "Economic 500g pack of standard clean charcoal. Great value and solid burn duration.",
    origin: "الذهب الأسود - صنعاء",
    burnDurationHours: "4 - 5 ساعات",
    ashPercentage: "< 2.5%",
    moisture: "< 3%",
    rating: 4.8,
    reviewCount: 290,
    images: [
      "/src/assets/images/local_charcoal_pack_1786118685561.jpg",
      "/src/assets/images/charcoal_hero_banner_1786118670743.jpg"
    ],
    specs: [
      { labelAr: "سعر التاجر / الجملة", labelEn: "Wholesale Margin", valueAr: "550 ريال (ربح التاجر 250 ريال للكيس)", valueEn: "550 YER (250 YER Trader Profit)" }
    ],
    isFeatured: false,
    isBestSeller: false,
    stock: 900
  },

  {
    id: "bg-std-1kg",
    nameAr: "فحم الذهب الأسود الشعبي (1 كجم كامل + 10g مجاناً)",
    nameEn: "Black Gold Standard Charcoal - 1kg Pack",
    category: "local",
    price: 1200,
    originalPrice: 1400,
    discountPercent: 14,
    weightOptions: [
      { weight: "250g (ربع كيلو)", price: 500 },
      { weight: "500g (نصف كيلو)", price: 800 },
      { weight: "1kg (كيلو كامل)", price: 1200 }
    ],
    descriptionAr: "عبوة الكيلو الشعبي الأكثر مبيعاً للمشاوي المنزلية والرحلات والسوبرماركت. تمنحك ساعات من الشواء الممتع والنظيف.",
    descriptionEn: "Best-selling 1kg daily value charcoal pack for BBQ and family dinners.",
    origin: "الذهب الأسود - صنعاء",
    burnDurationHours: "5 ساعات متواصلة",
    ashPercentage: "< 2.5%",
    moisture: "< 3%",
    rating: 4.9,
    reviewCount: 512,
    images: [
      "/src/assets/images/local_charcoal_pack_1786118685561.jpg",
      "/src/assets/images/black_gold_pouch_pair_1786125935649.jpg"
    ],
    specs: [
      { labelAr: "سعر التاجر / الجملة", labelEn: "Wholesale Margin", valueAr: "900 ريال (ربح التاجر 300 ريال للكيس)", valueEn: "900 YER (300 YER Trader Profit)" }
    ],
    isFeatured: false,
    isBestSeller: true,
    stock: 1500
  },

  // 6. Wholesale Retail Display Stand Box (24 Pouches)
  {
    id: "bg-retail-box",
    nameAr: "صندوق العرض والترويج للبقالات (24 عبوة + ستاند خشبي مجاناً)",
    nameEn: "Retail Display Stand & Wholesale Box (24 Pouches)",
    category: "wholesale",
    price: 18500,
    originalPrice: 22000,
    discountPercent: 16,
    weightOptions: [
      { weight: "24 عبوة مشكلة", price: 18500 },
      { weight: "48 عبوة سوبرماركت", price: 36000 }
    ],
    descriptionAr: "عرض التأسيس والدخول الميداني للبقالات ونقاط البيع في صنعاء: يشمل 24 عبوة مشكلة من فحم الذهب الأسود (شعبي وفاخر) مع ستاند عرض خشبي فاخر مجاني للمحل وبوسترات دعائية وضمان استرجاع 100%.",
    descriptionEn: "Complete store entry kit for supermarkets and groceries: 24 mixed pouches + free wooden display rack + promotional posters + 100% buyback guarantee.",
    origin: "الذهب الأسود - صنعاء",
    burnDurationHours: "مخصص للجملة والتوزيع",
    ashPercentage: "< 2%",
    moisture: "< 2%",
    rating: 5.0,
    reviewCount: 88,
    images: [
      "/src/assets/images/black_gold_retail_stand_1786125959576.jpg",
      "/src/assets/images/black_gold_pouch_pair_1786125935649.jpg",
      "/src/assets/images/black_gold_merch_kit_1786125990648.jpg"
    ],
    specs: [
      { labelAr: "محتوى الكرتون", labelEn: "Box Content", valueAr: "24 عبوة مشكلة (فاخر وشعبي بأحجام 250g و 500g و 1kg)", valueEn: "24 Mixed Pouches" },
      { labelAr: "حافز التاجر", labelEn: "Trader Incentive", valueAr: "ستاند مجاني + هامش ربح يصل إلى 30% + عينات مجانية", valueEn: "Free Display + Up to 30% margin" },
      { labelAr: "سياسة التوزيع", labelEn: "Delivery Policy", valueAr: "توصيل مباشر مجاني للبقالة بالدراجات النارية في صنعاء", valueEn: "Free Direct Motorbike Delivery" }
    ],
    isFeatured: true,
    isBestSeller: true,
    stock: 120
  },

  // 7. Wholesale Restaurant Sack (شوال فحم خشن للمطاعم 20 كجم - Zero-Waste output)
  {
    id: "bg-restaurant-sack",
    nameAr: "شوال فحم خشن نقي للمطاعم والمشاوي (شوال 20 كجم)",
    nameEn: "Wholesale Restaurant & Grill Charcoal Sack (20kg)",
    category: "wholesale",
    price: 4000,
    originalPrice: 4800,
    discountPercent: 16,
    weightOptions: [
      { weight: "شوال واحد (20 كجم)", price: 4000 },
      { weight: "5 شوالات للمطاعم", price: 19000 },
      { weight: "10 شوالات جملة", price: 37000 }
    ],
    descriptionAr: "شوال فحم خشن نقي مخصص للمطاعم ومحلات المشاوي الكبرى والبرست والشوايات. قطع كبيرة طبيعية معالجة منزوعة الدخان تعطي جمراً جباراً يدوم طوال ساعات العمل.",
    descriptionEn: "20kg Heavy-duty commercial charcoal sack engineered specifically for restaurants, BBQ pits, and commercial kitchens.",
    origin: "الذهب الأسود - خط الجملة",
    burnDurationHours: "7+ ساعات نار متصلة",
    ashPercentage: "< 2%",
    moisture: "< 3%",
    rating: 4.9,
    reviewCount: 64,
    images: [
      "/src/assets/images/black_gold_delivery_fleet_1786125973582.jpg",
      "/src/assets/images/charcoal_hero_banner_1786118670743.jpg"
    ],
    specs: [
      { labelAr: "الوزن التقريبي", labelEn: "Weight", valueAr: "شوال 20 كجم فحم خشن نقي", valueEn: "20kg Coarse Lump Charcoal" },
      { labelAr: "الميزة للمطاعم", labelEn: "Restaurant Advantage", valueAr: "حرارة هائلة وموفر جداً في استهلاك المطاعم", valueEn: "Extreme High Heat & High Cost Efficiency" }
    ],
    isFeatured: true,
    isBestSeller: false,
    stock: 250
  },

  // 8. Quick Ignition Golden Cubes (مكعبات الإشعال السريع)
  {
    id: "bg-ignition-cubes",
    nameAr: "مكعبات الإشعال السريع الذهبية (عبوة 24 مكعب)",
    nameEn: "Golden Quick-Ignition Firestarter Cubes (24 Cubes)",
    category: "bbq",
    price: 450,
    originalPrice: 600,
    discountPercent: 25,
    weightOptions: [
      { weight: "علبة 24 مكعب", price: 450 },
      { weight: "3 علب توفير", price: 1200 }
    ],
    descriptionAr: "مكعبات إشعال آمنة وسريعة الاشتعال بلمسة عود ثقاب واحدة. عديمة الرائحة ولا تترك أي طعم على المشاوي أو الشيشة.",
    descriptionEn: "Safe, odorless, instant-strike fire starter cubes. Lights in 1 second with no chemical odor.",
    origin: "الذهب الأسود - إكسسوارات",
    burnDurationHours: "اشتعال فوري خلال 5 ثوانٍ",
    ashPercentage: "0%",
    rating: 4.9,
    reviewCount: 140,
    images: [
      "/src/assets/images/black_gold_merch_kit_1786125990648.jpg",
      "/src/assets/images/black_gold_shisha_session_1786125947470.jpg"
    ],
    specs: [
      { labelAr: "عدد المكعبات", labelEn: "Count", valueAr: "24 مكعب إشعال سريع", valueEn: "24 Fast Cubes" }
    ],
    isFeatured: false,
    isBestSeller: false,
    stock: 500
  }
];

export const SANAA_DISTRICTS = [
  { id: "حدة", nameAr: "حدة (شارع حدة، صخر، الحي السياسي)", nameEn: "Haddah", fee: 1000, coords: { lat: 15.338, lng: 44.192 } },
  { id: "السبعين", nameAr: "السبعين وبيت بوس وعطان", nameEn: "Al Sabeen & Bayt Baws", fee: 1000, coords: { lat: 15.321, lng: 44.205 } },
  { id: "التحرير", nameAr: "التحرير ووسط العاصمة", nameEn: "Al Tahrir (Center)", fee: 1000, coords: { lat: 15.355, lng: 44.206 } },
  { id: "الحصبة", nameAr: "الحصبة وشارع المطار القديم", nameEn: "Al Hasabah", fee: 1200, coords: { lat: 15.381, lng: 44.211 } },
  { id: "الصافية", nameAr: "الصافية وميدان السبعين الشرقي", nameEn: "Al Safiyah", fee: 1000, coords: { lat: 15.342, lng: 44.221 } },
  { id: "شعوب", nameAr: "شعوب وباب الشعوب ونقم", nameEn: "Sho'ub", fee: 1200, coords: { lat: 15.368, lng: 44.228 } },
  { id: "الروضة", nameAr: "الروضة ومحيط المطار", nameEn: "Al Rawdah", fee: 1500, coords: { lat: 15.421, lng: 44.238 } },
  { id: "شملان", nameAr: "شملan ومذبح والستين الغربي", nameEn: "Shamlan & Madhbah", fee: 1500, coords: { lat: 15.412, lng: 44.168 } },
  { id: "بني الحارث", nameAr: "بني الحارث وجولة مصعب", nameEn: "Bani Al Harith", fee: 1800, coords: { lat: 15.451, lng: 44.225 } }
];

export const MOCK_ADDRESSES: DeliveryAddress[] = [
  {
    id: "addr-1",
    title: "منزل حدة",
    city: "صنعاء",
    district: "حدة",
    street: "شارع صخر - خلف سوبرماركت السعيد",
    landmark: "بجوار مسجد الخير - عماره 12",
    coordinates: { lat: 15.338, lng: 44.192 },
    notes: "البوابة الرئيسية سوداء، اتصل عند الشارع الرئيسي",
    isDefault: true
  },
  {
    id: "addr-2",
    title: "مقر العمل / الشركة",
    city: "صنعاء",
    district: "السبعين",
    street: "شارع الستين الجنوبي",
    landmark: "أمام برج التضامن",
    coordinates: { lat: 15.321, lng: 44.205 },
    notes: "التسليم للاستقبال في الدور الأرضي",
    isDefault: false
  }
];

export const PAYMENT_METHODS = [
  { id: "cod", nameAr: "الدفع عند الاستلام (نقداً)", nameEn: "Cash on Delivery", icon: "banknote", descAr: "ادفع كاش للمندوب عند استلام شحنة الفحم (سياسة التحصيل 95% الفورية)" },
  { id: "kuraimi", nameAr: "حاسب / بنك الكريمي", nameEn: "Kuraimi Haseb", icon: "wallet", descAr: "تحويل مباشر إلى حساب الكريمي رقم (21234567)" },
  { id: "wallet", nameAr: "المحافظ الإلكترونية (جيب / فلوسك / كاش / ون كاش)", nameEn: "E-Wallets", icon: "smartphone", descAr: "الدفع الفوري عبر المحافظ الإلكترونية المعتمدة" },
  { id: "card", nameAr: "البطاقة البنكية / الدفع الإلكتروني", nameEn: "Bank Card", icon: "credit-card", descAr: "بطاقات الدفع الإلكتروني والتحويل البنكي" }
];

export const INITIAL_DELIVERY_AGENTS: any[] = [
  {
    id: "dr-1",
    name: "أحمد الكبسي",
    phone: "770099887",
    vehicleType: "motorcycle",
    districtZone: "حدة والسبعين وعطان",
    activeOrdersCount: 2,
    deliveredCount: 148,
    rating: 4.95,
    isOnline: true,
    vehiclePlate: "صنعاء - 14920 د"
  },
  {
    id: "dr-2",
    name: "محمد العنسي",
    phone: "771122334",
    vehicleType: "motorcycle",
    districtZone: "التحرير وشعوب والروضة",
    activeOrdersCount: 1,
    deliveredCount: 112,
    rating: 4.9,
    isOnline: true,
    vehiclePlate: "صنعاء - 89211 د"
  },
  {
    id: "dr-3",
    name: "إبراهيم المؤيد",
    phone: "773344556",
    vehicleType: "van",
    districtZone: "شملان ومذبح وشارع الستين",
    activeOrdersCount: 3,
    deliveredCount: 205,
    rating: 4.98,
    isOnline: true,
    vehiclePlate: "صنعاء - نقل 4501"
  },
  {
    id: "dr-4",
    name: "سامي الحيمي",
    phone: "775566778",
    vehicleType: "motorcycle",
    districtZone: "الحصبة وبني الحارث ونقم",
    activeOrdersCount: 0,
    deliveredCount: 94,
    rating: 4.88,
    isOnline: false,
    vehiclePlate: "صنعاء - 33109 د"
  }
];

export const INITIAL_CAMPAIGNS: any[] = [
  {
    id: "camp-1",
    titleAr: "حملة الجمعة الملكية: خصم 15% على جميع عبوات الفحم",
    titleEn: "Royal Friday Campaign: 15% OFF",
    badge: "🔥 أقوى عروض نهاية الأسبوع",
    discountText: "استخدم كوبون SANAA للطلبات أكثر من 5,000 YER",
    isActive: true,
    couponCode: "SANAA",
    startDate: "2026-08-15",
    endDate: "2026-08-30"
  },
  {
    id: "camp-2",
    titleAr: "عرض التأسيس للبقالات والمقاهي: ستاند خشبي مجاني + 24 عبوة",
    titleEn: "B2B Starter Kit: Free Wooden Stand + 24 Pouches",
    badge: "📦 عرض خاص للأنشطة التجارية",
    discountText: "وفر 3,500 YER مع ضمان الاسترجاع الكامل",
    isActive: true,
    couponCode: "GOLD10",
    startDate: "2026-08-01",
    endDate: "2026-09-01"
  },
  {
    id: "camp-3",
    titleAr: "ضمان الثقة والوزن الزائد: +10 جرام مجاناً في كل كيس",
    titleEn: "Trust Guarantee: +10g Free Overpack",
    badge: "⚖️ معتمد بموازين دقيقة",
    discountText: "أكياس Zipper عازلة للرطوبة بدون أي أدخنة",
    isActive: true,
    startDate: "2026-01-01",
    endDate: "2026-12-31"
  }
];

export const INITIAL_STORE_SETTINGS = {
  storeNameAr: "فحم الذهب الأسود",
  storeNameEn: "Black Gold Charcoal",
  sloganAr: "الفحم النباتي الأجود في اليمن • نقاء، حرارة مضاعفة، وتوصيل فوري لباب بيتك",
  logoText: "الذهب الأسود",
  topBannerNoticeAr: "🔥 خدمة التوصيل السريع داخل العاصمة صنعاء خلال 45 دقيقة - الدفع عند الاستلام أو عبر حاسب / الكريمي",
  topBannerNoticeEn: "🔥 Express delivery within Sanaa in 45 mins - Cash on delivery & Bank transfers",
  whatsappPhone: "775000150",
  callPhone: "01400100",
  freeDeliveryThreshold: 8000,
  isStoreOpen: true,
  defaultCouponCode: "GOLD10"
};

