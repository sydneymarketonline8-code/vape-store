'use client'

import { motion } from 'framer-motion'

/**
 * Page transition. A template re-mounts on every navigation, so this plays an
 * enter animation per route. (App Router doesn't reliably support exit
 * animations on navigation without breaking scroll restoration, so this is
 * enter-only — the standard, robust approach.)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}
