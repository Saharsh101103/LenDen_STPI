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

function getBaseUrl() {
	if (typeof window !== "undefined") return window.location.origin;
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return `http://localhost:${process.env.PORT ?? 3000}`;
}

router.get("/", (req, res) => {
  res.send("Operations on refunds");
});

//API to create refund
router.post("/create_refund", async (req, res) => {
  const { refundId, orderId, customerEmail, email, x_id, x_secret } = req.body;

  const exists = await prisma.orders.findFirst({
    where: { orderId },
  });
  const order_exists = await prisma.refunds.findFirst({
    where: { refundId },
  });
  const header = exists
    ? await prisma.integration.findFirst({
        where: { businessName: exists.businessName },
      })
    : null;

  // Check if order exists
  if (!exists) {
    return res.status(404).json({ message: "Order Not Found" });
  }

  // Check if refund already exists
  if (order_exists) {
    return res.status(400).json({ message: "Refund already exists" });
  }

  // Check customer email matches
  if (exists.customerEmail !== customerEmail) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Registered and provided email are not linked!",
    });
  }

  // Validate headers
  if (!header || header.xid !== x_id || header.xsecret !== x_secret) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid headers. No or invalid X-id and X-secret provided!",
    });
  }

  // Check if email exists in the User table (or related table with foreign key)
  const userExists = await prisma.user.findUnique({
    where: { email },
  });
  if (!userExists) {
    return res.status(404).json({ error: "User with this email does not exist" });
  }

  try {
    const data = {
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
    const formUrl = `${getBaseUrl()}/process_refund/${refundId}`;
    res.status(200).json({
      message: "Refund initialized successfully",
      formUrl,  // Return the URL for processing
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post("/process_refund", async (req, res) => {
  const { refundId, accountNumber, ifsc } = req.body;

  try {
    const refund = await prisma.refunds.findFirst({
      where: { refundId },
    });
    const order = await prisma.orders.findFirst({
      where: { orderId: refund.orderId },
    });

    if (!refund) {
      res.status(404).json({ message: "Refund Not Found" });
    } else if (refund.status !== "PROCESSING") {
      res.status(400).json({ message: "Refund is not in a pending state" });
    } else {
      const user = await prisma.user.findFirst({
        where: { email: refund.email },
      });

      // Mocking the payout processing


      const useracc = await axios.post(process.env.BANK_URL, {
        UPI: decrypt(user.upi) || "",
        UPI_SUCCESS: true,
        payment_method: "UPI",
        orderAmount: order.orderAmount,
        transaction_type : "DEBIT"
      });

      
      console.log("User transaction success", useracc.data);

      if (useracc.data.success) {
        const customeracc = await axios.post(process.env.BANK_URL, {
          account_number: accountNumber,
          ifsc,
          orderAmount: order.orderAmount,
          transaction_type : "CREDIT"
        });
        console.log("Customer transaction success", customeracc.data);

        if (customeracc.data.success) {
          // Update refund status to SUCCESS
          const updatedRefund = await prisma.refunds.update({
            where: { refundId },
            data: { status: "SUCCESS" },
          });

          // Update user's balance
          await prisma.$executeRaw`UPDATE "User" SET "refund_amount" = "refund_amount" + ${order.orderAmount} WHERE "email" = ${order.email}`;

          res.status(200).json(updatedRefund);
        } else {
          res.status(400).json(customeracc.data);
        }
      } else {
        res.status(400).json(useracc.data);
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
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

router.get('/get_orders', async(req,res) => {
  const orders = await prisma.refunds.findMany({where: {email: req.query.email}})
  res.status(200).json(orders);
})

module.exports = router;