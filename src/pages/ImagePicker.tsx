import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Copy, Check, Download, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { usePaletteStore } from '@/store/paletteStore';

const ImagePicker = () => {
  const [image, setImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { loadPalette } = usePaletteStore();

  const extractColors = useCallback((imageElement: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize for faster processing
    const maxSize = 100;
    const ratio = Math.min(maxSize / imageElement.width, maxSize / imageElement.height);
    canvas.width = imageElement.width * ratio;
    canvas.height = imageElement.height * ratio;

    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Color quantization using simple bucketing
    const colorMap: { [key: string]: number } = {};

    for (let i = 0; i < pixels.length; i += 4) {
      const r = Math.round(pixels[i] / 32) * 32;
      const g = Math.round(pixels[i + 1] / 32) * 32;
      const b = Math.round(pixels[i + 2] / 32) * 32;
      const key = `${r},${g},${b}`;
      colorMap[key] = (colorMap[key] || 0) + 1;
    }

    // Sort by frequency and get top colors
    const sortedColors = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Convert to hex and filter similar colors
    const colors: string[] = [];
    for (const [rgb] of sortedColors) {
      const [r, g, b] = rgb.split(',').map(Number);
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
      
      // Check if color is too similar to existing ones
      const isSimilar = colors.some(c => {
        const [cr, cg, cb] = [
          parseInt(c.slice(1, 3), 16),
          parseInt(c.slice(3, 5), 16),
          parseInt(c.slice(5, 7), 16)
        ];
        const distance = Math.sqrt(
          Math.pow(r - cr, 2) + Math.pow(g - cg, 2) + Math.pow(b - cb, 2)
        );
        return distance < 50;
      });

      if (!isSimilar && colors.length < 6) {
        colors.push(hex);
      }
    }

    // Ensure we have at least 5 colors
    while (colors.length < 5) {
      const randomHex = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`.toUpperCase();
      colors.push(randomHex);
    }

    setExtractedColors(colors.slice(0, 5));
  }, []);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImage(dataUrl);

      const img = new Image();
      img.onload = () => extractColors(img);
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const copyColor = async (color: string, index: number) => {
    await navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    toast.success('Color copied!');
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const usePalette = () => {
    if (extractedColors.length >= 5) {
      loadPalette(extractedColors.slice(0, 5));
      navigate('/generator');
      toast.success('Palette loaded!');
    }
  };

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
              <span className="text-tool-pink">Image</span> Color Picker
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Extract beautiful color palettes from any image
            </p>
          </motion.div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-colors cursor-pointer ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {image ? (
                <div className="space-y-4">
                  <img 
                    src={image} 
                    alt="Uploaded" 
                    className="max-h-64 mx-auto rounded-lg shadow-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Click or drag to upload a different image
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Drop an image here</p>
                    <p className="text-muted-foreground">or click to browse</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Hidden canvas for color extraction */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Extracted Colors */}
          {extractedColors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <h3 className="text-xl font-bold mb-4 text-center">Extracted Colors</h3>
              
              {/* Color Strip */}
              <div className="flex h-24 sm:h-32 rounded-2xl overflow-hidden shadow-xl mb-6">
                {extractedColors.map((color, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 cursor-pointer relative group"
                    style={{ backgroundColor: color }}
                    whileHover={{ flex: 1.5 }}
                    onClick={() => copyColor(color, i)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedIndex === i ? (
                        <Check className="h-6 w-6 text-white drop-shadow-lg" />
                      ) : (
                        <Copy className="h-6 w-6 text-white drop-shadow-lg" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Color Values */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {extractedColors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => copyColor(color, i)}
                    className="p-2 bg-card rounded-lg border border-border text-center hover:bg-secondary transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-mono font-semibold">{color}</span>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={usePalette} className="gap-2">
                  <Palette className="h-5 w-5" />
                  Use This Palette
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const css = extractedColors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n');
                    navigator.clipboard.writeText(`:root {\n${css}\n}`);
                    toast.success('CSS copied!');
                  }}
                  className="gap-2"
                >
                  <Download className="h-5 w-5" />
                  Copy as CSS
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImagePicker;
