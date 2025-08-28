export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'limited' | 'dark';
  frontImage: string;
  backImage: string;
  description: string;
}