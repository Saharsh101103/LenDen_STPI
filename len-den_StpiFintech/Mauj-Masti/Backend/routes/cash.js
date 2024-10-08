const express = require("express");
const router = express.Router();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()


require("dotenv").config();

router.use(cors());
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.get("/", (req, res) => {
  res.send("Operations on cash");
});

router.get('/balance', async(req, res) => {
    try {
        const user = await prisma.user.findFirst({
            where: {username: req}
        })
    } catch (error) {
        // testing kshitiz
    }
})

module.exports = router;