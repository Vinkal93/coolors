import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { usePaletteStore } from '@/store/paletteStore';
import { hexToRgb, rgbToHex, hexToHsl, hslToHex, isValidHex, normalizeHex } from '@/lib/colorUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface ColorPickerProps {
  colorId: string;
  initialHex: string;
  onClose: () => void;
}

const ColorPicker = ({ colorId, initialHex, onClose }: ColorPickerProps) => {
  const { updateColor } = usePaletteStore();
  const [hex, setHex] = useState(initialHex);
  const [rgb, setRgb] = useState(() => hexToRgb(initialHex) || { r: 0, g: 0, b: 0 });
  const [hsl, setHsl] = useState(() => hexToHsl(initialHex) || { h: 0, s: 50, l: 50 });

  useEffect(() => {
    if (isValidHex(hex)) {
      const normalizedHex = normalizeHex(hex);
      updateColor(colorId, normalizedHex);
      
      const newRgb = hexToRgb(normalizedHex);
      const newHsl = hexToHsl(normalizedHex);
      if (newRgb) setRgb(newRgb);
      if (newHsl) setHsl(newHsl);
    }
  }, [hex, colorId, updateColor]);

  const handleHexChange = (value: string) => {
    setHex(value.startsWith('#') ? value : `#${value}`);
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [channel]: value };
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHex(newHex);
  };

  const handleHslChange = (channel: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hsl, [channel]: value };
    setHsl(newHsl);
    const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setHex(newHex);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 w-72 bg-card rounded-xl shadow-xl border border-border p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-card-foreground">Color Picker</h3>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Color preview */}
      <div 
        className="w-full h-16 rounded-lg mb-4 border border-border"
        style={{ backgroundColor: isValidHex(hex) ? normalizeHex(hex) : initialHex }}
      />

      {/* HEX input */}
      <div className="mb-4">
        <Label className="text-xs text-muted-foreground mb-1.5 block">HEX</Label>
        <Input
          value={hex}
          onChange={(e) => handleHexChange(e.target.value)}
          className="font-mono text-sm"
          maxLength={7}
        />
      </div>

      {/* RGB sliders */}
      <div className="space-y-3 mb-4">
        <Label className="text-xs text-muted-foreground">RGB</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs w-4 text-destructive font-medium">R</span>
            <Slider
              value={[rgb.r]}
              max={255}
              step={1}
              onValueChange={([v]) => handleRgbChange('r', v)}
              className="flex-1"
            />
            <span className="text-xs w-8 text-right font-mono">{rgb.r}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs w-4 text-success font-medium">G</span>
            <Slider
              value={[rgb.g]}
              max={255}
              step={1}
              onValueChange={([v]) => handleRgbChange('g', v)}
              className="flex-1"
            />
            <span className="text-xs w-8 text-right font-mono">{rgb.g}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs w-4 text-primary font-medium">B</span>
            <Slider
              value={[rgb.b]}
              max={255}
              step={1}
              onValueChange={([v]) => handleRgbChange('b', v)}
              className="flex-1"
            />
            <span className="text-xs w-8 text-right font-mono">{rgb.b}</span>
          </div>
        </div>
      </div>

      {/* HSL sliders */}
      <div className="space-y-3">
        <Label className="text-xs text-muted-foreground">HSL</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs w-4 font-medium">H</span>
            <Slider
              value={[hsl.h]}
              max={360}
              step={1}
              onValueChange={([v]) => handleHslChange('h', v)}
              className="flex-1"
            />
            <span className="text-xs w-8 text-right font-mono">{hsl.h}°</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs w-4 font-medium">S</span>
            <Slider
              value={[hsl.s]}
              max={100}
              step={1}
              onValueChange={([v]) => handleHslChange('s', v)}
              className="flex-1"
            />
            <span className="text-xs w-8 text-right font-mono">{hsl.s}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs w-4 font-medium">L</span>
            <Slider
              value={[hsl.l]}
              max={100}
              step={1}
              onValueChange={([v]) => handleHslChange('l', v)}
              className="flex-1"
            />
            <span className="text-xs w-8 text-right font-mono">{hsl.l}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ColorPicker;
