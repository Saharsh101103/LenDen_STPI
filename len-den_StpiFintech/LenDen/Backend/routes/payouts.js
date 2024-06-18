const express = require("express");
const router = express.Router();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { encrypt, decrypt } = require("../utils/encyptions");
const { default: axios } = require("axios");

require("dotenv").config();

router.use(cors());
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.get("/", (req, res) => {
  res.send("Operations on payouts");
});

//API to create payout

router.post("/create_payout", async (req, res) => {
  const exists = await prisma.integration.findFirst({
    where: { businessName: req.body.businessName },
  });
  const payout_exists = await prisma.payouts.findFirst({
    where: { payoutId: req.body.payoutId },
  });

  if (!exists) {
    res.status(404).json({ message: "Not Found" });
  } else if (payout_exists) {
    res.status(400).json({ message: "Payout already exists" });
  } else if (exists.email != req.body.email) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Business and provided email are not linked!",
    });
  } else if (
    exists.xid != req.body.x_id ||
    exists.xsecret != req.body.x_secret
  ) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Invalid headers. No or invalid X-id and X-secret provided!",
    });
  } else {
    const {
      email,
      businessName,
      payoutId,
      payoutAmount,
      customerId,
      customerName,
      customerPhone,
      customerEmail,
    } = req.body;

    try {
      const data = {
        email,
        businessName,
        payoutId,
        payoutAmount,
        customerId,
        customerName,
        customerPhone,
        customerEmail,
        status: 'PROCESSING',
      };

      const payout = await prisma.payouts.create({ data });

      const responsePayout = {
        ...payout,
        payoutAmount: payout.payoutAmount.toString(),
      };

      res.status(200).json(responsePayout);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
});

//API to complete payout
router.post("/process_payout", async (req, res) => {
  const { payoutId, accountNumber, ifsc, UPI_SUCCESS } = req.body;

  const payout = await prisma.payouts.findFirst({
    where: { payoutId },
  });

  if (!payout) {
    res.status(404).json({ message: "Payout Not Found" });
  } else if (payout.status != "PROCESSING") {
    res.status(400).json({ message: "Payout is not in processing state" });
  } else {
    try {
      let data = { status: "SUCCESS" };
      const user = await prisma.user.findFirst({
        where: {email: payout.email}
      })
      // Mocking the payout processing
      const useracc = await axios.post('http://localhost:9000/debit',{
        "UPI": decrypt(user.upi) || "",
        "UPI_SUCCESS" : true || "",
        "payment_method": "UPI",
        "orderAmount" : payout.payoutAmount
      })
      console.log("User transaction success", useracc.data)

      if(useracc.data.message == "Transaction Successfull"){
        const customeracc = await axios.post('http://localhost:9000/credit',{
        "account_number" : accountNumber,
        "ifsc" : ifsc,
        "orderAmount" : payout.payoutAmount
        })
      console.log("customer transaction success", customeracc.data) 
        if(customeracc.data.message == "Transaction Successfull"){
          const updatedPayout = await prisma.payouts.update({
            where: { payoutId },
            data,
          });
    
          // Update user's balance
          await prisma.$executeRaw`UPDATE "User" SET "payout_amount" = "payout_amount" + ${payout.payoutAmount} WHERE "email" = ${payout.email}`;
    
          const responsePayout = {
            ...updatedPayout,
            payoutAmount: updatedPayout.payoutAmount.toString(),
          };
    
          res.status(200).json(responsePayout);
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


//API to verify/fetch payout
router.get("/verify_payout", async (req, res) => {
  try {
    const details = await prisma.payouts.findUnique({
      where: { payoutId: req.query.payoutId },
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
