import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  Download, 
  Heart, 
  Share2, 
  Code, 
  Image as ImageIcon,
  Check,
  Loader2
} from 'lucide-react';
import { usePaletteStore } from '@/store/paletteStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const GeneratorToolbar = () => {
  const { colors, generateNewPalette, savePalette } = usePaletteStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = () => {
    generateNewPalette();
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      savePalette();
      setSaving(false);
      setSaved(true);
      toast.success('Palette saved!');
      setTimeout(() => setSaved(false), 2000);
    }, 300);
  };

  const handleExportCSS = () => {
    const css = colors
      .map((c, i) => `  --color-${i + 1}: ${c.hex};`)
      .join('\n');
    const fullCSS = `:root {\n${css}\n}`;
    
    navigator.clipboard.writeText(fullCSS);
    toast.success('CSS copied to clipboard!');
  };

  const handleExportImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 600;
    const colorWidth = width / colors.length;

    canvas.width = width;
    canvas.height = height;

    colors.forEach((color, i) => {
      ctx.fillStyle = color.hex;
      ctx.fillRect(i * colorWidth, 0, colorWidth, height);
    });

    // Add hex values
    ctx.font = 'bold 24px Space Grotesk, sans-serif';
    colors.forEach((color, i) => {
      const x = i * colorWidth + colorWidth / 2;
      const y = height - 40;
      
      // Determine text color based on background
      const rgb = parseInt(color.hex.slice(1), 16);
      const r = (rgb >> 16) & 255;
      const g = (rgb >> 8) & 255;
      const b = rgb & 255;
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      ctx.fillStyle = luminance > 0.5 ? '#000000' : '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(color.hex, x, y);
    });

    const link = document.createElement('a');
    link.download = `palette-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    toast.success('Image downloaded!');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/generator?colors=${colors.map(c => c.hex.slice(1)).join('-')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Color Palette',
          text: 'Check out this color palette!',
          url,
        });
      } catch (err) {
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:bottom-auto sm:left-auto sm:translate-x-0 sm:right-4 sm:top-1/2 sm:-translate-y-1/2 z-40"
    >
      <div className="glass rounded-2xl p-2 flex flex-row sm:flex-col gap-2 shadow-lg">
        {/* Generate */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGenerate}
          className="hover:bg-primary/10 hover:text-primary h-10 w-10 sm:h-10 sm:w-10"
          title="Generate new palette (Space)"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>

        {/* Save */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          disabled={saving}
          className="hover:bg-accent/20 hover:text-accent h-10 w-10 sm:h-10 sm:w-10"
          title="Save palette"
        >
          <AnimatePresence mode="wait">
            {saving ? (
              <motion.div
                key="loading"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <Loader2 className="h-5 w-5 animate-spin" />
              </motion.div>
            ) : saved ? (
              <motion.div
                key="saved"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <Check className="h-5 w-5 text-success" />
              </motion.div>
            ) : (
              <motion.div
                key="heart"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <Heart className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Export dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-secondary h-10 w-10 sm:h-10 sm:w-10"
              title="Export"
            >
              <Download className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="center" className="w-40 sm:side-left bg-popover">
            <DropdownMenuItem onClick={handleExportCSS} className="gap-2">
              <Code className="h-4 w-4" />
              Export as CSS
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportImage} className="gap-2">
              <ImageIcon className="h-4 w-4" />
              Export as Image
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Share */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          className="hover:bg-secondary h-10 w-10 sm:h-10 sm:w-10"
          title="Share palette"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default GeneratorToolbar;
