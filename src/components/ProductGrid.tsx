'use client';

import ProductCard from './ProductCard';
import useProducts from '../hooks/useProducts';

interface ProductGridProps {
  category?: string;
  searchTerm?: string;
}

export default function ProductGrid({ category, searchTerm }: ProductGridProps) {
  const { products, loading } = useProducts(
		category,
		searchTerm
	);

  if (loading) {
    return (
      <div className="flex flex-wrap flex-row gap-2 p-2">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-100 animate-pulse h-[300px] sm:h-[400px] rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4
      gap-2 sm:gap-3 md:gap-4 lg:gap-5
      p-2 sm:p-3 md:p-4 lg:p-5
      mx-auto max-w-[2000px]
      animate-fadeIn ">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
        />
      ))}
    </div>
  );
}