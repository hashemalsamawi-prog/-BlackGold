import React, { useState, useEffect, useRef } from 'react';
import { Order, Language, DeliveryAgent } from '../types';
import { 
  Truck, Phone, MapPin, CheckCircle, Clock, AlertCircle, MessageSquare, 
  Navigation, Check, X, BellRing, Volume2, VolumeX, Radio, Sparkles, User, 
  ShieldCheck, ArrowRight, ExternalLink, ChevronDown, RefreshCw
} from 'lucide-react';
import { Logo } from './Logo';
import { playOrderAlertSound } from '../utils/soundAlert';
import { getMandoubGreeting, getTimeGreeting } from '../utils/greeting';

interface MandoubPortalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], driverNotes?: string) => void;
  lang: Language;
  driverName?: string;
  availableDrivers?: DeliveryAgent[];
  onSelectDriver?: (driverName: string) => void;
  isOwnerPreview?: boolean;
  onBackToAdmin?: () => void;
}

export const MandoubPortal: React.FC<MandoubPortalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  lang,
  driverName = 'أحمد الكبسي',
  availableDrivers = [],
  onSelectDriver,
  isOwnerPreview = false,
  onBackToAdmin
}) => {
  if (!isOpen) return null;

  const [currentDriver, setCurrentDriver] = useState<string>(driverName);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [driverNotesMap, setDriverNotesMap] = useState<Record<string, string>>({});
  
  // Mandoub Notifications State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [latestMandoubNotif, setLatestMandoubNotif] = useState<string | null>(null);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (onBackToAdmin) {
          onBackToAdmin();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onBackToAdmin]);

  useEffect(() => {
    setCurrentDriver(driverName);
  }, [driverName]);


  const activeDriverInfo = availableDrivers.find(d => d.name === currentDriver) || {
    id: 'dr-1',
    name: currentDriver,
    phone: '770099887',
    vehicleType: 'motorcycle',
    districtZone: 'حدة والسبعين وعطان',
    activeOrdersCount: 2,
    deliveredCount: 148,
    rating: 4.95,
    isOnline: true,
    vehiclePlate: 'صنعاء - 14920 د'
  };

  const driverGreeting = getMandoubGreeting(currentDriver, lang);
  const timeInfo = getTimeGreeting(currentDriver, lang);

  const prevMandoubOrdersRef = useRef(orders.length);

  useEffect(() => {
    if (orders.length > prevMandoubOrdersRef.current) {
      const latestOrd = orders[0];
      setLatestMandoubNotif(`🔔 تنبيه للمندوب (${currentDriver}): وصول طلب توصيل جديد (#${latestOrd?.orderNumber || 'BG-NEW'}) لمنطقة ${latestOrd?.address?.district || 'صنعاء'}!`);
      if (soundEnabled) {
        playOrderAlertSound(0.8);
      }
      const t = setTimeout(() => setLatestMandoubNotif(null), 7000);
      prevMandoubOrdersRef.current = orders.length;
      return () => clearTimeout(t);
    }
    prevMandoubOrdersRef.current = orders.length;
  }, [orders, soundEnabled, currentDriver]);

  const triggerMandoubTestAlert = () => {
    if (soundEnabled) {
      playOrderAlertSound(0.85);
    }
    setLatestMandoubNotif(`🔔 إشعار تجريبي للكابتن ${currentDriver}: تم اختبار جرس تنبيه الطلبات بنجاح!`);
    setTimeout(() => setLatestMandoubNotif(null), 5000);
  };

  // Filter orders for this driver's scope or all active in Sanaa
  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'active') return o.status === 'shipped' || o.status === 'delivering' || o.status === 'received' || o.status === 'preparing';
    if (filterStatus === 'delivered') return o.status === 'delivered';
    return true;
  });

  const handleDriverStatusUpdate = (orderId: string, nextStatus: Order['status']) => {
    const note = driverNotesMap[orderId] || '';
    onUpdateOrderStatus(orderId, nextStatus, note);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (onBackToAdmin) {
            onBackToAdmin();
          } else {
            onClose();
          }
        }
      }}
    >
      <div 
        className="bg-[#101017] border-2 border-amber-500/50 rounded-3xl max-w-4xl w-full p-4 sm:p-6 text-slate-100 relative shadow-2xl space-y-4 my-6 text-right max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Owner Simulator Banner if opened by Store Owner */}
        {isOwnerPreview && (
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 p-2.5 rounded-xl font-bold text-xs flex flex-wrap items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>👑 <strong>وضع المالك الحصري:</strong> أنت الآن تشاهد وتختبر شاشة المندوب الميداني الحية بدقة</span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Driver Switcher for Owner */}
              {availableDrivers.length > 0 && (
                <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-lg">
                  <span className="text-[11px] font-bold text-black">تبديل المندوب:</span>
                  <select
                    value={currentDriver}
                    onChange={(e) => {
                      setCurrentDriver(e.target.value);
                      if (onSelectDriver) onSelectDriver(e.target.value);
                    }}
                    className="bg-slate-950 text-amber-300 text-xs font-bold px-2 py-0.5 rounded border border-amber-400 outline-none"
                  >
                    {availableDrivers.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.districtZone})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {onBackToAdmin && (
                <button
                  onClick={onBackToAdmin}
                  className="bg-slate-950 hover:bg-slate-900 text-amber-300 px-3 py-1 rounded-lg text-xs font-black transition-all border border-amber-400/50 flex items-center gap-1 cursor-pointer"
                >
                  <span>العودة للداشبورد ↩</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Live Top Notification Banner */}
        {latestMandoubNotif && (
          <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-500/20 border border-amber-500/60 p-2.5 rounded-xl text-xs font-bold text-amber-300 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{latestMandoubNotif}</span>
            </div>
            <button onClick={() => setLatestMandoubNotif(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToAdmin || onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 hover:border-amber-500/40 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
              title={onBackToAdmin ? 'العودة للداشبورد' : 'الرجوع للمتجر'}
            >
              <span>{onBackToAdmin ? 'رجوع للداشبورد' : 'رجوع للمتجر'}</span>
            </button>

            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white">
                  بوابة كابتن التوصيل السريع بصنعاء
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  متصل ومستعد
                </span>
              </div>
              <p className="text-[11px] text-amber-300 font-bold mt-0.5">
                {driverGreeting} • {timeInfo.greeting}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
                soundEnabled 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
              title={soundEnabled ? 'صوت التنبيهات مفعل' : 'صوت التنبيهات مكتوم'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Test Sound */}
            <button
              onClick={triggerMandoubTestAlert}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold"
              title="تجربة صوت التنبيه"
            >
              <BellRing className="w-4 h-4 text-amber-400" />
            </button>

            <button onClick={onClose} className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Driver Quick Profile Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">اسم الكابتن:</span>
            <span className="font-bold text-white text-xs sm:text-sm">{activeDriverInfo.name}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">نطاق التغطية:</span>
            <span className="font-bold text-amber-400 text-xs sm:text-sm">{activeDriverInfo.districtZone}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">الطلبات المسلمة بنجاح:</span>
            <span className="font-bold text-emerald-400 text-xs sm:text-sm">{activeDriverInfo.deliveredCount} طلب (⭐ {activeDriverInfo.rating})</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">لوحة المركبة / الدراجة:</span>
            <span className="font-mono font-bold text-slate-300 text-xs">{activeDriverInfo.vehiclePlate || 'صنعاء - 14920 د'}</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex gap-2">
            {[
              { id: 'all', label: `جميع الشحنات (${orders.length})` },
              { id: 'active', label: `طلبات قيد التوصيل (${orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length})` },
              { id: 'delivered', label: `تم تسليمها (${orders.filter(o => o.status === 'delivered').length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            متوسط وقت التوصيل المستهدف: <strong className="text-amber-400">45 دقيقة</strong>
          </span>
        </div>

        {/* Orders Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Truck className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="font-bold text-slate-300">لا توجد طلبات توصيل حالياً ضمن هذا التبويب</p>
              <p className="text-xs text-slate-500">سيظهر هنا أي طلب فحم جديد فور اعتماده من المتجر</p>
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 text-xs ${
                  ord.status === 'delivered'
                    ? 'bg-slate-900/50 border-emerald-500/30'
                    : 'bg-[#151520] border-amber-500/40 shadow-lg'
                }`}
              >
                {/* Top Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-amber-400 font-mono">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">({ord.date})</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                      ord.status === 'delivered'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : ord.status === 'delivering'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}>
                      {ord.status === 'received' && 'تم الاستلام بالمتجر'}
                      {ord.status === 'preparing' && 'قيد تجهيز وتعبئة الفحم'}
                      {ord.status === 'shipped' && 'جاهز للتسليم للكابتن'}
                      {ord.status === 'delivering' && 'جاري التوصيل للعميل الآن 🛵'}
                      {ord.status === 'delivered' && 'تم التسليم والتحصيل بنجاح ✅'}
                      {ord.status === 'cancelled' && 'ملغي'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Call Customer Button */}
                    <a
                      href={`tel:${ord.customerPhone}`}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 font-bold flex items-center gap-1 transition-all"
                    >
                      <Phone className="w-3 h-3" />
                      <span>اتصال ({ord.customerPhone})</span>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/967${ord.customerPhone.replace(/[^0-9]/g, '')}?text=مرحباً%20${encodeURIComponent(ord.customerName)}،%20معك%20كابتن%20التوصيل%20من%20متجر%20الذهب%20الأسود%20بخصوص%20طلبك%20رقم%20${ord.orderNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50 font-bold flex items-center gap-1"
                    >
                      <span>واتساب 💬</span>
                    </a>
                  </div>
                </div>

                {/* Customer Details & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[11px] block">اسم العميل:</span>
                    <strong className="text-white text-xs">{ord.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">العنوان وموقع التوصيل بصنعاء:</span>
                    <strong className="text-amber-300 text-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{ord.address.district} - {ord.address.street} {ord.address.landmark ? `(بجوار ${ord.address.landmark})` : ''}</span>
                    </strong>
                  </div>
                </div>

                {/* Customer Note */}
                {ord.notes && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium">
                    💬 <strong>ملاحظة العميل للكابتن:</strong> "{ord.notes}"
                  </div>
                )}

                {/* Order Items Table */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold">المنتجات المطلوبة:</span>
                  <div className="space-y-1">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-900/40 px-3 py-1.5 rounded-lg text-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="font-bold">{it.productNameAr} ({it.weight})</span>
                          <span className="text-slate-400 text-[11px]">× {it.quantity} عبوة</span>
                        </div>
                        <span className="font-mono text-amber-400 font-bold">
                          {(it.unitPrice * it.quantity).toLocaleString()} YER
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary & Payment */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">طريقة التحصيل:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold">
                      {ord.paymentMethod === 'cod' ? '💵 نقداً عند الاستلام' : '💳 تحويل بنكي / الكريمي'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-slate-400 text-[10px] block">المبلغ المطلوب تحصيله:</span>
                      <span className="text-base font-black text-amber-400 font-mono">
                        {ord.total.toLocaleString()} YER
                      </span>
                    </div>
                  </div>
                </div>

                {/* Driver Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                  {ord.status !== 'delivering' && ord.status !== 'delivered' && (
                    <button
                      onClick={() => handleDriverStatusUpdate(ord.id, 'delivering')}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>بدء التوصيل الآن (في الطريق) 🛵</span>
                    </button>
                  )}

                  {ord.status === 'delivering' && (
                    <button
                      onClick={() => handleDriverStatusUpdate(ord.id, 'delivered')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer text-xs"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>تم تسليم الطلب وتحصيل {ord.total.toLocaleString()} YER بنجاح ✅</span>
                    </button>
                  )}

                  {ord.status === 'delivered' && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <Check className="w-4 h-4" />
                      <span>تم إنجاز وتوثيق هذا الطلب بنجاح</span>
                    </span>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
