'use client';

import type { productsTable, productVariantsTable } from '@/db/schema';
import { ProductItem } from './product-item';

interface ProductsListProps {
  title: string;
  products: (typeof productsTable.$inferSelect & {
    variants: (typeof productVariantsTable.$inferSelect)[];
  })[];
}

export function ProductsList({ products, title }: ProductsListProps) {
  return (
    <div className="space-y-6">
      <h3 className="px-5 font-semibold">{title}</h3>

      <div className="flex w-full gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
