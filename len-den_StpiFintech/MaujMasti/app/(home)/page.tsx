'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { FaCoins, FaGamepad, FaMoneyBillWave, FaTrophy } from 'react-icons/fa'

const useCoinCounter = (targetValue: number, duration: number = 2000) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress < duration) {
        setCount(Math.floor((progress / duration) * targetValue))
        animationFrame = requestAnimationFrame(updateCount)
      } else {
        setCount(targetValue)
      }
    }

    animationFrame = requestAnimationFrame(updateCount)

    return () => cancelAnimationFrame(animationFrame)
  }, [targetValue, duration])

  return count
}

export default function GamingLandingPage() {
  const coinCount = useCoinCounter(10000)
  const controls = useAnimation()

  useEffect(() => {
    controls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 }
    }))
  }, [controls])

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-gradient-start to-bg-gradient-end text-white">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">MaujMasti</h1>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <motion.h2 
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Play, Earn, Cash Out!
          </motion.h2>
          <motion.p 
            className="text-xl mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join the ultimate gaming experience and turn your skills into real money.
          </motion.p>
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a 
              href="/dashboard" 
              className="bg-btn-bg text-btn-text px-8 py-3 rounded-full font-bold text-lg hover:bg-btn-bg-hover transition-colors"
            >
              Start Playing Now
            </a>
          </motion.div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { icon: FaGamepad, title: "Play Games", description: "Choose from hundreds of exciting games" },
            { icon: FaCoins, title: "Earn Coins", description: "Win coins in every game you play" },
            { icon: FaTrophy, title: "Compete", description: "Join tournaments for bigger rewards" },
            { icon: FaMoneyBillWave, title: "Cash Out", description: "Convert your coins to real money" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="bg-card-bg p-6 rounded-lg text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={controls}
              custom={index}
            >
              <item.icon className="text-5xl mb-4 mx-auto text-icon-color" />
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p>{item.description}</p>
            </motion.div>
          ))}
        </section>

        <section className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Earn Coins
          </motion.h2>
          <motion.div 
            className="text-6xl font-bold text-yellow-400"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaCoins className="inline mr-2" />
            {coinCount}
          </motion.div>
        </section>

        <section className="bg-card-bg p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Sign up for a free account</li>
            <li>Choose from our wide selection of games</li>
            <li>Play and earn coins based on your performance</li>
            <li>Accumulate coins and convert them to real money</li>
            <li>Cash out your earnings through secure payment methods</li>
          </ol>
        </section>
      </main>

      <footer className="bg-footer-bg py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 MaujMasti. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="text-sm text-gray-400 hover:text-white mr-4">Terms of Service</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white mr-4">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
