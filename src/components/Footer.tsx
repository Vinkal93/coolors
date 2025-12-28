import { Link } from 'react-router-dom';
import { Palette, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 border-t border-border bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="flex items-center gap-2">
              <Palette className="h-6 w-6 text-primary" />
              <span className="text-lg font-extrabold">
                <span className="text-gradient">color</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              The super fast color palettes generator
            </p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/generator" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Generator
            </Link>
            <Link to="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Explore
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </nav>

          {/* Copyright */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>© {currentYear}</span>
            <Link 
              to="/about" 
              className="font-semibold text-foreground hover:text-primary transition-colors"
            >
              Prabhat Kumar
            </Link>
            <span className="hidden sm:flex items-center gap-1">
              • Made with <Heart className="h-3 w-3 text-destructive fill-destructive" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
