const express = require("express");
const app = express()
const cors = require("cors");


app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);


//Sample user account
let user_account = {
    account_holder: "user",
    account_number: "23122204240",
    ifsc: "LENDEN00010",
    cc_num: "2211332244335544",
    dc_num: "4455334422331122",
    cvv: "772",
    expiry: "11/27",
    UPI: "user@lenden",
    OTP: "111000",
    NB_username: "useracc",
    NB_password: "user@123456",
    balance: 20000
}

//Sample customer account
let customer_account = {
    account_holder: "customer",
    account_number: "100020000",
    ifsc: "LENDEN01101",
    cc_num: "100000200000",
    dc_num: "200000100000",
    cvv: "772",
    expiry: "11/27",
    UPI: "customer@lenden",
    OTP: "111000",
    NB_username: "customeracc",
    NB_password: "customer@123456",
    balance: 10000
}

//Function to identify account
function identify_account(body){
    let account = null
    if(body.cc_num == user_account.cc_num || body.dc_num == user_account.dc_num || body.UPI == user_account.UPI || body.NB_username == user_account.NB_username || body.account_number == user_account.account_number){
        account = user_account
    }
    else if(body.cc_num == customer_account.cc_num || body.dc_num == customer_account.dc_num || body.UPI == customer_account.UPI || body.NB_username == customer_account.NB_username || body.account_number == customer_account.account_number){
        account = customer_account
    }
    else{
        account = "unidentified"
    }
    return account;
}

