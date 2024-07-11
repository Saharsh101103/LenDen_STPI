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
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  tnc: z.boolean().default(false).optional()
})

// Define the SignupForm component
export function SignupForm() {
  const router = useRouter();
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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      name:"",
      password:"",
      tnc: false
    },
  })
  const isSubmitting = form.formState.isSubmitting;

  // Handle form submission
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.tnc) {
      try {

       
          const { error } = await supabase.auth.signUp({ email: data.email, password: data.password });
          if (error) {
            toast({
              title: "Sign-up failed",
              description: "Please try again",
              variant: "destructive",
            })
            console.error("Supabase sign-up error:", error);
          } else {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/create_user`,{email :data.email})
            if(res.status == 200){
              toast({
                title: "Signed-up successfully",
                description: "Check your email, and verify",
                variant: "default",
              })
            }
              else{
                toast({
                  title: "Sign-up failed",
                  description: "Please try again",
                  variant: "destructive",
                })
              }
            router.push('/auth/login');
          }
        }
       catch (error: any) {
        toast({
          title: "Sign-up failed",
          description: "Please use a different account",
          variant: "destructive",
        })
        console.error("Backend sign-up error:", error);
      }
    } else {
      toast({
        title: "Submit failed",
        description: "Accept terms and conditions to continue",
        variant: "destructive",
      })
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-secondary">Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} className="text-pretty text-primary" />
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
        <FormField
          name="tnc"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground"/>
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accept terms and conditions
                  </label>
                </div>
              </FormControl>
              <FormMessage className="-translate-y-5" />
            </FormItem>
          )}
        />
        <div className="w-full p-2 items-center flex justify-end">
          <Button type="submit" className="bg-secondary text-secondary-foreground"> {isSubmitting ?
            <>
              <Icons.spinner />
              Submitting...
            </> :
            <>
              Submit
            </>
          }</Button>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
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
