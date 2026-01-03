import { Link } from 'react-router-dom';
import { Palette } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Terms', href: '/terms' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Contact', href: '/contact' },
    { name: 'About', href: '/about' },
    { name: 'Explore', href: '/explore' },
  ];

  return (
    <footer className="py-6 px-3 border-t border-border bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4">
          {/* Links Row */}
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {footerLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.href} 
                className="hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Tagline */}
          <p className="text-xs text-muted-foreground text-center">
            Create beautiful color palettes for your designs
          </p>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Palette className="h-4 w-4 text-primary" />
            <span>© {currentYear}</span>
            <a 
              href="https://designforge12.vercel.app/" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary transition-colors"
            >
              Vinkal Prajapati
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