//API to debit amount
app.post('/debit', async(req,res) => {
    const account = identify_account(req.body)
    if(account == "unidentified"){
        res.status(404).json({message: "Account does not exist"})
    }
    else if(account == user_account){
        if(req.body.payment_method == "DEBITCARD"){
            if(req.body.dc_num == account.dc_num && req.body.expiry == account.expiry && req.body.cvv == account.cvv && req.body.OTP == account.OTP){
                if(req.body.orderAmount < account.balance || req.body.orderAmount == account.balance){
                    user_account.balance = user_account.balance - req.body.orderAmount
                    res.status(200).json({success: true, message: "Transaction Successfull", user_account})
                }
                else{
                    res.status(400).json({message: "Transaction failed, due to insufficient balance"})
                }
            }
            else{
                res.status(401).json({message: "Transaction failed, wrong credentials provided"})
            }
        }
        else if(req.body.payment_method == "CREDITCARD"){
            if(req.body.cc_num == account.cc_num && req.body.expiry == account.expiry && req.body.cvv == account.cvv && req.body.OTP == account.OTP){
                if(req.body.orderAmount < account.balance || req.body.orderAmount == account.balance){
                    user_account.balance = user_account.balance - req.body.orderAmount
                    res.status(200).json({success: true, message: "Transaction Successfull", user_account})
                }
                else{
                    res.status(400).json({message: "Transaction failed, due to insufficient balance"})
                }
            }
            else{
                res.status(401).json({message: "Transaction failed, wrong credentials provided"})
            }
        }
        else if(req.body.payment_method == "NETBANKING"){
            if(req.body.NB_username == account.NB_username && req.body.NB_password == account.NB_password && req.body.OTP == account.OTP){
                if(req.body.orderAmount < account.balance || req.body.orderAmount == account.balance){
                    user_account.balance = user_account.balance - req.body.orderAmount
                    res.status(200).json({success: true, message: "Transaction Successfull", user_account})
                }
                else{
                    res.status(400).json({message: "Transaction failed, due to insufficient balance"})
                }
            }
            else{
                res.status(401).json({message: "Transaction failed, wrong credentials provided"})
            }
        }
        else if(req.body.payment_method == "UPI"){
            if(req.body.UPI == account.UPI && req.body.UPI_SUCCESS){
                if(req.body.orderAmount < account.balance || req.body.orderAmount == account.balance){
                    user_account.balance = user_account.balance - req.body.orderAmount
                    res.status(200).json({success: true, message: "Transaction Successfull", user_account})
                }
                else{
                    res.status(400).json({message: "Transaction failed, due to insufficient balance"})
                }
            }
            else{
                res.status(401).json({message: "Transaction failed, wrong credentials provided"})
            }
        }
        else{
            res.status(400).json({message: "Invalid payment method"})
        }
    }
    else if(account == customer_account){
        if(req.body.payment_method == "DEBITCARD"){
            if(req.body.dc_num == account.dc_num && req.body.expiry == account.expiry && req.body.cvv == account.cvv && req.body.OTP == account.OTP){
                if(req.body.orderAmount < account.balance || req.body.orderAmount == account.balance){
                    customer_account.balance = customer_account.balance - req.body.orderAmount
                    res.status(200).json({success: true, message: "Transaction Successfull", customer_account})
                }
                else{
                    res.status(400).json({message: "Transaction failed, due to insufficient balance"})
                }
            }
            else{
                res.status(401).json({message: "Transaction failed, wrong credentials provided"})
            }
        }
        else if(req.body.payment_method == "CREDITCARD"){
            if(req.body.cc_num == account.cc_num && req.body.expiry == account.expiry && req.body.cvv == account.cvv && req.body.OTP == account.OTP){
                if(req.body.orderAmount < account.balance || req.body.orderAmount == account.balance){
                    customer_account.balance = customer_account.balance - req.body.orderAmount
                    res.status(200).json({success: true, message: "Transaction Successfull", customer_account})
                }
                else{
                    res.status(400).json({message: "Transaction failed, due to insufficient balance"})
                }
            }
            else{
                res.status(401).json({message: "Transaction failed, wrong credentials provided"})
            }
        }
        else if(req.body.payment_method == "NETBANKING"){
            if(req.body.NB_username == account.NB_username && req.body.NB_password == account.NB_password && req.body.OTP == account.OTP){
                if(req.body.orderAmount < account.balance || req.body.orderAmount == account.balance){
                    customer_account.balance = customer_account.balance - req.body.orderAmount
                    res.status(200).json({success: true, message: "Transaction Successfull", customer_account})
                }
                else{
                    res.status(400).json({message: "Transaction failed, due to insufficient balance"})
                }
            }
            else{
                res.status(401).json({message: "Transaction failed, wrong credentials provided"})
            }
        }
        else if(req.body.payment_method == "UPI"){
            if(req.body.UPI == account.UPI && req.body.UPI_SUCCESS){
                if(req.body.orderAmount < account.balance || req.body.orderAmount == account.balance){
                    customer_account.balance = customer_account.balance - req.body.orderAmount
                    res.status(200).json({success: true, message: "Transaction Successfull", customer_account})

                }
                else{
                    res.status(400).json({message: "Transaction failed, due to insufficient balance"})
                }
            }
            else{
                res.status(401).json({message: "Transaction failed, wrong credentials provided"})
            }
        }
        else{
            res.status(400).json("Invalid payment method")
            
        }

    }
    else{
        res.status(400).json("Invalid account details")
    }
})

//API to credit ammount
app.post('/credit', async(req,res) => {
    const account = identify_account(req.body)
    if(account == "unidentified"){
        res.status(404).json({message: "Account does not exist"})
    }
    else if(account == user_account){
        if(req.body.account_number == account.account_number && req.body.ifsc == account.ifsc){
            user_account.balance = user_account.balance + req.body.orderAmount
            res.status(200).json({success: true, message: "Transaction Successfull", user_account})

        }
        else{
            res.status(400).json({message: "Transaction failed, wrong credentials provided"})
        }
    }
    else if(account == customer_account){
        
        if(req.body.account_number == account.account_number && req.body.ifsc == account.ifsc){
           customer_account.balance = customer_account.balance + req.body.orderAmount
           res.status(200).json({success: true, message: "Transaction Successfull", customer_account})

        }
        else{
            res.status(400).json({message: "Transaction failed, wrong credentials provided"})
        }

    }
    else{
        res.status(400).json("Invalid account details")
    }
})



app.listen(9000, () => {
    console.log("Server is running on port 8000");
  });