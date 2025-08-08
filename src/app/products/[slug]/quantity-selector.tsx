'use client';

import { MinusIcon, PlusIcon } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
}

export function QuantitySelector({
  quantity,
  setQuantity,
}: QuantitySelectorProps) {
  function handleIncrement() {
    setQuantity((prev) => prev + 1);
  }

  function handleDecrement() {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Quantidade</h3>

      <div className="flex w-28 items-center justify-between rounded-lg border">
        <Button
          className="size-10"
          onClick={handleDecrement}
          size="icon"
          variant="ghost"
        >
          <MinusIcon />
        </Button>

        <span>{quantity}</span>

        <Button
          className="size-10"
          onClick={handleIncrement}
          size="icon"
          variant="ghost"
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}
