import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();
  const isGenerator = location.pathname === '/generator';

  return (
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
          <span className="text-xl font-bold tracking-tight">
            <span className="text-gradient">color</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" current={location.pathname}>Home</NavLink>
          <NavLink to="/generator" current={location.pathname}>Generator</NavLink>
          <NavLink to="/explore" current={location.pathname}>Explore</NavLink>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link to="/generator">
            <Button variant={isGenerator ? 'outline' : 'default'} size="sm" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Generate</span>
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
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
      className={`relative px-4 py-2 text-sm font-medium transition-colors ${
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
