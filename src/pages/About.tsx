import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-16 tracking-wide">
          ABOUT MONAARC
        </h1>
        
        <div className="prose prose-invert max-w-none">
          <div className="text-center mb-12">
            <p className="text-2xl text-white mb-8 font-light">
              Where Power Meets Elegance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 text-gray-300">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Our Philosophy</h2>
              <p className="mb-6">
                MONAARC represents the pinnacle of luxury streetwear, crafted for those who understand 
                that true power lies not in loud declarations, but in quiet confidence and undeniable presence.
              </p>
              <p className="mb-6">
                Every piece in our collection is meticulously designed to embody the essence of modern royalty—
                those who lead by example and command respect through their actions and style.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Our Vision</h2>
              <p className="mb-6">
                We believe that clothing is more than fabric; it's an expression of identity, a statement of intent, 
                and a testament to one's inner strength. Our dark aesthetic represents depth, mystery, and the 
                sophisticated power that comes from self-assurance.
              </p>
              <p className="mb-6">
                MONAARC is for the modern rulers of their own destiny—the entrepreneurs, artists, leaders, 
                and visionaries who shape the world around them.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">Crafted for Excellence</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Premium Materials</h3>
                <p className="text-gray-300">
                  Only the finest fabrics and materials make it into our collections, ensuring lasting quality and comfort.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Exclusive Designs</h3>
                <p className="text-gray-300">
                  Each piece is carefully designed to be unique, avoiding mass-market trends for timeless elegance.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Uncompromising Quality</h3>
                <p className="text-gray-300">
                  Every garment undergoes rigorous quality control to meet our exacting standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;