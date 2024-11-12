const express = require("express");
const router = express.Router();
const cors = require("cors");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const {encrypt, decrypt} = require("../utils/encyptions")

require("dotenv").config();

const prisma = new PrismaClient();

// Middleware
router.use(cors());
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

// Default route
router.get("/", (req, res) => {
  res.send("Operations on user");
});

// Error handler
const errorHandler = (res, error, statusCode = 400) => {
  console.error(error);
  res.status(statusCode).json({ error: error.message });
};

// Request to create a user
router.post("/create_user", async (req, res) => {
  try {
    const { email, password, name, contact, panNumber, aadharNumber, accountNumber, ifsc, upi, isAdmin } = req.body;

    // Check if user already exists
    const exist = await prisma.user.findFirst({ where: { email } });

    if (exist) {
      return res.status(400).json({ message: "User already exists", user: exist });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password || "", 10);

    // Encrypt sensitive fields
    const encryptedData = {
      panNumber: encrypt(panNumber),
      aadharNumber: encrypt(aadharNumber),
      accountNumber: encrypt(accountNumber),
      ifsc: encrypt(ifsc),
      upi: encrypt(upi),
    };

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        contact,
        ...encryptedData,
        isAdmin,
      },
    });

    console.log(newUser);
    res.status(200).json(newUser);
  } catch (error) {
    errorHandler(res, error);
  }
});

// Request to retrieve user info
router.get("/get_user", async (req, res) => {
  try {
    const { email } = req.query;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Decrypt sensitive fields
    const decryptedUser = {
      ...user,
      panNumber: decrypt(user.panNumber),
      aadharNumber: decrypt(user.aadharNumber),
      accountNumber: decrypt(user.accountNumber),
      ifsc: decrypt(user.ifsc),
      upi: decrypt(user.upi),
    };

    res.status(200).json(decryptedUser);
  } catch (error) {
    errorHandler(res, error);
  }
});

// Request to update user info
router.put("/update_user", async (req, res) => {
  try {
    const {email, name, contact, panNumber, aadharNumber, accountNumber, ifsc, upi, password } = req.body;

    // Fetch the existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Decrypt sensitive fields
    const decryptedUser = {
      ...existingUser,
      panNumber: existingUser.panNumber ? decrypt(existingUser.panNumber) : "",
      aadharNumber: existingUser.aadharNumber ? decrypt(existingUser.aadharNumber) : "",
      accountNumber: existingUser.accountNumber ? decrypt(existingUser.accountNumber) : "",
      ifsc: existingUser.ifsc ? decrypt(existingUser.ifsc) : "",
      upi: existingUser.upi ? decrypt(existingUser.upi) : "",
    };

    // Encrypt updated values if provided, else retain existing values
    const updatedUser = {
      name: name || decryptedUser.name,
      contact: contact || decryptedUser.contact,
      panNumber: panNumber ? encrypt(panNumber) : existingUser.panNumber,
      aadharNumber: aadharNumber ? encrypt(aadharNumber) : existingUser.aadharNumber,
      accountNumber: accountNumber ? encrypt(accountNumber) : existingUser.accountNumber,
      ifsc: ifsc ? encrypt(ifsc) : existingUser.ifsc,
      upi: upi ? encrypt(upi) : existingUser.upi,
      password: password ? await bcrypt.hash(password, 10) : existingUser.password,
    };

    const result = await prisma.user.update({
      where: { email },
      data: updatedUser,
    });

    res.status(200).json(result);
  } catch (error) {
    errorHandler(res, error);
  }
});

// Request to delete user
router.delete("/delete_user", async (req, res) => {
  try {
    const { email } = req.query;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete associated integrations
    await prisma.integration.deleteMany({ where: { email } });

    // Delete the user from the database
    await prisma.user.delete({ where: { email } });

    res.status(200).json({ message: "User and associated integrations deleted successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
});

// Request to check KYC status
router.get("/check_kyc", async (req, res) => {
  try {
    const { email } = req.query;

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      return res.status(200).json({ message: false });
    }

    res.status(200).json({ message: existingUser.email === email });
  } catch (error) {
    errorHandler(res, error, 500);
  }
});

module.exports = router;
