const express = require("express");
const router = express.Router();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { encrypt, decrypt } = require("../utils/encyptions");
const axios = require("axios");

require("dotenv").config();

router.use(cors());
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.get("/", (req, res) => {
  res.send("Operations on payments");
});

//API to create order

router.post("/create_order", async (req, res) => {
  const { orderId, email, businessName, customerId, customerName, customerPhone, customerEmail, orderAmount } = req.body;

  const exists = await prisma.integration.findFirst({
    where: { businessName },
  });

  const order_exists = await prisma.orders.findFirst({
    where: { orderId },
  });

  if (!exists) {
    res.status(404).json({ message: "Not Found" });
  } else if (order_exists) {
    res.status(400).json({ message: "Order already exists" });
  } else if (exists.email != email) {
    res.status(401).json({
      error: "Unauthorised",
      message: "Business and provided email are not linked!",
    });
  } else {
    try {
      const order = await prisma.orders.create({
        data: {
          email,
          businessName,
          orderId,
          customerId,
          customerName,
          customerPhone,
          customerEmail,
          orderAmount,
          status: "PROCESSING",
        },
      });

      res.status(200).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
});

//API to complete payment
router.post("/process_order", async (req, res) => {
  const { orderId, payment_method, dc_num, cc_num, cvv, expiry, Nb_username, Nb_password, UPI, UPI_SUCCESS, OTP } = req.body;
  try {
    const order = await prisma.orders.findFirst({
      where: { orderId },
    });
  
    const user = await prisma.user.findFirst({
      where: {email: order.email}
    })
  
    if (!order) {
      res.status(404).json({ message: "Order Not Found" });
    } else if (order.status !== "PROCESSING") {
      res.status(400).json({ message: "Order is not in processing state" });
    } else {
      try {
        let data = { status: "SUCCESS" }; // Default to success, modify as necessary
  
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
        console.log("module 1 success")
  
        // Mocking the payment processing
        //Connecting to bank to process the payement
        try {
          let customeracc = await axios.post(process.env.BANK_URL,{
            "cc_num" : cc_num || "",
            "dc_num" : dc_num || "",
            "expiry": expiry || "",
            "cvv": cvv || "",
            "OTP": OTP || "",
            "UPI": UPI || "",
            "UPI_SUCCESS" : UPI_SUCCESS || "",
            "NB_username" : Nb_username,
            "NB_password" : Nb_password, 
            "payment_method": payment_method,
            "orderAmount" : order.orderAmount,
            "transaction_type" : "DEBIT"
          })
          console.log(customeracc.data, "module 2 success")
    
          if(customeracc.data.message == 'Transaction Successfull'){
            console.log("prep mod 3")
            let useracc = await axios.post(process.env.BANK_URL,{
              "account_number" : decrypt(user.accountNumber),
              "ifsc" : decrypt(user.ifsc),
              "orderAmount" : order.orderAmount,
              "transaction_type" : "CREDIT"
            })
          console.log(useracc.data, "module 3 success")
          
          if(useracc.data.success){ 
            await prisma.$executeRaw`UPDATE "User" SET "payment_amount" = "payment_amount" + ${order.orderAmount} WHERE "email" = ${order.email}`;
            
            const updatedOrder = await prisma.orders.update({
              where: { orderId },
              data,
            });
            
            const responseOrder = {
              ...updatedOrder,
              orderAmount: updatedOrder.orderAmount.toString(),
            };
            
            res.status(200).json(responseOrder);
          }
          else{
            res.status(400).json(useracc.data.message)
          }
        }
          else{
            res.status(400).json(customeracc.data.message)
    
          }
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
       
        } catch (error) {
          console.log({ error: error.message });
        }
      }
  } catch (error) {
    res.status(400).json({error: error.message})
  }

  
  });

module.exports = router;


//API to verify/fetch order

  router.get('/verify_order', async (req, res) => {
    try {
      const details = await prisma.orders.findUnique({
        where: { orderId: req.query.orderId }
      });
  
      if (details) {
        const decryptedUser = {
          ...details,
          cc_num: details.cc_num ? decrypt(details.cc_num) : null,
          dc_num: details.dc_num ? decrypt(details.dc_num) : null,
          expiry: details.expiry ? decrypt(details.expiry) : null,
          Nb_username: details.Nb_username ? decrypt(details.Nb_username) : null,
          Nb_password: details.Nb_password ? decrypt(details.Nb_password) : null,
          UPI: details.UPI ? decrypt(details.UPI) : null
        };
        details.orderAmount = details.orderAmount.toString();
  
        if (details.email === req.query.email || details.customerEmail === req.query.customerEmail) {
          res.status(200).json({ orderDetails : decryptedUser});
        } else {
          res.status(401).json({ message: 'Unauthorized' });
        }
      } else {
        res.status(404).json({ message: 'Not Found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/get_orders', async(req,res) => {
    const orders = await prisma.orders.findMany({where: {email: req.query.email}})
    res.status(200).json(orders);
  })


module.exports = router;
