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
  const [activeColor, setActiveColor] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        generateNewPalette();
      }

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
    <div className="flex flex-row h-full w-full overflow-x-auto">
      {colors.map((color, index) => {
        const contrastColor = getContrastColor(color.hex);
        const colorName = getColorName(color.hex);
        const isLight = contrastColor === '#000000';
        const isActive = activeColor === color.id;

        return (
          <motion.div
            key={color.id}
            className={`flex-1 min-w-[60px] relative flex flex-col items-center justify-end pb-4 sm:pb-8 transition-all duration-300 ${
              isActive ? 'flex-[1.5] sm:flex-[1.3]' : 'hover:flex-[1.2]'
            }`}
            style={{ backgroundColor: color.hex }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            layout
            onClick={() => setActiveColor(isActive ? null : color.id)}
          >
            {/* Color info - top */}
            <div className={`absolute top-4 sm:top-8 left-0 right-0 flex flex-col items-center transition-opacity duration-200 ${
              isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              <span 
                className="text-[10px] sm:text-sm font-medium mb-1 text-center px-1"
                style={{ color: contrastColor }}
              >
                {colorName}
              </span>
            </div>

            {/* Action buttons - show on active (mobile) or hover (desktop) */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3 transition-opacity duration-200 ${
              isActive ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
            }`}>
              {/* Lock button */}
              <Button
                variant="color-action"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLock(color.id);
                }}
                className="relative h-9 w-9 sm:h-10 sm:w-10"
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
                onClick={(e) => {
                  e.stopPropagation();
                  setPickerOpen(pickerOpen === color.id ? null : color.id);
                }}
                className="h-9 w-9 sm:h-10 sm:w-10"
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
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(color.hex, color.id);
                }}
                className="h-9 w-9 sm:h-10 sm:w-10"
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
                className="absolute top-2 right-2 sm:top-4 sm:right-4"
              >
                <Lock 
                  className="h-4 w-4 sm:h-5 sm:w-5" 
                  style={{ color: contrastColor, opacity: 0.6 }}
                />
              </motion.div>
            )}

            {/* HEX value - bottom */}
            <div className="relative z-10 flex flex-col items-center px-1">
              <motion.span
                className="text-[10px] sm:text-lg font-bold tracking-tight sm:tracking-wider cursor-pointer hover:scale-105 transition-transform"
                style={{ color: contrastColor }}
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(color.hex, color.id);
                }}
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
                    className="absolute -bottom-4 sm:-bottom-6 text-[8px] sm:text-xs font-medium whitespace-nowrap"
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
