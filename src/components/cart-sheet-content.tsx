'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { getCart } from '@/actions/get-cart';
import { SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

export function CartSheetContent() {
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Carrinho</SheetTitle>
      </SheetHeader>

      <div>
        {cartIsLoading && <div>Carregando...</div>}

        {cart?.items.map((item) => (
          <div key={item.id}>
            <Image
              alt={item.productVariant.name}
              height={100}
              src={item.productVariant.imageUrl.slice(2, -2)}
              width={100}
            />
          </div>
        ))}
      </div>
    </SheetContent>
  );
}
