import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { ProductItem } from '@/components/product-item';
import { db } from '@/db';
import { categoriesTable } from '@/db/schema';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await db.query.categoriesTable.findFirst({
    where: eq(categoriesTable.slug, slug),
    with: {
      products: {
        with: {
          variants: true,
        },
      },
    },
  });

  if (!category) {
    return notFound();
  }

  return (
    <>
      <Header />

      <div className="space-y-6 px-5">
        <h2 className="font-semibold text-xl">{category.name}</h2>
        <div className="grid grid-cols-2 gap-4">
          {category.products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              textContainerClassName="max-w-full"
            />
          ))}
        </div>
      </div>
    </>
  );
}
