'use server';

import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { z } from 'zod/v4';
import { db } from '@/db';
import { cartItemsTable, cartsTable, productVariantsTable } from '@/db/schema';
import { auth } from '@/lib/auth';

const addProductToCartBodySchema = z.object({
  productVariantId: z.uuid(),
  quantity: z.number().int().min(1),
});

type AddProductToCartBodySchema = z.infer<typeof addProductToCartBodySchema>;

export async function addProductToCart(data: AddProductToCartBodySchema) {
  addProductToCartBodySchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const productVariant = await db.query.productVariantsTable.findFirst({
    where: eq(productVariantsTable.id, data.productVariantId),
  });

  if (!productVariant) {
    throw new Error('Product variant not found');
  }

  const cart = await db.query.cartsTable.findFirst({
    where: eq(cartsTable.userId, session.user.id),
  });

  let cartId = cart?.id;

  if (!cartId) {
    const [result] = await db
      .insert(cartsTable)
      .values({
        userId: session.user.id,
      })
      .returning({ id: cartsTable.id });

    cartId = result.id;
  }

  const cartItem = await db.query.cartItemsTable.findFirst({
    where: and(
      eq(cartItemsTable.cartId, cartId),
      eq(cartItemsTable.productVariantId, data.productVariantId)
    ),
  });

  if (cartItem) {
    await db
      .update(cartItemsTable)
      .set({
        quantity: cartItem.quantity + data.quantity,
      })
      .where(eq(cartItemsTable.id, cartItem.id));

    return;
  }

  await db.insert(cartItemsTable).values({
    cartId,
    productVariantId: data.productVariantId,
    quantity: data.quantity,
  });
}
