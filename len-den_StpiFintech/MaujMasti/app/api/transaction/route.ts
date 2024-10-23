import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

// Mock function to interact with your payment gateway (replace with actual implementation)
async function initiateTransaction(type: 'purchase' | 'withdraw', price: number, orderId: string,
  email: string,
  businessName: string,
  customerId: string,
  customerName: string,
  customerPhone: string,
  customerEmail: string,) {
  // Call your payment gateway API with the transaction details

if(type == "purchase"){
  const gatewayResponse = await axios.post(`${process.env.PAYMENT_GATEWAY_URL}/payment/create_order`, {
      orderId,
      email,
      businessName,
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      price,
    })
    
    

  const data = await gatewayResponse.data;
  // The gateway should return a payment_url or success/failure status
  if (gatewayResponse.status == 200) {
    return {
      payment_url: data.formUrl,  // URL to display the payment modal
    };
  } else {
    throw new Error('Payment initiation failed');
  }
}



}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { orderId,
      email,
      businessName,
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      price, type } = req.body;

    // Call the payment gateway to initiate the transaction
    const result = await initiateTransaction(orderId,
      email,
      businessName,
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      price,
       type);

    if (result!.payment_url) {
      // Return the URL for the frontend to open a modal or new tab
      console.log(result?.payment_url)
      return NextResponse.json({ payment_url: result!.payment_url }, { status: 200 })
    }
    else {
      return NextResponse.json({ error: "Transaction initiation failed" }, { status: 400 })
    }
  } catch (error : unknown) {
    const err = error as AxiosError
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
