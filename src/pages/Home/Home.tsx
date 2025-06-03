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
    <div className="min-h-screen bg-[#0B4D4D] text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className={`relative z-50 px-6 py-4 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src="/assets/dwarpal2.png" alt="Dwarpal AI" className="h-auto w-[16rem]" />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-teal-300 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-teal-300 transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-teal-300 transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-teal-300 transition-colors">Contact</a>
            <button className="bg-teal-600 px-6 py-2 rounded-full hover:shadow-lg hover:shadow-teal-500/25 transition-all" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className={`text-justify transition-all duration-1500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Meet Dwarpal AI
            </h1>
            Welcome to Dwarpal AI, the future of surveillance and access control, where traditional CCTV ends and intelligent surveillance begins. Powered by advanced artificial intelligence and built for both homes and workplaces, Dwarpal doesn't just watch—it understands, verifies, and responds.
            Whether it's managing employee attendance at an enterprise, securing an apartment entryway, or validating visitor access in a high-security zone, Dwarpal AI transforms every entry point into a smart checkpoint. It's time to upgrade from passive cameras to active intelligence.
            At the core of Dwarpal lies a smart AI engine capable of recognizing authorized faces, identifying intrusions, logging activities, and even learning behavioral patterns over time. It transforms your surveillance infrastructure into an intelligent access control system, redefining how you secure spaces.
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 transition-all duration-1500 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-teal-300 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-teal-300">
                Advanced Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of surveillance with AI-powered intelligence that doesn't just watch—it understands, verifies, and responds.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl backdrop-blur-sm border border-teal-900 hover:border-teal-500/50 transition-all duration-500 transform hover:scale-105 ${activeFeature === index ? 'bg-teal-900/30 border-teal-500/50' : 'bg-teal-900/10'
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 ${activeFeature === index ? 'bg-teal-600' : 'bg-teal-800'
                  }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-teal-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-700">
            <h2 className="text-3xl font-bold mb-4">Experience Dwarpal Today</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Step into the future of surveillance. Let Dwarpal AI safeguard what matters—efficiently, intelligently, and adaptively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#contact" className="group inline-flex bg-teal-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-teal-500/25 transition-all transform hover:scale-105">
                Book a Demo
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#contact" className="group inline-flex items-center space-x-2 px-8 py-4 rounded-full border border-gray-600 hover:border-teal-400 transition-all">
                <MessageSquare className="w-5 h-5" />
                <span>Talk to Our Team</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Forms Section */}
      <section id="contact" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-teal-300">Get in Touch</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're here to help you get started
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
            {/* Contact Options */}
            <div className="md:col-span-4 space-y-4">
              <button 
                onClick={() => setActiveForm('demo')}
                className={`w-full p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 flex items-center space-x-4 ${activeForm === 'demo' ? 'border-teal-500 bg-teal-900/30' : 'border-teal-900 hover:border-teal-500/50 bg-teal-900/10'}`}
              >
                <ArrowRight className={`w-8 h-8 ${activeForm === 'demo' ? 'text-teal-400' : 'text-gray-400'}`} />
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-1">Request Demo</h4>
                  <p className="text-gray-400">Schedule a live demo</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveForm('dealership')}
                className={`w-full p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 flex items-center space-x-4 ${activeForm === 'dealership' ? 'border-teal-500 bg-teal-900/30' : 'border-teal-900 hover:border-teal-500/50 bg-teal-900/10'}`}
              >
                <Building2 className={`w-8 h-8 ${activeForm === 'dealership' ? 'text-teal-400' : 'text-gray-400'}`} />
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-1">Dealership</h4>
                  <p className="text-gray-400">Become a partner</p>
                </div>
              </button>

              <a 
                href="#" 
                className="w-full p-6 rounded-2xl backdrop-blur-sm border border-teal-900 hover:border-teal-500/50 transition-all duration-300 bg-teal-900/10 flex items-center space-x-4"
              >
                <MessageSquare className="w-8 h-8 text-gray-400" />
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-1">WhatsApp</h4>
                  <p className="text-gray-400">Chat with us</p>
                </div>
              </a>
            </div>

            {/* Dynamic Form */}
            <div className="md:col-span-8 p-8 rounded-2xl backdrop-blur-sm border border-teal-500 transition-all duration-500 bg-teal-900/20">
              {activeForm === 'demo' ? (
                <>
                  <h3 className="text-2xl font-bold mb-6">Request a Demo</h3>
                  <form className="space-y-4">
                    <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-lg bg-teal-900/50 border border-teal-800 focus:border-teal-400 focus:outline-none" />
                    <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-lg bg-teal-900/50 border border-teal-800 focus:border-teal-400 focus:outline-none" />
                    <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg bg-teal-900/50 border border-teal-800 focus:border-teal-400 focus:outline-none" />
                    <textarea placeholder="Message" rows={4} className="w-full px-4 py-3 rounded-lg bg-teal-900/50 border border-teal-800 focus:border-teal-400 focus:outline-none"></textarea>
                    <button type="submit" className="w-full bg-teal-600 px-6 py-3 rounded-full hover:shadow-lg hover:shadow-teal-500/25 transition-all">
                      Schedule Demo
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-6">Dealership Enquiry</h3>
                  <form className="space-y-4">
                    <input type="text" placeholder="Company Name" className="w-full px-4 py-3 rounded-lg bg-teal-900/50 border border-teal-800 focus:border-teal-400 focus:outline-none" />
                    <input type="text" placeholder="Contact Person" className="w-full px-4 py-3 rounded-lg bg-teal-900/50 border border-teal-800 focus:border-teal-400 focus:outline-none" />
                    <input type="email" placeholder="Business Email" className="w-full px-4 py-3 rounded-lg bg-teal-900/50 border border-teal-800 focus:border-teal-400 focus:outline-none" />
                    <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg bg-teal-900/50 border border-teal-800 focus:border-teal-400 focus:outline-none" />
                    <textarea placeholder="Tell us about your business" rows={4} className="w-full px-4 py-3 rounded-lg bg-teal-900/50 border border-teal-800 focus:border-teal-400 focus:outline-none"></textarea>
                    <button type="submit" className="w-full bg-teal-600 px-6 py-3 rounded-full hover:shadow-lg hover:shadow-teal-500/25 transition-all">
                      Submit Enquiry
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-auto flex justify-center md:justify-start">
              <img src="/assets/dwarpal2.png" alt="Dwarpal AI" className="h-auto w-[13rem]" />
            </div>
            <div className="flex flex-col items-center md:items-end gap-4 text-gray-400">
              <p className="text-gray-400 text-center md:text-right">
                Intelligent surveillance redefined.
              </p>
              <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
                <a href="#" className="hover:text-teal-300 transition-colors text-sm whitespace-nowrap">Privacy Policy</a>
                <a href="#" className="hover:text-teal-300 transition-colors text-sm whitespace-nowrap">Terms of Service</a>
                <a href="#" className="hover:text-teal-300 transition-colors text-sm whitespace-nowrap">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;