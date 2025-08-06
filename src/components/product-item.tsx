import Image from 'next/image';
import Link from 'next/link';
import type { productsTable, productVariantsTable } from '@/db/schema';
import { formatCentsToBrl } from '@/helpers/money';

interface ProductItemProps {
  product: typeof productsTable.$inferSelect & {
    variants: (typeof productVariantsTable.$inferSelect)[];
  };
}

export function ProductItem({ product }: ProductItemProps) {
  const firstVariant = product.variants[0];

  return (
    <Link className="flex flex-col gap-4" href="/">
      <Image
        alt={firstVariant.name}
        className="rounded-3xl"
        height={200}
        src={firstVariant.imageUrl.slice(2).slice(0, -2)}
        width={200}
      />

      <div className="flex max-w-[200px] flex-col gap-1">
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
