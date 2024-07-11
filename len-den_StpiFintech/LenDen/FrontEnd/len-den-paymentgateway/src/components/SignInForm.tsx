"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabaseClient';
import axios from "axios"
import { useRouter } from 'next/navigation';
import { Icons } from "./ui/icons"
import Link from "next/link"


// Define the schema for form validation
const FormSchema = z.object({
  email: z.string().min(10, {
    message: "email must be at least 10 characters",
  }).email({ message: "Enter a valid email!" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

// Define the SigninForm component
export function SigninForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password:"",
    },
  })
  const isSubmitting = form.formState.isSubmitting;
  const googleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `/dashboard`,
      },
    })
  }

  const githubSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `/dashboard`,
      },
    })  
  }

  // Handle form submission
  async function onSubmit(data: z.infer<typeof FormSchema>) {
      try {

const { error } = await supabase.auth.signInWithPassword({ email: data.email , password: data.password });
          if (error) {
            toast({
              title: "Sign-in failed",
              description: error.message,
              variant: "destructive",
            })
            console.error("Supabase sign-up error:", error.message);
          } else {
            toast({
              title: "Signed-in successfully",
              description: "Welcome back!",
              variant: "default",
            })
            router.push('/dashboard');
          }
        }
       catch (error: any) {
        toast({
          title: "Sign-in failed",
          description: error.message,
          variant: "destructive",
        })
        console.error("Backend sign-up error:", error);
      }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-secondary">E-mail</FormLabel>
              <FormControl>
                <Input placeholder="Example: test123@gmail.com" {...field} className="text-pretty text-primary" />
              </FormControl>
              <FormMessage className="-translate-y-3" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-secondary">Password</FormLabel>
              <FormControl>
                <Input placeholder="********" {...field} type="password" className="text-pretty text-primary" />
              </FormControl>
              <FormMessage className="-translate-y-3" />
            </FormItem>
          )}
        />
        <div className="w-full p-2 items-center flex justify-end">
          <Button type="submit" className="bg-secondary text-secondary-foreground">{isSubmitting ?
            <>
              <Icons.spinner />
              Submitting...
            </> :
            <>
              Submit
            </>
          }</Button>
        </div>
        <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex gap-4 m-3">
        <Button className="w-full" onClick={githubSignIn} variant="secondary" type="button">
          <Icons.gitHub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button className="w-full" variant="secondary" onClick={googleSignIn} type="button">
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            New user?
          </span>
        </div>
      </div>
        <Link href={"/auth/signup"}>
      <div className="flex gap-4 m-3">
        <Button className="w-full"  variant="secondary" type="button">
          Create Account
        </Button>
      </div>
        </Link>
      
      </form>
    </Form>
  )
}
