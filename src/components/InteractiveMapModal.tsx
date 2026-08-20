import React, { useState, useEffect } from 'react';
import { DeliveryAddress, SanaaCoordinates } from '../types';
import { X, MapPin, Navigation, Plus, Check, Compass, Home, Building2, Coffee, Tent, ChevronRight, Trash2, Edit3 } from 'lucide-react';

interface InteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: DeliveryAddress[];
  onSaveAddress: (address: DeliveryAddress) => void;
  onUpdateAddress?: (address: DeliveryAddress) => void;
  onDeleteAddress?: (id: string) => void;
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
}

const PRESET_CHIPS = [
  { label: 'المنزل', emoji: '🏠' },
  { label: 'العمل / المكتب', emoji: '🏢' },
  { label: 'كافيه / مطعم', emoji: '☕' },
  { label: 'استراحة / شاليه', emoji: '🏕️' },
  { label: 'موقع آخر', emoji: '📍' },
];

export const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({
  isOpen,
  onClose,
  addresses,
  onSaveAddress,
  onUpdateAddress,
  onDeleteAddress,
  selectedAddressId,
  onSelectAddress
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'new'>('saved');

  // New address state
  const [title, setTitle] = useState('المنزل');
  const [city, setCity] = useState('صنعاء');
  const [district, setDistrict] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Pin coordinate simulation for Sanaa map
  const [pinnedCoords, setPinnedCoords] = useState<SanaaCoordinates>({ lat: 15.348, lng: 44.191 });
  const [pinPlaced, setPinPlaced] = useState(true);

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

  const handleSimulatedMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click position to approximate Sana'a coordinates
    const lat = 15.450 - (y / rect.height) * 0.200;
    const lng = 44.100 + (x / rect.width) * 0.200;
    
    setPinnedCoords({ lat: Number(lat.toFixed(4)), lng: Number(lng.toFixed(4)) });
    setPinPlaced(true);
  };

  const handleOpenEdit = (addr: DeliveryAddress, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(addr.id);
    setTitle(addr.title);
    setCity(addr.city || 'صنعاء');
    setDistrict(addr.district);
    setStreet(addr.street);
    setLandmark(addr.landmark || '');
    setNotes(addr.notes || '');
    if (addr.coordinates) {
      setPinnedCoords(addr.coordinates);
    }
    setActiveTab('new');
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !district.trim() || !street.trim()) return;

    if (editingId && onUpdateAddress) {
      const updated: DeliveryAddress = {
        id: editingId,
        title: title.trim(),
        city: city.trim() || 'صنعاء',
        district: district.trim(),
        street: street.trim(),
        landmark: landmark.trim(),
        coordinates: pinnedCoords,
        notes: notes.trim(),
        isDefault: false
      };
      onUpdateAddress(updated);
      onSelectAddress(updated.id);
    } else {
      const newAddr: DeliveryAddress = {
        id: "addr-" + Date.now(),
        title: title.trim(),
        city: city.trim() || 'صنعاء',
        district: district.trim(),
        street: street.trim(),
        landmark: landmark.trim(),
        coordinates: pinnedCoords,
        notes: notes.trim(),
        isDefault: addresses.length === 0
      };
      onSaveAddress(newAddr);
      onSelectAddress(newAddr.id);
    }

    setActiveTab('saved');
    setEditingId(null);
    setTitle('المنزل');
    setDistrict('');
    setStreet('');
    setLandmark('');
    setNotes('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-[#121218] border border-amber-500/30 rounded-3xl max-w-3xl w-full p-4 sm:p-6 text-slate-100 relative shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Prominent Back Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-3">
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

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-white">إدارة مواقع التوصيل المباشر (صنعاء)</h2>
                <p className="text-[10px] sm:text-xs text-slate-400">إضافة وتحديد عناوين التوصيل بدقة يدوياً وتحديد الموقع على الخريطة</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => {
              setActiveTab('saved');
              setEditingId(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            مواقعي المحفوظة ({addresses.length})
          </button>
          
          <button
            onClick={() => {
              setActiveTab('new');
              setEditingId(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'new'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{editingId ? 'تعديل الموقع' : '+ إضافة موقع جديد'}</span>
          </button>
        </div>

        {activeTab === 'saved' ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 font-medium">اختر الموقع الفعال للطلب الحالي ليظهر مباشرة في الفاتورة وللمندوب:</p>
            
            {addresses.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-dashed border-amber-500/30 text-center space-y-3">
                <MapPin className="w-8 h-8 text-amber-400 mx-auto opacity-70" />
                <p className="text-xs font-bold text-white">لا توجد مواقع محفوظة بعد</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('new')}
                  className="px-5 py-2 rounded-xl gold-gradient-bg text-slate-950 font-black text-xs cursor-pointer"
                >
                  + إضافة موقعك الأول الآن
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => onSelectAddress(addr.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg ring-1 ring-amber-500/50'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-amber-300 flex items-center gap-1.5">
                          <Home className="w-4 h-4" />
                          {addr.title}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleOpenEdit(addr, e)}
                            className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800"
                            title="تعديل"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>

                          {addresses.length > 1 && onDeleteAddress && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteAddress(addr.id);
                              }}
                              className="p-1 rounded-lg bg-slate-950 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800"
                              title="حذف"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}

                          {isSelected && (
                            <span className="p-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs mr-1">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-snug">
                        <span className="font-bold text-amber-400">{addr.district}</span> • {addr.street}
                      </p>
                      
                      {addr.landmark && (
                        <p className="text-[11px] text-slate-400">معلم بارز: {addr.landmark}</p>
                      )}

                      {addr.notes && (
                        <p className="text-[10px] text-amber-300">ملاحظة: {addr.notes}</p>
                      )}

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                        <span>إحداثيات GPS: {addr.coordinates?.lat || 15.348}, {addr.coordinates?.lng || 44.191}</span>
                        <span className="text-amber-400 font-bold">{addr.city || 'صنعاء'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('new')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 text-xs font-bold cursor-pointer"
              >
                + إضافة موقع جديد
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-black text-xs hover:brightness-110 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                اعتماد الموقع المختار والرجوع
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Interactive Simulated Sanaa Map Canvas */}
            <div className="md:col-span-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>انقر على الخريطة لتسقيط الدبوس لتحديد موقع التوصيل:</span>
                <span className="text-amber-400 font-bold">خريطة صنعاء التفاعلية</span>
              </div>

              <div
                onClick={handleSimulatedMapClick}
                className="relative h-64 sm:h-72 rounded-2xl bg-[#1A1A24] border-2 border-amber-500/40 overflow-hidden cursor-crosshair group shadow-inner"
                style={{
                  backgroundImage: `radial-gradient(#2A2A38 1px, transparent 1px)`,
                  backgroundSize: '16px 16px'
                }}
              >
                {/* Map Grid Roads Visualization */}
                <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                  <path d="M 0 50 Q 150 120 400 100 T 800 200" stroke="#D4AF37" strokeWidth="3" fill="none" />
                  <path d="M 120 0 Q 180 150 200 300" stroke="#D4AF37" strokeWidth="2" fill="none" />
                  <path d="M 300 0 Q 280 200 320 300" stroke="#888" strokeWidth="2" fill="none" />
                  <circle cx="200" cy="120" r="12" fill="#D4AF37" opacity="0.2" />
                  <text x="170" y="145" fill="#D4AF37" fontSize="10" fontWeight="bold">حدة - شارع صخر</text>
                  <text x="50" y="80" fill="#AAA" fontSize="10">السبعين</text>
                  <text x="250" y="60" fill="#AAA" fontSize="10">التحرير</text>
                  <text x="180" y="240" fill="#AAA" fontSize="10">الحصبة</text>
                </svg>

                {/* Drop Pin Indicator */}
                {pinPlaced && (
                  <div
                    className="absolute z-20 -translate-x-1/2 -translate-y-full transition-all duration-200 pointer-events-none"
                    style={{
                      left: `${((pinnedCoords.lng - 44.100) / 0.200) * 100}%`,
                      top: `${((15.450 - pinnedCoords.lat) / 0.200) * 100}%`
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap animate-bounce">
                        📍 تم تحديد موقعك
                      </div>
                      <MapPin className="w-8 h-8 text-amber-400 fill-amber-500 drop-shadow-lg" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-2 right-2 bg-slate-950/90 text-amber-400 text-[10px] font-mono p-1.5 rounded-md border border-slate-800">
                  GPS: {pinnedCoords.lat.toFixed(4)}, {pinnedCoords.lng.toFixed(4)}
                </div>
              </div>
            </div>

            {/* Manual Address Form Inputs */}
            <form onSubmit={handleCreateAddress} className="md:col-span-6 space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">مسمى الموقع:</label>
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {PRESET_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setTitle(chip.label)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        title === chip.label
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      {chip.emoji} {chip.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  placeholder="منزل حدة / شقة السبعين"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الحي / المنطقة في صنعاء (كتابة يدوية):</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حدة، الحي السياسي، السبعين، الصافية، الروضة..."
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-amber-300 p-2.5 rounded-xl outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">اسم الشارع ورقم المبنى:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شارع صخر - خلف سوبرماركت السعيد"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">أقرب معلم بارز للمندوب (اختياري):</label>
                <input
                  type="text"
                  placeholder="أمام سوبرماركت السعيد / بجوار المسجد"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">ملاحظات التوصيل (اختياري):</label>
                <input
                  type="text"
                  placeholder="الدور الثاني / الاتصال عند البوابة"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('saved')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl gold-gradient-bg text-slate-950 font-black text-xs hover:brightness-110 transition-all shadow-md cursor-pointer"
                >
                  {editingId ? 'حفظ التعديلات' : '💾 حفظ وتثبيت الموقع'}
                </button>
              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};
