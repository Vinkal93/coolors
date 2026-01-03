import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2, Eye, ExternalLink, Maximize2, Copy, Download, MoreHorizontal, Palette } from 'lucide-react';
import { SavedPalette, usePaletteStore } from '@/store/paletteStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ColorInfoModal from './ColorInfoModal';

interface PaletteCardProps {
  palette: SavedPalette;
  index?: number;
  showDelete?: boolean;
}

const PaletteCard = ({ palette, index = 0, showDelete = false }: PaletteCardProps) => {
  const { loadPalette, deletePalette, likePalette, getLikes } = usePaletteStore();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  // Create a unique key for likes based on colors
  const paletteKey = palette.colors.join('-');
  const likes = getLikes(paletteKey);

  const handleOpenInGenerator = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    loadPalette(palette.colors);
    navigate('/generator');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deletePalette(palette.id);
    toast.success('Palette deleted');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(
      <div className="flex flex-col gap-2">
        <span className="font-semibold">{palette.name || 'Palette'}</span>
        <div className="flex gap-1">
          {palette.colors.map((color, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    );
  };

  const handleCopyColors = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(palette.colors.join(', '));
    toast.success('Colors copied to clipboard');
  };

  const handleCopyCSS = (e: React.MouseEvent) => {
    e.stopPropagation();
    const css = palette.colors.map((c, i) => `--color-${i + 1}: ${c};`).join('\n');
    navigator.clipboard.writeText(css);
    toast.success('CSS variables copied');
  };

  const handleExportJSON = (e: React.MouseEvent) => {
    e.stopPropagation();
    const json = JSON.stringify({ name: palette.name, colors: palette.colors }, null, 2);
    navigator.clipboard.writeText(json);
    toast.success('JSON exported to clipboard');
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likePalette(paletteKey);
    toast.success('Palette liked!');
  };

  const handleColorClick = (e: React.MouseEvent, color: string) => {
    e.stopPropagation();
    setSelectedColor(color);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="palette-card group"
    >
      {/* Color strips */}
      <div 
        className="flex h-24 sm:h-28"
      >
        {palette.colors.map((color, i) => (
          <div
            key={i}
            className="flex-1 first:rounded-tl-xl last:rounded-tr-xl transition-all duration-200 cursor-pointer hover:scale-y-105 hover:z-10"
            style={{ backgroundColor: color }}
            onClick={(e) => handleColorClick(e, color)}
            title={`Click to view ${color} details`}
          />
        ))}
      </div>
      
      {/* Bottom info bar */}
      <div className="px-3 py-2.5 bg-card flex items-center justify-between gap-2">
        <p 
          className="text-sm font-medium text-card-foreground truncate flex-1 cursor-pointer"
          onClick={() => handleOpenInGenerator()}
        >
          {palette.name || 'Untitled Palette'}
        </p>
        
        <div className="flex items-center gap-1">
          {/* Like button with counter */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-red-500 gap-1"
            onClick={handleLike}
          >
            <Heart className="h-4 w-4" />
            {likes > 0 && <span className="text-xs font-medium">{likes}</span>}
          </Button>
          
          {/* Quick view button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={handleQuickView}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          {/* 3-dot menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-popover border border-border shadow-lg z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem onClick={handleOpenInGenerator} className="gap-2 cursor-pointer">
                <ExternalLink className="h-4 w-4" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenInGenerator} className="gap-2 cursor-pointer">
                <Palette className="h-4 w-4" />
                Open in Generator
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleQuickView} className="gap-2 cursor-pointer">
                <Eye className="h-4 w-4" />
                Quick View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                loadPalette(palette.colors);
                toast.info('View fullscreen in generator');
                navigate('/generator');
              }} className="gap-2 cursor-pointer">
                <Maximize2 className="h-4 w-4" />
                View Fullscreen
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleCopyColors} className="gap-2 cursor-pointer">
                <Copy className="h-4 w-4" />
                Copy Colors
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyCSS} className="gap-2 cursor-pointer">
                <Copy className="h-4 w-4" />
                Copy as CSS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON} className="gap-2 cursor-pointer">
                <Download className="h-4 w-4" />
                Export JSON
              </DropdownMenuItem>
              
              {showDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleDelete} 
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Color Info Modal */}
      <ColorInfoModal
        color={selectedColor || '#000000'}
        open={!!selectedColor}
        onOpenChange={(open) => !open && setSelectedColor(null)}
      />
    </motion.div>
  );
};

export default PaletteCard;