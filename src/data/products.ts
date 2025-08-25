import { Product } from '../types';

export const products: Product[] = [
  // Anime Edition
  {
    id: 'anime-1',
    name: 'toji ',
    price: 1,
    images: {
      front: '/toji front.png',
      back: '/toji back.png'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    edition: 'anime',
    description: 'Premium black tee with exclusive anime-inspired design'
  },
  {
    id: 'anime-2',
    name: 'itachi',
    price: 1,
    images: {
      front: 'itachi front.png',
      back: '/itachi back.png'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    edition: 'anime',
    description: 'Luxury anime collection piece with intricate detailing'
  },
  {
    id: 'anime-3',
    name: 'sukuna',
    price: 4999,
    images: {
      front: '/sukuna front.png',
      back: '/sukuna back.png'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    edition: 'anime',
    description: 'Premium hoodie featuring bold anime-inspired graphics'
  },
  {
    id: 'anime-4',
    name: 'AOT',
    price: 2499,
    images: {
      front: '/aot front.png',
      back: '/aot back.png'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    edition: 'anime',
    description: 'Sleek tank top with minimalist anime aesthetics'
  },
  {
    id: 'anime-5',
    name: 'zenitsu',
    price: 3999,
    images: {
      front: '/zenitsu front.png',
      back: '/zenitsu back.png'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    edition: 'anime',
    description: 'Long sleeve with exclusive anime-inspired artwork'
  },
  {
    id: 'anime-6',
    name: 'Black Dragon Polo',
    price: 4499,
    images: {
      front: '/sololevling front.png',
      back: '/sololevling back.png'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    edition: 'anime',
    description: 'Luxury polo with subtle anime design elements'
  },
  
  // MONAARC Edition
  {
    id: 'MONAARC-1',
    name: 'Power Statement Tee',
    price: 3999,
    images: {
      front: 'https://images.pexels.com/photos/9558618/pexels-photo-9558618.jpeg?auto=compress&cs=tinysrgb&w=800',
      back: 'https://images.pexels.com/photos/9558619/pexels-photo-9558619.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    edition: 'MONAARC',
    description: 'Signature MONAARC tee representing ultimate power and elegance'
  },
  {
    id: 'MONAARC-2',
    name: 'Dominance Hoodie',
    price: 5999,
    images: {
      front: 'https://images.pexels.com/photos/8532622/pexels-photo-8532622.jpeg?auto=compress&cs=tinysrgb&w=800',
      back: 'https://images.pexels.com/photos/8532623/pexels-photo-8532623.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    edition: 'MONAARC',
    description: 'Premium hoodie embodying the essence of dominance'
  },
  {
    id: 'MONAARC-3',
    name: 'Authority Shirt',
    price: 4499,
    images: {
      front: 'https://images.pexels.com/photos/6764022/pexels-photo-6764022.jpeg?auto=compress&cs=tinysrgb&w=800',
      back: 'https://images.pexels.com/photos/6764023/pexels-photo-6764023.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    edition: 'MONAARC',
    description: 'Luxury shirt designed for those who command authority'
  },
  {
    id: 'MONAARC-4',
    name: 'Elite Long Sleeve',
    price: 4999,
    images: {
      front: 'https://images.pexels.com/photos/9558620/pexels-photo-9558620.jpeg?auto=compress&cs=tinysrgb&w=800',
      back: 'https://images.pexels.com/photos/9558621/pexels-photo-9558621.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    edition: 'MONAARC',
    description: 'Long sleeve for the elite who appreciate refined power'
  },
  {
    id: 'MONAARC-5',
    name: 'Sovereign Tank',
    price: 3499,
    images: {
      front: 'https://images.pexels.com/photos/8532624/pexels-photo-8532624.jpeg?auto=compress&cs=tinysrgb&w=800',
      back: 'https://images.pexels.com/photos/8532625/pexels-photo-8532625.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    edition: 'MONAARC',
    description: 'Tank top for those who rule with quiet confidence'
  },
  {
    id: 'MONAARC-6',
    name: 'MONAARCh Polo',
    price: 5499,
    images: {
      front: 'https://images.pexels.com/photos/6764024/pexels-photo-6764024.jpeg?auto=compress&cs=tinysrgb&w=800',
      back: 'https://images.pexels.com/photos/6764025/pexels-photo-6764025.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    edition: 'MONAARC',
    description: 'The ultimate luxury polo for modern MONAARChs'
  }
];