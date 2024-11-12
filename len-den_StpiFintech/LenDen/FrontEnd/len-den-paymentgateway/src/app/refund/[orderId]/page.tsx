'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'

type PaymentMethod = 'NETBANKING'

export default function PaymentForm() {
  const router = useRouter()
  const params = useParams()
  const { orderId } = params

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('NETBANKING')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifsc, setIfsc] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/refund/process_refund`, {
        orderId: orderId,
        payment_method: paymentMethod,
        account_num: accountNumber,
        ifsc: ifsc,
      })

      if (response.status === 200) {
        setIsPaymentConfirmed(true)
        toast({
          title: "Payment Successful!",
          description: "LenDen -PG",
          variant: "default",
        })
      } else {
        toast({
          title: response.data.message || 'Payment Failed!',
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

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4"
      initial="hidden"
      animate="visible"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md space-y-6"
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Beneficiary Details</h2>
        
        <AnimatePresence mode="wait">
          {paymentMethod === 'NETBANKING' && (
            <motion.div
              key="netbanking"
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-4"
            >
              <motion.input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
              />
              <motion.input
                type="text"
                placeholder="IFSC Code"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          className={`w-full py-3 mt-6 font-semibold rounded-md text-white ${isProcessing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition`}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Confirm Payment'}
        </motion.button>
      </motion.form>
    </motion.div>
  )
}
