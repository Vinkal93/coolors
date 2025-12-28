import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { SavedPalette, usePaletteStore } from '@/store/paletteStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PaletteCardProps {
  palette: SavedPalette;
  index?: number;
  showDelete?: boolean;
}

const PaletteCard = ({ palette, index = 0, showDelete = false }: PaletteCardProps) => {
  const { loadPalette, deletePalette } = usePaletteStore();
  const navigate = useNavigate();

  const handleClick = () => {
    loadPalette(palette.colors);
    navigate('/generator');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deletePalette(palette.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="palette-card group cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex h-24 sm:h-28">
        {palette.colors.map((color, i) => (
          <div
            key={i}
            className="flex-1 first:rounded-l-xl last:rounded-r-xl transition-all duration-200 group-hover:first:rounded-l-lg group-hover:last:rounded-r-lg"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-end justify-between p-3">
        <div className="flex gap-1">
          {palette.colors.map((color, i) => (
            <span key={i} className="text-[10px] text-background/80 font-mono">
              {color}
            </span>
          ))}
        </div>
        
        {showDelete && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-background/80 hover:text-background hover:bg-background/20"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {palette.name && (
        <div className="px-3 py-2 bg-card">
          <p className="text-sm font-medium text-card-foreground truncate">{palette.name}</p>
        </div>
      )}
    </motion.div>
  );
};

export default PaletteCard;
