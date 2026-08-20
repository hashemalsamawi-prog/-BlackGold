import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Lock, ShieldCheck, ArrowRight, LogIn, ChevronRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userName: string) => void;
  onOpenMandoub?: () => void;
  onOpenAdmin?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenMandoub,
  onOpenAdmin
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('771234567');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('هاشم السماوي');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(name || 'عميل الذهب الأسود');
    onClose();
  };

  const handleGoogleLogin = () => {
    onLoginSuccess('هاشم السماوي (Google)');
    onClose();
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
        className="bg-[#121218] border border-amber-500/40 rounded-3xl max-w-md w-full p-4 sm:p-6 text-slate-100 relative shadow-2xl space-y-4 my-auto max-h-[92vh] overflow-y-auto text-right"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 hover:border-amber-500/40 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
              title="الرجوع للشاشة السابقة"
            >
              <ChevronRight className="w-4 h-4 text-amber-400" />
              <span>رجوع</span>
            </button>

            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">
                {mode === 'login' ? 'تسجيل الدخول لحسابك' : 'إنشاء حساب جديد'}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400">متجر الذهب الأسود لمنتجات الفحم الفاخر</p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>


        {/* Google Quick Sign-In */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3s.7 5.6 1.9 8l3.7-2.9c-.3-.8-.4-1.6-.4-2.4z" />
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 22.3z" />
          </svg>
          <span>متابعة باستخدام حساب Google</span>
        </button>

        <div className="relative text-center my-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
          <span className="relative bg-[#121218] px-3 text-[11px] text-slate-500 font-bold">أو بالبريد والهاتف</span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block text-slate-300 font-bold mb-1">الاسم الكامل:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-bold mb-1">رقم الهاتف أو البريد الإلكتروني:</label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">كلمة المرور:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl gold-gradient-bg text-slate-950 font-black hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>{mode === 'login' ? 'الدخول للحساب' : 'إنشاء الحساب الآن'}</span>
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              ليس لديك حساب؟{' '}
              <button onClick={() => setMode('register')} className="text-amber-400 font-bold underline">
                سجل الآن
              </button>
            </p>
          ) : (
            <p>
              لديك حساب بالفعل؟{' '}
              <button onClick={() => setMode('login')} className="text-amber-400 font-bold underline">
                تسجيل الدخول
              </button>
            </p>
          )}
        </div>

        {/* Staff & Fleet Portals */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          {onOpenMandoub && (
            <button
              onClick={() => {
                onClose();
                onOpenMandoub();
              }}
              className="text-amber-400/90 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>🛵 دخول كابتن التوصيل (المندوب)</span>
            </button>
          )}

          {onOpenAdmin && (
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="text-slate-400 hover:text-slate-200 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>👑 لوحة المالك</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
