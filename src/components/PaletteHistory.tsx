import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Trash2, RefreshCw, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePaletteStore, SavedPalette } from '@/store/paletteStore';
import { toast } from 'sonner';
import { formatDistanceToNow, format, isToday, isYesterday, subDays, isAfter } from 'date-fns';

interface PaletteHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaletteHistory = ({ isOpen, onClose }: PaletteHistoryProps) => {
  const { recentPalettes, loadPalette, cleanExpiredPalettes } = usePaletteStore();

  const groupedPalettes = () => {
    const groups: { label: string; palettes: SavedPalette[] }[] = [];
    
    const today: SavedPalette[] = [];
    const yesterday: SavedPalette[] = [];
    const thisWeek: SavedPalette[] = [];

    const weekAgo = subDays(new Date(), 7);

    recentPalettes.forEach((palette) => {
      const date = new Date(palette.savedAt);
      
      if (!isAfter(date, weekAgo)) return;
      
      if (isToday(date)) {
        today.push(palette);
      } else if (isYesterday(date)) {
        yesterday.push(palette);
      } else {
        thisWeek.push(palette);
      }
    });

    if (today.length > 0) groups.push({ label: 'Today', palettes: today });
    if (yesterday.length > 0) groups.push({ label: 'Yesterday', palettes: yesterday });
    if (thisWeek.length > 0) groups.push({ label: 'This Week', palettes: thisWeek });

    return groups;
  };

  const handleRestore = (colors: string[]) => {
    loadPalette(colors);
    toast.success('Palette restored!');
    onClose();
  };

  const handleClearHistory = () => {
    cleanExpiredPalettes();
    toast.success('History cleaned!');
  };

  if (!isOpen) return null;

  const groups = groupedPalettes();

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
          className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Palette History</h2>
                <p className="text-sm text-muted-foreground">Last 7 days • {recentPalettes.length} palettes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleClearHistory}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-100px)]">
            {groups.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No palettes in history</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Generated palettes will appear here for 7 days
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {groups.map((group) => (
                  <div key={group.label}>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-muted-foreground">{group.label}</h3>
                      <span className="text-xs text-muted-foreground/70">({group.palettes.length})</span>
                    </div>
                    
                    <div className="grid gap-3">
                      {group.palettes.map((palette, index) => (
                        <motion.div
                          key={palette.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-secondary/30 rounded-xl p-3 hover:bg-secondary/50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            {/* Color Preview */}
                            <div className="flex rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                              {palette.colors.map((color, i) => (
                                <div
                                  key={i}
                                  className="w-8 h-10 sm:w-10 sm:h-12"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-mono text-muted-foreground truncate">
                                {palette.colors.join(' • ')}
                              </p>
                              <p className="text-xs text-muted-foreground/70 mt-1">
                                {formatDistanceToNow(new Date(palette.savedAt), { addSuffix: true })}
                              </p>
                            </div>

                            {/* Restore Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                              onClick={() => handleRestore(palette.colors)}
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Restore
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaletteHistory;
