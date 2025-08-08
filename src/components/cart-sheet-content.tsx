'use client';

import { useQuery } from '@tanstack/react-query';
import { getCart } from '@/actions/get-cart';
import { formatCentsToBrl } from '@/helpers/money';
import { CartItem } from './cart-item';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

export function CartSheetContent() {
  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Carrinho</SheetTitle>
      </SheetHeader>

      <div className="flex h-full flex-col px-4 pb-5">
        <div className="flex h-full max-h-full flex-col overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex h-full flex-col gap-8">
              {cart?.items.map((item) => (
                <CartItem
                  key={item.id}
                  product={{
                    id: item.id,
                    name: item.productVariant.product.name,
                    variantName: item.productVariant.name,
                    variantImageUrl: item.productVariant.imageUrl,
                    variantPriceInCents: item.productVariant.priceInCents,
                    quantity: item.quantity,
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {(cart?.items || []).length > 0 && (
          <div className="flex flex-col gap-4">
            <Separator />

            <div className="flex items-center justify-between font-medium text-xs">
              <p>Subtotal:</p>
              <p>{formatCentsToBrl(cart?.totalPriceInCents || 0)}</p>
            </div>

            <Separator />

            <div className="flex items-center justify-between font-medium text-xs">
              <p>Entraga:</p>
              <p>Gratis</p>
            </div>

            <Separator />

            <div className="flex items-center justify-between font-medium text-xs">
              <p>Total:</p>
              <p>{formatCentsToBrl(cart?.totalPriceInCents || 0)}</p>
            </div>

            <Button className="mt-5 h-10 rounded-full">Finalizar compra</Button>
          </div>
        )}
      </div>
    </SheetContent>
  );
}
