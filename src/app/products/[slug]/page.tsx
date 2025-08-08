import { and, eq, not } from 'drizzle-orm';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createLoader, parseAsString, type SearchParams } from 'nuqs/server';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ProductsList } from '@/components/products-list';
import { db } from '@/db';
import { productsTable } from '@/db/schema';
import { formatCentsToBrl } from '@/helpers/money';
import { cn } from '@/lib/utils';
import { ProductActions } from './product-actions';

// Search Params
const productPageSearchParams = {
  variant: parseAsString.withDefault(''),
};

const loadSearchParams = createLoader(productPageSearchParams);

interface ProductPageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { slug } = await params;
  const { variant } = await loadSearchParams(searchParams);

  const product = await db.query.productsTable.findFirst({
    where: eq(productsTable.slug, slug),
    with: {
      variants: true,
    },
  });

  if (!product) {
    return notFound();
  }

  const likelyProducts = await db.query.productsTable.findMany({
    where: and(
      eq(productsTable.categoryId, product.categoryId || ''),
      not(eq(productsTable.slug, slug))
    ),
    with: {
      variants: true,
    },
  });

  const selectedVariant =
    product.variants.find((v) => v.slug === variant) ?? product.variants[0];

  return (
    <>
      <Header />
      <div className="flex flex-col space-y-6 px-5">
        <figure className="relative h-[300px] w-full overflow-hidden rounded-3xl">
          <Image
            alt="Product Image"
            className="object-cover"
            fill
            src={selectedVariant.imageUrl.slice(2, -2)}
          />
        </figure>

        <div className="flex w-full gap-4 px-2">
          {product.variants.map((v) => (
            <Link
              className={cn(
                'relative size-16 overflow-hidden rounded-xl duration-300 hover:scale-105',
                v.slug === selectedVariant.slug && 'border-2 border-primary'
              )}
              href={`/products/${product.slug}?variant=${v.slug}`}
              key={v.id}
            >
              <Image
                alt={v.name}
                className="object-cover"
                fill
                src={v.imageUrl.slice(2).slice(0, -2)}
              />
            </Link>
          ))}
        </div>

        <div>
          <h2 className="font-bold text-lg leading-tight">{product.name}</h2>
          <h3 className="font-medium text-muted-foreground text-sm">
            {selectedVariant.name}
          </h3>

          <h3 className="mt-2 font-bold text-lg">
            {formatCentsToBrl(selectedVariant.priceInCents)}
          </h3>
        </div>

        <ProductActions productVariantId={selectedVariant.id} />

        <p className="text-sm">{product.description}</p>

        <ProductsList
          contentContainerClassName="px-0"
          products={likelyProducts}
          title="Produtos relacionados"
          titleContainerClassName="px-0"
        />
      </div>
      <Footer />
    </>
  );
}
