import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import clsx from 'clsx'
import { useReducedMotion } from '../hooks'

interface GlassCardProps {
  children: ReactNode
  className?: string
  delay?: number
  hover?: boolean
}

export function GlassCard({ children, className, delay = 0, hover = true }: GlassCardProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover && !reducedMotion ? { y: -3, scale: 1.01 } : {}}
      className={clsx(
        'glass rounded-2xl p-6 md:p-7',
        'transition-shadow duration-300',
        hover && 'hover:shadow-lg hover:shadow-roofus-accent/10 hover:border-roofus-accent/30',
        className
      )}
    >
      {children}
    </motion.div>
  )
}



