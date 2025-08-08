import Image from 'next/image';
import Link from 'next/link';
import type { productsTable, productVariantsTable } from '@/db/schema';
import { formatCentsToBrl } from '@/helpers/money';
import { cn } from '@/lib/utils';

interface ProductItemProps {
  textContainerClassName?: string;
  product: typeof productsTable.$inferSelect & {
    variants: (typeof productVariantsTable.$inferSelect)[];
  };
}

export function ProductItem({
  product,
  textContainerClassName,
}: ProductItemProps) {
  const firstVariant = product.variants[0];

  return (
    <Link
      className="flex flex-col gap-4"
      href={`/products/${product.slug}?variant=${firstVariant.slug}`}
    >
      <Image
        alt={firstVariant.name}
        className="h-auto w-full rounded-3xl"
        height={0}
        sizes="100vw"
        src={firstVariant.imageUrl.slice(2).slice(0, -2)}
        width={0}
      />

      <div
        className={cn(
          'flex max-w-[200px] flex-col gap-1',
          textContainerClassName
        )}
      >
        <p className="truncate font-medium text-sm">{product.name}</p>
        <p className="truncate font-medium text-muted-foreground text-xs">
          {product.description}
        </p>
        <p className="truncate font-medium text-sm">
          {formatCentsToBrl(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  );
}
