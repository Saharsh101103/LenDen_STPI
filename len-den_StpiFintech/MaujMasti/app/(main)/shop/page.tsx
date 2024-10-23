'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { ChevronDown, ChevronUp, CreditCard, Wallet, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '@/hooks/useAuth'
import axios from 'axios'

// Array of available credit packages (each with a unique ID, amount, price, and color for display)
const creditPackages = [
  { id: 1, amount: 100, price: 0.99, color: '#FF6B6B' },
  { id: 2, amount: 500, price: 4.99, color: '#4ECDC4' },
  { id: 3, amount: 1000, price: 9.99, color: '#45B7D1' },
  { id: 4, amount: 5000, price: 49.99, color: '#F9DB6D' },
]

// A component that shows a rotating coin animation using Framer Motion values
const RotatingCoin = () => {
  const y = useMotionValue(1)
  const rotate = useTransform(y, [-100, 100], [-60, 60], { clamp: false } )

  return (
    <motion.div
      style={{ y, animation: 'infinite', rotate,  }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold cursor-grab"
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    >
      $
    </motion.div>
  )
}

export default function ShopPage() {
  const { user } =  useAuth() 
  const [balance, setBalance] = useState(0)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Purchase', amount: 500, date: '2023-05-01' },
    { id: 2, type: 'Withdraw', amount: 200, date: '2023-05-03' },
  ])
  const [confirmPurchase, setConfirmPurchase] = useState<{ amount: number; price: number } | null>(null)
  const [confirmWithdraw, setConfirmWithdraw] = useState(false)
  const controls = useAnimation()
  const containerRef = useRef(null)
  const [paymentResult, setPaymentResult] = useState<any>(null); // Holds the payment gateway response
  const [confirmPayment, setConfirmPayment] = useState<boolean>(false); // Toggles the modal visibility


  // Start animation when the component mounts
  useEffect(() => {
    controls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }))
  }, [controls])

  // Update balance when the user's cash changes (from user context)
  useEffect(() => {
  setBalance(user?.cash || 0)
  }, [useAuth, user?.cash])


  // Function to handle purchasing credits
// Update handlePurchase to call the backend API
const handlePurchase = async (amount: number, price: number) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/api/transaction`, {
        orderId: `1101${Math.random()}`,
        email: "worktogetherks@gmail.com",
        businessName :"Mauj Masti", 
        customerId : `${user?.username}${user?.id}`, 
        customerName : user?.name, 
        customerPhone : "9022442200", 
        customerEmail : user?.email,
        price,
        xId: process.env.XID,
        xSecret: process.env.XSECRET,
        type: "purchase"
      });

  
      const result = await response.data;
      if (result.payment_url) {
        // Open the modal with the payment URL returned from the backend
        setPaymentResult(result.payment_url)
        setConfirmPayment(true)
      } else {
        // Handle success/failure without modal
        setBalance(balance + amount);  // Update balance locally for now
        setTransactions([
          { id: Date.now(), type: 'Purchase', amount, date: new Date().toISOString().split('T')[0] },
          ...transactions,
        ]);
        toast.success(`Successfully purchased ${amount} credits!`);
      }
    } catch (error) {
      console.error("Purchase failed:", error);
      toast.error('Something went wrong!');
    }
  };
  
  // Update handleWithdraw to call the backend API
  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount);
    if (amount > balance) {
      toast.error('Insufficient balance');
      return;
    }
  
    try {
      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'withdraw',
          amount,
          userId: user?.id,
        }),
      });
  
      const result = await response.json();
      if (result.payment_url) {
        // Open the modal with the payment URL returned from the backend
        setPaymentResult(result.payment_url)
        setConfirmPayment(true)
      } else {
        // Handle success/failure without modal
        setBalance(balance - amount);
        setTransactions([
          { id: Date.now(), type: 'Withdraw', amount, date: new Date().toISOString().split('T')[0] },
          ...transactions,
        ]);
        toast.info(`Successfully withdrew ${amount} credits!`);
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error('Something went wrong!');
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8" ref={containerRef}>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg p-6 mb-8 flex justify-between items-center shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <RotatingCoin />
            <div>
              <h2 className="text-2xl font-semibold">Your Balance</h2>
              <motion.p
                key={balance}
                initial={{ scale: 1.5, color: '#4CAF50' }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-bold"
              >
                {balance} Credits
              </motion.p>
            </div>
          </div>
          <Button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {showHistory ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />}
            Transaction History
          </Button>
        </motion.div>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-lg p-6 mb-8 overflow-hidden shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
              <ul className="space-y-2">
                {transactions.map((transaction, index) => (
                  <motion.li
                    key={transaction.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                  >
                    <span>{transaction.type}</span>
                    <span className={transaction.type === 'Purchase' ? 'text-green-400' : 'text-red-400'}>
                      {transaction.type === 'Purchase' ? '+' : '-'}{transaction.amount} Credits
                    </span>
                    <span className="text-gray-400">{transaction.date}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {creditPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              custom={index}
              initial={{ opacity: 0, y: 50 }}
              animate={controls}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="bg-gray-800 border-gray-700 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-50" />
                <CardHeader>
                  <CardTitle className="text-2xl font-bold relative z-10">{pkg.amount} Credits</CardTitle>
                  <CardDescription className="text-lg relative z-10">${pkg.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 relative z-10">Purchase this credit package to boost your gaming experience!</p>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full relative z-10 overflow-hidden group"
                        style={{ backgroundColor: pkg.color }}
                      >
                        <span className="absolute w-64 h-64 mt-12 group-hover:-rotate-45 -translate-x-20 -translate-y-24 bg-white opacity-10 transition-all duration-300 ease-in-out"></span>
                        <span className="relative flex items-center justify-center">
                          <CreditCard className="mr-2" />
                          Purchase
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
                      <DialogHeader>
                        <DialogTitle>Confirm Purchase</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to purchase {pkg.amount} credits for ${pkg.price}?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="secondary" onClick={() => setConfirmPurchase(null)}>Cancel</Button>
                        <Button onClick={() => handlePurchase(pkg.amount, pkg.price)}>Confirm Purchase</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
                <motion.div
                  className="absolute top-2 right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 opacity-50" />
          <h2 className="text-2xl font-semibold mb-4 relative z-10">Withdraw Credits</h2>
          <div className="flex space-x-4 relative z-10">
            <Input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
              className="flex-grow bg-gray-700 text-white border-gray-600"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-red-600 hover:bg-red-700 transition-colors"
                  onClick={() => setConfirmWithdraw(true)}
                >
                  <Wallet className="mr-2" />
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Confirm Withdrawal</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to withdraw {withdrawAmount} credits?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="secondary" onClick={() => setConfirmWithdraw(false)}>Cancel</Button>
                  <Button onClick={handleWithdraw}>Confirm Withdrawal</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {confirmPayment && (
  <Dialog open={true} onOpenChange={() => setConfirmPayment(false)}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Complete Your Purchase</DialogTitle>
        <DialogDescription>
          Please complete your purchase using the form below:
        </DialogDescription>
      </DialogHeader>
     
      <DialogFooter>
      {paymentResult && (
            <div className="payment-iframe-container">
              <iframe
                src={paymentResult}
                title="Payment Form"
              ></iframe>
            </div>
          )}
        <Button onClick={() => setConfirmPayment(false)} variant="outline">Cancel</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}

        </motion.div>
      </div>
    </div>
  )
}