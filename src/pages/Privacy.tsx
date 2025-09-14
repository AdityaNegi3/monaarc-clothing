import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    // Added bigger top padding so it clears the header nicely
    <div className="bg-black min-h-screen text-gray-300 py-16 px-6 sm:px-12 lg:px-24 pt-32 md:pt-40">
      <div className="max-w-4xl mx-auto text-center">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-white mb-4 scroll-mt-28">
          🔒 Privacy Policy
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Effective Date: 13/09/2025
        </p>
        <p className="text-gray-300 mb-12">
          At <span className="font-semibold text-white">MONAARC</span>, your
          privacy is important to us. This policy explains how we collect, use,
          and protect your information.
        </p>

        {/* Sections */}
        <div className="space-y-8 text-left">
          <div>
            <h2 className="text-xl font-semibold text-yellow-400">
              1. Information We Collect
            </h2>
            <p className="mt-2">
              <strong>Personal Information:</strong> Name, email, phone number,
              shipping address, payment details. <br />
              <strong>Non-Personal Information:</strong> Device details, browser
              type, IP address, website usage data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400">
              2. How We Use Your Information
            </h2>
            <p className="mt-2">
              • To process orders and payments. <br />
              • To improve our website, products, and customer experience.{" "}
              <br />
              • To send promotional offers, updates, and newsletters (you can
              opt-out anytime).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400">
              3. Sharing of Information
            </h2>
            <p className="mt-2">
              We do not sell or rent your personal data. <br />
              We may share limited information with trusted service providers
              (e.g., shipping partners, payment gateways).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400">
              4. Data Security
            </h2>
            <p className="mt-2">
              We implement security measures to protect your personal data.
              However, no online system is 100% secure; use our services at your
              own risk.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400">5. Cookies</h2>
            <p className="mt-2">
              Our website uses cookies to improve browsing and personalize your
              experience. You may disable cookies in your browser, but some
              features may not function properly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400">
              6. Your Rights
            </h2>
            <p className="mt-2">
              You can request access, correction, or deletion of your data by
              contacting us at{" "}
              <a
                href="mailto:crew@monaarcclothing.com"
                className="text-yellow-400 underline"
              >
                crew@monaarcclothing.com
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400">
              7. Changes to This Policy
            </h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. Please review
              it periodically.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-yellow-400">
              8. Contact Us
            </h2>
            <p className="mt-2">
              📧 Email:{" "}
              <a
                href="mailto:crew@monaarcclothing.com"
                className="text-yellow-400 underline"
              >
                crew@monaarcclothing.com
              </a>{" "}
              <br />
              📍 Address: Bangalore, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
