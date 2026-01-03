import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Privacy = () => {
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
              <p>
                We collect minimal information to provide our service. This includes locally stored preferences like saved palettes and theme settings, which are stored in your browser.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Image Processing</h2>
              <p>
                When you upload images for color extraction, processing happens locally in your browser. We do not upload, store, or transmit your images to any server.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Cookies</h2>
              <p>
                We use essential cookies to remember your preferences like theme settings. We do not use tracking cookies or share data with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Storage</h2>
              <p>
                All your saved palettes and preferences are stored locally in your browser using localStorage. We do not have access to this data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Third-Party Services</h2>
              <p>
                Our website may contain links to external websites. We are not responsible for the privacy practices of these third-party sites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Security</h2>
              <p>
                Since we don't collect personal data, there's minimal security risk. Your browser data is protected by your browser's security measures.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Rights</h2>
              <p>
                You can clear your saved palettes and preferences at any time by clearing your browser's local storage or using incognito mode.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to Policy</h2>
              <p>
                We may update this privacy policy from time to time. Any changes will be reflected on this page.
              </p>
            </section>
          </div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
};

export default Privacy;
