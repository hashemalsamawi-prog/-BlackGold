import React, { StrictMode, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class RootErrorBoundary extends React.Component<Props, State> {
  props: Props;
  state: State = {
    hasError: false,
    errorMessage: '',
  };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: any): State {
    return {
      hasError: true,
      errorMessage: error?.message || String(error) || 'Render Exception',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("RootErrorBoundary caught error:", error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn("Could not clear storage:", e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex items-center justify-center p-4 font-['Cairo',sans-serif] dir-rtl text-right">
          <div className="max-w-md w-full bg-[#121217] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-3xl">
              👑
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-amber-400">متجر الذهب الأسود (Black Gold)</h2>
              <p className="text-sm text-slate-300">
                حدث خطأ أثناء تحميل واجهة المتجر.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-400 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-left font-mono break-all max-h-28 overflow-y-auto">
              {this.state.errorMessage}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 text-slate-950 font-black text-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                🔄 إعادة تحديث المتجر
              </button>
              <button
                onClick={this.handleReset}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs active:scale-95 transition-all cursor-pointer"
                title="مسح الذاكرة المؤقتة وإعادة التشغيل"
              >
                مسح البيانات المؤقتة
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </StrictMode>,
  );
}
