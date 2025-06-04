import { useState, useEffect } from 'react';
import { Eye, Shield, Zap, Users, ArrowRight, Check, Building2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeForm, setActiveForm] = useState('demo');

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navigation */}
      <nav className="fixed w-full bg-[#0B4D4D] text-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <img src="/assets/dwarpal2.png" alt="Dwarpal AI" className="h-24 w-auto" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white hover:text-teal-300 transition-colors">Features</a>
              <a href="#solutions" className="text-white hover:text-teal-300 transition-colors">Solutions</a>
              <a href="#pricing" className="text-white hover:text-teal-300 transition-colors">Pricing</a>
              <a href="#contact" className="text-white hover:text-teal-300 transition-colors">Contact</a>
              <button 
                onClick={() => navigate('/login')}
                className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#0B4D4D] mb-6">
              Meet Dwarpal AI
            </h1>
            <p className="text-xl text-gray-600 w-full mx-auto mb-8">
            Welcome to Dwarpal AI, the future of surveillance and access control, where traditional CCTV ends and intelligent surveillance begins. Powered by advanced artificial intelligence and built for both homes and workplaces, Dwarpal doesn't just watch—it understands, verifies, and responds.
            Whether it's managing employee attendance at an enterprise, securing an apartment entryway, or validating visitor access in a high-security zone, Dwarpal AI transforms every entry point into a smart checkpoint. It's time to upgrade from passive cameras to active intelligence.
            At the core of Dwarpal lies a smart AI engine capable of recognizing authorized faces, identifying intrusions, logging activities, and even learning behavioral patterns over time. It transforms your surveillance infrastructure into an intelligent access control system, redefining how you secure spaces.
            </p>
            
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-teal-50 rounded-lg">
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of surveillance with AI-powered intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-6 text-teal-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-b from-white to-teal-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#0B4D4D] rounded-3xl p-12 shadow-xl">
            <h2 className="text-3xl font-bold mb-4 text-white">Experience Dwarpal Today</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Step into the future of surveillance. Let Dwarpal AI safeguard what matters—efficiently, intelligently, and adaptively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate('/login')}
                className="group inline-flex items-center bg-teal-500 px-8 py-4 rounded-full text-lg font-semibold text-white hover:bg-teal-600 transition-all transform hover:scale-105 hover:shadow-lg"
              >
                Get Started
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#contact" 
                className="group inline-flex items-center space-x-2 px-8 py-4 rounded-full border-2 border-white text-white hover:bg-white/10 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Talk to Our Team</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help you get started
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
            {/* Contact Options */}
            <div className="md:col-span-4 space-y-4">
              <button 
                onClick={() => setActiveForm('demo')}
                className={`w-full p-6 rounded-lg border transition-all duration-300 flex items-center space-x-4 ${
                  activeForm === 'demo' 
                    ? 'border-teal-600 bg-teal-50' 
                    : 'border-gray-200 hover:border-teal-600 bg-white'
                }`}
              >
                <ArrowRight className={`w-8 h-8 ${activeForm === 'demo' ? 'text-teal-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-1 text-gray-900">Request Demo</h4>
                  <p className="text-gray-600">Schedule a live demo</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveForm('dealership')}
                className={`w-full p-6 rounded-lg border transition-all duration-300 flex items-center space-x-4 ${
                  activeForm === 'dealership' 
                    ? 'border-teal-600 bg-teal-50' 
                    : 'border-gray-200 hover:border-teal-600 bg-white'
                }`}
              >
                <Building2 className={`w-8 h-8 ${activeForm === 'dealership' ? 'text-teal-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-1 text-gray-900">Dealership</h4>
                  <p className="text-gray-600">Become a partner</p>
                </div>
              </button>

              <a 
                href="https://wa.me/919876543210?text=Hi%20Dwarpal%20Team%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-6 rounded-lg border border-gray-200 hover:border-teal-600 transition-all duration-300 bg-white flex items-center space-x-4"
              >
                <MessageSquare className="w-8 h-8 text-gray-400" />
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-1 text-gray-900">WhatsApp</h4>
                  <p className="text-gray-600">Chat with us</p>
                </div>
              </a>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-8">
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                {activeForm === 'demo' ? (
                  <>
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Request a Demo</h3>
                    <form className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none" 
                      />
                      <input 
                        type="email" 
                        placeholder="Your Email" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none" 
                      />
                      <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none" 
                      />
                      <textarea 
                        placeholder="Message" 
                        rows={4} 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none"
                      ></textarea>
                      <button 
                        type="submit" 
                        className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Schedule Demo
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Dealership Enquiry</h3>
                    <form className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Company Name" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none" 
                      />
                      <input 
                        type="text" 
                        placeholder="Contact Person" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none" 
                      />
                      <input 
                        type="email" 
                        placeholder="Business Email" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none" 
                      />
                      <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none" 
                      />
                      <textarea 
                        placeholder="Tell us about your business" 
                        rows={4} 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none"
                      ></textarea>
                      <button 
                        type="submit" 
                        className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Submit Enquiry
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B4D4D] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src="/assets/dwarpal2.png" alt="Dwarpal AI" className="h-24 w-auto mb-4" />
              <p className="text-gray-300">
                Intelligent surveillance redefined.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-300 hover:text-teal-300">Features</a></li>
                <li><a href="#solutions" className="text-gray-300 hover:text-teal-300">Solutions</a></li>
                <li><a href="#pricing" className="text-gray-300 hover:text-teal-300">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-teal-300">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-teal-300">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">Email: contact@dwarpal.ai</li>
                <li className="text-gray-300">Phone: +1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} Dwarpal AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;