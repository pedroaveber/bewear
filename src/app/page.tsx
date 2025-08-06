import { desc } from 'drizzle-orm';
import Image from 'next/image';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ProductsList } from '@/components/products-list';
import { db } from '@/db';
import { productsTable } from '@/db/schema';
import { CategorySelector } from './category-selector';

export default async function Home() {
  const products = await db.query.productsTable.findMany({
    with: {
      variants: true,
    },
  });

  const newlyCreatedProducts = await db.query.productsTable.findMany({
    with: {
      variants: true,
    },
    orderBy: [desc(productsTable.createdAt)],
    limit: 4,
  });

  const categories = await db.query.categoriesTable.findMany();

  return (
    <>
      <Header />
      <div className="space-y-6">
        <div className="px-5">
          <Image
            alt=""
            className="h-auto w-full"
            height={0}
            quality={100}
            sizes="100vw"
            src="/banner-01.png"
            width={0}
          />
        </div>

        <ProductsList products={products} title="Mais vendidos" />

        <div className="px-5">
          <Image
            alt=""
            className="h-auto w-full"
            height={0}
            quality={100}
            sizes="100vw"
            src="/banner-02.png"
            width={0}
          />
        </div>

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <ProductsList products={newlyCreatedProducts} title="Novidades" />
      </div>

      <Footer />
    </>
  );
}
