const express = require("express");
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require("dotenv").config();

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

function generateRandomString(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset[randomIndex];
    }
    return randomString;
  }
  
  function generateXid(){
    // Assuming a length of 16 characters for xid
    return generateRandomString(16);
  }
  
  function generateXsecret() {
    // Assuming a length of 32 characters for xsecret
    return generateRandomString(32);
  }

router.get("/", (req, res) => {
    res.send("Operations on integration");
});


// API to create integration
router.post('/create_integration', async (req, res) => {
    const exists = await prisma.integration.findFirst({
        where: {businessName: req.body.businessName}
    })
    if(exists){
        res.status(400).json({message: "Integration with same Business already exists", details: exists})
    }
    else{
        
        const x_id = await generateXid();
        const x_secret = await generateXsecret();
        try {
            const integration = await prisma.integration.create({
                data: {
                    email: req.body.email, //User's email
                    businessName: req.body.businessName,
                    domain: req.body.domain,
                    xid: x_id,
                    xsecret: x_secret        },
                });
                res.status(200).json(integration);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }
        });
  
  // API to update xid and x_sec

  router.put('/update_integration', async (req,res) => {
    const exists = await prisma.integration.findFirst({
      where: {businessName: req.body.businessName}
  })
  if(!exists){
      res.status(404).json({message: "Not Found"})
  }
  else{
    const x_id = await generateXid();
    const x_secret = await generateXsecret();
    try {
        const integration = await prisma.integration.update({
          where: {businessName: req.body.businessName},
          data: {
            xid: x_id,
            xsecret: x_secret
          }
        })
        res.status(200).json({message: "Success", integration})
    } catch (error) {
      res.status(400).json(error)
    }
  }
  })


//To get info about an integration

router.get('/get_integration', async(req,res)=> {
  const exists = await prisma.integration.findFirst({
    where: {businessName: req.query.businessName}
})
if(!exists){
    res.status(404).json({message: "Not Found"})
}
else{
  res.status(200).json(exists)
}
})

// To delete a perticular integration

router.delete('/delete_integration', async(req,res)=> {
  const exists = await prisma.integration.findFirst({
    where: {businessName: req.body.businessName}
})
if(!exists){
    res.status(404).json({message: "Not Found"})
}
else{
  try {
    const object = prisma.integration.delete({
      where: {businessName: req.body.businessName}
    })
    res.status(200).json({message: "Success"})
  } catch (error) {
    res.status(400).json(error)
  }
}
})
        
module.exports = router;
