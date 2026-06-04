'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

export function AgeGate() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('age-verified')) setShow(true)
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-2xl"
          >
            <div className="mb-5 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border border-green-200">
                <ShieldCheck className="h-8 w-8 text-[#1B7A3E]" />
              </div>
            </div>
            <h2 className="mb-1 text-2xl font-bold text-gray-900">Age Verification</h2>
            <p className="mb-1 text-gray-600">
              You must be <span className="font-semibold text-gray-900">18 years or older</span> to
              enter this site.
            </p>
            <p className="mb-7 text-sm text-gray-400">
              By entering you confirm you are of legal age to purchase nicotine products in your
              jurisdiction.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-[#1B7A3E] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#156331] active:scale-95"
              >
                Yes, I am 18+
              </button>
              <button
                type="button"
                onClick={handleDeny}
                className="flex-1 rounded-lg border border-gray-200 px-6 py-3 font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 active:scale-95"
              >
                No, Exit
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              This site sells nicotine products. Underage sales are strictly prohibited.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
