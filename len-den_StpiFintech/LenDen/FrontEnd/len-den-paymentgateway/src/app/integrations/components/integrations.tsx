"use client";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CopyToClipboardButton from "@/components/CopyToClipboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Checkbox } from "@radix-ui/react-checkbox";
import { MoreHorizontal, Trash2Icon } from "lucide-react";

interface IntegrationProps {
  businessName: string;
  domain: string;
  email: string;
  id: number;
  xid: string;
  xsecret: string;
}

const FormSchema = z.object({
    businessName: z.string().min(3, {message: "Business Name should contain minimum 3 characters."}),
    domain: z.string().min(8, {message: "Business Name should contain minimum 8 characters."}),
});

export default function Integrations() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [KYC, setKYC] = useState(false);
  const [email, setEmail] = useState<String | undefined>("");
  const [integrations, setIntegrations] = useState<IntegrationProps[]>([]);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          router.push('/auth/login');
          return;
        }

        setUser(session.user);
        
        const KYC_Status = await axios.get(`http://localhost:8000/user/check_kyc?email=${session.user.email}`);
        setKYC(KYC_Status.data.message);

        if (!KYC) {
          const { data } = await axios.get(`http://localhost:8000/integration/get_integration?email=${session.user.email}`);
          setIntegrations(data);
          setEmail(session.user.email)
          console.log(data);
        }

        supabase.auth.onAuthStateChange((_event, session) => {
          if (!session) {
            router.push('/auth/signup');
          } else {
            setUser(session.user);
          }
        });
      } catch (error) {
        console.error('Error fetching session or integrations:', error);
      }
    };

    getSession();
  }, [router, KYC]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      businessName: "",
      domain: ""
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleDelete = async(BusinessName : string) => {
    const response = await axios.delete(`http://localhost:8000/integration/delete_integration?businessName=${BusinessName}`);
    const { data } = await axios.get(`http://localhost:8000/integration/get_integration?email=${email}`);
          setIntegrations(data);
  }

  const onSubmit = useCallback(async (data: z.infer<typeof FormSchema>) => {
    console.log("onSubmit called with data:", data); // Debugging
    
      try {
        const response = await axios.post('http://localhost:8000/integration/create_integration', {
          email: email,
          businessName: data.businessName,
          domain: data.domain,
        });

        console.log("API response", response); // Debugging

        if (response.status === 200 && response.data.message != "Integration with same Business already exists") {
          toast({
            title: "Integration Successful",
            description: "Use API keys provided to integrate PG",
            variant: "default",
          });

          const { data } = await axios.get(`http://localhost:8000/integration/get_integration?email=${email}`);
          setIntegrations(data);
        }
        else if(response.status === 200 && response.data.message === "Integration with same Business already exists" ){
            toast({
                title: "Integration Unsuccessful",
                description: response.data.message,
                variant: "destructive",
              });
        } else {
          toast({
            title: "Integration Unsuccessful",
            description: "Please try again",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("API error", error); // Debugging
        toast({
          title: "Error",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    
  }, [user, router]);

  return (
    <Card className="bg-primary-foreground text-primary min-h-screen pt-14">
      <CardHeader>
        <div className="flex justify-between items-center">

        <div>
        <CardTitle>Integrations</CardTitle>
        <CardDescription className="text-secondary">
          Find API keys for integration.
        </CardDescription>
        </div>
        <div>
        <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate API keys</DialogTitle>
          <DialogDescription>
            Tell us more about your business.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Business Name" {...field} className="text-pretty " />
                    </FormControl>
                    <FormMessage className="-translate-y-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="www.mybusiness.com" {...field} className="text-pretty " />
                    </FormControl>
                    <FormMessage className="-translate-y-3" />
                  </FormItem>
                )}
              />
              
        <DialogFooter>
            <DialogClose asChild>

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
            </DialogClose>
        </DialogFooter>
         </form>
          </Form>
      </DialogContent>
    </Dialog>
        </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-secondary">Business Name</TableHead>
              <TableHead className="text-secondary">Domain</TableHead>
              <TableHead className="text-secondary">X-id</TableHead>
              <TableHead className="text-secondary">X-Secret</TableHead>
              <TableHead className="text-secondary">Reveal</TableHead>
              <TableHead className="text-secondary">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {integrations.length > 0 ? (
              integrations.map((content, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {content.businessName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" typeof="link" className="bg-primary">{content.domain}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{content.xid}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {"*".repeat(content.xsecret.length)}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="secondary">Reveal</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{content.businessName}</DialogTitle>
                          <DialogDescription>
                            Do not share these keys with anyone!
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                          <span>X-ID</span>
                          <div className="grid flex-1 gap-2">
                            <Label htmlFor="X-ID" className="sr-only">
                              X-ID
                            </Label>
                            <Input defaultValue={content.xid} readOnly />
                          </div>
                          <CopyToClipboardButton text={content.xid} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>X-SE</span>
                          <div className="grid flex-1 gap-2">
                            <Label htmlFor="X-Secret" className="sr-only">
                              X-Secret
                            </Label>
                            <Input defaultValue={content.xsecret} readOnly />
                          </div>
                          <CopyToClipboardButton text={content.xsecret} />
                        </div>
                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                          
                              <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="scale-x-90"><Trash2Icon /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 text-white" onClick={() => handleDelete(content.businessName)}>Continue</AlertDialogAction>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>  

                        </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No integrations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter />
    </Card>
  );
}
