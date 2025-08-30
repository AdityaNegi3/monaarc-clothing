import React from 'react';
import { Instagram, Mail, Award, Users, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-wide">
            About MONAARC
          </h1>
          <div className="h-px w-32 bg-yellow-400 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Born from a vision to redefine luxury fashion, MONAARC represents the intersection 
            of timeless elegance and contemporary sophistication.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-400 leading-relaxed">
                <p>
                  MONAARC was founded on the belief that luxury fashion should be more than just clothing—
                  it should be an expression of one's identity, a statement of sophistication, and a 
                  testament to exceptional craftsmanship.
                </p>
                <p>
                  Drawing inspiration from ancient mythology and modern aesthetics, every piece in our 
                  collection tells a story. We meticulously select premium materials and employ traditional 
                  techniques combined with contemporary design principles to create garments that transcend 
                  fleeting trends.
                </p>
                <p>
                  Our commitment to excellence extends beyond the garment itself. From the initial sketch 
                  to the final stitch, every detail is carefully considered to ensure that when you wear 
                  MONAARC, you're not just wearing clothes—you're wearing a legacy.
                </p>
              </div>
            </div>
            
            <div className="relative">
             <img
                    src="/IMG_20250801_132311.jpg"
                    alt="MONAARC craftsmanship"
                    className="w-full rounded-lg shadow-2xl"
/>

           
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Values</h2>
            <div className="h-px w-32 bg-yellow-400 mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at MONAARC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gray-900/30 rounded-lg p-8 border border-white/10">
              <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Excellence</h3>
              <p className="text-gray-400">
                We pursue perfection in every detail, from fabric selection to final finishing, 
                ensuring each piece meets our exacting standards.
              </p>
            </div>

            <div className="text-center bg-gray-900/30 rounded-lg p-8 border border-white/10">
              <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Community</h3>
              <p className="text-gray-400">
                Our customers are part of an exclusive community that appreciates luxury, 
                quality, and the finer things in life.
              </p>
            </div>

            <div className="text-center bg-gray-900/30 rounded-lg p-8 border border-white/10">
              <Globe className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Innovation</h3>
              <p className="text-gray-400">
                While respecting tradition, we constantly evolve and innovate to create 
                designs that are both timeless and contemporary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Get in Touch</h2>
          <div className="h-px w-32 bg-yellow-400 mx-auto mb-8"></div>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out to us through any of the channels below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <a
              href="https://instagram.com/monaarcclothing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-4 bg-gray-900/50 rounded-lg p-6 border border-white/10 hover:border-yellow-400/30 transition-all duration-300 group"
            >
              <Instagram className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-left">
                <div className="text-white font-semibold">Instagram</div>
                <div className="text-gray-400 text-sm">@monaarcclothing</div>
              </div>
            </a>

            <a
              href="mailto:crew@monaarcclothing.com"
              className="flex items-center justify-center space-x-4 bg-gray-900/50 rounded-lg p-6 border border-white/10 hover:border-yellow-400/30 transition-all duration-300 group"
            >
              <Mail className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-left">
                <div className="text-white font-semibold">Email</div>
                <div className="text-gray-400 text-sm">crew@monaarcclothing.com</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;