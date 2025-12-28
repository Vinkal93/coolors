import { motion } from 'framer-motion';
import { Keyboard } from 'lucide-react';

const shortcuts = [
  { key: 'Space', action: 'Generate new palette' },
  { key: 'L', action: 'Toggle lock' },
  { key: 'S', action: 'Save palette' },
];

const KeyboardShortcuts = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="glass rounded-full px-6 py-3 flex items-center gap-6 shadow-lg">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Keyboard className="h-4 w-4" />
          <span className="text-sm font-medium">Shortcuts:</span>
        </div>
        
        <div className="flex items-center gap-4">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center gap-2">
              <kbd className="kbd">{shortcut.key}</kbd>
              <span className="text-xs text-muted-foreground hidden sm:inline">
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
