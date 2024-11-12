const express = require("express");
const router = express.Router();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {encrypt, decrypt} = require("../utils/encyptions");
const axios = require("axios");

require("dotenv").config();

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
function getBaseUrl() {
	if (typeof window !== "undefined") return window.location.origin;
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return `http://localhost:${process.env.PORT ?? 3000}`;
}

// Default route
router.get("/", (req, res) => {
  res.send("Operations on payouts");
});

// API to create payout
router.post("/create_payout", async (req, res) => {
  try {
    const { businessName, email, x_id, x_secret, payoutId, payoutAmount, customerId, customerName, customerPhone, customerEmail } = req.body;

    // Check if business exists
    const business = await prisma.integration.findFirst({ where: { businessName } });
    if (!business) return res.status(404).json({ message: "Business not found" });

    // Check if payout already exists
    const existingPayout = await prisma.payouts.findFirst({ where: { payoutId } });
    if (existingPayout) return res.status(400).json({ message: "Payout already exists" });

    // Validate email and credentials
    if (business.email !== email) {
      return res.status(401).json({ message: "Business and provided email are not linked!" });
    }
    if (business.xid !== x_id || business.xsecret !== x_secret) {
      return res.status(401).json({ message: "Invalid X-id or X-secret provided!" });
    }

    // Create new payout
    const payoutData = {
      email,
      businessName,
      payoutId,
      payoutAmount,
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      status: "PROCESSING",
    };

    const newPayout = await prisma.payouts.create({ data: payoutData });
    newPayout.payoutAmount = newPayout.payoutAmount.toString();

    const formUrl = `${getBaseUrl()}/payout/${payoutId}`;
    console.log(formUrl)


  res.status(200).json({
    message: "Order created successfully",
    formUrl, // Return the URL for the iframe
  })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to process payout
router.post("/process_payout", async (req, res) => {
  const { payoutId, accountNumber, ifsc, UPI_SUCCESS } = req.body;

  try {
    // Find payout by ID
    const payout = await prisma.payouts.findFirst({ where: { payoutId } });
    if (!payout) return res.status(404).json({ message: "Payout not found" });

    if (payout.status !== "PROCESSING") {
      return res.status(400).json({ message: "Payout is not in processing state" });
    }

    const user = await prisma.user.findFirst({ where: { email: payout.email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Mocking payout processing
    const debitResponse = await axios.post(process.env.BANK_URL, {
      UPI: decrypt(user.upi) || "",
      UPI_SUCCESS: UPI_SUCCESS || false,
      payment_method: "UPI",
      orderAmount: payout.payoutAmount,
      transaction_type : "DEBIT"
    });

    if (debitResponse.data.success !== true) {
      return res.status(400).json({ message: "Debit transaction failed" });
    }

    // Proceed with credit transaction to customer
    const creditResponse = await axios.post(process.env.BANK_URL, {
      account_number: accountNumber,
      ifsc,
      orderAmount: payout.payoutAmount,
      transaction_type : "CREDIT"
    });

    if (creditResponse.data.success !== true) {
      return res.status(400).json({ message: "Credit transaction failed" });
    }

    // Update payout status and user's payout amount
    const updatedPayout = await prisma.payouts.update({
      where: { payoutId },
      data: { status: "SUCCESS" },
    });

    await prisma.$executeRaw`UPDATE "User" SET "payout_amount" = "payout_amount" + ${payout.payoutAmount} WHERE "email" = ${payout.email}`;

    updatedPayout.payoutAmount = updatedPayout.payoutAmount.toString();
    res.status(200).json(updatedPayout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to verify/fetch payout
router.get("/verify_payout", async (req, res) => {
  try {
    const { payoutId, email, customerEmail } = req.query;

    const payoutDetails = await prisma.payouts.findUnique({ where: { payoutId } });
    if (!payoutDetails) return res.status(404).json({ message: "Payout not found" });

    if (payoutDetails.email === email || payoutDetails.customerEmail === customerEmail) {
      res.status(200).json({ payoutDetails });
    } else {
      res.status(401).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get_orders', async(req,res) => {
  const orders = await prisma.payouts.findMany({where: {email: req.query.email}})
  res.status(200).json(orders);
})

module.exports = router;
