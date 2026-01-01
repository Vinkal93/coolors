import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, Upload, Palette, Copy, Check, Info } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePaletteStore } from '@/store/paletteStore';
import { isValidHex, normalizeHex } from '@/lib/colorUtils';
import { toast } from 'sonner';

// Color blindness simulation matrices
const colorBlindnessTypes = [
  {
    id: 'normal',
    name: 'Normal Vision',
    description: 'Standard color vision (trichromacy)',
    matrix: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  },
  {
    id: 'protanopia',
    name: 'Protanopia',
    description: 'Red-blind (~1% of males)',
    matrix: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  },
  {
    id: 'protanomaly',
    name: 'Protanomaly',
    description: 'Red-weak (~1% of males)',
    matrix: [0.817, 0.183, 0, 0.333, 0.667, 0, 0, 0.125, 0.875],
  },
  {
    id: 'deuteranopia',
    name: 'Deuteranopia',
    description: 'Green-blind (~1% of males)',
    matrix: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  },
  {
    id: 'deuteranomaly',
    name: 'Deuteranomaly',
    description: 'Green-weak (~5% of males)',
    matrix: [0.8, 0.2, 0, 0.258, 0.742, 0, 0, 0.142, 0.858],
  },
  {
    id: 'tritanopia',
    name: 'Tritanopia',
    description: 'Blue-blind (rare)',
    matrix: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
  },
  {
    id: 'tritanomaly',
    name: 'Tritanomaly',
    description: 'Blue-weak (rare)',
    matrix: [0.967, 0.033, 0, 0, 0.733, 0.267, 0, 0.183, 0.817],
  },
  {
    id: 'achromatopsia',
    name: 'Achromatopsia',
    description: 'Complete color blindness (very rare)',
    matrix: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
  },
];

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
};

const rgbToHex = (r: number, g: number, b: number): string => {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[r, g, b].map((c) => clamp(c).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
};

const simulateColorBlindness = (hex: string, matrix: number[]): string => {
  const [r, g, b] = hexToRgb(hex);
  const newR = r * matrix[0] + g * matrix[1] + b * matrix[2];
  const newG = r * matrix[3] + g * matrix[4] + b * matrix[5];
  const newB = r * matrix[6] + g * matrix[7] + b * matrix[8];
  return rgbToHex(newR, newG, newB);
};

const ColorBlindnessSimulator = () => {
  const { colors } = usePaletteStore();
  const [customColors, setCustomColors] = useState<string[]>(['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']);
  const [newColor, setNewColor] = useState('#FF6B6B');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('palette');

  const handleAddColor = () => {
    if (isValidHex(newColor) && customColors.length < 10) {
      setCustomColors([...customColors, normalizeHex(newColor)]);
      setNewColor('#FF6B6B');
    }
  };

  const handleRemoveColor = (index: number) => {
    setCustomColors(customColors.filter((_, i) => i !== index));
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Copied!');
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const usePaletteColors = () => {
    setCustomColors(colors.map(c => c.hex));
  };

  const activeColors = activeTab === 'palette' ? colors.map(c => c.hex) : customColors;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tool-purple/10 text-tool-purple mb-4">
              <Eye className="h-4 w-4" />
              <span className="text-sm font-semibold">Color Blindness Simulator</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              See How Others <span className="text-gradient">See Colors</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Preview your color palette through the eyes of people with different types of color vision deficiency
            </p>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-8 flex items-start gap-3"
          >
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-foreground">
                <strong>Did you know?</strong> About 8% of men and 0.5% of women have some form of color vision deficiency. 
                Designing with accessibility in mind ensures your colors work for everyone.
              </p>
            </div>
          </motion.div>

          {/* Color Source Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-6 mb-8"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                <TabsTrigger value="palette" className="gap-2">
                  <Palette className="h-4 w-4" />
                  Current Palette
                </TabsTrigger>
                <TabsTrigger value="custom" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Custom Colors
                </TabsTrigger>
              </TabsList>

              <TabsContent value="palette">
                <div className="flex flex-wrap gap-3 justify-center">
                  {colors.map((color, index) => (
                    <div
                      key={color.id}
                      className="w-16 h-16 rounded-xl shadow-md cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyToClipboard(color.hex, `palette-${index}`)}
                      title={color.hex}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="custom">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {customColors.map((color, index) => (
                      <div key={index} className="relative group">
                        <div
                          className="w-16 h-16 rounded-xl shadow-md cursor-pointer hover:scale-105 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => copyToClipboard(color, `custom-${index}`)}
                          title={color}
                        />
                        <button
                          onClick={() => handleRemoveColor(index)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center gap-3">
                    <div className="relative">
                      <Input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value.toUpperCase())}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                    </div>
                    <Input
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value.toUpperCase())}
                      className="w-32 font-mono"
                      maxLength={7}
                    />
                    <Button onClick={handleAddColor} disabled={customColors.length >= 10}>
                      Add Color
                    </Button>
                    <Button variant="outline" onClick={usePaletteColors}>
                      Use Current Palette
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Simulation Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {colorBlindnessTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-card rounded-2xl border border-border overflow-hidden"
              >
                <div className="p-4 border-b border-border">
                  <h3 className="font-bold text-lg">{type.name}</h3>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
                
                <div className="flex h-20">
                  {activeColors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="flex-1 cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: simulateColorBlindness(color, type.matrix) }}
                      onClick={() => copyToClipboard(simulateColorBlindness(color, type.matrix), `${type.id}-${colorIndex}`)}
                      title={simulateColorBlindness(color, type.matrix)}
                    />
                  ))}
                </div>
                
                <div className="p-3 flex flex-wrap gap-1 justify-center">
                  {activeColors.map((color, colorIndex) => {
                    const simulated = simulateColorBlindness(color, type.matrix);
                    return (
                      <span
                        key={colorIndex}
                        className="text-[10px] font-mono text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => copyToClipboard(simulated, `${type.id}-hex-${colorIndex}`)}
                      >
                        {simulated}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-secondary/50 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-4">Accessibility Tips</h2>
            <ul className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                Don't rely on color alone to convey information
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                Use patterns, icons, or labels alongside colors
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                Ensure sufficient contrast between colors
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                Test your designs with color blindness simulators
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                Avoid red/green combinations for important distinctions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                Use blues and yellows which are visible to most color blind users
              </li>
            </ul>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ColorBlindnessSimulator;
