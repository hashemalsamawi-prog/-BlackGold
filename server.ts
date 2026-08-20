import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini Client lazily/safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-Memory Database for demonstration with persistence state
let products = [
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

let orders: any[] = [
  {
    id: "ORD-9082",
    orderNumber: "BG-2026-9082",
    date: "2026-08-07 11:30",
    status: "delivering", // received | preparing | shipped | delivering | delivered | cancelled
    items: [
      { productId: "p3", productNameAr: "فحم الذهب الأسود الفاخر (عبوة 250 جرام)", weight: "250g", quantity: 2, unitPrice: 2500 },
      { productId: "p1", productNameAr: "فحم بلدي طبيعي (عبوة 250 جرام)", weight: "250g", quantity: 1, unitPrice: 1500 }
    ],
    subtotal: 6500,
    shippingFee: 1000,
    discount: 500,
    total: 7000,
    address: {
      id: "addr-1",
      title: "المنزل الرئيسي",
      city: "صنعاء",
      district: "حدة - شارع صخر بجوار سوبرماركت السعيد",
      street: "شارع 14",
      landmark: "أمام عمارة النصر",
      coordinates: { lat: 15.348, lng: 44.191 },
      notes: "يرجى الاتصال قبل الوصول بـ 10 دقائق، بوابة العمارة السوداء"
    },
    customerName: "هاشم السماوي",
    customerPhone: "771234567",
    paymentMethod: "cod", // cod | kuraimi | haseb | wallet | card
    notes: "يرجى تسليم الطلب حرارياً في كيس حافظ وقفل العبوة جيداً",
    driverId: "dr-1",
    driverName: "أحمد الكبسي",
    driverPhone: "770099887",
    timeline: [
      { status: "received", time: "11:30", titleAr: "تم استلام الطلب", titleEn: "Order Received" },
      { status: "preparing", time: "11:35", titleAr: "قيد التجهيز والتغليف", titleEn: "Order Preparing" },
      { status: "shipped", time: "11:45", titleAr: "تم التسليم للمندوب", titleEn: "Handed to Driver" },
      { status: "delivering", time: "11:50", titleAr: "في الطريق إليك مع المندوب", titleEn: "On the way with Driver" }
    ]
  }
];

let reviews: any[] = [
  {
    id: "rev-1",
    productId: "p3",
    userName: "محمد الحيمي",
    rating: 5,
    comment: "فحم ممتاز جداً حرارته عالية وما يطلع أي دخان أو ريحة للمجالس، الشحن في صنعاء كان سريع جداً بنفس اليوم!",
    date: "2026-08-05",
    verifiedPurchase: true
  },
  {
    id: "rev-2",
    productId: "p1",
    userName: "صالح العنسي",
    rating: 5,
    comment: "الفحم البلدي ممتاز جداً للشواء في حدائق صنعاء.. عبوة الـ 500 جرام تكفي عائلية.",
    date: "2026-08-06",
    verifiedPurchase: true
  }
];

let coupons: any[] = [
  { code: "GOLD10", discountPercent: 10, maxDiscount: 2000, minOrderAmount: 3000, isActive: true },
  { code: "SANAA", discountPercent: 15, maxDiscount: 3000, minOrderAmount: 5000, isActive: true }
];

let storeSettings: any = {
  storeNameAr: "فحم الذهب الأسود",
  storeNameEn: "Black Gold Charcoal",
  sloganAr: "الفحم النباتي الأجود في اليمن • نقاء، حرارة مضاعفة، وتوصيل فوري لباب بيتك",
  logoText: "الذهب الأسود",
  customLogoUrl: "",
  topBannerNoticeAr: "🔥 خدمة التوصيل السريع داخل العاصمة صنعاء خلال 45 دقيقة - الدفع عند الاستلام أو عبر حاسب / الكريمي",
  topBannerNoticeEn: "🔥 Express delivery within Sanaa in 45 mins - Cash on delivery & Bank transfers",
  whatsappPhone: "775000150",
  callPhone: "01400100",
  freeDeliveryThreshold: 8000,
  isStoreOpen: true,
  defaultCouponCode: "GOLD10"
};

// API Routes
app.get("/api/settings", (req, res) => {
  res.json({ success: true, data: storeSettings });
});

app.post("/api/settings", (req, res) => {
  storeSettings = { ...storeSettings, ...req.body };
  res.json({ success: true, data: storeSettings });
});

app.get("/api/products", (req, res) => {
  res.json({ success: true, data: products });
});

app.post("/api/products", (req, res) => {
  const newProduct = {
    id: "p" + (products.length + 1) + "_" + Date.now(),
    ...req.body
  };
  products.unshift(newProduct);
  res.json({ success: true, data: newProduct });
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json({ success: true, data: products[index] });
  } else {
    res.status(404).json({ success: false, message: "Product not found" });
  }
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  products = products.filter((p) => p.id !== id);
  res.json({ success: true, message: "Deleted" });
});

