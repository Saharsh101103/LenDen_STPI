const express = require("express");
const router = express.Router();
const cors = require("cors");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const { error } = require("console");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const {encrypt, decrypt} = require("../utils/encyptions")

require("dotenv").config();

router.use(cors());
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.get("/", (req, res) => {
  res.send("Operations on user");
});


// Request to create User

router.post('/create_user', async (req, res) => {
  const exist = await prisma.user.findFirst({
    where: { email: req.body.email }
  });

  if (exist) {
    return res.status(400).json({ message: "User already exists", user: exist });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password || "", 10);
          // Encrypt other sensitive fields
    const encryptedPanNumber = encrypt(req.body.panNumber);
    const encryptedAadharNumber = encrypt(req.body.aadharNumber);
    const encryptedAccountNumber = encrypt(req.body.accountNumber);
    const encryptedIfsc = encrypt(req.body.ifsc);
    const encryptedUpi = encrypt(req.body.upi);
    


    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name,
          contact: req.body.contact,
          panNumber: encryptedPanNumber,
          aadharNumber: encryptedAadharNumber,
          accountNumber: encryptedAccountNumber,
          ifsc: encryptedIfsc,
          upi: encryptedUpi,
          isAdmin: req.body.isAdmin
      }
    });
    console.log(user)

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message});
  }
});

//Request to retrieve user info



router.get('/get_user', async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: req.query.email }
      });
  
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
        upi: decrypt(user.upi)
      };
  
      res.status(200).json(decryptedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

//Request to update user_info

router.put('/update_user', async (req, res) => {
    try {
      const Useremail = req.query.email
  
      // Fetch the existing user
      const existingUser = await prisma.user.findUnique({
        where: { email: Useremail }
      });
  
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Decrypt sensitive fields
      const decryptedUser = {
        ...existingUser,
        panNumber: existingUser.panNumber ? decrypt(existingUser.panNumber) : '',
        aadharNumber: existingUser.aadharNumber ? decrypt(existingUser.aadharNumber) : '',
        accountNumber: existingUser.accountNumber ? decrypt(existingUser.accountNumber) : '',
        ifsc: existingUser.ifsc ? decrypt(existingUser.ifsc) : '',
        upi: existingUser.upi ? decrypt(existingUser.upi) : ''
      };
  
      // Update the fields with new values from the request body
      const updatedUser = {
        ...decryptedUser,
        name: req.body.name || decryptedUser.name,
        contact: req.body.contact || decryptedUser.contact,
        panNumber: req.body.panNumber ? encrypt(req.body.panNumber) : existingUser.panNumber,
        aadharNumber: req.body.aadharNumber ? encrypt(req.body.aadharNumber) : existingUser.aadharNumber,
        accountNumber: req.body.accountNumber ? encrypt(req.body.accountNumber) : existingUser.accountNumber,
        ifsc: req.body.ifsc ? encrypt(req.body.ifsc) : existingUser.ifsc,
        upi: req.body.upi ? encrypt(req.body.upi) : existingUser.upi,
      };
  
      // Update the user in the database
      const result = await prisma.user.update({
        where: { email: Useremail },
        data: {
          name: updatedUser.name,
          contact: updatedUser.contact,
          panNumber: updatedUser.panNumber,
          aadharNumber: updatedUser.aadharNumber,
          accountNumber: updatedUser.accountNumber,
          ifsc: updatedUser.ifsc,
          upi: updatedUser.upi,
          password: await bcrypt.hash(req.body.password, 10)
        }
      });
  
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete the user
  router.delete('/delete_user', async (req, res) => {
    try {
      const userEmail = req.query.email;
  
      // Check if the user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userEmail }
      });
  
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Delete the user from the database
      await prisma.user.delete({
        where: { email: userEmail }
      });
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/check_kyc',async(req,res)=> {
    const userEmail = req.query.email;
  
      // Check if the user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userEmail }
      });
    console.log(existingUser)
    if(existingUser == null){
      res.status(200).json({message: false})
    }
    else if(existingUser.email == req.query.email){
      res.status(200).json({message: true})
    }
    else{
      res.status(500).json({message: "Internal Server Error"})
    }
  })



module.exports = router;
