import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, Check, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateShades, hexToRgb, hexToHsl, getContrastColor } from '@/lib/colorUtils';
import { toast } from 'sonner';

interface ShadeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  baseColor: string;
}

const ShadeGenerator = ({ isOpen, onClose, baseColor }: ShadeGeneratorProps) => {
  const [shadeCount, setShadeCount] = useState(9);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const shades = generateShades(baseColor, shadeCount);

  const copyToClipboard = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
    toast.success(`Copied ${color}`);
  };

  const copyAllShades = () => {
    const allColors = shades.join(', ');
    navigator.clipboard.writeText(allColors);
    toast.success('All shades copied!');
  };

  const exportAsCSS = () => {
    const cssVars = shades.map((shade, i) => `  --shade-${(i + 1) * 100}: ${shade};`).join('\n');
    const css = `:root {\n${cssVars}\n}`;
    navigator.clipboard.writeText(css);
    toast.success('CSS variables copied!');
  };

  const exportAsJSON = () => {
    const json = JSON.stringify({ baseColor, shades }, null, 2);
    navigator.clipboard.writeText(json);
    toast.success('JSON copied!');
  };

  const downloadImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = shades.length * 100;
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    shades.forEach((shade, index) => {
      ctx.fillStyle = shade;
      ctx.fillRect(index * 100, 0, 100, 150);
      
      ctx.fillStyle = getContrastColor(shade);
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(shade, index * 100 + 50, 170);
    });

    const link = document.createElement('a');
    link.download = `shades-${baseColor.replace('#', '')}.png`;
    link.href = canvas.toDataURL();
    link.click();
    toast.success('Image downloaded!');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg shadow-md"
                style={{ backgroundColor: baseColor }}
              />
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Shade Generator</h2>
                <p className="text-sm text-muted-foreground">Base: {baseColor}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Controls */}
          <div className="p-4 sm:p-6 border-b border-border">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Shades:</label>
                <select
                  value={shadeCount}
                  onChange={(e) => setShadeCount(Number(e.target.value))}
                  className="bg-secondary text-secondary-foreground rounded-md px-3 py-1.5 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={7}>7</option>
                  <option value={9}>9</option>
                  <option value={11}>11</option>
                </select>
              </div>
              
              <div className="flex flex-wrap gap-2 ml-auto">
                <Button variant="outline" size="sm" onClick={copyAllShades}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy All
                </Button>
                <Button variant="outline" size="sm" onClick={exportAsCSS}>
                  <Palette className="h-4 w-4 mr-1" />
                  CSS
                </Button>
                <Button variant="outline" size="sm" onClick={exportAsJSON}>
                  JSON
                </Button>
                <Button variant="outline" size="sm" onClick={downloadImage}>
                  <Download className="h-4 w-4 mr-1" />
                  PNG
                </Button>
              </div>
            </div>
          </div>

          {/* Shades Grid */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh]">
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-3">
              {shades.map((shade, index) => {
                const rgb = hexToRgb(shade);
                const hsl = hexToHsl(shade);
                const isCopied = copiedIndex === index;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => copyToClipboard(shade, index)}
                  >
                    <div
                      className="aspect-square rounded-lg shadow-md mb-2 flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ backgroundColor: shade }}
                    >
                      {isCopied ? (
                        <Check className="h-5 w-5" style={{ color: getContrastColor(shade) }} />
                      ) : (
                        <Copy 
                          className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" 
                          style={{ color: getContrastColor(shade) }} 
                        />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-mono font-medium">{shade}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {(index + 1) * 100}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Color Details */}
            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <h3 className="text-sm font-semibold mb-3">Color Values</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
                {shades.slice(0, 3).map((shade, i) => {
                  const rgb = hexToRgb(shade);
                  const hsl = hexToHsl(shade);
                  return (
                    <div key={i} className="flex items-center gap-2 bg-background p-2 rounded">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: shade }} />
                      <span>{shade}</span>
                      {rgb && <span className="text-muted-foreground">rgb({rgb.r},{rgb.g},{rgb.b})</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShadeGenerator;
