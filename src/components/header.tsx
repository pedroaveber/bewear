'use client';

import { LogInIcon, LogOutIcon, MenuIcon, ShoppingBagIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { CartSheetContent } from './cart-sheet-content';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

export function Header() {
  const { data: session } = authClient.useSession();

  return (
    <header className="flex items-center justify-between p-5">
      <Image alt="Bewear" height={26.14} src="/logo.svg" width={100} />

      <div className="flex items-center gap-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost">
              <ShoppingBagIcon />
            </Button>
          </SheetTrigger>

          <CartSheetContent />
        </Sheet>

        <div className="h-4 w-px bg-muted-foreground/10" />

        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost">
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <div className="px-5">
              {session?.user ? (
                <div className="flex justify-between space-y-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={session.user.image as string | undefined}
                      />
                      <AvatarFallback>
                        {session.user.name.split(' ')?.[0]?.[0]}
                        {session.user.name.split(' ')?.[1]?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-semibold">{session.user.name}</h3>
                      <span>{session.user.email}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => authClient.signOut()}
                    size="icon"
                    variant="outline"
                  >
                    <LogOutIcon />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Olá. Faça seu login!</h2>

                  <Button asChild size="icon" variant="outline">
                    <Link href="/authentication">
                      <LogInIcon />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
