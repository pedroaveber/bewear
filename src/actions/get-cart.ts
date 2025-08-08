'use server';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { db } from '@/db';
import { cartsTable } from '@/db/schema';
import { auth } from '@/lib/auth';

export async function getCart() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const cart = await db.query.cartsTable.findFirst({
    where: eq(cartsTable.userId, session.user.id),
    with: {
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    const [newCart] = await db
      .insert(cartsTable)
      .values({
        userId: session.user.id,
      })
      .returning();

    return {
      ...newCart,
      totalPriceInCents: 0,
      items: [],
    };
  }

  const totalPriceInCents = cart.items.reduce(
    (total, item) => total + item.productVariant.priceInCents * item.quantity,
    0
  );

  return {
    ...cart,
    totalPriceInCents,
  };
}
