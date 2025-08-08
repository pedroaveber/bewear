import { MinusIcon, PlusIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import { formatCentsToBrl } from '@/helpers/money';
import { Button } from './ui/button';

interface CartItemProps {
  product: {
    id: string;
    name: string;
    variantName: string;
    variantImageUrl: string;
    variantPriceInCents: number;
    quantity: number;
  };
}

export function CartItem({ product }: CartItemProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-1 items-center gap-4">
        <Image
          alt={product.variantName}
          className="rounded-lg"
          height={78}
          src={product.variantImageUrl.slice(2, -2)}
          width={78}
        />

        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm">{product.name}</p>
          <p className="font-medium text-muted-foreground text-xs">
            {product.variantName}
          </p>

          <div className="flex w-fit items-center gap-2 rounded-lg border">
            <Button className="size-6 px-1" size="icon" variant="ghost">
              <MinusIcon className="size-3" />
            </Button>

            <span className="text-xs">0</span>

            <Button className="size-6 px-1" size="icon" variant="ghost">
              <PlusIcon className="size-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <Button size="icon" variant="outline">
          <Trash />
        </Button>

        <span className="font-bold text-sm">
          {formatCentsToBrl(product.variantPriceInCents)}
        </span>
      </div>
    </div>
  );
}
