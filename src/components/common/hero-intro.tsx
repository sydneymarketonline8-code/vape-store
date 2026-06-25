'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } }
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

/** Homepage hero copy with a staggered reveal (name → subtitle → buttons). */
export function HeroIntro() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.h1 variants={item} className="mb-4 text-4xl font-black leading-tight text-gray-900 sm:text-5xl">
        Australia&apos;s #1 Online<br />
        <span className="text-[#1B7A3E]">Vape Store</span>
      </motion.h1>
      <motion.p variants={item} className="mb-8 max-w-md text-lg text-gray-500">
        Premium vapes at wholesale prices. Trusted by thousands of customers across Australia. Fast dispatch, nation-wide.
      </motion.p>
      <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/products?category=disposables"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B7A3E] px-8 py-3.5 font-semibold text-white transition-colors hover:bg-[#156331]"
        >
          Shop Disposables <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1B7A3E] px-8 py-3.5 font-semibold text-[#1B7A3E] transition-colors hover:bg-green-50"
        >
          Browse All Products
        </Link>
      </motion.div>
    </motion.div>
  )
}
