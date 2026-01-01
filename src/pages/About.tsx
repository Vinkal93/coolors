import { motion } from 'framer-motion';
import { 
  Mail, 
  Globe, 
  Briefcase, 
  MapPin, 
  Code, 
  Bot, 
  BarChart3, 
  Smartphone, 
  Search,
  CheckCircle,
  Rocket,
  Users,
  Heart,
  ExternalLink,
  Youtube,
  Instagram,
  Linkedin
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import profileImage from '@/assets/profile.jpg';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Globe,
    title: 'Custom Website Development',
    description: 'Business websites, landing pages & portfolio sites',
    color: 'text-tool-cyan',
    bg: 'bg-tool-cyan/10',
  },
  {
    icon: Bot,
    title: 'AI & Automation Projects',
    description: 'Chatbots, form-filling bots, data-based Q&A systems',
    color: 'text-tool-purple',
    bg: 'bg-tool-purple/10',
  },
  {
    icon: BarChart3,
    title: 'Excel-based Dashboards & Training',
    description: 'Real-world report cards, data analysis & automation',
    color: 'text-tool-green',
    bg: 'bg-tool-green/10',
  },
  {
    icon: Smartphone,
    title: 'Android Apps',
    description: 'Tools like calculators, chat-based helpers & productivity apps',
    color: 'text-tool-pink',
    bg: 'bg-tool-pink/10',
  },
  {
    icon: Search,
    title: 'SEO & Digital Presence Setup',
    description: 'Helping brands grow online with visibility',
    color: 'text-tool-orange',
    bg: 'bg-tool-orange/10',
  },
];

const projects = [
  'Student Q&A AI Chatbot powered by Gemini API',
  'Interactive Excel Dashboards for Analytics Training',
  'Custom Mobile Calculator App (Jagdeesh Dubey)',
  'Form Filler Guru – YouTube Channel for guidance',
  'Website Development Service for businesses & institutes',
];

const whyWorkWithMe = [
  'I build projects that actually solve problems',
  'I explain technology in a simple & practical way',
  'I believe in quality, transparency & long-term support',
  'I treat every project like my own brand',
];

const socialLinks = [
  { icon: Mail, href: 'mailto:vinkal93041@gmail.com', label: 'Email' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-center gap-12 mb-20"
          >
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-primary/20">
                <img
                  src={profileImage}
                  alt="Vinkal Prajapati"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/30 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/30 rounded-full blur-2xl" />
            </motion.div>

            {/* Intro Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1 text-center lg:text-left"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                About the Developer
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
                <span className="text-gradient">Vinkal Prajapati</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Web Developer, Educator & AI-Based Solution Builder
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Hello! I'm dedicated to creating digital tools that make learning and business easier. 
                I run <strong className="text-foreground">Quantum Institute</strong>, where I teach students practical 
                computer skills — from MS Excel to programming — so they can build real-world projects with confidence.
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center lg:justify-start gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* What I Do Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-20"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">What I Do</h2>
              <p className="text-muted-foreground text-lg">I specialize in building practical digital solutions</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`${service.bg} rounded-2xl p-6 hover-lift`}
                >
                  <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-4`}>
                    <service.icon className={`h-6 w-6 ${service.color}`} />
                  </div>
                  <h3 className={`text-xl font-extrabold ${service.color} mb-2`}>{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold">
                <Code className="h-5 w-5" />
                My approach: Practical + User-Focused + Result-Driven
              </div>
            </div>
          </motion.section>

          {/* Mission Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-20"
          >
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 sm:p-12 text-center">
              <Rocket className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">My Mission</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                To empower students & businesses with practical digital solutions — whether it's a student 
                learning Excel analytics, a startup needing a website, or a shop owner wanting an app to 
                connect with customers.
              </p>
            </div>
          </motion.section>

          {/* Why Work With Me */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Why People Work With Me</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {whyWorkWithMe.map((reason, index) => (
                <motion.div
                  key={reason}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-success/10 rounded-xl"
                >
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{reason}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Featured Projects */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-20"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Featured Projects</h2>
            </div>
            
            <div className="space-y-3 max-w-2xl mx-auto">
              {projects.map((project, index) => (
                <motion.div
                  key={project}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-medium">{project}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Beyond Coding */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-20"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Beyond Coding</h2>
              <p className="text-muted-foreground">When I'm not writing code, I'm:</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 p-4 bg-tool-cyan/10 rounded-xl">
                <Users className="h-6 w-6 text-tool-cyan" />
                <span className="text-sm font-medium">Teaching students</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-tool-pink/10 rounded-xl">
                <Heart className="h-6 w-6 text-tool-pink" />
                <span className="text-sm font-medium">Sharing tips on socials</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-tool-purple/10 rounded-xl">
                <Bot className="h-6 w-6 text-tool-purple" />
                <span className="text-sm font-medium">Experimenting with AI</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-tool-green/10 rounded-xl">
                <Rocket className="h-6 w-6 text-tool-green" />
                <span className="text-sm font-medium">Building new products</span>
              </div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <div className="bg-foreground rounded-3xl p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-background mb-4">
                Let's Create Something Together
              </h2>
              <p className="text-background/80 text-lg mb-6 max-w-xl mx-auto">
                If you need a website, app, AI chatbot, dashboard, or digital solution, 
                I'm always excited to collaborate and build something meaningful.
              </p>
              <p className="text-primary text-xl font-bold mb-8 italic">
                "Your idea + My development = A digital product that delivers results."
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:vinkal93041@gmail.com">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Mail className="h-5 w-5" />
                    vinkal93041@gmail.com
                  </Button>
                </a>
                <a href="https://designforge12.vercel.app/" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="bg-background gap-2">
                    <Globe className="h-5 w-5" />
                    Visit Portfolio
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>

              <p className="text-background/60 text-sm mt-6 flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" />
                Based in India — working with clients everywhere
              </p>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
