import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { hexToRgb, hexToHsl, getColorName, getContrastColor } from '@/lib/colorUtils';
import { useState } from 'react';
import { toast } from 'sonner';

interface ColorInfoModalProps {
  color: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const hexToRgbString = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'N/A';
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

const hexToHslString = (hex: string): string => {
  const hsl = hexToHsl(hex);
  if (!hsl) return 'N/A';
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
};

const hexToCmyk = (hex: string): { c: number; m: number; y: number; k: number } | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
};

const hexToCmykString = (hex: string): string => {
  const cmyk = hexToCmyk(hex);
  if (!cmyk) return 'N/A';
  return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
};

const ColorInfoModal = ({ color, open, onOpenChange }: ColorInfoModalProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  
  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);
  const cmyk = hexToCmyk(color);
  const colorName = getColorName(color);
  const contrastColor = getContrastColor(color);

  const colorFormats = [
    { label: 'HEX', value: color.toUpperCase() },
    { label: 'RGB', value: hexToRgbString(color) },
    { label: 'HSL', value: hexToHslString(color) },
    { label: 'CMYK', value: hexToCmykString(color) },
  ];

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    toast.success(`${label} copied`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div 
              className="w-6 h-6 rounded-full border border-border"
              style={{ backgroundColor: color }}
            />
            {colorName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Large color preview */}
          <div 
            className="w-full h-32 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <span 
              className="text-2xl font-bold"
              style={{ color: contrastColor }}
            >
              {color.toUpperCase()}
            </span>
          </div>
          
          {/* Color values */}
          <div className="space-y-2">
            {colorFormats.map(({ label, value }) => (
              <div 
                key={label}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium">{label}</span>
                  <span className="text-sm font-mono">{value}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(value, label)}
                >
                  {copied === label ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
          
          {/* Raw values */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {rgb && (
              <div className="p-2 bg-muted/50 rounded">
                <span className="text-muted-foreground">R: </span>
                <span className="font-medium">{rgb.r}</span>
                <span className="text-muted-foreground ml-2">G: </span>
                <span className="font-medium">{rgb.g}</span>
                <span className="text-muted-foreground ml-2">B: </span>
                <span className="font-medium">{rgb.b}</span>
              </div>
            )}
            {hsl && (
              <div className="p-2 bg-muted/50 rounded">
                <span className="text-muted-foreground">H: </span>
                <span className="font-medium">{hsl.h}°</span>
                <span className="text-muted-foreground ml-2">S: </span>
                <span className="font-medium">{hsl.s}%</span>
                <span className="text-muted-foreground ml-2">L: </span>
                <span className="font-medium">{hsl.l}%</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorInfoModal;
