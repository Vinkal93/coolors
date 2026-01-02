import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Plus, Trash2, RotateCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface GradientStop {
  color: string;
  position: number;
}

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
      { name: 'Tidal Wave', colors: ['#667DB6', '#0082C8', '#0082C8', '#667DB6'] },
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

const allGradients = Object.values(gradientCategories).flatMap(cat => cat.gradients);

const GradientMaker = () => {
  const [stops, setStops] = useState<GradientStop[]>([
    { color: '#6366F1', position: 0 },
    { color: '#EC4899', position: 100 },
  ]);
  const [angle, setAngle] = useState(135);
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [copied, setCopied] = useState(false);

  const gradientCSS = gradientType === 'linear'
    ? `linear-gradient(${angle}deg, ${stops.map(s => `${s.color} ${s.position}%`).join(', ')})`
    : `radial-gradient(circle, ${stops.map(s => `${s.color} ${s.position}%`).join(', ')})`;

  const addStop = () => {
    if (stops.length >= 5) {
      toast.error('Maximum 5 color stops allowed');
      return;
    }
    const newPosition = Math.round((stops[stops.length - 1].position + stops[0].position) / 2);
    const newColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`.toUpperCase();
    setStops([...stops, { color: newColor, position: newPosition }].sort((a, b) => a.position - b.position));
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) {
      toast.error('Minimum 2 color stops required');
      return;
    }
    setStops(stops.filter((_, i) => i !== index));
  };

  const updateStop = (index: number, updates: Partial<GradientStop>) => {
    setStops(stops.map((stop, i) => i === index ? { ...stop, ...updates } : stop));
  };

  const copyCSS = async () => {
    await navigator.clipboard.writeText(`background: ${gradientCSS};`);
    setCopied(true);
    toast.success('CSS copied!');
    setTimeout(() => setCopied(false), 1500);
  };

  const loadPreset = (colors: string[]) => {
    const step = 100 / (colors.length - 1);
    setStops(colors.map((color, i) => ({ color, position: Math.round(i * step) })));
  };

  const randomGradient = () => {
    const numStops = 2 + Math.floor(Math.random() * 2);
    const newStops: GradientStop[] = [];
    for (let i = 0; i < numStops; i++) {
      newStops.push({
        color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`.toUpperCase(),
        position: Math.round((i / (numStops - 1)) * 100)
      });
    }
    setStops(newStops);
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="text-tool-purple">Gradient</span> Maker
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Create beautiful CSS gradients for your designs
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div 
                className="h-64 sm:h-80 rounded-2xl shadow-xl mb-4"
                style={{ background: gradientCSS }}
              />
              
              {/* CSS Output */}
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold">CSS Code</Label>
                  <Button variant="ghost" size="sm" onClick={copyCSS} className="gap-2">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <code className="text-xs sm:text-sm font-mono break-all text-muted-foreground">
                  background: {gradientCSS};
                </code>
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Type Selector */}
              <div className="bg-card rounded-xl p-4 border border-border">
                <Label className="text-sm font-semibold mb-3 block">Gradient Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={gradientType === 'linear' ? 'default' : 'outline'}
                    onClick={() => setGradientType('linear')}
                    className="flex-1"
                  >
                    Linear
                  </Button>
                  <Button
                    variant={gradientType === 'radial' ? 'default' : 'outline'}
                    onClick={() => setGradientType('radial')}
                    className="flex-1"
                  >
                    Radial
                  </Button>
                </div>
              </div>

              {/* Angle (Linear only) */}
              {gradientType === 'linear' && (
                <div className="bg-card rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-semibold">Angle</Label>
                    <span className="text-sm font-mono">{angle}°</span>
                  </div>
                  <Slider
                    value={[angle]}
                    max={360}
                    step={1}
                    onValueChange={([v]) => setAngle(v)}
                  />
                </div>
              )}

              {/* Color Stops */}
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold">Color Stops</Label>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={randomGradient}>
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={addStop}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {stops.map((stop, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg border border-border cursor-pointer relative overflow-hidden"
                        style={{ backgroundColor: stop.color }}
                      >
                        <input
                          type="color"
                          value={stop.color}
                          onChange={(e) => updateStop(i, { color: e.target.value.toUpperCase() })}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <Input
                        value={stop.color}
                        onChange={(e) => updateStop(i, { color: e.target.value.toUpperCase() })}
                        className="font-mono text-sm flex-1"
                        maxLength={7}
                      />
                      <Input
                        type="number"
                        value={stop.position}
                        onChange={(e) => updateStop(i, { position: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                        className="w-20 text-sm"
                        min={0}
                        max={100}
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeStop(i)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Preset Gradients by Category */}
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

      <Footer />
    </div>
  );
};

export default GradientMaker;
