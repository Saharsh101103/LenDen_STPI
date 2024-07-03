const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const user = require("./routes/user");
const integration = require(".//routes/integration");
const payments = require("./routes/payments");
const payouts = require("./routes/payouts");
const refunds = require("./routes/refunds");
const recurring = require("./routes/recurring");

require("dotenv").config();
// test

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Route for operation on user
app.use("/user", user);

//Once the user is created,
//User needs to integrate

app.use("/integration", integration);

//When integration is done, user can now createOrder(Payment), createBenificiary(Withdral), createRequest(Refund)
app.use("/payment", payments); //For payment
app.use("/payout", payouts); //For payout
app.use("/refund", refunds); //For refund
app.use("/recurring", recurring); //For refund

app.get("/orderCount",async(req, res) => {
  const count = await prisma.orders.count({where: {email: req.query.email}});
  res.status(200).json(count);
})

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
