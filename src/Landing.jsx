import React, { useState } from 'react';
import { Search, Phone, Facebook, Youtube, Instagram, Linkedin, Twitter, User, Shield, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const navigate = useNavigate();

  const serviceCategories = [
    { name: 'Road Issues', color: 'bg-white hover:bg-gray-50' },
    { name: 'Water Supply', color: 'bg-white hover:bg-gray-50' },
    { name: 'Electricity', color: 'bg-green-600 hover:bg-green-700 text-white' },
    { name: 'Gas Supply', color: 'bg-white hover:bg-gray-50' }
  ];

  const faqs = [
    { question: "How do I report a problem?", answer: "You can report problems by registering as a citizen, then using our complaint form to describe the issue and upload photos or videos as evidence." },
    { question: "How long does it take to resolve complaints?", answer: "Resolution time varies depending on the complexity of the issue. Most complaints are acknowledged within 24 hours, and we aim to resolve them within 7-15 working days." },
    { question: "Can I track my complaint status?", answer: "Yes, after logging in to your citizen dashboard, you can view all your complaints and their current status (Pending, In Progress, or Resolved)." },
    { question: "What types of problems can I report?", answer: "You can report infrastructure issues including road problems, water supply issues, electricity outages, gas supply problems, streetlight malfunctions, and other civic issues." },
    { question: "Do I need to create an account?", answer: "Yes, you need to register as a citizen to submit complaints and track their progress. Registration is free and only takes a few minutes." }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  <span className="text-red-600">Sheba</span>
                  <span className="text-green-600">Shongskar</span>
                </h1>
                <p className="text-xs text-gray-600">Citizen Problem Reporting Platform</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 border border-blue-300 rounded text-sm hover:bg-blue-50 text-blue-600"
              >
                Citizen Login
              </button>

              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 border border-blue-300 rounded text-sm hover:bg-blue-50 text-blue-600"
              >
                Admin Login
              </button>

              <button 
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Register
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative overflow-hidden bg-gradient-to-r from-green-100 to-blue-100 min-h-screen">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
              Speak Up for a Better Tomorrow
            </h2>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="flex">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for services"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <button className="px-6 py-3 bg-green-600 text-white rounded-r-lg hover:bg-green-700 font-medium">
                  Search
                </button>
              </div>
            </div>

            <p className="text-green-600 font-medium mb-12">
              <span className="border-b border-green-600">View your latest complaints</span>
            </p>

            {/* Service Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {serviceCategories.map((service, index) => (
                <button
                  key={index}
                  className={`px-6 py-3 rounded-full border border-gray-300 transition-all duration-200 ${service.color}`}
                >
                  {service.name}
                </button>
              ))}
            </div>

            {/* FAQ Section */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg shadow-sm bg-white"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex justify-between items-center p-4 text-left"
                    >
                      <span className="font-medium text-gray-800">{faq.question}</span>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
