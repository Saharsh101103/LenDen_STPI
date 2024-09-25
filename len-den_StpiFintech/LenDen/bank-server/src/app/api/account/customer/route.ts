import { NextResponse } from "next/server";

export async function GET() {
    // Mock data for customer account
    const customerAccount = {
      name: "Customer",
      balance: 10000.00,
      transactions: [
        { id: 1, date: "2023-09-20", description: "Purchase at Store B", amount: -75.50 },
        { id: 2, date: "2023-09-19", description: "Salary Deposit", amount: 2500.00 },
        { id: 3, date: "2023-09-18", description: "Electric Bill", amount: -120.00 },
        { id: 4, date: "2023-09-17", description: "Online Shopping", amount: -49.99 },
        { id: 5, date: "2023-09-16", description: "Restaurant", amount: -35.75 },
      ]
    };
  
    return NextResponse.json(customerAccount);
  }
  