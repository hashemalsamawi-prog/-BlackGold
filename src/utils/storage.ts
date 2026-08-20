/**
 * Safe local storage and image compression utilities
 * Prevents QuotaExceededError and optimizes image payloads
 */

/**
 * Resizes and compresses an image File or Base64 dataURL using an off-screen HTML5 Canvas.
 * Supports auto-cleaning of fake checkered/white backgrounds into true transparent PNG/WebP.
 */
export async function compressImage(
  source: File | string,
  maxWidth: number = 400,
  maxHeight: number = 400,
  quality: number = 0.85,
  autoCleanBackground: boolean = true
): Promise<{ dataUrl: string; sizeKb: number; dimensions: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    const processImg = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width <= 0 || height <= 0) {
          width = maxWidth;
          height = maxHeight;
        }

        // Calculate aspect ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          const fallbackDataUrl = typeof source === 'string' ? source : '';
          resolve({
            dataUrl: fallbackDataUrl,
            sizeKb: Math.round(fallbackDataUrl.length / 1024),
            dimensions: `${width} × ${height} px`
          });
          return;
        }

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Auto-clean fake checkerboard/white background into crisp transparency if enabled
        if (autoCleanBackground) {
          try {
            const imgData = ctx.getImageData(0, 0, width, height);
            const data = imgData.data;
            const len = data.length;

            for (let i = 0; i < len; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const a = data[i + 3];

              // Detect pure white or neutral gray/checkered squares (#CBCBCB to #FFFFFF)
              const isGrayscale = Math.abs(r - g) < 14 && Math.abs(g - b) < 14 && Math.abs(r - b) < 14;
              const isLightBackground = r > 185 && g > 185 && b > 185;

              // Don't remove black charcoal (which has r<60, g<60, b<60) or gold/bronze (which has rich saturation with r > g > b)
              if (a > 0 && isGrayscale && isLightBackground) {
                // Smoothly fade to transparent
                data[i + 3] = 0;
              }
            }
            ctx.putImageData(imgData, 0, 0);
          } catch (cleanErr) {
            console.warn('Background cleaner skipped:', cleanErr);
          }
        }

        // Export as PNG or WebP with preserved alpha channel
        let compressedDataUrl = canvas.toDataURL('image/png');
        if (!compressedDataUrl.startsWith('data:image/png')) {
          compressedDataUrl = canvas.toDataURL('image/webp', quality);
        }

        const sizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);
        resolve({
          dataUrl: compressedDataUrl,
          sizeKb: sizeKb > 0 ? sizeKb : 1,
          dimensions: `${width} × ${height} px`
        });
      } catch (err) {
        console.warn('Image compression fallback:', err);
        const fallbackUrl = typeof source === 'string' ? source : '';
        resolve({
          dataUrl: fallbackUrl,
          sizeKb: Math.round((fallbackUrl.length * 3) / 4 / 1024),
          dimensions: 'Original'
        });
      }
    };

    img.onload = processImg;
    img.onerror = () => {
      // Return safe fallback if image load fails
      if (typeof source === 'string') {
        resolve({ dataUrl: source, sizeKb: 0, dimensions: 'Unknown' });
      } else {
        reject(new Error('Failed to load image file'));
      }
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(source);
    }
  });
}

/**
 * Safely writes a key-value pair to localStorage, handling quota exceptions gracefully.
 */
export function safeSetLocalStorage(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error: any) {
    console.warn(`localStorage quota error for key "${key}":`, error);
    
    // Attempt automatic quota recovery: clear stale/non-essential cache keys
    try {
      const nonEssentialKeys = ['bg_temp_cache', 'bg_preview_cache'];
      nonEssentialKeys.forEach((k) => localStorage.removeItem(k));
      
      // Retry setting item once after clearing cache
      localStorage.setItem(key, value);
      return true;
    } catch (retryError) {
      console.error(`Persistent storage full. Could not save "${key}".`, retryError);
      return false;
    }
  }
}

/**
 * Safely reads a key from localStorage.
 */
export function safeGetLocalStorage(key: string, fallback: string = ''): string {
  if (typeof window === 'undefined') return fallback;

  try {
    const value = localStorage.getItem(key);
    return value !== null ? value : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}":`, e);
    return fallback;
  }
}

/**
 * Safely removes a key from localStorage.
 */
export function safeRemoveLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`Error removing localStorage key "${key}":`, e);
  }
}
