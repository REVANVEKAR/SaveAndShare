import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, HelpingHand, Building2, User } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
          <Heart size={60} className="mb-6 text-white" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Aid Platform</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl">
            Connecting NGOs, volunteers, and donors to make a positive impact in communities
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/ngo/register"
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium shadow-md transition-all"
            >
              Register as NGO
            </Link>
            <Link
              to="/user/register"
              className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-md font-medium shadow-md border border-blue-400 transition-all"
            >
              Join as Volunteer
            </Link>
          </div>
        </div>
      </header>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building2 size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">NGOs</h3>
              <p className="text-gray-600">
                Register, get verified, and post donation drives. Claim resources and coordinate with volunteers through a simple dashboard.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <User size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Volunteers</h3>
              <p className="text-gray-600">
                Browse upcoming drives and events, register to participate, and track your impact through the user dashboard.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <HelpingHand size={32} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Donors</h3>
              <p className="text-gray-600">
                Donate resources by messaging our WhatsApp/Telegram number. Your donation will be instantly visible to registered NGOs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp/Telegram Integration */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-4">Send a Message, Make a Difference</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our platform makes donating as simple as sending a message. Just share your donation details and location with our WhatsApp or Telegram bot.
                </p>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <p className="font-medium text-gray-800">Sample Message Format:</p>
                  <div className="mt-2 bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                    <p><strong>Donation:</strong> 20 food packets</p>
                    <p><strong>Location:</strong> 123 Main St, City</p>
                    <p><strong>Contact:</strong> John Doe, 555-1234</p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-center">Contact Our Donation Bot</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-green-800">will be updated soon</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M21.5 8.67v8.58a3 3 0 0 1-4.5 2.6l-6.5-3.75v-6.29l6.5-3.75a3 3 0 0 1 4.5 2.61Z"></path>
                        <path d="M10.5 7.13v9.74a2.5 2.5 0 0 1-5 0V7.13a2.5 2.5 0 0 1 5 0Z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Telegram</p>
                      <p className="text-sm text-blue-800">@SaveShareReva_bot</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Already a member?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/ngo/login"
              className="bg-blue-600 text-white hover:bg-blue-500 px-5 py-2 rounded-md font-medium transition-all flex items-center"
            >
              <Building2 size={18} className="mr-2" />
              NGO Login
            </Link>
            <Link
              to="/user/login"
              className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-md font-medium shadow-sm border border-blue-200 transition-all flex items-center"
            >
              <User size={18} className="mr-2" />
              User Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold flex items-center">
                <Heart size={24} className="mr-2" />
                CommAid
              </h2>
              <p className="text-gray-400 mt-1">Connecting communities for a better world</p>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                About
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Community Aid Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;