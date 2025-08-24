import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/products';

export default function ProductsPage() {
  const products = getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Business Guides & Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our comprehensive collection of business plans and guides designed specifically for the Kenyan market
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
} 