'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addProductToCart } from '@/actions/add-cart-product';
import { Button } from '@/components/ui/button';
import { QuantitySelector } from './quantity-selector';

interface ProductActionsProps {
  productVariantId: string;
}

export function ProductActions({ productVariantId }: ProductActionsProps) {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const { mutateAsync: addProductToCartAsync, isPending } = useMutation({
    mutationFn: addProductToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return (
    <>
      <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

      <div className="flex flex-col gap-2">
        <Button
          className="h-12 rounded-full"
          disabled={isPending}
          onClick={async () =>
            addProductToCartAsync({ productVariantId, quantity })
          }
          variant="outline"
        >
          Adicionar à sacola
        </Button>

        <Button className="h-12 rounded-full">Comprar agora</Button>
      </div>
    </>
  );
}
