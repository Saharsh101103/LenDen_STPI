"use client"
import { UserAccount } from "@/components/user-account"
import axios from "axios";
import { toast } from "sonner"


import {  useState, useEffect } from 'react'

interface AccountData {
  name: string;
  balance: number;
}




export default function BankPage() {
   // Define states for user1 and user2 account data
 // Define states for user1 and user2 account data
 const [user1Data, setUser1Data] = useState<AccountData>({ name: '', balance: 0 });
 const [user2Data, setUser2Data] = useState<AccountData>({ name: '', balance: 0 });

 // Function to fetch account data from the API
 const fetchAccountData = async () => {
   const res = await axios.get('/api/transaction');
   return res.data;
 };

 // Fetch data and check for balance update
 const fetchData = async () => {
   const res = await fetchAccountData();

   // Check if balance has been updated for user1
   if (res.merchant.balance !== user1Data.balance) {
     toast.success('Balance updated')

   }

   // Check if balance has been updated for user2
   if (res.customer.balance !== user2Data.balance) {

   }

   // Update the state with the new data
   setUser1Data({ name: res.merchant.name, balance: res.merchant.balance });
   setUser2Data({ name: res.customer.name, balance: res.customer.balance });
 };

 useEffect(() => {
   // Fetch data immediately when the component mounts
   fetchData();

   // Set interval to fetch data every 30 seconds
   const interval = setInterval(() => {
     fetchData();
   }, 30000); // 30 seconds

   // Cleanup the interval on component unmount
   return () => clearInterval(interval);
 }, []); // Empty dependency array to ensure the interval is only set once


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Bank Accounts</h1>
        </div>
      </header>
      <main className="container mx-auto py-6 px-4">
        <div className="grid gap-6 md:grid-cols-2">
          <UserAccount 
            name={user1Data.name}
            balance={user1Data.balance}
            
          />
          <UserAccount 
            name={user2Data.name}
            balance={user2Data.balance}
            
          />
        </div>
      </main>
    </div>
  )
}