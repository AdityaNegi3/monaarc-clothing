import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('MONAARC-cookie-consent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('MONAARC-cookie-consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('MONAARC-cookie-consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3 flex-1">
          <Cookie size={24} className="text-white" />
          <div>
            <p className="text-white text-sm">
              We use cookies to enhance your browsing experience and provide personalized content. 
              By continuing to use our site, you consent to our use of cookies.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDecline}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <button
            onClick={handleAccept}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;