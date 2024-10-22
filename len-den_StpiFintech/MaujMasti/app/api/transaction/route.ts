import { NextApiRequest, NextApiResponse } from 'next';

// Mock function to interact with your payment gateway (replace with actual implementation)
async function initiateTransaction(type: 'purchase' | 'withdraw', amount: number, userId: string) {
  // Call your payment gateway API with the transaction details
  const gatewayResponse = await fetch('https://your-payment-gateway.com/api/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type,
      amount,
      userId,
    }),
  });

  const data = await gatewayResponse.json();

  // The gateway should return a payment_url or success/failure status
  if (data.success) {
    return {
      payment_url: data.payment_url,  // URL to display the payment modal
    };
  } else {
    throw new Error('Payment initiation failed');
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { type, amount, userId } = req.body;

    // Call the payment gateway to initiate the transaction
    const result = await initiateTransaction(type, amount, userId);

    if (result.payment_url) {
      // Return the URL for the frontend to open a modal or new tab
      res.status(200).json({
        payment_url: result.payment_url,
      });
    } else {
      res.status(400).json({ error: 'Transaction initiation failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error});
  }
}
