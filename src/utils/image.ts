import { MonsterItem, MonsterShape, RoomType } from '../types';

/**
 * Downscale image to max 1024px and re-encode to JPEG 0.85
 */
export async function preprocessImage(fileOrBlob: Blob | File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1024;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(e.target?.result as string);
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedBase64);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(fileOrBlob);
  });
}

/**
 * Fallback Edge Density algorithm:
 * Runs a 48x48 canvas downscale and sums pixel-to-pixel luminance differences.
 * Maps result to 10–95 range via clamp((raw - 2) * 7, 10, 95).
 */
export async function calculateEdgeDensity(dataUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 48;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return resolve(45);

      ctx.drawImage(img, 0, 0, size, size);
      const imgData = ctx.getImageData(0, 0, size, size);
      const data = imgData.data;

      let diffSum = 0;
      let count = 0;

      for (let y = 0; y < size - 1; y++) {
        for (let x = 0; x < size - 1; x++) {
          const idx = (y * size + x) * 4;
          const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];

          // Right neighbor
          const rIdx = (y * size + (x + 1)) * 4;
          const rLum = 0.299 * data[rIdx] + 0.587 * data[rIdx + 1] + 0.114 * data[rIdx + 2];

          // Bottom neighbor
          const bIdx = ((y + 1) * size + x) * 4;
          const bLum = 0.299 * data[bIdx] + 0.587 * data[bIdx + 1] + 0.114 * data[bIdx + 2];

          diffSum += Math.abs(lum - rLum) + Math.abs(lum - bLum);
          count += 2;
        }
      }

      const raw = count > 0 ? (diffSum / count) : 8;
      // Map via clamp((raw - 2) * 7, 10, 95)
      const mapped = Math.min(95, Math.max(10, Math.round((raw - 2) * 7)));
      resolve(mapped);
    };
    img.onerror = () => resolve(50);
    img.src = dataUrl;
  });
}

/**
 * Generate fallback monsters if Gemini is unavailable
 */
export function generateFallbackMonsters(messScore: number, roomType: RoomType = 'bedroom'): MonsterItem[] {
  const shapes: MonsterShape[] = ['horns', 'ghost', 'square', 'spikes', 'drip', 'box', 'tall'];
  const colors = ['#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4', '#10b981', '#ec4899'];

  const templates = [
    {
      name: 'Floor Cluster',
      label: 'Stray garments and textiles',
      task: 'Sort into laundry hamper or hang up',
      minutes: 4,
      xp: 25,
      shape: 'ghost' as MonsterShape,
      color: '#8b5cf6',
      box: [650, 200, 850, 450] as [number, number, number, number],
    },
    {
      name: 'Surface Scatter',
      label: 'Drink containers and loose paper',
      task: 'Relocate cups to sink and recycle notes',
      minutes: 3,
      xp: 20,
      shape: 'horns' as MonsterShape,
      color: '#f59e0b',
      box: [400, 520, 600, 750] as [number, number, number, number],
    },
    {
      name: 'Cable Tangler',
      label: 'Unwound charging cords and accessories',
      task: 'Bundle cords with ties and dock chargers',
      minutes: 5,
      xp: 30,
      shape: 'spikes' as MonsterShape,
      color: '#06b6d4',
      box: [550, 720, 750, 920] as [number, number, number, number],
    },
    {
      name: 'Stack Anomaly',
      label: 'Unsorted mail, notebooks, and cardboard',
      task: 'File papers and break down packaging',
      minutes: 6,
      xp: 35,
      shape: 'box' as MonsterShape,
      color: '#f43f5e',
      box: [300, 150, 500, 380] as [number, number, number, number],
    },
  ];

  const count = messScore > 60 ? 4 : 3;
  return templates.slice(0, count).map((t, idx) => ({
    id: `fb-monster-${idx}-${Date.now()}`,
    name: t.name,
    label: t.label,
    task: t.task,
    minutes: t.minutes,
    xp: t.xp,
    box: t.box,
    shape: shapes[idx % shapes.length],
    color: colors[idx % colors.length],
    completed: false,
  }));
}
