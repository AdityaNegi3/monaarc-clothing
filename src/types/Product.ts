export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;  // ✅ optional strike-through price
  category: 'limited' | 'gym';
  frontImage: string;
  backImage: string;
  description: string;
  tags?: string[];         // ✅ optional tags like "best-seller"
}
