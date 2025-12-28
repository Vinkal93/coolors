import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Clock, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import PaletteCard from '@/components/PaletteCard';
import { usePaletteStore, SavedPalette } from '@/store/paletteStore';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Curated palettes
const curatedPalettes: SavedPalette[] = [
  { id: 'c1', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'], savedAt: Date.now(), name: 'Tropical Sunset' },
  { id: 'c2', colors: ['#2D3436', '#636E72', '#B2BEC3', '#DFE6E9', '#FFFFFF'], savedAt: Date.now(), name: 'Minimal Gray' },
  { id: 'c3', colors: ['#6C5CE7', '#A29BFE', '#74B9FF', '#81ECEC', '#00CEC9'], savedAt: Date.now(), name: 'Ocean Dreams' },
  { id: 'c4', colors: ['#FD79A8', '#F8B500', '#00B894', '#00CEC9', '#0984E3'], savedAt: Date.now(), name: 'Vibrant Pop' },
  { id: 'c5', colors: ['#E17055', '#FDCB6E', '#00B894', '#0984E3', '#6C5CE7'], savedAt: Date.now(), name: 'Rainbow Bright' },
  { id: 'c6', colors: ['#2C3E50', '#E74C3C', '#ECF0F1', '#3498DB', '#2ECC71'], savedAt: Date.now(), name: 'Corporate Clean' },
  { id: 'c7', colors: ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#533483'], savedAt: Date.now(), name: 'Dark Neon' },
  { id: 'c8', colors: ['#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD'], savedAt: Date.now(), name: 'Light Shades' },
  { id: 'c9', colors: ['#FF9A9E', '#FECFEF', '#FFDDE1', '#A1C4FD', '#C2E9FB'], savedAt: Date.now(), name: 'Pastel Dream' },
  { id: 'c10', colors: ['#667EEA', '#764BA2', '#F093FB', '#F5576C', '#4FACFE'], savedAt: Date.now(), name: 'Gradient Magic' },
  { id: 'c11', colors: ['#0F0F0F', '#1A1A1A', '#2D2D2D', '#3D3D3D', '#4D4D4D'], savedAt: Date.now(), name: 'Dark Mode' },
  { id: 'c12', colors: ['#00B4D8', '#0077B6', '#03045E', '#023E8A', '#0096C7'], savedAt: Date.now(), name: 'Deep Blue' },
];

const Explore = () => {
  const { savedPalettes, recentPalettes } = usePaletteStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filterPalettes = (palettes: SavedPalette[]) => {
    if (!searchQuery.trim()) return palettes;
    
    const query = searchQuery.toLowerCase();
    return palettes.filter(p => 
      p.name?.toLowerCase().includes(query) ||
      p.colors.some(c => c.toLowerCase().includes(query))
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Explore <span className="text-gradient">Palettes</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Discover beautiful color combinations for your next project
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or color..."
                className="pl-12 h-12 rounded-full bg-secondary border-0"
              />
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="curated" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="curated" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Curated
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2">
                <Heart className="h-4 w-4" />
                Saved
              </TabsTrigger>
              <TabsTrigger value="recent" className="gap-2">
                <Clock className="h-4 w-4" />
                Recent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="curated">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterPalettes(curatedPalettes).map((palette, i) => (
                  <PaletteCard key={palette.id} palette={palette} index={i} />
                ))}
              </div>
              {filterPalettes(curatedPalettes).length === 0 && (
                <EmptyState message="No palettes match your search" />
              )}
            </TabsContent>

            <TabsContent value="saved">
              {savedPalettes.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterPalettes(savedPalettes).map((palette, i) => (
                    <PaletteCard key={palette.id} palette={palette} index={i} showDelete />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  message="No saved palettes yet" 
                  description="Save palettes from the generator to see them here"
                />
              )}
              {savedPalettes.length > 0 && filterPalettes(savedPalettes).length === 0 && (
                <EmptyState message="No palettes match your search" />
              )}
            </TabsContent>

            <TabsContent value="recent">
              {recentPalettes.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterPalettes(recentPalettes).map((palette, i) => (
                    <PaletteCard key={palette.id} palette={palette} index={i} />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  message="No recent palettes" 
                  description="Generate some palettes to see your history here"
                />
              )}
              {recentPalettes.length > 0 && filterPalettes(recentPalettes).length === 0 && (
                <EmptyState message="No palettes match your search" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

const EmptyState = ({ message, description }: { message: string; description?: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-16"
  >
    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
      <Search className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{message}</h3>
    {description && (
      <p className="text-muted-foreground text-sm">{description}</p>
    )}
  </motion.div>
);

export default Explore;
