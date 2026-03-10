import { Product } from '@/types';
import productsData from '@/data/products.json';

export function getProducts(): Product[] {
  return productsData as Product[];
}

export function getProductById(productId: string): Product | undefined {
  return productsData.find(product => product.product_id === productId) as Product | undefined;
} 