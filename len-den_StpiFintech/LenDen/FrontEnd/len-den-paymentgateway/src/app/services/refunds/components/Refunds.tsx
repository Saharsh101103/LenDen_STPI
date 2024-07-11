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

interface RefundProps {
  businessName: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  refundId: string;
  refundAmount: number;
  status: string;
}

export default function Refunds() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [KYC, setKYC] = useState(false);
  const [email, setEmail] = useState<string | undefined>("");
  const [refunds, setRefunds] = useState<RefundProps[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

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

        const KYC_Status = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/check_kyc?email=${session.user.email}`
        );
        setKYC(KYC_Status.data.message);

        if (KYC_Status.data.message) {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/refund/get_orders?email=${session.user.email}`
          );
          setRefunds(data);
          setEmail(session.user.email);
          setLoading(false); // Set loading to false after data is fetched
        }

        supabase.auth.onAuthStateChange((_event, session) => {
          if (!session) {
            router.push("/auth/signup");
          } else {
            setUser(session.user);
          }
        });
      } catch (error) {
        console.error("Error fetching session or refunds:", error);
        setError("Failed to load data. Please try again later."); // Set error message
        setLoading(false); // Set loading to false in case of error
      }
    };

    getSession();
  }, [router, KYC]);

  return (
    <Card className="bg-primary-foreground text-primary min-h-screen pt-14">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Refunds</CardTitle>
            <CardDescription className="text-secondary">
              See all refunds linked to your account.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-secondary">Business Name</TableHead>
              <TableHead className="text-secondary">Order ID</TableHead>
              <TableHead className="text-secondary">Customer</TableHead>
              <TableHead className="text-secondary">Contact</TableHead>
              <TableHead className="text-secondary">Refund ID</TableHead>
              <TableHead className="text-secondary">Refund Amount</TableHead>
              <TableHead className="text-secondary">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Render skeleton loaders while loading
              <TableRow>
                <TableCell colSpan={7}>
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                </TableCell>
              </TableRow>
            ) : (
              // Render actual data once loaded
              refunds.length > 0 ? (
                refunds.map((content, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {content.businessName}
                    </TableCell>
                    <TableCell className=" md:table-cell">
                      {content.orderId}
                    </TableCell>
                    <TableCell className=" md:table-cell">
                      {content.customerName}
                    </TableCell>
                    <TableCell>{content.customerPhone}</TableCell>
                    <TableCell>{content.refundId}</TableCell>
                    <TableCell>{content.refundAmount}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        typeof="link"
                        className="bg-primary"
                      >
                        {content.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    All refunds processed from any of your businesses will appear here.
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter />
    </Card>
  );
}
