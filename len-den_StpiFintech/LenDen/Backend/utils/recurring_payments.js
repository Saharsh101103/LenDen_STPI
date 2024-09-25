const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();

    const subscriptions = await prisma.subscription.findMany({
      where: {
        nextBillingDate: {
          lte: today,
        },
        status: 'ACTIVE',
      },
    });

    for (const subscription of subscriptions) {
      const { orderId, customerId, plan, nextBillingDate, orderAmount, payment_method, Nb_password,Nb_username, cc_num,dc_num,expiry } = subscription;

      const user = await prisma.user.findFirst({
        where: {email: subscription.email}
      })
      let customeracc = await axios.post(process.env.BANK_URL,{
        "UPI": UPI || "",
        "UPI_SUCCESS" : true,
        "payment_method": "UPI",
        "orderAmount" : orderAmount,
        "transaction_type" : "DEBIT"
      })
      console.log(customeracc.data, "module 2 success")

      if(customeracc.data.message == 'Transaction Successfull'){
        console.log("prep mod 3")
        let useracc = await axios.post(process.env.BANK_URL,{
          "account_number" : decrypt(user.accountNumber),
          "ifsc" : decrypt(user.ifsc),
          "orderAmount" : orderAmount,
          "transaction_type" : "CREDIT"
        })
      console.log(useracc.data, "module 3 success")
      
      if(useracc.data.success){ 
        const paymentStatus = 'SUCCESS'; // Assume the payment is successful

        // Create a record of the payment
          let data = {
              email : subscription.email,
              businessName : subscription.businessName,
              orderId : subscription.orderId,
              orderAmount : subscription.orderAmount,
              payment_method : subscription.payment_method,
              customerId : subscription.customerId,
              customerName : subscription.customerName,
              customerPhone : subscription.customerPhone,
              customerEmail : subscription.customerEmail,
              status : paymentStatus
          }
          switch (payment_method) {
              case "DEBITCARD":
                if (!dc_num || !cvv || !expiry || !OTP) {
                  throw new Error("Debit Card details are required");
                }
                data.dc_num = encrypt(dc_num);
                data.expiry = encrypt(expiry);
                break;
              case "CREDITCARD":
                if (!cc_num || !cvv || !expiry || !OTP) {
                  throw new Error("Credit Card details are required");
                }
                data.cc_num = encrypt(cc_num);
                data.expiry = encrypt(expiry);
      
                break;
              case "NETBANKING":
                if (!Nb_username || !Nb_password || !OTP) {
                  throw new Error("Net Banking details are required");
                }
                data.Nb_username = encrypt(Nb_username);
                data.Nb_password = encrypt(Nb_password);
                break;
              case "UPI":
                if (!UPI || !UPI_SUCCESS) {
                  throw new Error("UPI ID is required");
                }
                data.UPI = encrypt(UPI);
                break;
              default:
                throw new Error("Invalid payment method");
            }
  
            await prisma.orders.create({ data });
      }
      else{
        throw new Error(useracc.data)
      }
    }
    else{
      throw new Error(customeracc.data)
    }
        
     //update user's balance
     await prisma.$executeRaw`UPDATE "User" SET "payout_amount" = "payout_amount" + ${payout.payoutAmount} WHERE "email" = ${payout.email}`;

      if (paymentStatus === 'SUCCESS') {
        // Update the next billing date
        const newBillingDate = new Date(nextBillingDate);
        newBillingDate.setMonth(newBillingDate.getMonth() + plan.intervalCount);

        await prisma.subscription.update({
          where: { orderId: orderId },
          data: { nextBillingDate: newBillingDate },
        });
      } else {
        // Handle payment failure (e.g., update subscription status)
        await prisma.subscription.update({
          where: { orderId: orderId },
          data: { status: 'PAST_DUE' },
        });
      }
    }
  } catch (error) {
    console.error('Error processing subscriptions:', error);
  }
});
