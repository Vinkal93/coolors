import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 pt-24 pb-12 px-4"
      >
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Color Palette Generator, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Use of Service</h2>
              <p>
                You may use our color palette generator for personal and commercial projects. The palettes you create are yours to use freely without any restrictions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Intellectual Property</h2>
              <p>
                The website design, code, and content are the property of Color Palette Generator. You may not copy, reproduce, or distribute any part of our website without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. User Content</h2>
              <p>
                When you upload images for color extraction, we do not store your images permanently. Images are processed temporarily and deleted after use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Disclaimer</h2>
              <p>
                Our service is provided "as is" without any warranties. We are not responsible for any issues that may arise from using our color palettes in your projects.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of our service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us through our website.
              </p>
            </section>
          </div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
};

export default Terms;
