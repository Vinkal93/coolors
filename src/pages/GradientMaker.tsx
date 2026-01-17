import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Plus, Trash2, RotateCw, Download, Maximize2, Share2, Shuffle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import AdvancedColorPicker from '@/components/AdvancedColorPicker';

interface GradientStop {
  id: string;
  color: string;
  position: number;
}

interface ColorPickerState {
  stopId: string;
  position: { x: number; y: number };
}

const rotationOptions = [
  { value: '0', label: '0°' },
  { value: '45', label: '45°' },
  { value: '90', label: '90°' },
  { value: '135', label: '135°' },
  { value: '180', label: '180°' },
  { value: '225', label: '225°' },
  { value: '270', label: '270°' },
  { value: '315', label: '315°' },
];

const positionOptions = [
  { value: '0', label: '0%' },
  { value: '10', label: '10%' },
  { value: '20', label: '20%' },
  { value: '25', label: '25%' },
  { value: '30', label: '30%' },
  { value: '40', label: '40%' },
  { value: '50', label: '50%' },
  { value: '60', label: '60%' },
  { value: '70', label: '70%' },
  { value: '75', label: '75%' },
  { value: '80', label: '80%' },
  { value: '90', label: '90%' },
  { value: '100', label: '100%' },
];

const gradientCategories = {
  sunset: {
    name: '🌅 Sunset',
    gradients: [
      { name: 'Sunset Blaze', colors: ['#FF512F', '#F09819'] },
      { name: 'Golden Hour', colors: ['#F37335', '#FDC830'] },
      { name: 'Burning Orange', colors: ['#FF416C', '#FF4B2B'] },
      { name: 'Desert Dusk', colors: ['#FFB347', '#FFCC33'] },
      { name: 'Coral Sunset', colors: ['#FF9966', '#FF5E62'] },
      { name: 'Mango Tango', colors: ['#FFE259', '#FFA751'] },
    ]
  },
  ocean: {
    name: '🌊 Ocean',
    gradients: [
      { name: 'Deep Sea', colors: ['#2193B0', '#6DD5ED'] },
      { name: 'Pacific Dream', colors: ['#0093E9', '#80D0C7'] },
      { name: 'Aqua Marine', colors: ['#1A2980', '#26D0CE'] },
      { name: 'Sea Breeze', colors: ['#00C6FF', '#0072FF'] },
      { name: 'Tidal Wave', colors: ['#667DB6', '#0082C8', '#667DB6'] },
      { name: 'Ocean Blue', colors: ['#2E3192', '#1BFFFF'] },
    ]
  },
  forest: {
    name: '🌲 Forest',
    gradients: [
      { name: 'Forest Mist', colors: ['#11998E', '#38EF7D'] },
      { name: 'Emerald Lake', colors: ['#1D976C', '#93F9B9'] },
      { name: 'Deep Forest', colors: ['#0F2027', '#203A43', '#2C5364'] },
      { name: 'Pine Green', colors: ['#134E5E', '#71B280'] },
      { name: 'Moss', colors: ['#56AB2F', '#A8E063'] },
      { name: 'Jungle', colors: ['#5A3F37', '#2C7744'] },
    ]
  },
  purple: {
    name: '💜 Purple',
    gradients: [
      { name: 'Purple Haze', colors: ['#7303C0', '#EC38BC', '#FDEFF9'] },
      { name: 'Lavender', colors: ['#C471F5', '#FA71CD'] },
      { name: 'Violet Dream', colors: ['#4776E6', '#8E54E9'] },
      { name: 'Royal Purple', colors: ['#141E30', '#243B55'] },
      { name: 'Ultra Violet', colors: ['#654EA3', '#EAAFC8'] },
      { name: 'Mystic', colors: ['#757F9A', '#D7DDE8'] },
    ]
  },
  fire: {
    name: '🔥 Fire',
    gradients: [
      { name: 'Fire Blaze', colors: ['#F12711', '#F5AF19'] },
      { name: 'Cherry', colors: ['#EB3349', '#F45C43'] },
      { name: 'Hot Flame', colors: ['#F7971E', '#FFD200'] },
      { name: 'Lava', colors: ['#FF0000', '#FDCF58'] },
      { name: 'Ember', colors: ['#FF512F', '#DD2476'] },
      { name: 'Phoenix', colors: ['#F83600', '#F9D423'] },
    ]
  },
  night: {
    name: '🌙 Night',
    gradients: [
      { name: 'Midnight', colors: ['#0F2027', '#203A43', '#2C5364'] },
      { name: 'Night Sky', colors: ['#141E30', '#243B55'] },
      { name: 'Starry Night', colors: ['#000428', '#004E92'] },
      { name: 'Dark Ocean', colors: ['#373B44', '#4286F4'] },
      { name: 'Eclipse', colors: ['#1F1C2C', '#928DAB'] },
      { name: 'Cosmic', colors: ['#0F0C29', '#302B63', '#24243E'] },
    ]
  },
};

