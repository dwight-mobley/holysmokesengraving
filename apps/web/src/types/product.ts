export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  slug: string;
  description?: string;
  tags?: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}