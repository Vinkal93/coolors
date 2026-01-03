import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Color {
  hex: string;
  locked: boolean;
  id: string;
}

export interface SavedPalette {
  id: string;
  colors: string[];
  savedAt: number;
  name?: string;
  likes?: number;
}

interface PaletteStore {
  colors: Color[];
  savedPalettes: SavedPalette[];
  recentPalettes: SavedPalette[];
  paletteLikes: Record<string, number>;
  generateNewPalette: () => void;
  toggleLock: (id: string) => void;
  updateColor: (id: string, hex: string) => void;
  savePalette: (name?: string) => void;
  deletePalette: (id: string) => void;
  loadPalette: (colors: string[]) => void;
  likePalette: (paletteKey: string) => void;
  getLikes: (paletteKey: string) => number;
  cleanExpiredPalettes: () => void;
}

const WEEK_MS = 1000 * 60 * 60 * 24 * 7;

const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const generateHarmoniousColor = (baseHue?: number): string => {
  const hue = baseHue !== undefined 
    ? (baseHue + (Math.random() * 60 - 30) + 360) % 360
    : Math.random() * 360;
  const saturation = 50 + Math.random() * 40;
  const lightness = 40 + Math.random() * 30;
  return hslToHex(hue, saturation, lightness);
};

const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

const generateInitialColors = (): Color[] => {
  const baseHue = Math.random() * 360;
  return Array(5).fill(null).map((_, index) => ({
    hex: generateHarmoniousColor(baseHue + (index * 45)),
    locked: false,
    id: generateId(),
  }));
};

export const usePaletteStore = create<PaletteStore>()(
  persist(
    (set, get) => ({
      colors: generateInitialColors(),
      savedPalettes: [],
      recentPalettes: [],
      paletteLikes: {},

      generateNewPalette: () => {
        const currentColors = get().colors;
        const baseHue = Math.random() * 360;
        let hueIndex = 0;
        
        const newColors = currentColors.map((color) => {
          if (color.locked) {
            return color;
          }
          const newColor = {
            ...color,
            hex: generateHarmoniousColor(baseHue + (hueIndex * 45)),
          };
          hueIndex++;
          return newColor;
        });

        // Add to recent palettes
        const recentPalettes = get().recentPalettes;
        const currentPaletteHexes = currentColors.map(c => c.hex);
        const newRecent: SavedPalette = {
          id: generateId(),
          colors: currentPaletteHexes,
          savedAt: Date.now(),
        };

        set({ 
          colors: newColors,
          recentPalettes: [newRecent, ...recentPalettes.slice(0, 19)],
        });
      },

      toggleLock: (id: string) => {
        const colors = get().colors.map((color) =>
          color.id === id ? { ...color, locked: !color.locked } : color
        );
        set({ colors });
      },

      updateColor: (id: string, hex: string) => {
        const colors = get().colors.map((color) =>
          color.id === id ? { ...color, hex: hex.toUpperCase() } : color
        );
        set({ colors });
      },

      savePalette: (name?: string) => {
        const colors = get().colors.map(c => c.hex);
        const newPalette: SavedPalette = {
          id: generateId(),
          colors,
          savedAt: Date.now(),
          name,
        };
        set({ savedPalettes: [newPalette, ...get().savedPalettes] });
      },

      deletePalette: (id: string) => {
        set({ savedPalettes: get().savedPalettes.filter(p => p.id !== id) });
      },

      loadPalette: (colors: string[]) => {
        const newColors = colors.map((hex) => ({
          hex,
          locked: false,
          id: generateId(),
        }));
        set({ colors: newColors });
      },

      likePalette: (paletteKey: string) => {
        const currentLikes = get().paletteLikes;
        const newLikes = (currentLikes[paletteKey] || 0) + 1;
        set({ paletteLikes: { ...currentLikes, [paletteKey]: newLikes } });
      },

      getLikes: (paletteKey: string) => {
        return get().paletteLikes[paletteKey] || 0;
      },

      cleanExpiredPalettes: () => {
        const now = Date.now();
        const recentPalettes = get().recentPalettes.filter(
          (p) => now - p.savedAt < WEEK_MS
        );
        set({ recentPalettes });
      },
    }),
    {
      name: 'color-palette-storage',
      partialize: (state) => ({
        savedPalettes: state.savedPalettes,
        recentPalettes: state.recentPalettes,
        paletteLikes: state.paletteLikes,
      }),
    }
  )
);

// Clean expired palettes on load
if (typeof window !== 'undefined') {
  const store = usePaletteStore.getState();
  store.cleanExpiredPalettes();
}
