import React from 'react';
import { CheckCircle } from 'lucide-react';

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
      <p className="text-lg mb-4">
        Your payment was successful. Order details will be sent to your WhatsApp
        and Email within 15 minutes.
      </p>
      <p className="text-sm text-gray-400">
        If you do not receive a confirmation, contact us on Instagram{' '}
        <a
          href="https://instagram.com/officialmonaarcclothing"
          target="_blank"
          className="underline text-yellow-400"
        >
          @monaarcclothing
        </a>
        <br />
        or email us at{' '}
        <a
          href="mailto:crew@monaarcclothing.com"
          className="underline text-yellow-400"
        >
          crew@monaarcclothing.com
        </a>
      </p>
    </div>
  );
};

export default ThankYou;
