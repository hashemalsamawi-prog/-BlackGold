import React, { useState, useEffect } from 'react';
import { Order, Language } from '../types';
import { 
  X, Truck, CheckCircle2, Clock, MapPin, Phone, MessageSquare, 
  Navigation, ShieldCheck, Flame, Compass, ArrowRight, RefreshCw, 
  UserCheck, AlertCircle, Check, Send, ChevronRight, Sparkles
} from 'lucide-react';
import { Logo } from './Logo';
import { getTimeGreeting } from '../utils/greeting';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  lang: Language;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  lang
}) => {
  // Default mock order if no orders exist yet
  const defaultOrder: Order = {
    id: "ORD-9082",
    orderNumber: "BG-2026-9082",
    date: "2026-08-18 12:30",
    status: "delivering",
    items: [
      { productId: "bg-prem-250g", productNameAr: "فحم الذهب الأسود الفاخر (250g + 10g مجاناً)", weight: "250g (ربع كيلو)", quantity: 2, unitPrice: 600 },
      { productId: "bg-prem-500g", productNameAr: "فحم الذهب الأسود الفاخر (500g + 10g مجاناً)", weight: "500g (نصف كيلو)", quantity: 1, unitPrice: 1000 }
    ],
    subtotal: 2200,
    shippingFee: 1000,
    discount: 0,
    total: 3200,
    address: {
      id: "addr-1",
      title: "المنزل الرئيسي",
      city: "صنعاء",
      district: "حدة - شارع صخر",
      street: "شارع صخر - خلف سوبرماركت السعيد",
      landmark: "بجوار مسجد الخير - عمارة 12",
      coordinates: { lat: 15.338, lng: 44.192 },
      notes: "البوابة سوداء، يرجى الاتصال عند الوصول"
    },
    customerName: "هاشم السماوي",
    customerPhone: "771234567",
    paymentMethod: "cod",
    notes: "يرجى تسليم الفحم في كيس محكم الغلق مع فاتورة الذهب الأسود",
    driverId: "dr-1",
    driverName: "الكابتن / أحمد الكبسي",
    driverPhone: "770099887",
    timeline: [
      { status: "received", time: "12:30", titleAr: "تم استلام وتأكيد الطلب بالنظام", titleEn: "Order Received" },
      { status: "preparing", time: "12:35", titleAr: "تم الفرز والتغليف الحراري بالمستودع", titleEn: "Order Prepared" },
      { status: "shipped", time: "12:42", titleAr: "تم تسليم الشحنة لمندوب صنعاء", titleEn: "Handed to Driver" },
      { status: "delivering", time: "12:45", titleAr: "المندوب في الطريق إلى موقعك", titleEn: "On the way" }
    ]
  };

  const allOrders = orders.length > 0 ? orders : [defaultOrder];
  const [selectedOrderId, setSelectedOrderId] = useState<string>(allOrders[0]?.id || defaultOrder.id);
  const activeOrder = allOrders.find(o => o.id === selectedOrderId) || allOrders[0] || defaultOrder;

  // Real-time animation simulation state
  const [driverProgress, setDriverProgress] = useState(65); // percentage along route (0 to 100)
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulatedStatus, setSimulatedStatus] = useState<Order['status']>(activeOrder.status);

  // Sync simulated status with active order when changed
  useEffect(() => {
    setSimulatedStatus(activeOrder.status);
    if (activeOrder.status === 'received') setDriverProgress(5);
    else if (activeOrder.status === 'preparing') setDriverProgress(20);
    else if (activeOrder.status === 'shipped') setDriverProgress(40);
    else if (activeOrder.status === 'delivering') setDriverProgress(68);
    else if (activeOrder.status === 'delivered') setDriverProgress(100);
  }, [activeOrder.id, activeOrder.status]);

  // Live driver movement animation simulation
  useEffect(() => {
    if (!isOpen || !isSimulating || simulatedStatus === 'delivered' || simulatedStatus === 'cancelled') return;

    const interval = setInterval(() => {
      setDriverProgress((prev) => {
        if (prev >= 98) {
          setSimulatedStatus('delivered');
          return 100;
        }
        const next = prev + 1.2;
        if (next > 82 && simulatedStatus !== 'delivering') {
          // near location
        }
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen, isSimulating, simulatedStatus]);

  if (!isOpen) return null;

  const statusSteps = [
    { key: 'received', titleAr: 'تم الاستلام', descAr: 'تسجيل الفاتورة', eta: '45 دقيقة' },
    { key: 'preparing', titleAr: 'قيد التجهيز', descAr: 'وزن الفحم (+10g)', eta: '35 دقيقة' },
    { key: 'shipped', titleAr: 'استلام المندوب', descAr: 'شحن على الدراجة', eta: '25 دقيقة' },
    { key: 'delivering', titleAr: 'في الطريق', descAr: 'المندوب يتحرك بصنعاء', eta: '10 دقائق' },
    { key: 'delivered', titleAr: 'تم التوصيل', descAr: 'استلام الشحنة', eta: 'وصلت' }
  ];

  const getStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'received': return 0;
      case 'preparing': return 1;
      case 'shipped': return 2;
      case 'delivering': return 3;
      case 'delivered': return 4;
      default: return 3;
    }
  };

  const currentStepIdx = getStepIndex(simulatedStatus);

  // Dynamic Driver ETA and Distance calculation based on progress
  const remainingDistanceKm = Math.max(0, ((100 - driverProgress) * 0.045)).toFixed(1);
  const remainingMinutes = Math.max(1, Math.round((100 - driverProgress) * 0.25));

  const customerGreeting = getTimeGreeting(activeOrder.customerName, lang);

  // Coordinates calculation along simulated route from warehouse to customer in Sanaa
  const warehouseCoords = { lat: 15.365, lng: 44.205 }; // Black Gold Center Sana'a
  const customerCoords = activeOrder.address?.coordinates || { lat: 15.338, lng: 44.192 };
  
  const currentDriverLat = warehouseCoords.lat + ((customerCoords.lat - warehouseCoords.lat) * (driverProgress / 100));
  const currentDriverLng = warehouseCoords.lng + ((customerCoords.lng - warehouseCoords.lng) * (driverProgress / 100));

  // Distance status label
  const isNearby = driverProgress >= 80 && driverProgress < 100;
  const isDelivered = driverProgress >= 100 || simulatedStatus === 'delivered';

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-[#0F0F16] border border-amber-500/30 rounded-3xl max-w-4xl w-full p-4 sm:p-7 text-slate-100 relative shadow-2xl space-y-6 my-6 text-right max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 hover:border-amber-500/40 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
              title="الرجوع للشاشة السابقة"
            >
              <ChevronRight className="w-4 h-4 text-amber-400" />
              <span>رجوع</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Truck className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-lg font-black text-white">تتبع المندوب المباشر (Real-Time GPS)</h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    مباشر الآن
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">تحديث لحظي لمسار شحنة الفحم في أمانة العاصمة صنعاء</p>
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
            title="إغلاق الشاشة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Selector (if multiple orders exist) */}
        {allOrders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-bold text-slate-400 shrink-0">اختر الطلب:</span>
            {allOrders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => setSelectedOrderId(ord.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedOrderId === ord.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{ord.orderNumber}</span>
                <span className="text-[10px] opacity-80">({ord.total.toLocaleString()} YER)</span>
              </button>
            ))}
          </div>
        )}

        {/* Personalized Customer Welcome Greeting */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{customerGreeting.icon}</span>
            <div>
              <span className="font-black text-amber-300 block text-sm">{customerGreeting.greeting}</span>
              <span className="text-[11px] text-slate-400">تتبع حي ومباشر لمندوب توصيل فحم الذهب الأسود الخاص بطلبك</span>
            </div>
          </div>
          <span className="font-mono text-amber-400 font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] hidden sm:inline">
            {customerGreeting.formattedTime}
          </span>
        </div>

        {/* Status Callout Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#1A1A26] to-amber-500/10 border border-amber-500/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl font-black">
              {isDelivered ? '✅' : isNearby ? '📍' : '🛵'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-400 font-bold">الحالة الحالية:</span>
                <span className={`text-sm sm:text-base font-black ${
                  isDelivered ? 'text-emerald-400' : isNearby ? 'text-amber-300 animate-pulse' : 'text-white'
                }`}>
                  {isDelivered 
                    ? 'تم التوصيل بنجاح واستلام الشحنة 🎉'
                    : isNearby 
                    ? 'المندوب قريب جداً من موقعك (أقل من 500 متر) 📍'
                    : simulatedStatus === 'delivering'
                    ? 'المندوب في الطريق إليك عبر شوارع صنعاء 🛵'
                    : simulatedStatus === 'shipped'
                    ? 'تم استلام الشحنة من المستودع وجاري الانطلاق'
                    : 'قيد التجهيز والتغليف بالوزن الزائد (+10g)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                رقم الفاتورة: <span className="text-amber-300 font-bold font-mono">{activeOrder.orderNumber}</span> • التوصيل إلى: <span className="text-slate-200 font-bold">{activeOrder.address.district}</span>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">الوقت المقدر للوصول (ETA):</span>
            <span className="text-base sm:text-lg font-black text-emerald-400 flex items-center gap-1 justify-end">
              <Clock className="w-4 h-4 text-emerald-400" />
              {isDelivered ? 'اكتمل التوصيل' : `${remainingMinutes} دقيقة (${remainingDistanceKm} كم)`}
            </span>
          </div>
        </div>

        {/* Progress Pipeline Stepper */}
        <div className="py-2">
          <div className="relative flex items-center justify-between max-w-3xl mx-auto px-2">
            <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-slate-800 -translate-y-1/2 z-0 rounded-full" />
            <div 
              className="absolute top-1/2 right-0 h-1.5 bg-gradient-to-l from-amber-400 to-amber-500 -translate-y-1/2 z-0 transition-all duration-700 rounded-full shadow-lg shadow-amber-500/30"
              style={{ width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%` }}
            />

            {statusSteps.map((step, idx) => {
              const isDone = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30 scale-110 shadow-xl shadow-amber-500/40'
                        : isDone
                        ? 'bg-amber-500/90 text-slate-950'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : idx + 1}
                  </div>

                  <span className={`text-[11px] sm:text-xs font-bold mt-2 whitespace-nowrap ${
                    isCurrent ? 'text-amber-400 font-black' : isDone ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    {step.titleAr}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:block">
                    {step.descAr}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Grid: Live Map View + Driver & Details Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Top (Map Column: 7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                <span>الخريطة الحية - مسار المندوب في صنعاء</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-slate-300 border border-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 text-amber-400 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'تحديث تلقائي مفعل' : 'إيقاف مؤقت'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Live Map Canvas Container */}
            <div className="relative h-72 sm:h-80 rounded-3xl bg-[#14141E] border-2 border-amber-500/30 overflow-hidden shadow-2xl group">
              
              {/* Map Background Grid & Roads Pattern */}
              <div 
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `radial-gradient(#38384A 1.5px, transparent 1.5px)`,
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Vector Roads Overlay of Sanaa */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Major Arterial Roads in Sanaa */}
                <path d="M 50 40 Q 200 120 420 80 T 700 180" stroke="#2D2D3D" strokeWidth="6" fill="none" />
                <path d="M 120 20 Q 180 180 220 320" stroke="#2D2D3D" strokeWidth="5" fill="none" />
                <path d="M 320 0 Q 300 160 360 320" stroke="#2D2D3D" strokeWidth="4" fill="none" />
                <path d="M 0 160 Q 240 180 600 240" stroke="#2D2D3D" strokeWidth="5" fill="none" />

                {/* Active Delivery Route Trail with Animated Dashes */}
                <path 
                  d="M 140 70 Q 220 130 280 180 T 460 220" 
                  stroke="url(#routeGradient)" 
                  strokeWidth="4" 
                  strokeDasharray="8 4" 
                  className="animate-pulse"
                  fill="none" 
                />

                {/* City Landmarks Text */}
                <text x="110" y="60" fill="#94A3B8" fontSize="11" fontWeight="bold">مستودع الذهب الأسود (شعوب)</text>
                <text x="210" y="140" fill="#64748B" fontSize="10">ميدان التحرير</text>
                <text x="290" y="120" fill="#64748B" fontSize="10">السبعين</text>
                <text x="430" y="250" fill="#F59E0B" fontSize="11" fontWeight="bold">حدة (شارع صخر) 📍</text>
              </svg>

              {/* Central Warehouse Marker */}
              <div className="absolute top-14 right-14 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="flex flex-col items-center">
                  <div className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 text-[9px] font-bold border border-slate-800 shadow">
                    المستودع الرئيسي
                  </div>
                  <div className="w-6 h-6 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center text-amber-400 mt-1 shadow">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                </div>
              </div>

              {/* Customer Destination Marker */}
              <div className="absolute bottom-16 left-16 -translate-x-1/2 translate-y-1/2 z-10">
                <div className="flex flex-col items-center">
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-black shadow-lg animate-bounce">
                    📍 موقعك ({activeOrder.address.district})
                  </div>
                  <div className="relative mt-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl">
                      <MapPin className="w-4 h-4 fill-emerald-400" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                  </div>
                </div>
              </div>

              {/* Live Driver Motorbike Marker with Dynamic Position */}
              <div 
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear"
                style={{
                  top: `${20 + (driverProgress * 0.55)}%`,
                  right: `${15 + (driverProgress * 0.65)}%`
                }}
              >
                <div className="flex flex-col items-center">
                  {/* Driver Speech Pill */}
                  <div className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xl whitespace-nowrap flex items-center gap-1 border border-amber-300">
                    <span>🛵 الكابتن في الطريق ({remainingMinutes} د)</span>
                  </div>

                  {/* Pulsing Driver Icon */}
                  <div className="relative mt-1">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/50 border-2 border-amber-300 transform -rotate-12">
                      <Truck className="w-6 h-6 fill-slate-950" />
                    </div>
                    <div className="absolute -inset-2 rounded-2xl bg-amber-400/30 animate-ping pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Live Coordinates and Speed HUD at Bottom */}
              <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-300 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>GPS: {currentDriverLat.toFixed(4)}° N, {currentDriverLng.toFixed(4)}° E</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 font-bold">السرعة: 32 كم/س</span>
                  <span className="text-slate-400">صنعاء - اليمن</span>
                </div>
              </div>

            </div>

            {/* Slider to manually inspect different stages */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs gap-3">
              <span className="text-slate-400 font-bold shrink-0">محاكاة سرعة المندوب:</span>
              <input
                type="range"
                min="5"
                max="100"
                value={driverProgress}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDriverProgress(val);
                  if (val >= 98) setSimulatedStatus('delivered');
                  else if (val >= 50) setSimulatedStatus('delivering');
                  else if (val >= 25) setSimulatedStatus('shipped');
                  else setSimulatedStatus('preparing');
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="font-mono text-amber-400 font-bold shrink-0">{Math.round(driverProgress)}%</span>
            </div>
          </div>

          {/* Right Column: Driver Info & Package Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Captain / Mandoub Profile Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/25 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-amber-400 uppercase">مندوب التوصيل المعتمد</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  ★ 4.9 (480 توصيلة)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black text-lg shadow-md">
                  {activeOrder.driverName ? activeOrder.driverName.charAt(0) : 'أ'}
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-black text-white text-sm">{activeOrder.driverName || 'الكابتن / أحمد الكبسي'}</h4>
                  <p className="text-[11px] text-slate-400">دراجة نارية مجهزة بصندوق حراري عازل للرطوبة</p>
                </div>
              </div>

              {/* Direct Quick Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${activeOrder.driverPhone || '770099887'}`}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>اتصال مباشر</span>
                </a>

                <a
                  href={`https://wa.me/967${activeOrder.driverPhone || '770099887'}?text=${encodeURIComponent(`مرحباً كابتن ${activeOrder.driverName || 'أحمد'}، أنا العميل بخصوص طلب فحم الذهب الأسود رقم (${activeOrder.orderNumber}). أرجو إشعاري عند الاقتراب من موقعي.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>مراسلة واتساب</span>
                </a>
              </div>
            </div>

            {/* Delivery Address & Customer Instructions */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <MapPin className="w-4 h-4" />
                <span>عنوان التوصيل المسجل:</span>
              </div>
              
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-850 space-y-1">
                <span className="font-extrabold text-white block">{activeOrder.address.district}</span>
                <p className="text-slate-300">{activeOrder.address.street}</p>
                {activeOrder.address.landmark && (
                  <p className="text-[11px] text-amber-400/90">معلم بارز: {activeOrder.address.landmark}</p>
                )}
                {activeOrder.notes && (
                  <div className="pt-2 mt-2 border-t border-slate-800 text-[11px] text-slate-300 italic">
                    ملاحظتك للمندوب: "{activeOrder.notes}"
                  </div>
                )}
              </div>
            </div>

            {/* Package Contents & Bill Summary */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">محتويات الشحنة والعبوات:</span>
                <span className="text-amber-400 font-black">
                  {activeOrder.items.reduce((sum, it) => sum + it.quantity, 0)} عبوة
                </span>
              </div>

              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                {activeOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-850 text-slate-200">
                    <div className="space-y-0.5">
                      <span className="font-bold block text-white text-[11px]">{it.productNameAr}</span>
                      <span className="text-[10px] text-amber-400">{it.weight} × {it.quantity}</span>
                    </div>
                    <span className="font-black text-amber-300 font-mono">{(it.unitPrice * it.quantity).toLocaleString()} YER</span>
                  </div>
                ))}
              </div>

              {/* Total & Payment Method */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">طريقة الدفع:</span>
                  <span className="text-emerald-400 font-bold">
                    {activeOrder.paymentMethod === 'cod' ? 'نقداً عند الاستلام (كاش)' : 'بنك الكريمي / حاسب'}
                  </span>
                </div>

                <div className="text-left">
                  <span className="text-slate-400 block text-[10px]">المبلغ الإجمالي للفاتورة:</span>
                  <span className="text-sm font-black text-amber-400 font-mono">
                    {activeOrder.total.toLocaleString()} ريال يمني
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Guarantee */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-amber-300/90 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>ضمان الذهب الأسود: فحم نقي 100% بدون دخان مع (+10g مجاناً) في كل كيس.</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-black text-xs hover:brightness-110 transition-all cursor-pointer mr-auto"
          >
            إغلاق شاشة التتبع
          </button>
        </div>

      </div>
    </div>
  );
};
