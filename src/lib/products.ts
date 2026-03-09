import { Product } from '@/types';
import productsData, { products } from '@/data/products';

export function getProducts(): Product[] {
  return products as Product[];
}

export function getProductById(productId: string): Product | undefined {
  return productsData.find(product => product.product_id === productId) as Product | undefined;
} 