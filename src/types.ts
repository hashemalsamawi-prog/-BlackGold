export type Language = 'ar' | 'en';
export type ThemeMode = 'dark' | 'light';

export interface WeightOption {
  weight: string;
  price: number;
}

export interface TechnicalSpec {
  labelAr: string;
  labelEn: string;
  valueAr: string;
  valueEn: string;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'pouches' | 'wholesale' | 'local' | 'premium' | 'bbq' | 'incense';
  price: number; // Price in YER (الريال اليمني)
  originalPrice?: number;
  discountPercent?: number;
  weightOptions: WeightOption[];
  descriptionAr: string;
  descriptionEn: string;
  origin: string; // بلد المنشأ
  burnDurationHours: string; // مدة الاحتراق
  ashPercentage: string; // نسبة الرماد
  moisture?: string;
  rating: number;
  reviewCount: number;
  images: string[];
  videoUrl?: string;
  specs: TechnicalSpec[];
  isFeatured: boolean;
  isBestSeller: boolean;
  stock: number;
}

export interface CartItem {
  product: Product;
  selectedWeight: string;
  quantity: number;
  unitPrice: number;
}

export interface SanaaCoordinates {
  lat: number;
  lng: number;
}

export interface DeliveryAddress {
  id: string;
  title: string; // e.g. "المنزل", "المكتب", "الاستراحة"
  city: string; // صنعاء
  district: string; // حدة, السبعين, الحصبة, التحرير...
  street: string;
  landmark: string;
  coordinates: SanaaCoordinates;
  notes?: string;
  isDefault?: boolean;
}

export interface TimelineStep {
  status: 'received' | 'preparing' | 'shipped' | 'delivering' | 'delivered' | 'cancelled';
  time: string;
  titleAr: string;
  titleEn: string;
}

export interface OrderItem {
  productId: string;
  productNameAr: string;
  weight: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'received' | 'preparing' | 'shipped' | 'delivering' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  address: DeliveryAddress;
  customerName: string;
  customerPhone: string;
  paymentMethod: 'cod' | 'kuraimi' | 'haseb' | 'wallet' | 'card';
  notes?: string; // ملاحظة العميل
  driverNotes?: string; // ملاحظة المندوب
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  timeline: TimelineStep[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  verifiedPurchase: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'mandoub';
  addresses: DeliveryAddress[];
  loyaltyPoints: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderAmount: number;
  isActive: boolean;
  validUntil?: string;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'motorcycle' | 'van' | 'car';
  districtZone: string;
  activeOrdersCount: number;
  deliveredCount: number;
  rating: number;
  isOnline: boolean;
  avatar?: string;
  vehiclePlate?: string;
}

export interface MarketingCampaign {
  id: string;
  titleAr: string;
  titleEn: string;
  badge: string;
  discountText: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  couponCode?: string;
}

export interface DistrictDeliveryConfig {
  id: string;
  nameAr: string;
  nameEn: string;
  fee: number;
  etaMinutes: number;
  isActive: boolean;
}

export interface GalleryItem {
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

export interface StoreSettings {
  storeNameAr: string;
  storeNameEn: string;
  sloganAr: string;
  logoText: string;
  customLogoUrl?: string;
  topBannerNoticeAr: string;
  topBannerNoticeEn: string;
  whatsappPhone: string;
  callPhone: string;
  freeDeliveryThreshold: number;
  isStoreOpen: boolean;
  defaultCouponCode: string;
  deliveryDistricts: DistrictDeliveryConfig[];
}

