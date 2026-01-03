import { motion } from 'framer-motion';
import { Mail, ExternalLink, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Contact = () => {
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground mb-8">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>
          
          <div className="grid gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl bg-secondary/50 border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Email</h2>
                  <p className="text-muted-foreground mb-3">
                    For business inquiries or support questions.
                  </p>
                  <a href="mailto:hello@colorpalette.com">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Send Email
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-secondary/50 border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <ExternalLink className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Portfolio</h2>
                  <p className="text-muted-foreground mb-3">
                    Check out more of my work and projects.
                  </p>
                  <a href="https://designforge12.vercel.app/" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Visit Portfolio
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl bg-secondary/50 border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-tool-cyan/10">
                  <MessageCircle className="h-6 w-6 text-tool-cyan" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Feedback</h2>
                  <p className="text-muted-foreground">
                    Your feedback helps us improve! Let us know what features you'd like to see or any issues you've encountered.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
};

export default Contact;
