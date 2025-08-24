export interface Product {
  id: string;
  name: string;
  price: number;
  images: {
    front: string;
    back: string;
  };
  sizes: string[];
  edition: 'anime' | 'MONAARC';
  description?: string;
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface OrderForm {
  name: string;
  phone: string;
  email: string;
  address: string;
}