"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentProps {
  businessName: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  payment_method: string;
  orderAmount: number;
  status: string;
}

export default function Payments() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [KYC, setKYC] = useState(false);
  const [email, setEmail] = useState<string | undefined>("");
  const [payments, setPayments] = useState<PaymentProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error || !session) {
          router.push("/auth/login");
          return;
        }

        setUser(session.user);
        setEmail(session.user.email);

        const KYC_Status = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/check_kyc?email=${session.user.email}`
        );
        setKYC(KYC_Status.data.message);

        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/get_orders?email=${session.user.email}`
        );
        setPayments(data);
        setLoading(false);

        supabase.auth.onAuthStateChange((_event, session) => {
          if (!session) {
            router.push("/auth/signup");
          } else {
            setUser(session.user);
          }
        });
      } catch (error) {
        console.error("Error fetching session or integrations:", error);
        setLoading(false);
      }
    };

    getSession();
  }, [router]);

  return (
    <Card className="bg-primary-foreground text-primary min-h-screen pt-14">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payments</CardTitle>
            <CardDescription className="text-secondary">
              See all payments linked to your account.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-secondary">Business Name</TableHead>
              <TableHead className="text-secondary">Order ID</TableHead>
              <TableHead className="text-secondary">Customer</TableHead>
              <TableHead className="text-secondary">Contact</TableHead>
              <TableHead className="text-secondary">Payment Method</TableHead>
              <TableHead className="text-secondary">Order Amount</TableHead>
              <TableHead className="text-secondary">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                </TableRow>
              ))
            ) : payments.length > 0 ? (
              payments.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{payment.businessName}</TableCell>
                  <TableCell className="md:table-cell">{payment.orderId}</TableCell>
                  <TableCell className="md:table-cell">{payment.customerName}</TableCell>
                  <TableCell>{payment.customerPhone}</TableCell>
                  <TableCell>{payment.payment_method}</TableCell>
                  <TableCell>{payment.orderAmount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" typeof="link" className="bg-primary">
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  All payments made to any of your businesses will appear here.
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
