import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

interface HotspotProps {
  label: string
  description?: string
  position: { x: string; y: string }
}

export function Hotspot({ label, description, position }: HotspotProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="absolute z-20 pointer-events-auto select-none"
      style={{ left: position.x, top: position.y }}
    >
      {/* Hotspot button */}
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'relative w-8 h-8 rounded-full flex items-center justify-center',
          'bg-roofus-accent/80 hover:bg-roofus-accent transition-colors',
          'cursor-pointer'
        )}
      >
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full bg-roofus-accent animate-ping opacity-30" />
        <span className="absolute inset-0 rounded-full bg-roofus-accent animate-pulse opacity-50" />
        
        {/* Plus icon */}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="relative z-10">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-roofus-darker" />
        </svg>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 mt-3 w-48 glass rounded-xl p-4 text-center"
          >
            {/* Arrow */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 glass rotate-45 border-t border-l border-roofus-border" />
            
            <h4 className="font-display font-semibold text-white mb-1">{label}</h4>
            {description && (
              <p className="text-sm text-roofus-muted">{description}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}



