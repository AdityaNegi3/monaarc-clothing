import React from "react";

const Terms: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-gray-300 py-16 px-6 sm:px-12 lg:px-24 pt-32 md:pt-40">
      <div className="max-w-4xl mx-auto text-center">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-white mb-4 scroll-mt-28">
          📜 Terms & Conditions
        </h1>
        <p className="text-sm text-gray-400 mb-10">Effective Date: 13/09/2025</p>
        <p className="text-gray-300 mb-12">
          Welcome to <span className="font-semibold text-white">MONAARC</span>.
          By accessing or purchasing from our website, you agree to the
          following terms and conditions:
        </p>

        {/* Terms List */}
        <div className="space-y-8 text-left">
          <div>
            <h2 className="text-xl font-semibold text-yellow-400">1. General</h2>
            <p className="mt-2">
              These Terms govern your use of our website and services. We
              reserve the right to update or modify these Terms at any time.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400">
              2. Products & Orders
            </h2>
            <p className="mt-2">
              Product descriptions and images are provided for reference; slight
              variations may occur. Orders are subject to availability. We may
              cancel/refund orders if stock is unavailable or payment issues
              arise.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400">
              3. Pricing & Payment
            </h2>
            <p className="mt-2">
              All prices are listed in <strong>INR</strong>. We accept UPI,
              debit/credit cards, and wallets. We reserve the right to change
              prices without prior notice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400">
              4. Shipping & Delivery
            </h2>
            <p className="mt-2">
              Shipping times may vary depending on location. We are not liable
              for delays caused by courier partners or unforeseen circumstances.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400">
              5. Returns & Refunds
            </h2>
            <p className="mt-2">
              Returns are accepted within 3 days of delivery if the item is
              unused and in original condition. Refunds (if applicable) will be
              processed to the original payment method.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400">
              6. Intellectual Property
            </h2>
            <p className="mt-2">
              All designs, logos, and content on this website belongs to MONAARC. 
              Unauthorized use, reproduction, or distribution is prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400">
              7. Limitation of Liability
            </h2>
            <p className="mt-2">
              We are not responsible for indirect or consequential damages
              arising from use of our products or services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400">
              8. Governing Law
            </h2>
            <p className="mt-2">These Terms are governed by the laws of India.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
