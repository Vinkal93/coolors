import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Copy, Check, Pipette } from 'lucide-react';
import { usePaletteStore } from '@/store/paletteStore';
import { getContrastColor, getColorName } from '@/lib/colorUtils';
import { Button } from '@/components/ui/button';
import ColorPicker from './ColorPicker';

const ColorStrip = () => {
  const { colors, toggleLock, generateNewPalette } = usePaletteStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        generateNewPalette();
      }

      // L key to toggle lock on hovered color (simplified - just locks first unlocked)
      if (e.key === 'l' || e.key === 'L') {
        const unlockedColor = colors.find(c => !c.locked);
        if (unlockedColor) {
          toggleLock(unlockedColor.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generateNewPalette, colors, toggleLock]);

  const copyToClipboard = async (hex: string, id: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="color-strip h-full">
      {colors.map((color, index) => {
        const contrastColor = getContrastColor(color.hex);
        const colorName = getColorName(color.hex);
        const isLight = contrastColor === '#000000';

        return (
          <motion.div
            key={color.id}
            className="color-strip-item group"
            style={{ backgroundColor: color.hex }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            layout
          >
            {/* Color info - top */}
            <div className="absolute top-8 left-0 right-0 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span 
                className="text-sm font-medium mb-1"
                style={{ color: contrastColor }}
              >
                {colorName}
              </span>
            </div>

            {/* Action buttons */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* Lock button */}
              <Button
                variant="color-action"
                size="icon"
                onClick={() => toggleLock(color.id)}
                className="relative"
                style={{ 
                  backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)',
                  color: contrastColor 
                }}
              >
                <AnimatePresence mode="wait">
                  {color.locked ? (
                    <motion.div
                      key="locked"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Lock className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unlocked"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Unlock className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {/* Color Picker button */}
              <Button
                variant="color-action"
                size="icon"
                onClick={() => setPickerOpen(pickerOpen === color.id ? null : color.id)}
                style={{ 
                  backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)',
                  color: contrastColor 
                }}
              >
                <Pipette className="h-4 w-4" />
              </Button>

              {/* Copy button */}
              <Button
                variant="color-action"
                size="icon"
                onClick={() => copyToClipboard(color.hex, color.id)}
                style={{ 
                  backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)',
                  color: contrastColor 
                }}
              >
                <AnimatePresence mode="wait">
                  {copiedId === color.id ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Copy className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>

            {/* Lock indicator */}
            {color.locked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4"
              >
                <Lock 
                  className="h-5 w-5" 
                  style={{ color: contrastColor, opacity: 0.6 }}
                />
              </motion.div>
            )}

            {/* HEX value - bottom */}
            <div className="relative z-10 flex flex-col items-center">
              <motion.span
                className="text-lg font-bold tracking-wider cursor-pointer hover:scale-105 transition-transform"
                style={{ color: contrastColor }}
                onClick={() => copyToClipboard(color.hex, color.id)}
                whileTap={{ scale: 0.95 }}
              >
                {color.hex}
              </motion.span>
              
              {/* Copied tooltip */}
              <AnimatePresence>
                {copiedId === color.id && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute -bottom-6 text-xs font-medium"
                    style={{ color: contrastColor }}
                  >
                    Copied!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Color picker popover */}
            <AnimatePresence>
              {pickerOpen === color.id && (
                <ColorPicker
                  colorId={color.id}
                  initialHex={color.hex}
                  onClose={() => setPickerOpen(null)}
                />
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ColorStrip;
