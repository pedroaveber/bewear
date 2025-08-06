'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

const signInFormSchema = z.object({
  email: z.email('E-mail inválido').transform((value) => value.toLowerCase()),
  password: z.string().min(8, 'Mínimo de 8 caractéres'),
});

type SignInFormSchema = z.infer<typeof signInFormSchema>;

export function SignInForm() {
  const router = useRouter();

  const form = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: SignInFormSchema) {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
        onError: (context) => {
          toast.error(context.error.message);
        },
      },
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Faça login na sua conta para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o seu e-mail" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite a sua senha"
                      type="password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="flex w-full flex-col gap-2">
              <Button disabled={form.formState.isSubmitting} type="submit">
                Entrar
              </Button>

              <div className="h-px w-full bg-muted-foreground/10" />

              <Button
                onClick={() =>
                  authClient.signIn.social({
                    provider: 'google',
                  })
                }
                type="button"
                variant="outline"
              >
                Entrar com Google
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
