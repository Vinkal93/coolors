import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Lock, 
  Palette, 
  Image, 
  Contrast, 
  Layers,
  Check,
  Star,
  Users,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaletteCard from '@/components/PaletteCard';
import { usePaletteStore, SavedPalette } from '@/store/paletteStore';

// Sample palettes for showcase
const samplePalettes: SavedPalette[] = [
  { id: '1', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'], savedAt: Date.now(), name: 'Tropical Sunset' },
  { id: '2', colors: ['#2D3436', '#636E72', '#B2BEC3', '#DFE6E9', '#FFFFFF'], savedAt: Date.now(), name: 'Minimal Gray' },
  { id: '3', colors: ['#6C5CE7', '#A29BFE', '#74B9FF', '#81ECEC', '#00CEC9'], savedAt: Date.now(), name: 'Ocean Dreams' },
  { id: '4', colors: ['#FD79A8', '#F8B500', '#00B894', '#00CEC9', '#0984E3'], savedAt: Date.now(), name: 'Vibrant Pop' },
  { id: '5', colors: ['#E17055', '#FDCB6E', '#00B894', '#0984E3', '#6C5CE7'], savedAt: Date.now(), name: 'Rainbow Bright' },
  { id: '6', colors: ['#2C3E50', '#E74C3C', '#ECF0F1', '#3498DB', '#2ECC71'], savedAt: Date.now(), name: 'Corporate Clean' },
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate beautiful palettes instantly with a single press of the spacebar.',
    color: 'text-tool-yellow',
    bg: 'bg-tool-yellow/10',
  },
  {
    icon: Lock,
    title: 'Lock & Customize',
    description: 'Lock colors you love and regenerate the rest to find the perfect combination.',
    color: 'text-tool-cyan',
    bg: 'bg-tool-cyan/10',
  },
  {
    icon: Palette,
    title: 'Export Anywhere',
    description: 'Export your palettes as CSS variables, images, or share them with a link.',
    color: 'text-tool-purple',
    bg: 'bg-tool-purple/10',
  },
  {
    icon: Image,
    title: 'Image Picker',
    description: 'Extract beautiful color palettes from any image in seconds.',
    color: 'text-tool-pink',
    bg: 'bg-tool-pink/10',
  },
  {
    icon: Contrast,
    title: 'Contrast Checker',
    description: 'Ensure your designs meet WCAG accessibility standards.',
    color: 'text-tool-orange',
    bg: 'bg-tool-orange/10',
  },
  {
    icon: Layers,
    title: 'Gradient Maker',
    description: 'Create stunning CSS gradients with our easy-to-use tool.',
    color: 'text-tool-green',
    bg: 'bg-tool-green/10',
  },
];

const stats = [
  { value: '100%', label: 'Free Forever', icon: Star },
  { value: '∞', label: 'Unlimited Palettes', icon: Palette },
  { value: '0', label: 'Sign-up Required', icon: Users },
  { value: 'Instant', label: 'Export & Share', icon: Download },
];

const Index = () => {
  const { recentPalettes, savedPalettes } = usePaletteStore();
  const [heroColors, setHeroColors] = useState(['#00B4D8', '#E63946', '#F4A261', '#2A9D8F', '#9B5DE5']);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroColors(prev => {
        const newColors = [...prev];
        const randomIndex = Math.floor(Math.random() * 5);
        const hue = Math.random() * 360;
        const saturation = 60 + Math.random() * 30;
        const lightness = 45 + Math.random() * 20;
        
        const hslToHex = (h: number, s: number, l: number): string => {
          s /= 100;
          l /= 100;
          const a = s * Math.min(l, 1 - l);
          const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
          };
          return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
        };
        
        newColors[randomIndex] = hslToHex(hue, saturation, lightness);
        return newColors;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 -right-40 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: heroColors[0] }}
          />
          <motion.div
            animate={{ 
              x: [0, -20, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-40 -left-40 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: heroColors[2] }}
          />
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6"
            >
              <Sparkles className="h-4 w-4" />
              100% Free • No Sign-up Required
            </motion.div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              The super fast
              <br />
              <span className="text-gradient">color palettes</span> generator
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Create beautiful color schemes in seconds. Press spacebar to generate, 
              lock colors you love, and export anywhere. No sign-up required!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/generator">
                <Button variant="hero" className="group w-full sm:w-auto">
                  Start Generating
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="hero-outline" className="w-full sm:w-auto">
                  Explore Palettes
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero palette preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto max-w-3xl"
          >
            <div className="flex h-24 sm:h-32 md:h-40 rounded-2xl overflow-hidden shadow-2xl">
              {heroColors.map((color, i) => (
                <motion.div
                  key={i}
                  className="flex-1 transition-colors duration-700"
                  style={{ backgroundColor: color }}
                  whileHover={{ flex: 1.3 }}
                />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2"
            >
              <div className="glass rounded-full px-3 sm:px-4 py-2 flex items-center gap-2 text-xs sm:text-sm">
                <Sparkles className="h-3 sm:h-4 w-3 sm:w-4 text-primary" />
                <span className="text-muted-foreground">Press</span>
                <kbd className="kbd text-xs">Space</kbd>
                <span className="text-muted-foreground hidden sm:inline">to generate</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-primary/5">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-4 sm:p-6"
              >
                <stat.icon className="h-6 sm:h-8 w-6 sm:w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4">
              Powerful Tools, <span className="text-gradient">Completely Free</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Everything you need to create, customize, and export your perfect color palette.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${feature.bg} rounded-2xl p-6 hover-lift`}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className={`text-lg sm:text-xl font-extrabold mb-2 ${feature.color}`}>{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Create your perfect palette in 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Generate', desc: 'Press spacebar or click generate to create random palettes instantly.' },
              { step: '02', title: 'Customize', desc: 'Lock colors you love, adjust with the color picker, and fine-tune.' },
              { step: '03', title: 'Export', desc: 'Download as image, copy CSS code, or share with a unique link.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl sm:text-6xl font-extrabold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Palettes Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4">
              Trending Palettes
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Get inspired by popular color combinations
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {samplePalettes.map((palette, i) => (
              <PaletteCard key={palette.id} palette={palette} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 sm:mt-12"
          >
            <Link to="/explore">
              <Button variant="outline" size="lg" className="gap-2">
                View All Palettes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Gradient background */}
            <div 
              className="absolute inset-0"
              style={{ background: 'var(--gradient-hero)' }}
            />
            
            <div className="relative z-10 py-12 sm:py-16 px-6 sm:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4">
                Ready to create something beautiful?
              </h2>
              <p className="text-primary-foreground/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
                Start generating stunning color palettes for your next project. 
                It's fast, free, and incredibly fun.
              </p>
              <Link to="/generator">
                <Button 
                  size="xl" 
                  className="bg-background text-foreground hover:bg-background/90 shadow-xl"
                >
                  Start Creating
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
