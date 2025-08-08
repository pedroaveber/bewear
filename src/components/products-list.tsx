'use client';

import type { productsTable, productVariantsTable } from '@/db/schema';
import { cn } from '@/lib/utils';
import { ProductItem } from './product-item';

interface ProductsListProps {
  title: string;
  titleContainerClassName?: string;
  contentContainerClassName?: string;
  products: (typeof productsTable.$inferSelect & {
    variants: (typeof productVariantsTable.$inferSelect)[];
  })[];
}

export function ProductsList({
  products,
  title,
  titleContainerClassName,
  contentContainerClassName,
}: ProductsListProps) {
  return (
    <div className="space-y-6">
      <h3 className={cn('px-5 font-semibold', titleContainerClassName)}>
        {title}
      </h3>

      <div
        className={cn(
          'flex w-full gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden',
          contentContainerClassName
        )}
      >
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
