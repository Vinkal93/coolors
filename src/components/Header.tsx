import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Sparkles, 
  ChevronUp, 
  ChevronDown,
  Menu,
  X,
  User,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from './ThemeToggle';

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
    href: '/image-picker',
    colorClass: 'text-tool-pink',
    bgClass: 'bg-tool-pink/10',
  },
  {
    name: 'Contrast Checker',
    description: 'Ensure your designs meet accessibility standards.',
    href: '/contrast-checker',
    colorClass: 'text-tool-orange',
    bgClass: 'bg-tool-orange/10',
  },
  {
    name: 'Gradient Maker',
    description: 'Create beautiful gradients for your designs.',
    href: '/gradient-maker',
    colorClass: 'text-tool-purple',
    bgClass: 'bg-tool-purple/10',
  },
  {
    name: 'Shade Generator',
    description: 'Generate lighter and darker shades of any color.',
    href: '/generator',
    colorClass: 'text-tool-green',
    bgClass: 'bg-tool-green/10',
  },
  {
    name: 'Color Blindness Simulator',
    description: 'Preview how colors appear to colorblind users.',
    href: '/color-blindness',
    colorClass: 'text-tool-red',
    bgClass: 'bg-tool-red/10',
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
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-6 border-b border-border">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <Palette className="h-7 w-7 text-primary" />
                  <span className="text-xl font-extrabold text-gradient">color</span>
                </Link>
              </div>
              
              {/* Mobile Nav Links */}
              <nav className="p-4">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${
                        location.pathname === link.href
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                
                {/* Mobile Tools */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Tools
                  </p>
                  <div className="space-y-1">
                    {tools.map((tool) => (
                      <Link
                        key={tool.name}
                        to={tool.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-4 py-3 rounded-lg ${tool.bgClass} transition-colors`}
                      >
                        <span className={`font-bold ${tool.colorClass}`}>{tool.name}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
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
              className="gap-1 sm:gap-2 font-semibold hidden sm:flex"
              onClick={() => setToolsOpen(!toolsOpen)}
            >
              Tools
              {toolsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            <ThemeToggle />

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
              <div className="container mx-auto py-6 sm:py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {tools.map((tool) => (
                    <Link
                      key={tool.name}
                      to={tool.href}
                      onClick={() => setToolsOpen(false)}
                      className="group p-3 sm:p-4 rounded-xl hover:bg-secondary/50 transition-all duration-200"
                    >
                      <h3 className={`text-base sm:text-lg font-extrabold mb-0.5 ${tool.colorClass}`}>
                        {tool.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