app.get("/api/orders", (req, res) => {
  res.json({ success: true, data: orders });
});

app.post("/api/orders", (req, res) => {
  const { items, subtotal, shippingFee, discount, total, address, customerName, customerPhone, paymentMethod, notes } = req.body;
  const orderNum = "BG-2026-" + Math.floor(1000 + Math.random() * 9000);
  
  // Deduct stock automatically
  if (items && Array.isArray(items)) {
    items.forEach((item: any) => {
      const p = products.find((prod) => prod.id === item.productId);
      if (p && p.stock) {
        p.stock = Math.max(0, p.stock - item.quantity);
      }
    });
  }

  const newOrder = {
    id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
    orderNumber: orderNum,
    date: new Date().toISOString().replace("T", " ").substring(0, 16),
    status: "received",
    items,
    subtotal,
    shippingFee,
    discount,
    total,
    address,
    customerName,
    customerPhone,
    paymentMethod,
    notes: notes || "",
    driverId: "dr-1",
    driverName: "أحمد الكبسي",
    driverPhone: "770099887",
    timeline: [
      { status: "received", time: new Date().toLocaleTimeString("ar-YE", { hour: "2-digit", minute: "2-digit" }), titleAr: "تم استلام الطلب", titleEn: "Order Received" }
    ]
  };
  orders.unshift(newOrder);
  res.json({ success: true, data: newOrder });
});

app.patch("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, driverNotes } = req.body;
  const order = orders.find((o) => o.id === id);
  if (order) {
    order.status = status;
    const timeNow = new Date().toLocaleTimeString("ar-YE", { hour: "2-digit", minute: "2-digit" });
    const titlesMap: Record<string, { ar: string; en: string }> = {
      received: { ar: "تم استلام الطلب", en: "Order Received" },
      preparing: { ar: "قيد التجهيز والتغليف", en: "Preparing Order" },
      shipped: { ar: "تم شحن الطلب وتسليمه للمندوب", en: "Handed to Driver" },
      delivering: { ar: "في الطريق للتوصيل (صنعاء)", en: "On the way with Driver" },
      delivered: { ar: "تم التسليم بنجاح", en: "Delivered Successfully" },
      cancelled: { ar: "تم إلغاء الطلب", en: "Order Cancelled" }
    };
    if (titlesMap[status]) {
      order.timeline.push({
        status,
        time: timeNow,
        titleAr: titlesMap[status].ar,
        titleEn: titlesMap[status].en
      });
    }
    if (driverNotes) {
      order.driverNotes = driverNotes;
    }
    res.json({ success: true, data: order });
  } else {
    res.status(404).json({ success: false, message: "Order not found" });
  }
});

app.get("/api/reviews", (req, res) => {
  res.json({ success: true, data: reviews });
});

