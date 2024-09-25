import { NextResponse } from "next/server";

export async function GET() {
    // Mock data for merchant account
    const merchantAccount = {
      name: "Merchant",
      balance: 20000.00,
      transactions: [
        { id: 1, date: "2023-09-20", description: "Sale at Store A", amount: 1500.00 },
        { id: 2, date: "2023-09-19", description: "Refund from Supplier", amount: 250.00 },
        { id: 3, date: "2023-09-18", description: "Payment for Service B", amount: -1200.00 },
        { id: 4, date: "2023-09-17", description: "Purchase Supplies", amount: -300.00 },
        { id: 5, date: "2023-09-16", description: "Deposit", amount: 5000.00 },
      ]
    };

    return NextResponse.json(merchantAccount);
}