const GradientMaker = () => {
  const [stops, setStops] = useState<GradientStop[]>([
    { id: '1', color: '#6366F1', position: 0 },
    { id: '2', color: '#EC4899', position: 100 },
  ]);
  const [angle, setAngle] = useState(90);
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeColorPicker, setActiveColorPicker] = useState<ColorPickerState | null>(null);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const gradientBarRef = useRef<HTMLDivElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const gradientCSS = (() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');
    
    switch (gradientType) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${stopsStr})`;
      case 'radial':
        return `radial-gradient(circle, ${stopsStr})`;
      case 'conic':
        return `conic-gradient(from ${angle}deg, ${stopsStr})`;
      default:
        return `linear-gradient(${angle}deg, ${stopsStr})`;
    }
  })();

  const addStop = () => {
    if (stops.length >= 6) {
      toast.error('Maximum 6 color stops allowed');
      return;
    }
    const newColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`.toUpperCase();
    const positions = stops.map(s => s.position).sort((a, b) => a - b);
    let newPosition = 50;
    for (let i = 0; i < positions.length - 1; i++) {
      const gap = positions[i + 1] - positions[i];
      if (gap > 20) {
        newPosition = Math.round(positions[i] + gap / 2);
        break;
      }
    }
    setStops([...stops, { id: generateId(), color: newColor, position: newPosition }]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) {
      toast.error('Minimum 2 color stops required');
      return;
    }
    setStops(stops.filter(stop => stop.id !== id));
    if (selectedStopId === id) setSelectedStopId(null);
    if (activeColorPicker?.stopId === id) setActiveColorPicker(null);
  };

  const updateStop = (id: string, updates: Partial<Omit<GradientStop, 'id'>>) => {
    setStops(stops.map(stop => stop.id === id ? { ...stop, ...updates } : stop));
  };

  const handleColorBoxClick = (stopId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveColorPicker({
      stopId,
      position: { x: rect.left, y: rect.bottom + 8 }
    });
    setSelectedStopId(stopId);
  };

  const handleGradientBarClick = (e: React.MouseEvent) => {
    if (!gradientBarRef.current || stops.length >= 6) return;
    const rect = gradientBarRef.current.getBoundingClientRect();
    const position = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const newColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`.toUpperCase();
    setStops([...stops, { id: generateId(), color: newColor, position }]);
  };

  const copyCSS = async () => {
    await navigator.clipboard.writeText(`background: ${gradientCSS};`);
    setCopied(true);
    toast.success('CSS copied!');
    setTimeout(() => setCopied(false), 1500);
  };

  const loadPreset = (colors: string[]) => {
    const step = 100 / (colors.length - 1);
    setStops(colors.map((color, i) => ({ 
      id: generateId(), 
      color, 
      position: Math.round(i * step) 
    })));
    setActiveColorPicker(null);
  };

  const randomGradient = () => {
    const numStops = 2 + Math.floor(Math.random() * 2);
    const newStops: GradientStop[] = [];
    for (let i = 0; i < numStops; i++) {
      newStops.push({
        id: generateId(),
        color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`.toUpperCase(),
        position: Math.round((i / (numStops - 1)) * 100)
      });
    }
    setStops(newStops);
    setAngle(Math.floor(Math.random() * 360));
    setActiveColorPicker(null);
  };

  const downloadAsPNG = async () => {
    if (!previewRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create gradient
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    let gradient: CanvasGradient;
    
    if (gradientType === 'linear') {
      const angleRad = (angle - 90) * Math.PI / 180;
      const x1 = canvas.width / 2 - Math.cos(angleRad) * canvas.width;
      const y1 = canvas.height / 2 - Math.sin(angleRad) * canvas.height;
      const x2 = canvas.width / 2 + Math.cos(angleRad) * canvas.width;
      const y2 = canvas.height / 2 + Math.sin(angleRad) * canvas.height;
      gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    } else {
      gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
    }

    sortedStops.forEach(stop => {
      gradient.addColorStop(stop.position / 100, stop.color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const link = document.createElement('a');
    link.download = 'gradient.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Gradient downloaded!');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" onClick={() => setActiveColorPicker(null)}>
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="text-tool-purple">Gradient</span> Maker
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Create and export beautiful gradients.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Controls Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-lg"
            >
              {/* Gradient Bar with Stops */}
              <div className="mb-6">
                <div className="relative">
                  <div
                    ref={gradientBarRef}
                    className="h-8 rounded-full cursor-pointer relative"
                    style={{ background: gradientCSS }}
                    onClick={handleGradientBarClick}
                  >
                    {/* Stop indicators on the gradient bar */}
                    {stops.map(stop => (
                      <div
                        key={stop.id}
                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 cursor-pointer transition-transform ${
                          selectedStopId === stop.id ? 'border-primary scale-125' : 'border-white'
                        }`}
                        style={{ 
                          left: `calc(${stop.position}% - 8px)`,
                          backgroundColor: stop.color,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStopId(stop.id);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Color Stop Editor */}
              {selectedStopId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 bg-muted/30 rounded-xl"
                >
                  {stops.filter(s => s.id === selectedStopId).map(stop => (
                    <div key={stop.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Color</Label>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeStop(stop.id)}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl border border-border cursor-pointer shadow-inner relative overflow-hidden"
                          style={{ backgroundColor: stop.color }}
                          onClick={(e) => handleColorBoxClick(stop.id, e)}
                        />
                        <Input
                          value={stop.color}
                          onChange={(e) => updateStop(stop.id, { color: e.target.value.toUpperCase() })}
                          className="font-mono text-sm flex-1"
                          maxLength={7}
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm">Position</Label>
                          <span className="text-sm font-mono text-muted-foreground">{stop.position}%</span>
                        </div>
                        <Select
                          value={stop.position.toString()}
                          onValueChange={(value) => updateStop(stop.id, { position: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {positionOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Rotation */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Rotation</Label>
                  <Select value={angle.toString()} onValueChange={(v) => setAngle(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rotationOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Type</Label>
                  <Select value={gradientType} onValueChange={(v: any) => setGradientType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="radial">Radial</SelectItem>
                      <SelectItem value="conic">Conic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={randomGradient}>
                  <Shuffle className="h-4 w-4 mr-2" />
                  Random
                </Button>
                <Button className="flex-1 gap-2" onClick={copyCSS}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy CSS'}
                </Button>
              </div>
            </motion.div>

            {/* Preview Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div
                ref={previewRef}
                className={`rounded-2xl shadow-2xl overflow-hidden transition-all ${
                  isFullscreen ? 'fixed inset-4 z-50' : 'h-80 lg:h-96'
                }`}
                style={{ background: gradientCSS }}
              >
                {/* Fullscreen and Download buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm hover:bg-background"
                    onClick={downloadAsPNG}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm hover:bg-background"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* CSS Output */}
              <div className="mt-4 bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold">CSS Code</Label>
                  <Button variant="ghost" size="sm" onClick={copyCSS} className="gap-2">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <code className="text-xs sm:text-sm font-mono break-all text-muted-foreground block">
                  background: {gradientCSS};
                </code>
              </div>
            </motion.div>
          </div>

          {/* Preset Gradients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 space-y-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-center">Preset Gradients</h3>
            
            {Object.entries(gradientCategories).map(([key, category]) => (
              <div key={key}>
                <h4 className="text-lg font-bold mb-4">{category.name}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {category.gradients.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => loadPreset(preset.colors)}
                      className="group relative h-20 sm:h-24 rounded-xl overflow-hidden hover-lift"
                      style={{ 
                        background: `linear-gradient(135deg, ${preset.colors.join(', ')})`
                      }}
                    >
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                        <span className="text-white font-semibold text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg text-center px-2">
                          {preset.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Color Picker Popup */}
      <AnimatePresence>
        {activeColorPicker && (
          <div
            className="fixed z-50"
            style={{
              left: Math.min(activeColorPicker.position.x, window.innerWidth - 300),
              top: Math.min(activeColorPicker.position.y, window.innerHeight - 400)
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AdvancedColorPicker
              initialColor={stops.find(s => s.id === activeColorPicker.stopId)?.color || '#000000'}
              onColorChange={(color) => updateStop(activeColorPicker.stopId, { color })}
              onClose={() => setActiveColorPicker(null)}
            />
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default GradientMaker;
