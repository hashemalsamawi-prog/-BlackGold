import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Product, Order, Review, Coupon, DeliveryAgent, StoreSettings, GalleryItem } from '../src/types';

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'customer' | 'admin' | 'owner' | 'employee' | 'delivery';
  passwordHash?: string;
  pin?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'initial' | 'purchase' | 'sale' | 'return' | 'damage' | 'adjustment';
  quantity: number; // positive or negative
  previousStock: number;
  newStock: number;
  reason: string;
  performedBy: string;
  date: string;
}

export interface DatabaseSchema {
  users: UserAccount[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  deliveryAgents: DeliveryAgent[];
  storeSettings: StoreSettings;
  galleryItems: GalleryItem[];
  inventoryTransactions: InventoryTransaction[];
  abandonedCarts: Array<{
    id: string;
    customerPhone?: string;
    customerName?: string;
    items: any[];
    subtotal: number;
    updatedAt: string;
  }>;
  analyticsEvents: Array<{
    id: string;
    event: string;
    data: any;
    timestamp: string;
    userId?: string;
  }>;
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

// Helper to hash passwords / PINs
export function hashSecret(secret: string): string {
  return crypto.createHash('sha256').update(secret + 'BLACK_GOLD_SALT_2026').digest('hex');
}

// Generate secure session tokens (JWT-like HMAC-SHA256)
const JWT_SECRET = process.env.JWT_SECRET || 'bg_secure_secret_sanaa_2026_production_key';

export function generateToken(payload: { userId: string; role: string; phone: string; name: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 30 * 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): { userId: string; role: string; phone: string; name: string } | null {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (decoded.exp && decoded.exp < Date.now()) return null;
    return decoded;
  } catch (e) {
    return null;
  }
}

// Default Seed Data
const DEFAULT_PRODUCTS: Product[] = [
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

const DEFAULT_USERS: UserAccount[] = [
  {
    id: "usr-owner-1",
    name: "هاشم السماوي",
    phone: "775000150",
    email: "hashem@blackgold.ye",
    role: "owner",
    passwordHash: hashSecret("7777"),
    pin: hashSecret("7777"),
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "usr-admin-1",
    name: "مدير العمليات (صنعاء)",
    phone: "771112233",
    email: "admin@blackgold.ye",
    role: "admin",
    passwordHash: hashSecret("admin2026"),
    pin: hashSecret("1234"),
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "usr-emp-1",
    name: "مسؤول المخزون والمبيعات",
    phone: "772223344",
    email: "inventory@blackgold.ye",
    role: "employee",
    passwordHash: hashSecret("emp2026"),
    pin: hashSecret("5555"),
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "dr-1",
    name: "أحمد الكبسي",
    phone: "770099887",
    role: "delivery",
    passwordHash: hashSecret("driver123"),
    pin: hashSecret("8888"),
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "dr-2",
    name: "محمد الحيمي",
    phone: "773344556",
    role: "delivery",
    passwordHash: hashSecret("driver123"),
    pin: hashSecret("8888"),
    createdAt: "2026-01-01T00:00:00.000Z"
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ORD-9082",
    orderNumber: "BG-2026-9082",
    date: "2026-08-20 14:30",
    status: "delivering",
    items: [
      { productId: "bg-prem-250g", productNameAr: "فحم الذهب الأسود الفاخر (250g + 10g مجاناً)", weight: "250g (ربع كيلو)", quantity: 2, unitPrice: 600 },
      { productId: "bg-std-1kg", productNameAr: "فحم الذهب الأسود الشعبي (1 كجم كامل + 10g مجاناً)", weight: "1kg (كيلو كامل)", quantity: 1, unitPrice: 1200 }
    ],
    subtotal: 2400,
    shippingFee: 800,
    discount: 240,
    total: 2960,
    address: {
      id: "addr-1",
      title: "المنزل الرئيسي",
      city: "صنعاء",
      district: "حدة - شارع صخر بجوار سوبرماركت السعيد",
      street: "شارع 14",
      landmark: "أمام عمارة النصر",
      coordinates: { lat: 15.348, lng: 44.191 },
      notes: "يرجى الاتصال قبل الوصول بـ 10 دقائق"
    },
    customerName: "هاشم السماوي",
    customerPhone: "775000150",
    paymentMethod: "cod",
    notes: "يرجى تسليم الطلب حرارياً في كيس حافظ",
    driverId: "dr-1",
    driverName: "أحمد الكبسي",
    driverPhone: "770099887",
    timeline: [
      { status: "received", time: "14:30", titleAr: "تم استلام الطلب", titleEn: "Order Received" },
      { status: "preparing", time: "14:35", titleAr: "قيد التجهيز والتغليف", titleEn: "Order Preparing" },
      { status: "shipped", time: "14:45", titleAr: "تم التسليم للمندوب", titleEn: "Handed to Driver" },
      { status: "delivering", time: "14:50", titleAr: "في الطريق إليك مع المندوب", titleEn: "On the way with Driver" }
    ]
  }
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: "bg-prem-250g",
    userName: "محمد الحيمي",
    rating: 5,
    comment: "فحم ممتاز جداً حرارته عالية وما يطلع أي دخان أو ريحة للمجالس، الشحن في صنعاء كان سريع جداً بنفس اليوم!",
    date: "2026-08-15",
    verifiedPurchase: true
  },
  {
    id: "rev-2",
    productId: "bg-std-1kg",
    userName: "صالح العنسي",
    rating: 5,
    comment: "الفحم البلدي ممتاز جداً للشواء في حدائق صنعاء.. عبوة الـ 1 كجم ممتازة ونظيفة بدون غبار.",
    date: "2026-08-18",
    verifiedPurchase: true
  }
];

const DEFAULT_COUPONS: Coupon[] = [
  { code: "GOLD10", discountPercent: 10, maxDiscount: 2000, minOrderAmount: 2000, isActive: true, validUntil: "2026-12-31" },
  { code: "SANAA", discountPercent: 15, maxDiscount: 3000, minOrderAmount: 3000, isActive: true, validUntil: "2026-12-31" },
  { code: "WELCOME", discountPercent: 20, maxDiscount: 1500, minOrderAmount: 1500, isActive: true, validUntil: "2026-12-31" }
];

const DEFAULT_AGENTS: DeliveryAgent[] = [
  {
    id: "dr-1",
    name: "أحمد الكبسي",
    phone: "770099887",
    vehicleType: "motorcycle",
    districtZone: "حدة، السبعين، وعطان",
    activeOrdersCount: 2,
    deliveredCount: 148,
    rating: 4.95,
    isOnline: true,
    vehiclePlate: "صنعاء - 14920 د"
  },
  {
    id: "dr-2",
    name: "محمد الحيمي",
    phone: "773344556",
    vehicleType: "motorcycle",
    districtZone: "التحرير، الحصبة، وبير العزب",
    activeOrdersCount: 1,
    deliveredCount: 92,
    rating: 4.88,
    isOnline: true,
    vehiclePlate: "صنعاء - 8921 ب"
  },
  {
    id: "dr-3",
    name: "صالح الماوري",
    phone: "774455667",
    vehicleType: "van",
    districtZone: "شوالات المطاعم وصناديق الجملة",
    activeOrdersCount: 3,
    deliveredCount: 215,
    rating: 5.0,
    isOnline: true,
    vehiclePlate: "صنعاء - 33100 نقل"
  }
];

const DEFAULT_SETTINGS: StoreSettings = {
  storeNameAr: "فحم الذهب الأسود",
  storeNameEn: "Black Gold Charcoal",
  sloganAr: "الفحم النباتي الأجود في اليمن • نقاء، حرارة مضاعفة، وتوصيل فوري لباب بيتك",
  logoText: "الذهب الأسود",
  customLogoUrl: "",
  topBannerNoticeAr: "🔥 خدمة التوصيل السريع داخل العاصمة صنعاء خلال 45 دقيقة - الدفع عند الاستلام أو عبر الكريمي وحاسب",
  topBannerNoticeEn: "🔥 Express delivery within Sanaa in 45 mins - Cash on delivery & Bank transfers",
  whatsappPhone: "775000150",
  callPhone: "01400100",
  freeDeliveryThreshold: 8000,
  isStoreOpen: true,
  defaultCouponCode: "GOLD10",
  contactEmail: "blackgoled.ye@gmail.com",
  deliveryDistricts: [
    { id: 'd1', nameAr: 'حدة والمدينة السكنية', nameEn: 'Hadda', fee: 700, etaMinutes: 30, isActive: true },
    { id: 'd2', nameAr: 'السبعين وعطان', nameEn: 'Al-Sabeen', fee: 800, etaMinutes: 35, isActive: true },
    { id: 'd3', nameAr: 'التحرير وشارع جمال', nameEn: 'Al-Tahrir', fee: 800, etaMinutes: 40, isActive: true },
    { id: 'd4', nameAr: 'الحصبة ومازدا', nameEn: 'Al-Hasaba', fee: 900, etaMinutes: 45, isActive: true },
    { id: 'd5', nameAr: 'شميلة والخفجي', nameEn: 'Shumaila', fee: 900, etaMinutes: 40, isActive: true },
    { id: 'd6', nameAr: 'مذبح وشارع الثلاثين', nameEn: 'Mazbah', fee: 1000, etaMinutes: 50, isActive: true }
  ]
};

const DEFAULT_GALLERY: GalleryItem[] = [
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

// In-memory cache synced with JSON file
class Database {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      const dataDir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || DEFAULT_USERS,
          products: parsed.products || DEFAULT_PRODUCTS,
          orders: parsed.orders || DEFAULT_ORDERS,
          reviews: parsed.reviews || DEFAULT_REVIEWS,
          coupons: parsed.coupons || DEFAULT_COUPONS,
          deliveryAgents: parsed.deliveryAgents || DEFAULT_AGENTS,
          storeSettings: parsed.storeSettings || DEFAULT_SETTINGS,
          galleryItems: parsed.galleryItems || DEFAULT_GALLERY,
          inventoryTransactions: parsed.inventoryTransactions || [],
          abandonedCarts: parsed.abandonedCarts || [],
          analyticsEvents: parsed.analyticsEvents || []
        };
      }
    } catch (e) {
      console.error('Error loading db.json, using defaults:', e);
    }

