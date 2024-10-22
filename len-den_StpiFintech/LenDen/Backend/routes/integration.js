const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Utility functions for generating random strings
const generateRandomString = (length) => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join("");
};

const generateXid = () => generateRandomString(16); // Generate 16-character xid
const generateXsecret = () => generateRandomString(32); // Generate 32-character xsecret

// Root route
router.get("/", (req, res) => {
  res.send("Operations on integration");
});

// API to create an integration
router.post("/create_integration", async (req, res) => {
  const { businessName, email, domain } = req.body;

  if (!businessName || !email || !domain) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if the integration already exists
    const existingIntegration = await prisma.integration.findFirst({ where: { businessName } });

    if (existingIntegration) {
      return res.status(200).json({
        message: "Integration with the same Business already exists",
        details: existingIntegration,
      });
    }

    // Create new integration
    const newIntegration = await prisma.integration.create({
      data: {
        email,
        businessName,
        domain,
        xid: generateXid(),
        xsecret: generateXsecret(),
      },
    });

    res.status(201).json(newIntegration);
  } catch (error) {
    console.error("Error creating integration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API to update xid and xsecret of an integration
router.put("/update_integration", async (req, res) => {
  const { businessName, domain } = req.body;

  if (!businessName) {
    return res.status(400).json({ error: "Business name is required" });
  }

  try {
    // Check if the integration exists
    const integration = await prisma.integration.findFirst({ where: { businessName } });

    if (!integration) {
      return res.status(404).json({ message: "Integration not found" });
    }

    // Update the integration details
    const updatedIntegration = await prisma.integration.update({
      where: { businessName },
      data: {
        xid: generateXid(),
        xsecret: generateXsecret(),
        domain: domain || integration.domain, // Update domain if provided
      },
    });

    res.status(200).json({ message: "Integration updated successfully", integration: updatedIntegration });
  } catch (error) {
    console.error("Error updating integration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API to retrieve all integrations for a user (by email)
router.get("/get_integration", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Fetch integrations associated with the email
    const integrations = await prisma.integration.findMany({ where: { email } });

    if (integrations.length === 0) {
      return res.status(404).json({ message: "No integrations found for this email" });
    }

    res.status(200).json(integrations);
  } catch (error) {
    console.error("Error retrieving integrations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API to delete an integration
router.delete("/delete_integration", async (req, res) => {
  const { businessName } = req.query;

  if (!businessName) {
    return res.status(400).json({ error: "Business name is required" });
  }

  try {
    // Check if the integration exists
    const integration = await prisma.integration.findFirst({ where: { businessName } });

    if (!integration) {
      return res.status(404).json({ message: "Integration not found" });
    }

    // Delete the integration
    await prisma.integration.delete({ where: { businessName } });

    res.status(200).json({ message: "Integration deleted successfully" });
  } catch (error) {
    console.error("Error deleting integration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
