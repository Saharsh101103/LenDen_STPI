const express = require("express");
const router = express.Router();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { encrypt, decrypt } = require("../utils/encyptions");
const axios = require('axios')

require("dotenv").config();

router.use(cors());
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.get("/", (req, res) => {
  res.send("Operations on refunds");
});

//API to create refund
router.post("/create_refund", async (req, res) => {
  const exists = await prisma.orders.findFirst({
    where: { orderId: req.body.orderId },
  });
  const order_exists = await prisma.refunds.findFirst({
    where: { refundId: req.body.refundId },
  });
  const header = await prisma.integration.findFirst({
    where: { businessName: exists.businessName },
  });

  if (!exists) {
    res.status(404).json({ message: "Not Found" });
  } else if (order_exists) {
    res.status(400).json({ message: "Refund already exists" });
  } else if (exists.customerEmail != req.body.customerEmail) {
    res.status(401).json({
      error: "Unauthorised",
      message: "Registered and provided email are not linked!",
    });
  } else if (
    header.xid != req.body.x_id ||
    header.xsecret != req.body.x_secret
  ) {
    res.status(401).json({
      error: "Unauthorised",
      message: "Invalid headers. NO or invalid X-id and X-secret provided!",
    });
  } else {
    const { email, refundId, orderId, customerEmail, accountNumber, ifsc } =
      req.body;

    // Validate required fields for the selected payment method
    try {
      let data = {
        email,
        refundId,
        orderId,
        customerEmail,
        businessName: exists.businessName,
        refundAmount: exists.orderAmount,
        customerId: exists.customerId,
        customerPhone: exists.customerPhone,
        customerEmail: exists.customerEmail,
        customerName: exists.customerName,
      };

      const payout = await prisma.refunds.create({ data });
      const user = await prisma.user.findFirst({
        where: {email: payout.email}
      })
      // Mocking the payout processing
      const useracc = await axios.post('http://localhost:9000/debit',{
        "UPI": decrypt(user.upi) || "",
        "UPI_SUCCESS" : true || "",
        "payment_method": "UPI",
        "orderAmount" : exists.orderAmount
      })
      console.log("User transaction success", useracc.data)

      if(useracc.data.message == "Transaction Successfull"){
        const customeracc = await axios.post('http://localhost:9000/credit',{
        "account_number" : accountNumber,
        "ifsc" : ifsc,
        "orderAmount" : exists.orderAmount
        })
      console.log("customer transaction success", customeracc.data) 
      if(customeracc.data.message == "Transaction Successfull"){

        const updatedRefund = await prisma.refunds.update({
          where: { refundId: refundId },
          data: { status: "SUCCESS" }, 
        });

        // Update user's balance
         await prisma.$executeRaw`UPDATE "User" SET "refund_amount" = "refund_amount" + ${exists.orderAmount} WHERE "email" = ${exists.email}`;

         res.status(200).json(updatedRefund);
      }
      else{
        res.status(400).json(customeracc.data)
      }
    }
    else{
      res.status(400).json(useracc.data)
      
    }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
});

//API to verify/fetch refund
router.get("/verify_refund", async (req, res) => {
  try {
    if (req.query.refundId) {
      const details = await prisma.refunds.findUnique({
        where: { refundId: req.query.refundId },
      });

      if (details) {
        if (
          details.email === req.query.email ||
          details.customerEmail === req.query.customerEmail
        ) {
          res.status(200).json({ payoutDetails: details });
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
      } else {
        res.status(404).json({ message: "Not Found" });
      }
    } else if (req.query.orderId) {
      const details = await prisma.refunds.findFirst({
        where: { orderId: req.query.orderId },
      });

      if (details) {
        if (
          details.email === req.query.email ||
          details.customerEmail === req.query.customerEmail
        ) {
          res.status(200).json({ payoutDetails: details });
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
      } else {
        res.status(404).json({ message: "Not Found" });
      }
    } else {
      throw new Error("OrderId or RefundId is neccessary!");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
