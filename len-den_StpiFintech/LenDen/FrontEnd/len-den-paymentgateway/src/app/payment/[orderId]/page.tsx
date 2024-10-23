'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'


type PaymentMethod = 'DEBITCARD' | 'CREDITCARD' | 'UPI' | 'NETBANKING'

export default function PaymentForm() {
  const router = useRouter() // For navigation, if needed
  const params = useParams() // Access dynamic route parameters
  const { orderId } = params // Destructure orderId

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('DEBITCARD')
  const [cardNumber, setCardNumber] = useState('')
  const [cvv, setCvv] = useState('')
  const [expiry, setExpiry] = useState('')
  const [bankingId, setBankingId] = useState('')
  const [password, setPassword] = useState('')
  const [upiId, setUpiId] = useState('')
  const [otp, setOtp] = useState('')
  const [otpRequested, setOtpRequested] = useState(false)
  const [otpTimer, setOtpTimer] = useState(60)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpRequested && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpRequested, otpTimer])

  const handleRequestOtp = () => {
    setOtpRequested(true)
    setOtpTimer(60)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    console.log(orderId)
    
    // Prepare payment data based on selected payment method


    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/process_order`, {
        orderId: orderId,
    payment_method: paymentMethod,
    dc_num: paymentMethod == "DEBITCARD" ? cardNumber : "",
    cc_num: paymentMethod == "CREDITCARD" ? cardNumber : "",
    expiry: expiry,
    Nb_username: bankingId,
    Nb_password: password,
    UPI: upiId,
    OTP: otp,
    cvv: cvv
      })

      const result = await response.data

      if (response.status === 200) {
        setIsPaymentConfirmed(true)

        
          toast({
            title: "Payment Successful!",
            description: "LenDen -PG",
            variant: "default",
          })
        

        // Optionally navigate or perform other actions
      } else {
        toast({
            title: result.message || 'Payment Failed!',
            description: "LenDen -PG",
            variant: "destructive",
          })
      }
    } catch (error: any) {
      console.error('Payment Error:', error)
      toast({
        title: 'Something went wrong!',
        description: "LenDen -PG",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const fadeInOut = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4"
      initial="hidden"
      animate="visible"
      variants={fadeInOut}
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md space-y-6"
        initial="hidden"
        animate="visible"
        variants={fadeInOut}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Payment Details</h2>
        
        <motion.div variants={inputVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option>DEBITCARD</option>
            <option>CREDITCARD</option>
            <option>UPI</option>
            <option>NetBanking</option>
          </select>
        </motion.div>

        <AnimatePresence mode="wait">
          {(paymentMethod === 'DEBITCARD' || paymentMethod === 'CREDITCARD') && (
            <motion.div
              key="card"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeInOut}
              className="space-y-4"
            >
              <motion.input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
                variants={inputVariants}
              />
              <div className="flex space-x-4">
                <motion.input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-1/2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
                  variants={inputVariants}
                />
                <motion.input
                  type="text"
                  placeholder="Expiry (MM/YY)"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-1/2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
                  variants={inputVariants}
                />
              </div>
            </motion.div>
          )}

          {paymentMethod === 'NETBANKING' && (
            <motion.div
              key="netbanking"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeInOut}
              className="space-y-4"
            >
              <motion.input
                type="text"
                placeholder="Net Banking ID"
                value={bankingId}
                onChange={(e) => setBankingId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
                variants={inputVariants}
              />
              <motion.input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
                variants={inputVariants}
              />
            </motion.div>
          )}

          {paymentMethod === 'UPI' && (
            <motion.div
              key="upi"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeInOut}
            >
              <motion.input
                type="text"
                placeholder="UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
                variants={inputVariants}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!otpRequested ? (
          <motion.button
            type="button"
            onClick={handleRequestOtp}
            className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Request OTP
          </motion.button>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInOut}
            className="space-y-4"
          >
            <motion.input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
              variants={inputVariants}
            />
            <p className="text-sm text-gray-500 text-center">
              OTP expires in {otpTimer} seconds
            </p>
          </motion.div>
        )}

        <motion.button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!otpRequested || isProcessing}
        >
          {isProcessing ? 'Processing Payment...' : 'Submit Payment'}
        </motion.button>
      </motion.form>

      <AnimatePresence>
        {isPaymentConfirmed && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-lg text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h2>
              <p className="text-gray-700">Your payment has been processed successfully.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}



