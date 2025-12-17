import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import clsx from 'clsx'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  href?: string
  download?: string
  onClick?: () => void
  className?: string
  icon?: ReactNode
}

export function Button({ 
  children, 
  variant = 'primary', 
  href, 
  download,
  onClick, 
  className,
  icon 
}: ButtonProps) {
  const baseClasses = clsx(
    'inline-flex items-center justify-center gap-2 font-mono font-semibold',
    'transition-all duration-200 active:scale-[0.99]',
    variant === 'primary' && [
      'px-6 py-3 bg-roofus-accent text-roofus-darker rounded-xl',
      'hover:bg-roofus-secondary hover:shadow-lg hover:shadow-roofus-accent/20',
    ],
    variant === 'secondary' && [
      'px-6 py-3 glass text-roofus-text rounded-xl',
      'hover:border-roofus-accent/35',
    ],
    className
  )

  const content = (
    <>
      {children}
      {icon && <span className="ml-1">{icon}</span>}
    </>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        download={download}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={baseClasses}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={baseClasses}
    >
      {content}
    </motion.button>
  )
}



