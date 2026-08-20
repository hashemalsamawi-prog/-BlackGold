import React, { useState, useEffect } from 'react';
import { CartItem, Language, DeliveryAddress } from '../types';
import { PAYMENT_METHODS } from '../data/mockData';
import { 
  X, 
  CheckCircle, 
  CreditCard, 
  Banknote, 
  Wallet, 
  Phone, 
  User, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Printer, 
  ChevronRight, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Logo } from './Logo';
import { getTimeGreeting } from '../utils/greeting';
import { AddressManager } from './AddressManager';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  lang: Language;
  shippingFee: number;
  discount: number;
  customerNotes: string;
  selectedDistrictName: string;
  addresses: DeliveryAddress[];
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  onSaveAddress: (address: DeliveryAddress) => void;
  onUpdateAddress: (address: DeliveryAddress) => void;
  onDeleteAddress: (id: string) => void;
  onOrderPlaced: (order: any) => void;
  onOpenTracking?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  lang,
  shippingFee,
  discount,
  customerNotes,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onSaveAddress,
  onUpdateAddress,
  onDeleteAddress,
  onOrderPlaced,
  onOpenTracking
}) => {
  const [customerName, setCustomerName] = useState('هاشم السماوي');
  const [customerPhone, setCustomerPhone] = useState('771234567');
  const [orderNotes, setOrderNotes] = useState(customerNotes || '');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderData, setPlacedOrderData] = useState<any>(null);
  const [hasAddressValidationError, setHasAddressValidationError] = useState(false);

  // Sync initial state when modal opens
  useEffect(() => {
    if (customerNotes) {
      setOrderNotes(customerNotes);
    }
    setHasAddressValidationError(false);
  }, [isOpen, customerNotes]);

  // Handle ESC key to go back
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

  const customerGreeting = getTimeGreeting(customerName, lang);

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = Math.max(0, subtotal + shippingFee - discount);

  // Find currently selected address
  const activeSelectedAddress = addresses.find((a) => a.id === selectedAddressId) || (addresses.length === 1 ? addresses[0] : null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT VALIDATION: The customer MUST have a valid saved address selected
    if (!activeSelectedAddress) {
      setHasAddressValidationError(true);
      // Scroll to address area
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      return;
    }

    setHasAddressValidationError(false);
    setIsSubmitting(true);

    const fullAddressPayload: DeliveryAddress = {
      id: activeSelectedAddress.id,
      title: activeSelectedAddress.title,
      city: activeSelectedAddress.city || 'صنعاء',
      district: activeSelectedAddress.district,
      street: activeSelectedAddress.street,
      landmark: activeSelectedAddress.landmark || '',
      notes: orderNotes.trim() || activeSelectedAddress.notes || '',
      coordinates: activeSelectedAddress.coordinates || { lat: 15.348, lng: 44.191 }
    };

    const payload = {
      items: cart.map((c) => ({
        productId: c.product.id,
        productNameAr: c.product.nameAr,
        weight: c.selectedWeight,
        quantity: c.quantity,
        unitPrice: c.unitPrice
      })),
      subtotal,
      shippingFee,
      discount,
      total,
      address: fullAddressPayload,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      paymentMethod,
      notes: orderNotes.trim()
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setPlacedOrderData(data.data);
        onOrderPlaced(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch {
      // Fallback local order placement
      const mockOrd = {
        id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
        orderNumber: "BG-2026-" + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toISOString().substring(0, 16).replace('T', ' '),
        status: 'received',
        items: payload.items,
        subtotal,
        shippingFee,
        discount,
        total,
        address: fullAddressPayload,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        paymentMethod,
        notes: orderNotes.trim(),
        driverName: "أحمد الكبسي",
        driverPhone: "770099887"
      };
      setPlacedOrderData(mockOrd);
      onOrderPlaced(mockOrd);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        // Tap outside modal backdrop to close/return
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-[#121218] border border-amber-500/40 rounded-3xl max-w-2xl w-full p-4 sm:p-6 text-slate-100 relative shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar with prominent Back Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 hover:border-amber-500/50 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
              title="الرجوع للشاشة السابقة"
            >
              <ChevronRight className="w-4 h-4 text-amber-400" />
              <span>رجوع</span>
            </button>

            <div className="hidden xs:block">
              <h2 className="text-sm sm:text-base font-black text-white">إتمام طلب الفحم وتأكيد الفاتورة</h2>
              <p className="text-[10px] text-slate-400">شركة الذهب الأسود - للتوصيل الفوري (صنعاء)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Logo variant="horizontal" size="sm" showSubtext={false} />
            <button 
              type="button"
              onClick={onClose} 
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
              title="إغلاق الشاشة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {placedOrderData ? (
          /* Success Screen & Printable Invoice */
          <div className="py-2 text-center space-y-5">
            {/* Invoice Header Brand Badge */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#181820] to-[#0D0D12] border border-amber-500/40 shadow-2xl relative overflow-hidden text-right">
              <div className="flex flex-col items-center justify-center space-y-2 mb-3">
                <Logo variant="full" size="md" />
                <div className="text-xs text-amber-400 font-bold border-b border-amber-500/20 pb-1 w-full max-w-xs text-center">
                  فاتورة مبيعات معتمدة • الشحن السريع بصنعاء
                </div>
              </div>

              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto my-2">
                <CheckCircle className="w-7 h-7" />
              </div>

              <div className="space-y-1 text-center">
                <h3 className="text-lg sm:text-xl font-black text-white">تم استلام الطلب وتأكيد الفاتورة! 🎉</h3>
                <p className="text-xs text-amber-300 font-mono font-black">رقم الفاتورة: {placedOrderData.orderNumber}</p>
              </div>

              {/* Printable Invoice Summary Table */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5 text-xs mt-4">
                <div className="flex justify-between text-slate-300 border-b border-slate-850 pb-1.5">
                  <span className="font-semibold text-slate-400">اسم العميل:</span>
                  <span className="font-bold text-white">{placedOrderData.customerName}</span>
                </div>
                
                <div className="flex justify-between text-slate-300 border-b border-slate-850 pb-1.5">
                  <span className="font-semibold text-slate-400">رقم الهاتف للتواصل:</span>
                  <span className="font-bold text-white font-mono">{placedOrderData.customerPhone}</span>
                </div>

                <div className="flex justify-between text-slate-300 border-b border-slate-850 pb-1.5">
                  <span className="font-semibold text-slate-400">موقع وعنوان التوصيل المختار:</span>
                  <span className="font-black text-amber-400">{placedOrderData.address.title} ({placedOrderData.address.district})</span>
                </div>

                <div className="flex justify-between text-slate-300 border-b border-slate-850 pb-1.5">
                  <span className="font-semibold text-slate-400">الشارع وتفاصيل العنوان:</span>
                  <span className="font-bold text-slate-200">{placedOrderData.address.street}</span>
                </div>

                {placedOrderData.address.landmark && (
                  <div className="flex justify-between text-slate-300 border-b border-slate-850 pb-1.5">
                    <span className="font-semibold text-slate-400">أقرب معلم بارز:</span>
                    <span className="font-bold text-amber-300">{placedOrderData.address.landmark}</span>
                  </div>
                )}

                <div className="my-2 border-t border-slate-800 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1.5">المنتجات المطلوبة:</span>
                  <div className="space-y-1.5">
                    {placedOrderData.items.map((it: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-slate-200 text-xs bg-slate-900/60 p-2 rounded-lg">
                        <span className="font-semibold">{it.productNameAr} ({it.weight}) × {it.quantity}</span>
                        <span className="font-mono text-amber-400 font-bold">{(it.unitPrice * it.quantity).toLocaleString()} YER</span>
                      </div>
                    ))}
                  </div>
                </div>

                {placedOrderData.notes && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium text-[11px]">
                    ملاحظات التوصيل: "{placedOrderData.notes}"
                  </div>
                )}
                
                <div className="flex justify-between text-amber-400 font-black text-sm pt-2.5 border-t border-slate-800">
                  <span>إجمالي الفاتورة المطلوب للمندوب:</span>
                  <span className="text-base sm:text-lg font-mono">{placedOrderData.total.toLocaleString()} YER</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <a
                  href={`https://wa.me/967775000150?text=${encodeURIComponent(
                    `*طلب فحم جديد - شركة الذهب الأسود* 👑\n-------------------------------\n*رقم الفاتورة:* ${placedOrderData.orderNumber}\n*اسم العميل:* ${placedOrderData.customerName}\n*رقم التواصل:* ${placedOrderData.customerPhone}\n*الموقع المحفوظ:* ${placedOrderData.address?.title || 'موقع العميل'}\n*المنطقة بصنعاء:* ${placedOrderData.address?.district || 'صنعاء'}\n*الشارع والعنوان:* ${placedOrderData.address?.street || ''}\n${placedOrderData.address?.landmark ? `*معلم بارز:* ${placedOrderData.address.landmark}\n` : ''}-------------------------------\n*الطلبات:*\n${placedOrderData.items.map((it: any) => `• ${it.productNameAr} (${it.weight}) × ${it.quantity} = ${(it.unitPrice * it.quantity).toLocaleString()} YER`).join('\n')}\n-------------------------------\n*إجمالي الفاتورة:* ${placedOrderData.total.toLocaleString()} YER\n*وسيلة الدفع:* ${placedOrderData.paymentMethod === 'cod' ? 'دفع عند الاستلام (كاش)' : 'تحويل بنكي / كريمي'}\n${placedOrderData.notes ? `*ملاحظات التوصيل:* ${placedOrderData.notes}\n` : ''}-------------------------------\nيرجى تأكيد التوصيل السريع لـ صنعاء. شكراً لكم!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  إرسال الطلب عبر الواتساب (WhatsApp) 💬
                </a>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  طباعة الفاتورة 📄
                </button>
              </div>

              {/* Live Tracking Link */}
              <div className="pt-4 border-t border-slate-850 mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenTracking) onOpenTracking();
                  }}
                  className="px-5 py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-black text-xs hover:brightness-110 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  تتبع مسار المندوب المباشر (GPS) 🗺️
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Order Form with Forced Saved Location Selection & Manual Addition */
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            
            {/* Friendly Personalized Greeting Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{customerGreeting.icon}</span>
                <div>
                  <span className="font-black text-amber-300 block">{customerGreeting.greeting}</span>
                  <span className="text-[11px] text-slate-400">توصيل سريع لفحم الذهب الأسود لباب منزلك بصنعاء</span>
                </div>
              </div>
              <span className="font-mono text-amber-400/80 text-[11px] font-bold hidden sm:inline">{customerGreeting.formattedTime}</span>
            </div>

            {/* Customer Details Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  اسم العميل الثلاثي: <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: هاشم السماوي"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-500 pr-9 text-xs font-bold"
                  />
                  <User className="w-4 h-4 text-amber-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  رقم الهاتف للتواصل واتساب / اتصال: <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="مثال: 771234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-500 pr-9 text-xs font-mono font-bold"
                  />
                  <Phone className="w-4 h-4 text-amber-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Dynamic Saved Address Management & Forced Selection Section */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3">
              <AddressManager
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={(id) => {
                  onSelectAddress(id);
                  setHasAddressValidationError(false);
                }}
                onSaveAddress={onSaveAddress}
                onUpdateAddress={onUpdateAddress}
                onDeleteAddress={onDeleteAddress}
                isMandatorySelection={true}
                hasValidationError={hasAddressValidationError}
                onClearValidationError={() => setHasAddressValidationError(false)}
              />
            </div>

            {/* Optional Additional Order Notes */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">
                ملاحظات أو توجيهات إضافية خاصة بالطلب (اختياري):
              </label>
              <input
                type="text"
                placeholder="مثال: يرجى تجهيز الفحم قبل صلاة المغرب، أو الدفع عبر الكريمي..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 p-2.5 rounded-xl outline-none focus:border-amber-500 text-xs"
              />
            </div>

            {/* Payment Options Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-amber-400">وسيلة الدفع المناسبة بالسوق المحلي:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-xs flex items-center justify-between ${
                      paymentMethod === method.id
                        ? 'bg-amber-500/20 border-amber-500 text-white font-bold shadow-md'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-white">{method.nameAr}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{method.descAr}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank details preview if Kuraimi selected */}
            {paymentMethod === 'kuraimi' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
                <p className="font-bold">حساب حاسب / بنك الكريمي:</p>
                <p className="font-mono text-sm font-black text-white">21234567 - باسم شركة الذهب الأسود للفحم</p>
                <p className="text-[10px] text-slate-400">يرجى تحويل المبلغ والاحتفاظ ببرينت التحويل للمندوب عند الاستلام.</p>
              </div>
            )}

            {/* Total Price & Submit */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">المبلغ الإجمالي المطلوب بالريال:</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{total.toLocaleString()} YER</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
                >
                  إلغاء / رجوع
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 sm:px-6 py-3 rounded-xl gold-gradient-bg text-slate-950 font-black text-xs sm:text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {isSubmitting ? 'جاري التأكيد...' : 'تأكيد وإرسال الطلب للمندوب ⚡'}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
