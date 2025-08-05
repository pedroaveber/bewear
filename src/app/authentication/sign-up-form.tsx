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

const signUpFormSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .min(5, 'Mínimo de 5 caractéres'),
    email: z.email('E-mail inválido').transform((value) => value.toLowerCase()),
    password: z.string().min(8, 'Mínimo de 8 caractéres'),
    passwordConfirmation: z.string().min(8, 'Mínimo de 8 caractéres'),
  })
  .check((context) => {
    if (context.value.passwordConfirmation !== context.value.password) {
      context.issues.push({
        code: 'custom',
        path: ['passwordConfirmation'],
        message: 'As senhas não coincidem',
        input: context.value.passwordConfirmation,
      });
    }
  });

type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export function SignUpForm() {
  const router = useRouter();

  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  async function onSubmit(data: SignUpFormSchema) {
    await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      fetchOptions: {
        onSuccess: () => {
          toast.success('Conta criada com sucesso!');
          router.push('/');
        },
        onError: (error) => {
          toast.error(error.error.message);
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o seu nome" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirme sua senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite a sua senha novamente"
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
            <Button type="submit">Criar conta</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
