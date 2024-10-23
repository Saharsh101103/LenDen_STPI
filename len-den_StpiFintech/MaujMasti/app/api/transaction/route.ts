import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

// Mock function to interact with your payment gateway (replace with actual implementation)
async function initiateTransaction(
  type: 'purchase' | 'withdraw', 
  orderAmount: number, 
  orderId: string,
  email: string,
  businessName: string,
  customerId: string,
  customerName: string,
  customerPhone: string,
  customerEmail: string,
  xId : string | undefined,
  xSecret : string | undefined
) {
  try {
    if (type == "purchase") {
      const gatewayResponse = await axios.post(`${process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL}/payment/create_order`, {
        orderId,
        email,
        businessName,
        customerId,
        customerName,
        customerPhone,
        customerEmail,
        orderAmount,
        xId,
        xSecret
      });
      
      const data = gatewayResponse.data;
      console.log('Payment Gateway Response:', data);  // Log the full response
      
      if (gatewayResponse.status === 200 && data?.formUrl) {
        return {
          payment_url: data.formUrl,  // URL to display the payment modal
        };
      } else {
        console.error('Payment initiation failed:', data);
        throw new Error('Payment initiation failed or formUrl missing');
      }
      
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error initiating transaction:', error);
    throw error;
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {

    const body = await req.json()
    const { 
      orderId,
      email,
      businessName,
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      price, 
      type 
    } = body;

    const xId = process.env.XID
    const xSecret = process.env.XSECRET

    // Call the payment gateway to initiate the transaction
    const result = await initiateTransaction(
      type, // type should be passed first
      price,
      orderId,
      email,
      businessName,
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      xId,
      xSecret
    );

    // Check if the result and payment_url are valid
    if (result && result.payment_url) {
      console.log(result.payment_url);
      return NextResponse.json({ payment_url: result.payment_url }, { status: 200 });
    } else {
      return NextResponse.json({ error: `Transaction initiation failed`, body: body }, { status: 400 });
    }
  } catch (error: unknown) {
    const err = error as AxiosError;
    console.error('Server error:', err.config?.data);
    return NextResponse.json({ message: err.config?.data }, { status: 500 });
  }
}
