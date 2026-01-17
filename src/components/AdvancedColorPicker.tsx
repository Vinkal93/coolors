import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Pipette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { hexToRgb, rgbToHex, hexToHsl, hslToHex, isValidHex, normalizeHex } from '@/lib/colorUtils';
import { toast } from 'sonner';

interface AdvancedColorPickerProps {
  initialColor: string;
  onColorChange: (color: string) => void;
  onClose: () => void;
}

const AdvancedColorPicker = ({ initialColor, onColorChange, onClose }: AdvancedColorPickerProps) => {
  const [hex, setHex] = useState(normalizeHex(initialColor));
  const [hsl, setHsl] = useState(() => hexToHsl(initialColor) || { h: 0, s: 100, l: 50 });
  const [copied, setCopied] = useState(false);
  
  const gradientRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const [isDraggingGradient, setIsDraggingGradient] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);

  // Convert HSL to position on gradient
  const gradientPos = {
    x: hsl.s,
    y: 100 - hsl.l * 2 // Approximate conversion
  };

  const updateFromHsl = useCallback((newHsl: { h: number; s: number; l: number }) => {
    const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setHex(newHex);
    setHsl(newHsl);
    onColorChange(newHex);
  }, [onColorChange]);

  const handleGradientClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gradientRef.current) return;
    const rect = gradientRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    const s = x;
    const l = Math.max(0, Math.min(100, (100 - y) / 2 + (100 - x) / 2));
    
    updateFromHsl({ ...hsl, s: Math.round(s), l: Math.round(l) });
  };

  const handleHueClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const h = Math.round((x / 100) * 360);
    updateFromHsl({ ...hsl, h });
  };

  const handleHexChange = (value: string) => {
    const cleanValue = value.startsWith('#') ? value : `#${value}`;
    setHex(cleanValue);
    if (isValidHex(cleanValue)) {
      const newHsl = hexToHsl(cleanValue);
      if (newHsl) {
        setHsl(newHsl);
        onColorChange(normalizeHex(cleanValue));
      }
    }
  };

  const copyColor = async () => {
    await navigator.clipboard.writeText(hex);
    setCopied(true);
    toast.success('Color copied!');
    setTimeout(() => setCopied(false), 1500);
  };

  // Mouse move handlers for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingGradient && gradientRef.current) {
        const rect = gradientRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        
        const s = x;
        const l = Math.max(0, Math.min(100, (100 - y) / 2 + (100 - x) / 2));
        
        updateFromHsl({ ...hsl, s: Math.round(s), l: Math.round(l) });
      }
      
      if (isDraggingHue && hueRef.current) {
        const rect = hueRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const h = Math.round((x / 100) * 360);
        updateFromHsl({ ...hsl, h });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingGradient(false);
      setIsDraggingHue(false);
    };

    if (isDraggingGradient || isDraggingHue) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingGradient, isDraggingHue, hsl, updateFromHsl]);

  const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
  const baseHue = `hsl(${hsl.h}, 100%, 50%)`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="bg-card rounded-2xl shadow-2xl border border-border p-4 w-72 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foreground">Color Picker</span>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Gradient picker area */}
      <div
        ref={gradientRef}
        className="relative w-full h-40 rounded-xl cursor-crosshair mb-3 overflow-hidden"
        style={{
          background: `
            linear-gradient(to bottom, transparent, black),
            linear-gradient(to right, white, ${baseHue})
          `
        }}
        onMouseDown={(e) => {
          setIsDraggingGradient(true);
          handleGradientClick(e);
        }}
      >
        {/* Picker indicator */}
        <div
          className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${hsl.s}%`,
            top: `${Math.max(5, Math.min(95, 100 - hsl.l))}%`,
            backgroundColor: hex
          }}
        />
      </div>

      {/* Hue slider */}
      <div
        ref={hueRef}
        className="relative w-full h-4 rounded-full cursor-pointer mb-3"
        style={{
          background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
        }}
        onMouseDown={(e) => {
          setIsDraggingHue(true);
          handleHueClick(e);
        }}
      >
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 pointer-events-none"
          style={{
            left: `${(hsl.h / 360) * 100}%`,
            top: 0,
            backgroundColor: baseHue
          }}
        />
      </div>

      {/* HEX Input with color preview */}
      <div className="flex items-center gap-2 mb-3">
        <Input
          value={hex}
          onChange={(e) => handleHexChange(e.target.value)}
          className="font-mono text-sm flex-1"
          maxLength={7}
        />
        <div
          className="w-10 h-10 rounded-lg border border-border shrink-0"
          style={{ backgroundColor: hex }}
        />
      </div>

      {/* RGB values */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <Label className="text-xs text-muted-foreground">R</Label>
          <div className="text-sm font-mono bg-muted/30 rounded py-1">{rgb.r}</div>
        </div>
        <div className="text-center">
          <Label className="text-xs text-muted-foreground">G</Label>
          <div className="text-sm font-mono bg-muted/30 rounded py-1">{rgb.g}</div>
        </div>
        <div className="text-center">
          <Label className="text-xs text-muted-foreground">B</Label>
          <div className="text-sm font-mono bg-muted/30 rounded py-1">{rgb.b}</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={copyColor}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </motion.div>
  );
};

export default AdvancedColorPicker;
