"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import axios from 'axios';
import SignOutButton from '@/components/SignoutButton';
import KycAlert from '@/components/kycAlert';
import { Skeleton } from '@/components/ui/skeleton'; // Import the skeleton component
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import Overview from './components/overview';
import RecentSales from './components/recent-sales';
import { User } from '@supabase/supabase-js';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderAmount: number;
}


const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<string>("0");
  const [payoutAmount, setPayoutAmount] = useState<string>("0");
  const [refundAmount, setRefundAmount] = useState<string>("0");
  const [orderCount, setOrderCount] = useState<number>(0);
  const [KYC, setKYC] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          router.push('/auth/login');
          return;
        }

        setUser(session.user);

        const [KYC_Status, userDetails, orderCountData, ordersData] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/check_kyc?email=${session.user.email}`),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get_user?email=${session.user.email}`),
          axios.get<number>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orderCount?email=${session.user.email}`),
          axios.get<Order[]>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/get_orders?email=${session.user.email}`),
        ]);

        setKYC(KYC_Status.data.message);
        setPaymentAmount(userDetails.data.payment_amount);
        setPayoutAmount(userDetails.data.payout_amount);
        setRefundAmount(userDetails.data.refund_amount);
        setOrderCount(orderCountData.data);
        setOrders(ordersData.data);
        
        setLoading(false); // Set loading to false after all data is fetched
      } catch (error) {
        console.error('Error fetching session or user data:', error);
        setLoading(false); // End loading in case of error
      }
    };

    getSession();
  }, [router]);

  if (!user) return null;

  return (
    <>
      <div className="flex flex-col md:flex bg-primary-foreground text-primary min-h-screen pt-14">
        {loading ? <Skeleton/> : KYC ? null : <KycAlert />}
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <SignOutButton />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">
                    ₹ {parseFloat(paymentAmount) - parseFloat(payoutAmount) - parseFloat(refundAmount)}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">From Payments</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">₹ {paymentAmount}</div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payouts</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">₹ {payoutAmount}</div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Refunds</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold">₹ {refundAmount}</div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-primary-foreground text-primary">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {loading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <Overview paymentAmount={parseFloat(paymentAmount)} payoutAmount={parseFloat(payoutAmount)} refundAmount={parseFloat(refundAmount)} />
                )}
              </CardContent>
            </Card>
            <Card className="col-span-3 bg-primary-foreground text-primary">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  {orderCount === 0 ? 'There are no orders.' : `${orderCount} Orders`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                {loading ? (
                  <Skeleton className="h-64 w-full" />
                ) : orderCount === 0 ? (
                  <div className="flex justify-center items-center w-full h-full">
                    Your orders will appear here.
                  </div>
                ) : (
                  orders.map((order) => (
                    <RecentSales
                      key={order.id}
                      customerName={order.customerName}
                      email={order.customerEmail}
                      amount={order.orderAmount}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
