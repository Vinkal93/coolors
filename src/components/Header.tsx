import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Sparkles, 
  ChevronDown,
  Menu,
  Eye,
  ImageIcon,
  Contrast,
  Layers,
  Droplets,
  Grid3X3,
  Paintbrush
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import ThemeToggle from './ThemeToggle';

const tools = [
  {
    name: 'Palette Generator',
    description: 'Create unique color palettes quickly and effortlessly.',
    href: '/generator',
    icon: Palette,
    colorClass: 'text-tool-cyan',
    bgClass: 'bg-tool-cyan/10',
    hoverBg: 'hover:bg-tool-cyan/15',
  },
  {
    name: 'Explore Palettes',
    description: 'Discover millions of color palettes by topic, style and color.',
    href: '/explore',
    icon: Grid3X3,
    colorClass: 'text-tool-blue',
    bgClass: 'bg-tool-blue/10',
    hoverBg: 'hover:bg-tool-blue/15',
  },
  {
    name: 'Image Picker',
    description: 'Extract beautiful colors from any image with ease.',
    href: '/image-picker',
    icon: ImageIcon,
    colorClass: 'text-tool-pink',
    bgClass: 'bg-tool-pink/10',
    hoverBg: 'hover:bg-tool-pink/15',
  },
  {
    name: 'Contrast Checker',
    description: 'Ensure your designs meet accessibility standards.',
    href: '/contrast-checker',
    icon: Contrast,
    colorClass: 'text-tool-orange',
    bgClass: 'bg-tool-orange/10',
    hoverBg: 'hover:bg-tool-orange/15',
  },
  {
    name: 'Gradient Maker',
    description: 'Create beautiful gradients for your designs.',
    href: '/gradient-maker',
    icon: Layers,
    colorClass: 'text-tool-purple',
    bgClass: 'bg-tool-purple/10',
    hoverBg: 'hover:bg-tool-purple/15',
  },
  {
    name: 'Color Blindness Simulator',
    description: 'Preview how colors appear to colorblind users.',
    href: '/color-blindness',
    icon: Eye,
    colorClass: 'text-tool-red',
    bgClass: 'bg-tool-red/10',
    hoverBg: 'hover:bg-tool-red/15',
  },
  {
    name: 'Shade Generator',
    description: 'Generate lighter and darker shades of any color.',
    href: '/generator',
    icon: Droplets,
    colorClass: 'text-tool-green',
    bgClass: 'bg-tool-green/10',
    hoverBg: 'hover:bg-tool-green/15',
  },
  {
    name: 'Color Harmonies',
    description: 'Find complementary, triadic, and split colors.',
    href: '/generator',
    icon: Paintbrush,
    colorClass: 'text-tool-yellow',
    bgClass: 'bg-tool-yellow/10',
    hoverBg: 'hover:bg-tool-yellow/15',
  },
];

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Generator', href: '/generator' },
  { name: 'Explore', href: '/explore' },
  { name: 'About Developer', href: '/about' },
];

const Header = () => {
  const location = useLocation();
  const isGenerator = location.pathname === '/generator';
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          {/* Mobile Menu Button */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 flex flex-col h-full">
              <div className="p-4 border-b border-border shrink-0">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <Palette className="h-7 w-7 text-primary" />
                  <span className="text-xl font-extrabold text-gradient">color</span>
                </Link>
              </div>
              
              {/* Scrollable Content */}
              <ScrollArea className="flex-1">
                <nav className="p-3">
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                          location.pathname === link.href
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-secondary active:scale-[0.98]'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                  
                  {/* Mobile Tools */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Tools
                    </p>
                    <div className="space-y-1">
                      {tools.map((tool) => (
                        <Link
                          key={tool.name}
                          to={tool.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-start gap-3 px-3 py-2.5 rounded-lg ${tool.bgClass} ${tool.hoverBg} transition-all duration-200 active:scale-[0.98]`}
                        >
                          <tool.icon className={`h-5 w-5 mt-0.5 shrink-0 ${tool.colorClass}`} />
                          <div className="min-w-0">
                            <span className={`font-bold text-sm ${tool.colorClass}`}>{tool.name}</span>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{tool.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>

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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.href} to={link.href} current={location.pathname}>
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Tools & CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tools Dropdown */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1 sm:gap-2 font-semibold hidden sm:flex transition-all duration-200 hover:bg-secondary"
              onClick={() => setToolsOpen(!toolsOpen)}
            >
              Tools
              <motion.div
                animate={{ rotate: toolsOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </Button>

            <ThemeToggle />

            <Link to="/generator">
              <Button variant={isGenerator ? 'outline' : 'default'} size="sm" className="gap-2 font-semibold transition-all duration-200 hover:scale-105 active:scale-95">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Generate</span>
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Tools Dropdown Menu - Full Height Right Side Panel */}
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

            {/* Full Height Right Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-96 bg-background border-l border-border shadow-2xl flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
                <h2 className="text-lg font-bold">Tools</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setToolsOpen(false)}
                  className="hover:bg-secondary transition-colors"
                >
                  <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
                </Button>
              </div>

              {/* Scrollable Tools List */}
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-2">
                  {tools.map((tool, index) => (
                    <motion.div
                      key={tool.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={tool.href}
                        onClick={() => setToolsOpen(false)}
                        className={`group flex items-start gap-3 p-3 rounded-xl ${tool.bgClass} ${tool.hoverBg} transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
                      >
                        <div className={`p-2 rounded-lg bg-background/50 shrink-0`}>
                          <tool.icon className={`h-5 w-5 ${tool.colorClass}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className={`font-bold ${tool.colorClass} group-hover:underline`}>
                            {tool.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                            {tool.description}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Panel Footer */}
              <div className="p-4 border-t border-border shrink-0">
                <Link to="/generator" onClick={() => setToolsOpen(false)}>
                  <Button className="w-full gap-2 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                    <Sparkles className="h-4 w-4" />
                    Start Generating
                  </Button>
                </Link>
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
      className={`relative px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
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
