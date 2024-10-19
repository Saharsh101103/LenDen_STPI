'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import axios, { Axios, AxiosError } from 'axios'


export default function VerificationForm() {
  const router = useRouter();
  const email = useAuth().session?.email
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [errors, setErrors] = useState({ name: '', username: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [bubbles, setBubbles] = useState([])


  const validateForm = () => {
    let isValid = true
    const newErrors = { name: '', username: '' }

    if (name.trim() === '') {
      newErrors.name = 'Name is required'
      isValid = false
    }

    if (username.trim() === '') {
      newErrors.username = 'Username is required'
      isValid = false
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Step 3: Ensure username and name are not empty
    if (!username || !name) {
        console.error("Username and Name are required");
        return;
    }

    // Step 4: Send the data to the backend
    try {
        const res = await axios.post('/api/user-reg', {
            email: email,
            name: name,
            username: username,
        });

        const data = await res.data;

        if (res.status === 200) {
            console.log('User registered successfully:', data);
            setIsSubmitting(false);
            setIsSubmitted(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        }
    } catch (error) {
        console.error('An error occurred:', error);
        setIsSubmitting(false);

        // Check if the error is an Axios error and has a response
        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;

            if (status === 400 && data.error === "Email or username already exists") {
                setErrors({ name:"", username: "Username already exists. Please try another." });
            } else {
                // Handle other error responses if necessary
                console.error('Error response:', data);
            }
        } else {
            // Handle unexpected errors
            console.error('Unexpected error:', error);
        }
    }
};
  


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-900 p-4 overflow-hidden">
      {bubbles}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-3  text-center">Welcome!</h2>
          <h3 className="text-2xl font-bold text-white mb-6 text-center">What should we call you?</h3>
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="text-center text-white"
              >
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <p className="text-xl font-semibold mb-2">Submission Successful!</p>
                <p>{`Thank You ${name}, we hope you enjoy :D`}</p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-white bg-opacity-80 border-white border-opacity-20 text-white placeholder-white placeholder-opacity-60"
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-300 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </motion.p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="bg-white bg-opacity-80 border-white border-opacity-20 text-white placeholder-white placeholder-opacity-60"
                  />
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-300 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.username}
                    </motion.p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Submitting...
                    </motion.span>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Submit
                    </motion.span>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}