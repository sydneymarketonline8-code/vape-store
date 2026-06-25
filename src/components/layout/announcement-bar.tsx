'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const STORAGE_KEY = 'announcementDismissed'

/** Thin dismissible promo bar above the header. Slides up on dismiss; persists in localStorage. */
export function AnnouncementBar() {
  // Start hidden to avoid a flash before we can read localStorage on the client;
  // reveal after mount unless previously dismissed.
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== 'true') setVisible(true)
  }, [])

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="overflow-hidden bg-primary"
        >
          <div className="relative px-8 py-2 text-center text-sm text-white">
            <span>
              🚚 <strong>FREE Shipping</strong> on all orders over $300 — Australia-wide
            </span>
            <button
              type="button"
              aria-label="Dismiss announcement"
              onClick={() => {
                localStorage.setItem(STORAGE_KEY, 'true')
                setVisible(false)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
