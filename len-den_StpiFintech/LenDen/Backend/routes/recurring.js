const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { encrypt, decrypt } = require("../utils/encyptions");


//API to create new Plan
router.post("/create_plan", async (req, res) => {
  const exists = await prisma.integration.findFirst({
    where: { businessName: req.body.businessName },
  });
  const order_exists = await prisma.plan.findFirst({
    where: { planId: req.body.planId },
  });

  if (!exists) {
    res.status(404).json({ message: "Not Found" });
  } else if (order_exists) {
    res.status(400).json({ message: "Plan already exists" });
  } else if (exists.email != req.body.email) {
    res.status(401).json({
      error: "Unauthorised",
      message: "Business and provided email are not linked!",
    });
  } else if (
    exists.xid != req.body.x_id ||
    exists.xsecret != req.body.x_secret
  ) {
    res.status(401).json({
      error: "Unauthorised",
      message: "Invalid headers. NO or invalid X-id and X-secret provided!",
    });
  }
  else{
      
      const {
          planId,
          email,
          businessName,
          name,
          price,
          interval,
          intervalCount,
        } = req.body;
        
        try {
            const plan = await prisma.plan.create({
      data: {
        planId,
        email,
        businessName,
        name,
        price,
        interval,
        intervalCount,
    },
});
res.status(200).json(plan);
} catch (error) {
    res.status(400).json({ error: error.message });
}
}
});

//API to get plan details
router.get("/get_plan", async (req, res) => {
    try {
      const details = await prisma.plan.findUnique({
        where: { planId: req.query.planId },
      });
  
      if (details) {
        if (
          details.email === req.query.email
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

//API to create new subscription
router.post("/create_subscription", async (req, res) => {
    const { userId, planId } = req.body;
  
    try {
      const plan = await prisma.plan.findUnique({
        where: { planId: planId },
      });
  
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
  
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + plan.intervalCount);
  
      const exists = await prisma.integration.findFirst({
        where: { businessName: req.body.businessName },
      });
      const order_exists = await prisma.subscription.findFirst({
        where: { orderId: req.body.orderId },
      });
    
      if (!exists) {
        res.status(404).json({ message: "Not Found" });
      } else if (order_exists) {
        res.status(400).json({ message: "Subscription already exists" });
      } else if (exists.email != req.body.email) {
        res.status(401).json({
          error: "Unauthorised",
          message: "Business and provided email are not linked!",
        });
      } else if (
        exists.xid != req.body.x_id ||
        exists.xsecret != req.body.x_secret
      ) {
        res.status(401).json({
          error: "Unauthorised",
          message: "Invalid headers. NO or invalid X-id and X-secret provided!",
        });
      } else {
        const {
          email,
          businessName,
          orderId,
          planId,
          orderAmount,
          payment_method,
          dc_num,
          cc_num,
          x_id,
          x_secret,
          cvv,
          expiry,
          Nb_username,
          Nb_password,
          UPI,
          UPI_SUCCESS,
          customerId,
          customerName,
          customerPhone,
          customerEmail,
          OTP,
        } = req.body;
    
        // Validate required fields for the selected payment method
        try {
          let data = {
            email,
            businessName,
            planId,
            orderId,
            orderAmount: plan.price,
            payment_method,
            customerId,
            customerName,
            customerPhone,
            customerEmail,
            nextBillingDate: nextBillingDate
          };
    
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
            case "UPI":
              if (!UPI || !UPI_SUCCESS) {
                throw new Error("UPI ID is required");
              }
              data.UPI = encrypt(UPI);
              break;
            default:
              throw new Error("Invalid payment method");
          }
    
          const order = await prisma.subscription.create({ data });
          
            const updatedOrder = await prisma.subscription.update({
              where: { orderId: orderId },
              data: { status: "ACTIVE" }, //mocking transaction success
            });
    
    
            const responseOrder = {
              ...updatedOrder,
              orderAmount: updatedOrder.orderAmount.toString(),
            };
      
            res.status(200).json(responseOrder);
          } catch (error) {
            res.status(400).json({ error: error.message });
          }
        }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

router.put('/cancel_subscription',async(req,res) => {
    
    try {
        const details = await prisma.subscription.findUnique({
          where: { orderId: req.body.orderId },
        });
    
        if (details) {
          if (
            details.email === req.body.email ||
            details.customerEmail === req.body.customerEmail
          ) {
           const newDetails =  await prisma.subscription.update(
                {
                    where: {orderId: req.body.orderId},
                    data: {status: "CANCELED"}
                }
            )
            res.status(200).json({ subscriptionDetails: newDetails });
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

router.get("/verify_subscription", async (req, res) => {
    try {
      const details = await prisma.subscription.findUnique({
        where: { orderId: req.query.orderId },
      });
  
      if (details) {
        if (
          details.email === req.query.email ||
          details.customerEmail === req.query.customerEmail
        ) {
          res.status(200).json({ subscriptionDetails: details });
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
