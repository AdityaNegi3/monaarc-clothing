export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'limited' | 'GYM';
  frontImage: string;
  backImage: string;
  description: string;
}