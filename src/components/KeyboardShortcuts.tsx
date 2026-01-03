import { motion } from 'framer-motion';
import { Keyboard } from 'lucide-react';

const shortcuts = [
  { key: 'Space', action: 'Generate' },
  { key: 'L', action: 'Lock' },
  { key: 'S', action: 'Save' },
];

const KeyboardShortcuts = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-2rem)]"
    >
      <div className="glass rounded-full px-3 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-6 shadow-lg">
        <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
          <Keyboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm font-medium hidden sm:inline">Shortcuts:</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center gap-1 sm:gap-2">
              <kbd className="kbd text-[10px] sm:text-xs px-1.5 sm:px-2">{shortcut.key}</kbd>
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                {shortcut.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default KeyboardShortcuts;
