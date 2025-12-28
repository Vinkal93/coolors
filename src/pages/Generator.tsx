import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ColorStrip from '@/components/ColorStrip';
import GeneratorToolbar from '@/components/GeneratorToolbar';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import { usePaletteStore } from '@/store/paletteStore';
import { isValidHex } from '@/lib/colorUtils';

const Generator = () => {
  const [searchParams] = useSearchParams();
  const { loadPalette, savePalette } = usePaletteStore();

  // Load palette from URL if present
  useEffect(() => {
    const colorsParam = searchParams.get('colors');
    if (colorsParam) {
      const colors = colorsParam.split('-').map(c => `#${c.toUpperCase()}`);
      const validColors = colors.filter(c => isValidHex(c));
      if (validColors.length === 5) {
        loadPalette(validColors);
      }
    }
  }, [searchParams, loadPalette]);

  // Handle 'S' key for saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        savePalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [savePalette]);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 pt-16"
      >
        <ColorStrip />
      </motion.main>

      <GeneratorToolbar />
      <KeyboardShortcuts />
    </div>
  );
};

export default Generator;
