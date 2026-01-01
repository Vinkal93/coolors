import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getContrastRatio, isValidHex, normalizeHex, hexToRgb } from '@/lib/colorUtils';

const ContrastChecker = () => {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#FFFFFF');

  const contrastRatio = getContrastRatio(
    isValidHex(foreground) ? normalizeHex(foreground) : '#000000',
    isValidHex(background) ? normalizeHex(background) : '#FFFFFF'
  );

  const getWCAGRating = (ratio: number, level: 'AA' | 'AAA', size: 'normal' | 'large') => {
    if (level === 'AA') {
      return size === 'normal' ? ratio >= 4.5 : ratio >= 3;
    }
    return size === 'normal' ? ratio >= 7 : ratio >= 4.5;
  };

  const swapColors = () => {
    setForeground(background);
    setBackground(foreground);
  };

  const ratings = [
    { label: 'Normal Text AA', pass: getWCAGRating(contrastRatio, 'AA', 'normal'), required: '4.5:1' },
    { label: 'Normal Text AAA', pass: getWCAGRating(contrastRatio, 'AAA', 'normal'), required: '7:1' },
    { label: 'Large Text AA', pass: getWCAGRating(contrastRatio, 'AA', 'large'), required: '3:1' },
    { label: 'Large Text AAA', pass: getWCAGRating(contrastRatio, 'AAA', 'large'), required: '4.5:1' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="text-tool-orange">Contrast</span> Checker
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Check color contrast for WCAG accessibility compliance
            </p>
          </motion.div>

          {/* Preview Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl overflow-hidden shadow-xl mb-8"
            style={{ backgroundColor: isValidHex(background) ? normalizeHex(background) : '#FFFFFF' }}
          >
            <div className="p-8 sm:p-12 text-center">
              <h2 
                className="text-3xl sm:text-5xl font-extrabold mb-4"
                style={{ color: isValidHex(foreground) ? normalizeHex(foreground) : '#000000' }}
              >
                Sample Text
              </h2>
              <p 
                className="text-lg sm:text-xl mb-6"
                style={{ color: isValidHex(foreground) ? normalizeHex(foreground) : '#000000' }}
              >
                The quick brown fox jumps over the lazy dog.
              </p>
              <div 
                className="text-6xl sm:text-8xl font-extrabold"
                style={{ color: isValidHex(foreground) ? normalizeHex(foreground) : '#000000' }}
              >
                {contrastRatio.toFixed(2)}:1
              </div>
            </div>
          </motion.div>

          {/* Color Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-6 mb-8"
          >
            {/* Foreground */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <Label className="text-sm font-semibold mb-3 block">Foreground Color</Label>
              <div className="flex gap-3">
                <div 
                  className="w-16 h-12 rounded-lg border border-border cursor-pointer relative overflow-hidden"
                  style={{ backgroundColor: isValidHex(foreground) ? normalizeHex(foreground) : '#000000' }}
                >
                  <input
                    type="color"
                    value={isValidHex(foreground) ? normalizeHex(foreground) : '#000000'}
                    onChange={(e) => setForeground(e.target.value.toUpperCase())}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <Input
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value.toUpperCase())}
                  className="font-mono text-lg"
                  maxLength={7}
                />
              </div>
            </div>

            {/* Background */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <Label className="text-sm font-semibold mb-3 block">Background Color</Label>
              <div className="flex gap-3">
                <div 
                  className="w-16 h-12 rounded-lg border border-border cursor-pointer relative overflow-hidden"
                  style={{ backgroundColor: isValidHex(background) ? normalizeHex(background) : '#FFFFFF' }}
                >
                  <input
                    type="color"
                    value={isValidHex(background) ? normalizeHex(background) : '#FFFFFF'}
                    onChange={(e) => setBackground(e.target.value.toUpperCase())}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <Input
                  value={background}
                  onChange={(e) => setBackground(e.target.value.toUpperCase())}
                  className="font-mono text-lg"
                  maxLength={7}
                />
              </div>
            </div>
          </motion.div>

          {/* Swap Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={swapColors}
              className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-full font-semibold transition-colors"
            >
              ↔ Swap Colors
            </button>
          </div>

          {/* WCAG Ratings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {ratings.map((rating) => (
              <div 
                key={rating.label}
                className={`p-4 rounded-xl border-2 ${
                  rating.pass 
                    ? 'bg-success/10 border-success' 
                    : 'bg-destructive/10 border-destructive'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {rating.pass ? (
                    <Check className="h-5 w-5 text-success" />
                  ) : (
                    <X className="h-5 w-5 text-destructive" />
                  )}
                  <span className={`font-bold ${rating.pass ? 'text-success' : 'text-destructive'}`}>
                    {rating.pass ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <p className="font-semibold text-sm">{rating.label}</p>
                <p className="text-xs text-muted-foreground">Requires {rating.required}</p>
              </div>
            ))}
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-secondary/30 rounded-2xl p-6 sm:p-8"
          >
            <h3 className="text-xl font-bold mb-4">About WCAG Contrast Guidelines</h3>
            <div className="grid sm:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Level AA (Minimum)</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Normal text: 4.5:1 contrast ratio</li>
                  <li>Large text (18pt+): 3:1 contrast ratio</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Level AAA (Enhanced)</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Normal text: 7:1 contrast ratio</li>
                  <li>Large text (18pt+): 4.5:1 contrast ratio</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContrastChecker;
