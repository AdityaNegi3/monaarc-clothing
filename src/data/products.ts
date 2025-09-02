import { Underline } from 'lucide-react';
import { Product } from '../types/Product';

export const products: Product[] = [
  // LIMITED Edition Collection
{
    id: 'limited-1',
    name: 'Toji Wrath White Tee',
    price: 1599,
    originalPrice: 2999, // ✅ Added for discount display
    category: 'limited',
    frontImage: '/tee1.png',
    backImage: '/yami (2).png',
    description:
      'Exclusive LIMITED edition signature tee with premium cotton blend and gold foil detailing.'
  },
  {
    id: 'limited-2',
    name: 'Project Yeager Black Tee',
    price: 1599,
    originalPrice: 2999, // ✅ Added for discount display
    category: 'limited',
    frontImage: '/front eren.png',
    backImage: '/tatake copy.png',
    description:
      'LIMITED collection featuring elegant gold script typography on premium fabric.'
  },
  {
    id: 'limited-3',
    name: 'Eye Of Fate White Tee',
    price: 1099,
    category: 'limited',
    frontImage: '/itachi front 1.png',
    backImage: '/itachi back 2.png',
    description: 'Royal edition with sophisticated design elements and luxury finishing.'
  },
  {
    id: 'limited-4',
    name: 'Rengoku Hellfire Black Tee',
    price: 2599,
    originalPrice: 4999,
    category: 'limited',
    frontImage: '/royal front 1.png',
    backImage: '/royal 2.png',
    description: 'Heritage collection piece with timeless design and premium craftsmanship.'
  },
  {
    id: 'limited-5',
    name: 'Beyond Average Black Tee',
    price: 1499,
    category: 'limited',
    frontImage: '/gym 1 front copy.png',
    backImage: '/gym 1 back copy.png',
    description: 'Luxury edition with exclusive design elements and superior material quality.'
  },
  {
    id: 'limited-6',
    name: 'Prove Yourself Black Tee',
    price: 1499,
    category: 'limited',
    frontImage: '/gym 2 front heh.png',
    backImage: '/gym 2 back prod copy.png',
    description: 'Elite collection featuring sophisticated aesthetics and premium comfort.'
  },

  // gym Edition Collection
  // {
  //   id: 'gym-1',
  //   name: 'MONAARC MENTALITY ',
  //   price: 1499,
  //   category: 'gym',
  //   frontImage: '/gym 1 front.png',
  //   backImage: '/gym 1 back.png',
  //   description: 'gym Edition with shadow aesthetics and mysterious elegance.'
  // },
  // {
  //   id: 'gym-2',
  //   name: 'MONAARC DISCIPLINE',
  //   price: 1499,
  //   category: 'gym',
  //   frontImage: '/gym 2 front.png',
  //   backImage: '/gym 2 back.png',
  //   description: 'Midnight collection with deep black tones and subtle design details.'
  // },
  // {
  //   id: 'gym-3',
  //   name: 'test',
  //   price: 999,
  //   category: 'gym',
  //   frontImage: 'https://images.pexels.com/photos/1964979/pexels-photo-1964979.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=cro',
  //   backImage: '/back.png',
  //   description: 'Noir edition featuring sophisticated gym aesthetics and premium quality.'
  // },
  // {
  //   id: 'gym-4',
  //   name: 'test',
  //   price: 999,
  //   category: 'gym',
  //   frontImage: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop',
  //   backImage: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop',
  //   description: 'Phantom collection with mysterious allure and exceptional craftsmanship.'
  // },
  // {
  //   id: 'gym-5',
  //   name: 'gym Edition Eclipse Tee',
  //   price: 999,
  //   category: 'gym',
  //   frontImage: 'https://images.pexels.com/photos/3758146/pexels-photo-3758146.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop',
  //   backImage: 'https://images.pexels.com/photos/3758146/pexels-photo-3758146.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop',
  //   description: 'Eclipse edition symbolizing the union of light and shadow in perfect harmony.'
  // },
  // {
  //   id: 'gym-6',
  //   name: 'gym Edition Storm Tee',
  //   price: 999,
  //   category: 'gym',
  //   frontImage: 'https://images.pexels.com/photos/1964979/pexels-photo-1964979.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop',
  //   backImage: 'https://images.pexels.com/photos/1964979/pexels-photo-1964979.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop',
  //   description: 'Storm edition with bold aesthetics and fierce energy, crafted for statement wear.'
  // },
  // {
  //   id: 'gym-7',
  //   name: 'gym Edition Flame Tee',
  //   price: 999,
  //   category: 'gym',
  //   frontImage: 'https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop',
  //   backImage: 'https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop',
  //   description: 'Flame edition inspired by passion and intensity, designed with vibrant details.'
  // },
  // {
  //   id: 'gym-8',
  //   name: 'gym Edition Mist Tee',
  //   price: 999,
  //   category: 'gym',
  //   frontImage: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop',
  //   backImage: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop',
  //   description: 'Mist edition embodying subtle elegance with soft mysterious tones.'
  // }
];
