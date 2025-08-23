// This is your Landing.js component that should replace your current Landing.js file
import React, { useState } from 'react';
import { Search, Phone, Facebook, Youtube, Instagram, Linkedin, Twitter, User, Shield, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import backgroundImage from './assets/background.jpg';
import LoginPage from './LoginPage';

const Landing = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [loginTab, setLoginTab] = useState('citizen');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const serviceCategories = [
    { name: 'Road Issues', color: 'bg-white hover:bg-gray-50' },
    { name: 'Water Supply', color: 'bg-white hover:bg-gray-50' },
    { name: 'Electricity', color: 'bg-green-600 hover:bg-green-700 text-white' },
    { name: 'Gas Supply', color: 'bg-white hover:bg-gray-50' }
  ];

  const faqs = [
    {
      question: "How do I report a problem?",
      answer: "You can report problems by registering as a citizen, then using our complaint form to describe the issue and upload photos or videos as evidence."
    },
    {
      question: "How long does it take to resolve complaints?",
      answer: "Resolution time varies depending on the complexity of the issue. Most complaints are acknowledged within 24 hours, and we aim to resolve them within 7-15 working days."
    },
    {
      question: "Can I track my complaint status?",
      answer: "Yes, after logging in to your citizen dashboard, you can view all your complaints and their current status (Pending, In Progress, or Resolved)."
    },
    {
      question: "What types of problems can I report?",
      answer: "You can report infrastructure issues including road problems, water supply issues, electricity outages, gas supply problems, streetlight malfunctions, and other civic issues."
    },
    {
      question: "Do I need to create an account?",
      answer: "Yes, you need to register as a citizen to submit complaints and track their progress. Registration is free and only takes a few minutes."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleCitizenLogin = () => {
    setLoginTab('citizen');
    setCurrentPage('login');
  };

  const handleAdminLogin = () => {
    setLoginTab('admin');
    setCurrentPage('login');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  // Show login page if currentPage is 'login'
  if (currentPage === 'login') {
    return (
      <LoginPage 
        initialTab={loginTab} 
        onBack={handleBackToLanding} 
      />
    );
  }

  // Show landing page
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
              <button className="px-2 py-1 text-sm text-green-600 hover:bg-green-50">
                ENG
              </button>

              <button className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                <Phone className="w-4 h-4" />
                <span>Help Desk</span>
              </button>

              <button 
                onClick={handleCitizenLogin}
                className="px-4 py-2 border border-blue-300 rounded text-sm hover:bg-blue-50 text-blue-600"
              >
                Citizen Login
              </button>
              
              <button 
                onClick={handleAdminLogin}
                className="px-4 py-2 border border-blue-300 rounded text-sm hover:bg-blue-50 text-blue-600"
              >
                Admin Login
              </button>

              <button className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                Register
              </button>

              <button className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
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

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={handleCitizenLogin}
                  className="text-left px-4 py-2 hover:bg-gray-50"
                >
                  Citizen Login
                </button>
                <button 
                  onClick={handleAdminLogin}
                  className="text-left px-4 py-2 hover:bg-gray-50"
                >
                  Admin Login
                </button>
                <button className="text-left px-4 py-2 bg-green-600 text-white rounded mx-4 hover:bg-green-700">
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative overflow-hidden ">
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt="Bangladesh landscape"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
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
          </div>
        </div>

        {/* FAQ Section */}
        <div className="relative z-10 bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-4" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Help Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Need Help?</h3>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold">Call Us</p>
                <p className="text-gray-600">For all help and information</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="text-xl font-bold mb-2">333</div>
              <p className="text-gray-600 mb-4">Call government institutions for information services and assistance.</p>
              <p className="text-sm text-gray-500">Working days from 9 AM to 6 PM. Emergency services available on holidays.</p>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-32 h-32 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="w-16 h-16 text-purple-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Social Media */}
          <div className="text-center mb-8">
            <h4 className="text-lg font-semibold mb-4">Social Connectivity</h4>
            <div className="flex justify-center space-x-4">
              <Facebook className="w-8 h-8 text-blue-600 hover:text-blue-800 cursor-pointer" />
              <Youtube className="w-8 h-8 text-red-600 hover:text-red-800 cursor-pointer" />
              <Instagram className="w-8 h-8 text-pink-600 hover:text-pink-800 cursor-pointer" />
              <Linkedin className="w-8 h-8 text-blue-700 hover:text-blue-900 cursor-pointer" />
              <Twitter className="w-8 h-8 text-blue-400 hover:text-blue-600 cursor-pointer" />
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-sm">
                <p>Copyright © 2025 All Rights Reserved</p>
                <p>Sheba Shongskar Platform</p>
              </div>
            </div>

            <div className="text-sm">
              <p></p>
              <div className="flex space-x-4 mt-2">
                <div className="w-8 h-6 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;