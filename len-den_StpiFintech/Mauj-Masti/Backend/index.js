const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const user = require("./routes/user")

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/user",user)


app.listen(10000, () => {
  console.log("Server is running on port 10000");
});
