"use client";
import { useCallback, useEffect, useState } from "react";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";

interface PayoutProps {
  businessName: string;
  payoutId: string;
  customerName: string;
  customerPhone: string;
  payout_method: string;
  payoutAmount: number;
  status: string

}



export default function Payouts() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [KYC, setKYC] = useState(false);
  const [email, setEmail] = useState<String | undefined>("");
  const [payouts, setPayouts] = useState<PayoutProps[]>([]);

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

        if (!KYC) {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/payout/get_orders?email=${session.user.email}`
          );
          setPayouts(data);
          setEmail(session.user.email);
          console.log(data);
        }

        supabase.auth.onAuthStateChange((_event, session) => {
          if (!session) {
            router.push("/auth/signup");
          } else {
            setUser(session.user);
          }
        });
      } catch (error) {
        console.error("Error fetching session or integrations:", error);
      }
    };

    getSession();
  }, [router, KYC]);





  return (
    <Card className="bg-primary-foreground text-primary min-h-screen pt-14">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payouts</CardTitle>
            <CardDescription className="text-secondary">
              See all payouts linked to your account.
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
              
              <TableHead className="text-secondary">Order Amount</TableHead>
              <TableHead className="text-secondary">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.length > 0 ? (
              payouts.map((content, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {content.businessName}
                  </TableCell>
                  <TableCell className=" md:table-cell">
                    {content.payoutId}
                  </TableCell>
                  <TableCell className=" md:table-cell">
                    {content.customerName}
                  </TableCell>
                  <TableCell>{content.customerPhone}</TableCell>
                  
                  <TableCell>{content.payoutAmount}</TableCell>
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
                <TableCell colSpan={5} className="text-center">
                All payouts made from any of your businesses will appear here.
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