app.post("/api/reviews", (req, res) => {
  const newReview = {
    id: "rev-" + Date.now(),
    date: new Date().toISOString().split("T")[0],
    verifiedPurchase: true,
    ...req.body
  };
  reviews.unshift(newReview);
  
  // Recalculate product rating
  const prodReviews = reviews.filter((r) => r.productId === req.body.productId);
  const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
  const prod = products.find((p) => p.id === req.body.productId);
  if (prod) {
    prod.rating = Number(avg.toFixed(1));
    prod.reviewCount = prodReviews.length;
  }
  
  res.json({ success: true, data: newReview });
});

app.post("/api/validate-coupon", (req, res) => {
  const { code, amount } = req.body;
  const found = coupons.find((c) => c.code.toUpperCase() === code?.toUpperCase() && c.isActive);
  if (!found) {
    return res.status(400).json({ success: false, message: "كوبون غير صالح أو منتهي الصلاحية" });
  }
  if (amount < found.minOrderAmount) {
    return res.status(400).json({ success: false, message: `الحد الأدنى لاستخدام الكوبون هو ${found.minOrderAmount} ريال يمني` });
  }
  const discountVal = Math.min((amount * found.discountPercent) / 100, found.maxDiscount);
  res.json({ success: true, discount: discountVal, coupon: found });
});

// AI Charcoal Advisor route powered by Gemini
app.post("/api/gemini/advisor", async (req, res) => {
  try {
    const { useCase, guests, duration, location } = req.body;
    const ai = getGeminiClient();
    
    if (!ai) {
      return res.json({
        success: true,
        recommendation: `بناءً على اختيارك (${useCase}) لعدد ${guests || "عائلي"} في ${location || "صنعاء"}: ننصحك بـ "فحم الذهب الأسود الفاخر عبوة 500 جرام (Zipper Lock)" لاشتعال يدوم أكثر من 6 ساعات بدون أدخنة أو روائح!`,
        recommendedProductId: useCase?.includes("فاخر") || useCase?.includes("بخور") || useCase?.includes("مجالس") ? "bg-prem-500g" : "bg-std-1kg"
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `أنت خبير مستشار متجر "الذهب الأسود (Black Gold)" لمنتجات الفحم الفاخر في اليمن (صنعاء).
العميل يريد نصيحة لشراء الفحم بالتفاصيل التالية:
- سبب الاستخدام: ${useCase}
- عدد الأشخاص / الحجم: ${guests}
- مدة الاستخدام المتوقعة: ${duration}
- الموقع: ${location || "صنعاء"}

أعط نصيحة مختصرة ومشوقة جداً باللغة العربية بأسلوب راقي وفاخر، وحدد أي نوع هو الأنسب له من منتجاتنا:
1. فحم الذهب الأسود الفاخر (250g, 500g, 1kg) بنظام Zipper Lock العازل (للمجالس والأراجيل والبخور بدون رائحة أو دخان)
2. فحم الذهب الأسود الشعبي الاقتصادي (250g, 500g, 1kg) للمشاوي والطهي المنزلي اليومي
3. مكعبات الإشعال السريع الذهبية
4. شوالات المطاعم وصناديق البقالات.

اجعل الإجابة في 3 أسطر مركزة مع نصيحة لإشعال الفحم بأعلى كفاءة.`
    });

    res.json({
      success: true,
      recommendation: response.text,
      recommendedProductId: useCase?.includes("مجالس") || useCase?.includes("شيشة") || useCase?.includes("فاخر") ? "bg-prem-500g" : "bg-std-1kg"
    });
  } catch (err: any) {
    console.error("Gemini advisor error:", err);
    res.json({
      success: true,
      recommendation: "ننصح بـ فحم الذهب الأسود الفاخر (عبوة 500 جرام Zipper) للحصول على أطول مدة احتراق وحرارة نقية بدون رماد أو دخان.",
      recommendedProductId: "bg-prem-500g"
    });
  }
});

// Vite Middleware & Static Serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
