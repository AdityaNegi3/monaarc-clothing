export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'limited' | 'gym';
  frontImage: string;
  backImage: string;
  description: string;
}