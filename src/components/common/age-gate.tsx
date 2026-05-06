'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'

export function AgeGate() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const verified = localStorage.getItem('age-verified')
    if (!verified) setShow(true)
  }, [])

  function handleConfirm() {
    localStorage.setItem('age-verified', 'true')
    setShow(false)
  }

  function handleDeny() {
    window.location.href = 'https://google.com'
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 border border-violet-500/30">
                <ShieldAlert className="h-8 w-8 text-violet-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Age Verification</h2>
            <p className="text-zinc-400 mb-2">
              You must be{' '}
              <span className="text-white font-semibold">21 years of age or older</span> to enter
              this site.
            </p>
            <p className="text-zinc-500 text-sm mb-8">
              By entering, you confirm you are of legal age to purchase tobacco and nicotine
              products in your jurisdiction.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition-all hover:bg-violet-500 active:scale-95"
              >
                Yes, I am 21+
              </button>
              <button
                onClick={handleDeny}
                className="flex-1 rounded-xl border border-zinc-700 px-6 py-3 font-semibold text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white active:scale-95"
              >
                No, Exit
              </button>
            </div>
            <p className="mt-4 text-xs text-zinc-600">
              This site sells tobacco/nicotine products. Underage sales are strictly prohibited.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
