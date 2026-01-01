import { Link } from 'react-router-dom';
import { Palette, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 border-t border-border bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col gap-8">
          {/* Top Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-3">
                <Palette className="h-6 w-6 text-primary" />
                <span className="text-lg font-extrabold">
                  <span className="text-gradient">color</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                The super fast color palettes generator. Create, explore, and export beautiful color schemes.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-3">Quick Links</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
                <Link to="/generator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Generator
                </Link>
                <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Explore
                </Link>
              </nav>
            </div>

            {/* Tools */}
            <div>
              <h4 className="font-bold mb-3">Tools</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/contrast-checker" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contrast Checker
                </Link>
                <Link to="/image-picker" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Image Picker
                </Link>
                <Link to="/gradient-maker" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Gradient Maker
                </Link>
              </nav>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-bold mb-3">Connect</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Developer
                </Link>
                <a 
                  href="https://designforge12.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Portfolio
                </a>
              </nav>
            </div>
          </div>

          {/* Bottom Section - Copyright */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear}</span>
            <a 
              href="https://designforge12.vercel.app/" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-foreground hover:text-primary transition-colors"
            >
              Vinkal Prajapati
            </a>
            <span className="flex items-center gap-1">
              • Made with <Heart className="h-3 w-3 text-destructive fill-destructive" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
