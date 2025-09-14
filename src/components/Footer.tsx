import React from 'react';
import { Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">MONAARC</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Wear strength. Own presence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  Collections
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  About Us
                </a>
              </li>
            
              <li>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="space-y-3">
              <a
                href="https://instagram.com/monaarcclothing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
              >
                <Instagram className="w-4 h-4 mr-2" />
                @monaarcclothing
              </a>
              <a
                href="mailto:crew@monaarcclothing.com"
                className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                crew@monaarcclothing.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8">
          <p className="text-gray-400 text-sm text-center">
            © 2025 MONAARC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