    return {
      users: DEFAULT_USERS,
      products: DEFAULT_PRODUCTS,
      orders: DEFAULT_ORDERS,
      reviews: DEFAULT_REVIEWS,
      coupons: DEFAULT_COUPONS,
      deliveryAgents: DEFAULT_AGENTS,
      storeSettings: DEFAULT_SETTINGS,
      galleryItems: DEFAULT_GALLERY,
      inventoryTransactions: [],
      abandonedCarts: [],
      analyticsEvents: []
    };
  }

  public save(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      try {
        const dataDir = path.dirname(DB_FILE_PATH);
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
      } catch (e) {
        console.error('Failed to save db.json:', e);
      }
    }, 100);
  }

  // Users
  public getUsers() { return this.data.users; }
  public findUserById(id: string) { return this.data.users.find(u => u.id === id); }
  public findUserByPhone(phone: string) { return this.data.users.find(u => u.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')); }
  public addUser(user: UserAccount) {
    this.data.users.push(user);
    this.save();
    return user;
  }
  public updateUser(id: string, updates: Partial<UserAccount>) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
      return this.data.users[idx];
    }
    return null;
  }

  // Products
  public getProducts() { return this.data.products; }
  public findProductById(id: string) { return this.data.products.find(p => p.id === id); }
  public addProduct(p: Product) {
    this.data.products.unshift(p);
    // Log initial inventory
    this.logInventoryTransaction({
      id: 'tx-' + Date.now(),
      productId: p.id,
      productName: p.nameAr,
      type: 'initial',
      quantity: p.stock || 0,
      previousStock: 0,
      newStock: p.stock || 0,
      reason: 'إضافة منتج جديد للمتجر',
      performedBy: 'الإدارة',
      date: new Date().toISOString()
    });
    this.save();
    return p;
  }
  public updateProduct(id: string, p: Partial<Product>) {
    const idx = this.data.products.findIndex(prod => prod.id === id);
    if (idx !== -1) {
      const oldStock = this.data.products[idx].stock;
      this.data.products[idx] = { ...this.data.products[idx], ...p };
      if (p.stock !== undefined && p.stock !== oldStock) {
        this.logInventoryTransaction({
          id: 'tx-' + Date.now(),
          productId: id,
          productName: this.data.products[idx].nameAr,
          type: 'adjustment',
          quantity: p.stock - oldStock,
          previousStock: oldStock,
          newStock: p.stock,
          reason: 'تعديل يدوي للمخزون من لوحة التحكم',
          performedBy: 'الإدارة',
          date: new Date().toISOString()
        });
      }
      this.save();
      return this.data.products[idx];
    }
    return null;
  }
  public deleteProduct(id: string) {
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.save();
    return true;
  }

  // Orders
  public getOrders() { return this.data.orders; }
  public findOrderById(id: string) { return this.data.orders.find(o => o.id === id); }
  public addOrder(order: Order) {
    this.data.orders.unshift(order);
    this.save();
    return order;
  }
  public updateOrderStatus(id: string, status: Order['status'], driverNotes?: string, updatedTimelineStep?: any) {
    const order = this.data.orders.find(o => o.id === id);
    if (!order) return null;
    order.status = status;
    if (driverNotes) order.driverNotes = driverNotes;
    if (updatedTimelineStep) {
      order.timeline.push(updatedTimelineStep);
    }
    this.save();
    return order;
  }
  public updateOrderDriver(id: string, driverId: string, driverName: string, driverPhone: string) {
    const order = this.data.orders.find(o => o.id === id);
    if (!order) return null;
    order.driverId = driverId;
    order.driverName = driverName;
    order.driverPhone = driverPhone;
    this.save();
    return order;
  }

  // Reviews
  public getReviews() { return this.data.reviews; }
  public addReview(review: Review) {
    this.data.reviews.unshift(review);
    // recalculate rating for product
    const prodReviews = this.data.reviews.filter(r => r.productId === review.productId);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    const prod = this.findProductById(review.productId);
    if (prod) {
      prod.rating = Number(avg.toFixed(1));
      prod.reviewCount = prodReviews.length;
    }
    this.save();
    return review;
  }

  // Coupons
  public getCoupons() { return this.data.coupons; }
  public findCoupon(code: string) {
    return this.data.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
  }
  public addCoupon(coupon: Coupon) {
    this.data.coupons.unshift(coupon);
    this.save();
    return coupon;
  }
  public deleteCoupon(code: string) {
    this.data.coupons = this.data.coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
    this.save();
    return true;
  }

  // Delivery Agents
  public getDeliveryAgents() { return this.data.deliveryAgents; }
  public updateDeliveryAgents(agents: DeliveryAgent[]) {
    this.data.deliveryAgents = agents;
    this.save();
    return agents;
  }

  // Settings
  public getSettings() { return this.data.storeSettings; }
  public updateSettings(settings: Partial<StoreSettings>) {
    this.data.storeSettings = { ...this.data.storeSettings, ...settings };
    this.save();
    return this.data.storeSettings;
  }

  // Gallery
  public getGalleryItems() { return this.data.galleryItems; }
  public addGalleryItem(item: GalleryItem) {
    this.data.galleryItems.unshift(item);
    this.save();
    return item;
  }
  public updateGalleryItem(id: string, updates: Partial<GalleryItem>) {
    const idx = this.data.galleryItems.findIndex(g => g.id === id);
    if (idx !== -1) {
      this.data.galleryItems[idx] = { ...this.data.galleryItems[idx], ...updates };
      this.save();
      return this.data.galleryItems[idx];
    }
    return null;
  }
  public deleteGalleryItem(id: string) {
    this.data.galleryItems = this.data.galleryItems.filter(g => g.id !== id);
    this.save();
    return true;
  }

  // Inventory Transactions
  public getInventoryTransactions() { return this.data.inventoryTransactions; }
  public logInventoryTransaction(tx: InventoryTransaction) {
    this.data.inventoryTransactions.unshift(tx);
    this.save();
    return tx;
  }

  // Analytics & Abandoned Carts
  public logAnalyticsEvent(event: string, data: any, userId?: string) {
    this.data.analyticsEvents.unshift({
      id: 'ev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      event,
      data,
      timestamp: new Date().toISOString(),
      userId
    });
    if (this.data.analyticsEvents.length > 500) {
      this.data.analyticsEvents = this.data.analyticsEvents.slice(0, 500);
    }
    this.save();
  }

  public logAbandonedCart(cart: { customerPhone?: string; customerName?: string; items: any[]; subtotal: number }) {
    const id = 'cart-' + Date.now();
    this.data.abandonedCarts.unshift({
      id,
      ...cart,
      updatedAt: new Date().toISOString()
    });
    if (this.data.abandonedCarts.length > 100) {
      this.data.abandonedCarts = this.data.abandonedCarts.slice(0, 100);
    }
    this.save();
  }

  // Check if a customer has a verified delivered order for a product
  public hasDeliveredOrderForProduct(customerPhone: string, productId: string): boolean {
    if (!customerPhone) return false;
    const cleanPhone = customerPhone.replace(/\D/g, '');
    return this.data.orders.some(order => {
      const orderPhone = order.customerPhone?.replace(/\D/g, '');
      const isMatchPhone = orderPhone === cleanPhone;
      const isDelivered = order.status === 'delivered';
      const hasProduct = order.items.some(it => it.productId === productId);
      return isMatchPhone && isDelivered && hasProduct;
    });
  }
}

export const db = new Database();
