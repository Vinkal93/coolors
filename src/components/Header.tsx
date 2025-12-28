import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Sparkles, 
  ChevronUp, 
  ChevronDown,
  Wand2,
  Search,
  Image,
  SlidersHorizontal,
  Eye,
  Pipette,
  Contrast,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const tools = [
  {
    name: 'Palette Generator',
    description: 'Create unique color palettes quickly and effortlessly.',
    href: '/generator',
    colorClass: 'text-tool-cyan',
    bgClass: 'bg-tool-cyan/10',
  },
  {
    name: 'Explore Palettes',
    description: 'Discover millions of color palettes by topic, style and color.',
    href: '/explore',
    colorClass: 'text-tool-blue',
    bgClass: 'bg-tool-blue/10',
  },
  {
    name: 'Image Picker',
    description: 'Extract beautiful colors from any image with ease.',
    href: '/generator',
    colorClass: 'text-tool-pink',
    bgClass: 'bg-tool-pink/10',
  },
  {
    name: 'Contrast Checker',
    description: 'Ensure your designs meet accessibility standards.',
    href: '/generator',
    colorClass: 'text-tool-orange',
    bgClass: 'bg-tool-orange/10',
  },
  {
    name: 'Color Picker',
    description: 'Get useful info about any color like meaning and variations.',
    href: '/generator',
    colorClass: 'text-tool-yellow',
    bgClass: 'bg-tool-yellow/10',
  },
  {
    name: 'Gradient Maker',
    description: 'Create beautiful gradients for your designs.',
    href: '/generator',
    colorClass: 'text-tool-purple',
    bgClass: 'bg-tool-purple/10',
  },
  {
    name: 'Palette Visualizer',
    description: 'Check your colors on real designs in real-time.',
    href: '/generator',
    colorClass: 'text-tool-red',
    bgClass: 'bg-tool-red/10',
  },
  {
    name: 'Shade Generator',
    description: 'Generate lighter and darker shades of any color.',
    href: '/generator',
    colorClass: 'text-tool-green',
    bgClass: 'bg-tool-green/10',
  },
];

const Header = () => {
  const location = useLocation();
  const isGenerator = location.pathname === '/generator';
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          isGenerator ? 'glass' : 'bg-background/95 backdrop-blur-sm border-b border-border'
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Palette className="h-7 w-7 text-primary" />
            </motion.div>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-gradient">color</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" current={location.pathname}>Home</NavLink>
            <NavLink to="/generator" current={location.pathname}>Generator</NavLink>
            <NavLink to="/explore" current={location.pathname}>Explore</NavLink>
          </nav>

          {/* Tools & CTA */}
          <div className="flex items-center gap-3">
            {/* Tools Dropdown */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 font-semibold"
              onClick={() => setToolsOpen(!toolsOpen)}
            >
              Tools
              {toolsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            <Link to="/generator">
              <Button variant={isGenerator ? 'outline' : 'default'} size="sm" className="gap-2 font-semibold">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Generate</span>
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Tools Dropdown Menu */}
      <AnimatePresence>
        {toolsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setToolsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-0 right-0 z-50 bg-background border-b border-border shadow-xl"
            >
              <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tools.map((tool) => (
                    <Link
                      key={tool.name}
                      to={tool.href}
                      onClick={() => setToolsOpen(false)}
                      className={`group p-4 rounded-xl ${tool.bgClass} hover:scale-[1.02] transition-all duration-200`}
                    >
                      <h3 className={`text-xl font-extrabold mb-2 ${tool.colorClass}`}>
                        {tool.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tool.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

interface NavLinkProps {
  to: string;
  current: string;
  children: React.ReactNode;
}

const NavLink = ({ to, current, children }: NavLinkProps) => {
  const isActive = current === to;
  
  return (
    <Link
      to={to}
      className={`relative px-4 py-2 text-sm font-semibold transition-colors ${
        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );
};

export default Header;
