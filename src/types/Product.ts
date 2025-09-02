export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;  // ✅ optional field for strike-through price
  category: 'limited' | 'gym';
  frontImage: string;
  backImage: string;
  description: string;
}
