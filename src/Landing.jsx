// src/Landing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  UserPlus,
  FileText,
  CheckCircle,
  Wrench,
  Droplets,
  Zap,
  Flame,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const serviceCategories = [
    { name: 'Road & Infrastructure', icon: <Wrench className="w-8 h-8 mx-auto mb-3 text-blue-500" />, color: 'bg-blue-50' },
    { name: 'Water Supply', icon: <Droplets className="w-8 h-8 mx-auto mb-3 text-cyan-500" />, color: 'bg-cyan-50' },
    { name: 'Electricity Issues', icon: <Zap className="w-8 h-8 mx-auto mb-3 text-yellow-500" />, color: 'bg-yellow-50' },
    { name: 'Gas Supply', icon: <Flame className="w-8 h-8 mx-auto mb-3 text-orange-500" />, color: 'bg-orange-50' }
  ];

  const faqs = [
    { question: "How do I report a problem?", answer: "You can report problems by registering as a citizen, then using our complaint form to describe the issue and upload photos or videos as evidence." },
    { question: "How long does it take to resolve complaints?", answer: "Resolution time varies depending on the complexity of the issue. Most complaints are acknowledged within 24 hours, and we aim to resolve them within 7-15 working days." },
    { question: "Can I track my complaint status?", answer: "Yes, after logging in to your citizen dashboard, you can view all your complaints and their current status (Pending, In Progress, or Resolved)." },
    { question: "What types of problems can I report?", answer: "You can report infrastructure issues including road problems, water supply issues, electricity outages, gas supply problems, streetlight malfunctions, and other civic issues." },
  ];

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-blue-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
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
                <p className="text-xs text-gray-700">Citizen Problem Reporting Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <button onClick={() => navigate('/login', { state: { initialTab: 'citizen' } })} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                Citizen Login
              </button>
              <button onClick={() => navigate('/login', { state: { initialTab: 'admin' } })} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                Admin Login
              </button>
              <button onClick={() => navigate('/register')} className="px-5 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 transition-colors">
                Register Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => navigate('/login', { state: { initialTab: 'citizen' } })} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Citizen Login</button>
              <button onClick={() => navigate('/login', { state: { initialTab: 'admin' } })} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Admin Login</button>
              <button onClick={() => navigate('/register')} className="block w-full mt-2 text-left px-3 py-2 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-700">Register Now</button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section with Background Image */}
        <section
          className="relative py-20 md:py-32 bg-cover bg-center"
          style={{ backgroundImage: "url('/background.jpg')" }}
        >
          {/* Dark overlay to make text readable */}
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Your Voice, Your Community, <span className="text-green-400">Our Action.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto">
              Report civic issues like broken roads, water leaks, or power outages and track their resolution. Join us in building a better community, together.
            </p>
            <div className="mt-10">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-green-600 text-white rounded-lg text-lg font-bold hover:bg-green-700 transition-transform hover:scale-105 shadow-lg"
              >
                Report a Problem Now
              </button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">A Simple 3-Step Process</h2>
              <p className="text-gray-600 mt-2">Getting started is quick and easy.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              <div className="p-6">
                <UserPlus className="w-12 h-12 mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">1. Register Account</h3>
                <p className="text-gray-600">Create a free citizen account in just a few minutes to get started.</p>
              </div>
              <div className="p-6">
                <FileText className="w-12 h-12 mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">2. Submit Complaint</h3>
                <p className="text-gray-600">Describe the issue, pinpoint the location, and upload photos as evidence.</p>
              </div>
              <div className="p-6">
                <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">3. Track Resolution</h3>
                <p className="text-gray-600">Receive real-time updates and see your complaint get resolved by officials.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Categories Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">What You Can Report</h2>
              <p className="text-gray-600 mt-2">We handle a wide range of civic issues.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {serviceCategories.map((service) => (
                <div key={service.name} className={`p-8 text-center rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${service.color}`}>
                  {service.icon}
                  <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg shadow-sm bg-white">
                  <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center p-5 text-left">
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {openFaq === index ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 text-gray-600 prose-sm">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Instagram /></a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} Sheba Shongskar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
