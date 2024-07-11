"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { Icons } from "./ui/icons";
import Link from "next/link";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

// Define the schema for form validation
const FormSchema = z.object({
  email: z.string().min(10, {
    message: "email must be at least 10 characters",
  }).email({ message: "Enter a valid email!" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  tnc: z.boolean().default(false).optional(),
  contact: z.string().min(10, { message: "Contact number must be 10 digits" }).max(10,{ message: "Contact number must be 10 digits" }),
  panNumber: z.string().min(10, { message: "Pan number must be 10 digits" }).max(10,{ message: "Pan number must be 10 digits" }),
  aadharNumber: z.string().min(12, { message: "Aadhar number must be 12 digits" }).max(12,{ message: "Aadhar number must be 12 digits" }),
  accountNumber: z.string().min(8, { message: "Bank account number must be 8-12 digits" }).max(12,{ message: "Bank account number must be 8-12 digits" }),
  ifsc: z.string().min(11, { message: "IFSC code must have 11 digits" }).max(11,{ message: "IFSC code must have 11 digits" }),
  upi: z.string(),
})

// Define the SignupForm component
export function KYCForm() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    getSession();
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: user?.email || '',
      name: "",
      password: "",
      tnc: false,
      contact: "",
      panNumber: "",
      aadharNumber: "",
      accountNumber: "",
      ifsc: "",
      upi: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // Handle form submission
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.tnc) {
      try {
        const existingUser = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get_user`, {
          params: { email: data.email }
        });

        if (existingUser.status == 200) {
          // User exists, update the user
          const updatedUser = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update_user`, {
            "email": data.email,
            "password": data.password,
            "name": data.name,
            "contact": data.contact,
            "panNumber": data.panNumber,
            "aadharNumber": data.aadharNumber,
            "accountNumber": data.accountNumber,
            "ifsc": data.ifsc,
            "upi": data.upi,
            "isAdmin": false,
          });

          if (updatedUser.data.message.email === data.email) {
            toast({
              title: "Verification Successful",
              description: "You can continue to integration.",
              variant: "default",
            });
          } else {
            toast({
              title: "Verification Unsuccessful",
              description: "Please try again",
              variant: "destructive",
            });
          }
        } else {
          // User does not exist, create a new user
          const newUser = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/create_user`, {
            "email": data.email,
            "password": data.password,
            "name": data.name,
            "contact": data.contact,
            "panNumber": data.panNumber,
            "aadharNumber": data.aadharNumber,
            "accountNumber": data.accountNumber,
            "ifsc": data.ifsc,
            "upi": data.upi,
            "isAdmin": false,
          });

          if (newUser.data.message.email === data.email) {
            toast({
              title: "Verification Successful",
              description: "You can continue to integration",
              variant: "default",
            });
          } else {
            toast({
              title: "Verification Unsuccessful",
              description: "Please try again",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Terms and Conditions",
        description: "You must accept the terms and conditions to proceed.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3">
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
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-secondary">Contact</FormLabel>
              <FormControl>
                <Input placeholder="90xxx52xxxx" {...field} type="text" className="text-pretty text-primary" />
              </FormControl>
              <FormMessage className="-translate-y-3" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="panNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-secondary">Pan Number</FormLabel>
              <FormControl>
                <Input placeholder="AAAPZ1234C1" {...field} type="text" className="text-pretty text-primary" />
              </FormControl>
              <FormMessage className="-translate-y-3" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aadharNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-secondary">Aadhar Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter: 662223509284" {...field} type="text" className="text-pretty text-primary" />
              </FormControl>
              <FormMessage className="-translate-y-3" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-secondary">Bank Account Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter: 23122204240" {...field} type="text" className="text-pretty text-primary" />
              </FormControl>
              <FormMessage className="-translate-y-3" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ifsc"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-secondary">IFSC code</FormLabel>
              <FormControl>
                <Input placeholder="Enter: LENDEN00010" {...field} type="text" className="text-pretty text-primary" />
              </FormControl>
              <FormMessage className="-translate-y-3" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="upi"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-secondary">UPI ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter: user@lenden" {...field} type="text" className="text-pretty text-primary" />
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
          <Button type="submit" className="bg-secondary text-secondary-foreground">
            {isSubmitting ? (
              <>
                <Icons.spinner />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
