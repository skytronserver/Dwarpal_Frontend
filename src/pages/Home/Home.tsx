import { useState, useEffect } from 'react';
import { Eye, Shield, Zap, Users, ArrowRight, Check, Building2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeForm, setActiveForm] = useState('demo');

  // Hero section content split
  const heroStatements = [
    "Welcome to Dwarpal AI, the future of surveillance and access control, where traditional CCTV ends and intelligent surveillance begins.",
    "Powered by advanced artificial intelligence and built for both homes and workplaces, Dwarpal doesn't just watch—it understands, verifies, and responds.",
    "At the core of Dwarpal lies a smart AI engine capable of recognizing authorized faces, identifying intrusions, logging activities, and even learning behavioral patterns over time.",
    "It transforms your surveillance infrastructure into an intelligent access control system, redefining how you secure spaces."
  ];
  const fullHeroText = heroStatements.join(' ');
  const [heroStep, setHeroStep] = useState(0);
  const [showFullHero, setShowFullHero] = useState(false);
  useEffect(() => {
    if (showFullHero) return;
    const timer = setTimeout(() => {
      setHeroStep((prev) => (prev + 1) % heroStatements.length);
    }, 3500);
    return () => clearTimeout(timer);
  }, [heroStep, showFullHero]);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "AI Face Recognition",
      description: "Advanced facial recognition with 99.9% accuracy"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Intrusion Detection",
      description: "Real-time threat identification and alerts"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart Analytics",
      description: "Behavioral pattern learning and insights"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Access Control",
      description: "Seamless entry management system"
    }
  ];

  const stats = [
    { number: "99.9%", label: "Accuracy Rate" },
    { number: "50K+", label: "Installations" },
    { number: "24/7", label: "Monitoring" },
    { number: "0.1s", label: "Response Time" }
  ];

  return (
    <div className="min-h-screen bg-[#FFF6E9] text-[#0D5C63] font-poppins">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed w-full bg-[#0B4D4D] text-white shadow-lg z-50"
        style={{ fontFamily: 'Poppins, Roboto, Segoe UI, Arial, sans-serif' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <img src="/assets/dwarpal2.png" alt="Dwarpal AI" className="h-16 w-auto" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white hover:text-[#F5B041] transition-colors font-medium">Features</a>
              <a href="#contact" className="text-white hover:text-[#F5B041] transition-colors font-medium">Contact</a>
              <button 
                onClick={() => navigate('/login')}
                className="bg-[#19B6B3] text-white px-6 py-2 rounded-lg hover:bg-[#0D5C63] transition-colors font-semibold shadow"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[url('/assets/bg.jpeg')]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-80 h-80 bg-[#19B6B3]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-[#F5B041]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-[#0D5C63]/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-32">
            {/* Animated Text Section */}
            <div className="flex-1 w-full">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-5xl md:text-6xl font-extrabold text-[#0D5C63] mb-6 leading-tight"
                style={{ fontFamily: 'Poppins, Arial, sans-serif' }}
              >
                Meet <span className="text-[#19B6B3]">Dwarpal AI</span>
              </motion.h1>
              <div className="min-h-[120px] flex items-center" style={{ fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 500 }}>
                {!showFullHero ? (
                  <motion.p
                    key={heroStep}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.6 }}
                    className="text-xl text-[#555] max-w-2xl font-medium mb-6 w-full"
                    style={{ minHeight: '72px', display: 'flex', alignItems: 'center' }}
                  >
                    {heroStatements[heroStep]}
                  </motion.p>
                ) : (
                  <motion.p
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-xl text-[#555] max-w-2xl font-medium mb-6 w-full"
                    style={{ minHeight: '72px', display: 'flex', alignItems: 'center' }}
                  >
                    {fullHeroText}
                  </motion.p>
                )}
              </div>
              {!showFullHero && (
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => setShowFullHero(true)}
                    className="px-4 py-2 rounded-lg border-2 border-[#19B6B3] text-[#19B6B3] font-semibold hover:bg-[#19B6B3] hover:text-white transition-all"
                  >
                    Read More
                  </button>
                </div>
              )}
            </div>
            {/* Hero Illustration Image */}
            <div className="flex-1 w-full flex justify-center">
              <img 
                src="/assets/56401.jpg" 
                alt="Dwarpal AI Hero Illustration" 
                className="w-full max-w-xl rounded-2xl shadow-lg object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#FFF9F3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-8 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 border border-[#F9E2C0]"
              >
                <div className="text-4xl font-extrabold text-[#19B6B3] mb-2">
                  {stat.number}
                </div>
                <div className="text-[#555] font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#FFF6E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0D5C63] mb-4">
              Advanced Features
            </h2>
            <p className="text-xl text-[#555] max-w-3xl mx-auto">
              Experience the future of surveillance with AI-powered intelligence
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#F9E2C0] flex flex-col items-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-14 h-14 rounded-xl bg-[#19B6B3]/10 flex items-center justify-center mb-6 text-[#19B6B3] text-2xl"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-[#0D5C63] text-center">
                  {feature.title}
                </h3>
                <p className="text-[#555] text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-b from-[#FFF9F3] to-[#FFF6E9]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#19B6B3] rounded-3xl p-12 shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Experience Dwarpal Today</h2>
            <p className="text-xl text-[#e6f9f7] mb-8 max-w-3xl mx-auto">
              Step into the future of surveillance. Let Dwarpal AI safeguard what matters—efficiently, intelligently, and adaptively.
            </p>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="group inline-flex items-center bg-[#F5B041] px-8 py-4 rounded-full text-lg font-semibold text-[#0D5C63] hover:bg-[#19B6B3] hover:text-white transition-all transform hover:shadow-lg"
              >
                Get Started
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </motion.span>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/919876543210?text=Hi%20Dwarpal%20Team%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center space-x-2 px-8 py-4 rounded-full border-2 border-white text-white hover:bg-white/10 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Talk to Our Team</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-[#FFF6E9]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0D5C63] mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-[#555] max-w-3xl mx-auto">
              We're here to help you get started
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
            {/* Contact Options */}
            <div className="md:col-span-4 space-y-4">
              <button 
                onClick={() => setActiveForm('demo')}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 flex items-center space-x-4 ${
                  activeForm === 'demo' 
                    ? 'border-[#19B6B3] bg-[#e6f9f7]' 
                    : 'border-[#F9E2C0] hover:border-[#19B6B3] bg-white'
                }`}
              >
                <ArrowRight className={`w-8 h-8 ${activeForm === 'demo' ? 'text-[#19B6B3]' : 'text-[#F5B041]'}`} />
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-1 text-[#0D5C63]">Request Demo</h4>
                  <p className="text-[#555]">Schedule a live demo</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveForm('dealership')}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 flex items-center space-x-4 ${
                  activeForm === 'dealership' 
                    ? 'border-[#19B6B3] bg-[#e6f9f7]' 
                    : 'border-[#F9E2C0] hover:border-[#19B6B3] bg-white'
                }`}
              >
                <Building2 className={`w-8 h-8 ${activeForm === 'dealership' ? 'text-[#19B6B3]' : 'text-[#F5B041]'}`} />
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-1 text-[#0D5C63]">Dealership</h4>
                  <p className="text-[#555]">Become a partner</p>
                </div>
              </button>

              <a 
                href="https://wa.me/919876543210?text=Hi%20Dwarpal%20Team%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-6 rounded-2xl border-2 border-[#F9E2C0] hover:border-[#19B6B3] transition-all duration-300 bg-white flex items-center space-x-4"
              >
                <MessageSquare className="w-8 h-8 text-[#F5B041]" />
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-1 text-[#0D5C63]">WhatsApp</h4>
                  <p className="text-[#555]">Chat with us</p>
                </div>
              </a>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-8">
              <div className="bg-white p-8 rounded-2xl border-2 border-[#F9E2C0]">
                {activeForm === 'demo' ? (
                  <>
                    <h3 className="text-2xl font-bold mb-6 text-[#0D5C63]">Request a Demo</h3>
                    <form className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        className="w-full px-4 py-3 rounded-lg border border-[#F9E2C0] focus:border-[#19B6B3] focus:ring-1 focus:ring-[#19B6B3] focus:outline-none" 
                      />
                      <input 
                        type="email" 
                        placeholder="Your Email" 
                        className="w-full px-4 py-3 rounded-lg border border-[#F9E2C0] focus:border-[#19B6B3] focus:ring-1 focus:ring-[#19B6B3] focus:outline-none" 
                      />
                      <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        className="w-full px-4 py-3 rounded-lg border border-[#F9E2C0] focus:border-[#19B6B3] focus:ring-1 focus:ring-[#19B6B3] focus:outline-none" 
                      />
                      <textarea 
                        placeholder="Message" 
                        rows={4} 
                        className="w-full px-4 py-3 rounded-lg border border-[#F9E2C0] focus:border-[#19B6B3] focus:ring-1 focus:ring-[#19B6B3] focus:outline-none"
                      ></textarea>
                      <button 
                        type="submit" 
                        className="w-full bg-[#19B6B3] text-white px-6 py-3 rounded-lg hover:bg-[#0D5C63] transition-colors font-semibold"
                      >
                        Schedule Demo
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold mb-6 text-[#0D5C63]">Dealership Enquiry</h3>
                    <form className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Company Name" 
                        className="w-full px-4 py-3 rounded-lg border border-[#F9E2C0] focus:border-[#19B6B3] focus:ring-1 focus:ring-[#19B6B3] focus:outline-none" 
                      />
                      <input 
                        type="text" 
                        placeholder="Contact Person" 
                        className="w-full px-4 py-3 rounded-lg border border-[#F9E2C0] focus:border-[#19B6B3] focus:ring-1 focus:ring-[#19B6B3] focus:outline-none" 
                      />
                      <input 
                        type="email" 
                        placeholder="Business Email" 
                        className="w-full px-4 py-3 rounded-lg border border-[#F9E2C0] focus:border-[#19B6B3] focus:ring-1 focus:ring-[#19B6B3] focus:outline-none" 
                      />
                      <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        className="w-full px-4 py-3 rounded-lg border border-[#F9E2C0] focus:border-[#19B6B3] focus:ring-1 focus:ring-[#19B6B3] focus:outline-none" 
                      />
                      <textarea 
                        placeholder="Tell us about your business" 
                        rows={4} 
                        className="w-full px-4 py-3 rounded-lg border border-[#F9E2C0] focus:border-[#19B6B3] focus:ring-1 focus:ring-[#19B6B3] focus:outline-none"
                      ></textarea>
                      <button 
                        type="submit" 
                        className="w-full bg-[#19B6B3] text-white px-6 py-3 rounded-lg hover:bg-[#0D5C63] transition-colors font-semibold"
                      >
                        Submit Enquiry
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#0B4D4D] text-white py-12 mt-12"
        style={{ fontFamily: 'Poppins, Roboto, Segoe UI, Arial, sans-serif' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src="/assets/dwarpal2.png" alt="Dwarpal AI" className="h-20 w-auto mb-4" />
              <p className="text-[#e6f9f7]">
                Intelligent surveillance redefined.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-[#e6f9f7] hover:text-[#F5B041]">Features</a></li>
                <li><a href="#solutions" className="text-[#e6f9f7] hover:text-[#F5B041]">Solutions</a></li>
                <li><a href="#pricing" className="text-[#e6f9f7] hover:text-[#F5B041]">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#e6f9f7] hover:text-[#F5B041]">Privacy Policy</a></li>
                <li><a href="#" className="text-[#e6f9f7] hover:text-[#F5B041]">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-[#e6f9f7]">Email: contact@dwarpal.ai</li>
                <li className="text-[#e6f9f7]">Phone: +1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#19B6B3] text-center text-[#e6f9f7]">
            <p>&copy; {new Date().getFullYear()} Dwarpal AI. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;