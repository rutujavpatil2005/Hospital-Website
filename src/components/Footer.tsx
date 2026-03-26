import React from 'react';
import { Link } from 'react-router-dom';
import { Hospital, Phone, Mail, MapPin, Facebook, Twitter, Instagram, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B3C5D] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Hospital Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Hospital className="h-8 w-8 text-[#328CC1]" />
              <span className="font-bold text-xl tracking-tight">SILVER JUBILEE</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Serving the community of Baramati with excellence in healthcare since 1997. 
              A premier government institution dedicated to accessible and quality medical services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#328CC1] transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-[#328CC1] transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-[#328CC1] transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b-2 border-[#328CC1] inline-block">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-[#328CC1] transition-colors flex items-center space-x-2"><ExternalLink className="h-3 w-3" /> <span>About Us</span></Link></li>
              <li><Link to="/services" className="hover:text-[#328CC1] transition-colors flex items-center space-x-2"><ExternalLink className="h-3 w-3" /> <span>Our Services</span></Link></li>
              <li><Link to="/doctors" className="hover:text-[#328CC1] transition-colors flex items-center space-x-2"><ExternalLink className="h-3 w-3" /> <span>Find a Doctor</span></Link></li>
              <li><Link to="/appointment" className="hover:text-[#328CC1] transition-colors flex items-center space-x-2"><ExternalLink className="h-3 w-3" /> <span>Book Appointment</span></Link></li>
              <li><Link to="/contact" className="hover:text-[#328CC1] transition-colors flex items-center space-x-2"><ExternalLink className="h-3 w-3" /> <span>Contact Us</span></Link></li>
              <li className="pt-4 border-t border-white/10"><Link to="/login" className="text-gray-400 hover:text-[#328CC1] transition-colors flex items-center space-x-2 text-xs uppercase tracking-widest font-bold"><span>Staff Login</span></Link></li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b-2 border-[#328CC1] inline-block">Departments</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li>General OPD</li>
              <li>Emergency & Trauma</li>
              <li>ICU & Critical Care</li>
              <li>Maternity & Gynaecology</li>
              <li>Paediatrics</li>
              <li>Pharmacy</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b-2 border-[#328CC1] inline-block">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#328CC1] flex-shrink-0" />
                <span className="text-gray-300">Silver Jubilee Hospital, Bhigwan Road, Baramati, Maharashtra 413102</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#328CC1] flex-shrink-0" />
                <span className="text-gray-300">+91 2112 222222</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#328CC1] flex-shrink-0" />
                <span className="text-gray-300">info@silverjubileehospital.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Silver Jubilee Hospital, Baramati. All rights reserved.</p>
          <p className="mt-2">Government of Maharashtra | Public Health Department</p>
        </div>
      </div>
    </footer>
  );
}
