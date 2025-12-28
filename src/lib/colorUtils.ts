export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${[r, g, b]
    .map((x) => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('')}`.toUpperCase();
};

export const hexToHsl = (hex: string): { h: number; s: number; l: number } | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

export const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

export const getContrastColor = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

export const getContrastRatio = (hex1: string, hex2: string): number => {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 0;

  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

export const generateShades = (hex: string, count: number = 9): string[] => {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex];

  const shades: string[] = [];
  const step = 100 / (count + 1);

  for (let i = 1; i <= count; i++) {
    const lightness = 100 - step * i;
    shades.push(hslToHex(hsl.h, hsl.s, lightness));
  }

  return shades;
};

export const getColorName = (hex: string): string => {
  const hsl = hexToHsl(hex);
  if (!hsl) return 'Unknown';

  const { h, s, l } = hsl;

  // Grayscale
  if (s < 10) {
    if (l < 20) return 'Black';
    if (l < 40) return 'Dark Gray';
    if (l < 60) return 'Gray';
    if (l < 80) return 'Light Gray';
    return 'White';
  }

  // Color names based on hue
  let colorName = '';
  if (h < 15 || h >= 345) colorName = 'Red';
  else if (h < 45) colorName = 'Orange';
  else if (h < 75) colorName = 'Yellow';
  else if (h < 150) colorName = 'Green';
  else if (h < 195) colorName = 'Cyan';
  else if (h < 255) colorName = 'Blue';
  else if (h < 285) colorName = 'Purple';
  else if (h < 345) colorName = 'Pink';

  // Add lightness modifier
  if (l < 30) return `Dark ${colorName}`;
  if (l > 70) return `Light ${colorName}`;
  return colorName;
};

export const isValidHex = (hex: string): boolean => {
  return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
};

export const normalizeHex = (hex: string): string => {
  let normalized = hex.replace('#', '').toUpperCase();
  if (normalized.length === 3) {
    normalized = normalized
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return `#${normalized}`;
};
