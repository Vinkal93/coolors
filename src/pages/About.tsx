import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import profileImage from '@/assets/profile.jpg';

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-center gap-12"
          >
            {/* Profile Image Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-3xl overflow-hidden bg-warning shadow-2xl">
                <img
                  src={profileImage}
                  alt="Prabhat Kumar"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/20 rounded-full blur-2xl" />
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1 text-center lg:text-left"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
                HELLO!
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">
                I'm <span className="font-bold text-foreground">Prabhat Kumar</span>, a passionate 
                web developer and designer. I created this color palette generator to help 
                designers and developers find the perfect colors for their projects.
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center text-background hover:bg-foreground/80 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div className="bg-tool-cyan/10 rounded-2xl p-6">
              <h3 className="text-2xl font-extrabold text-tool-cyan mb-2">Fast & Easy</h3>
              <p className="text-muted-foreground">
                Generate beautiful palettes instantly with just a spacebar press.
              </p>
            </div>
            <div className="bg-tool-purple/10 rounded-2xl p-6">
              <h3 className="text-2xl font-extrabold text-tool-purple mb-2">100% Free</h3>
              <p className="text-muted-foreground">
                All features are completely free to use. No subscriptions needed.
              </p>
            </div>
            <div className="bg-tool-pink/10 rounded-2xl p-6">
              <h3 className="text-2xl font-extrabold text-tool-pink mb-2">Open Source</h3>
              <p className="text-muted-foreground">
                Built with love and open for everyone to contribute and improve.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
