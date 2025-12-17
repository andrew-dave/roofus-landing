import { motion } from 'framer-motion'
import { Zap, Gauge, Leaf } from 'lucide-react'
import clsx from 'clsx'
import { usePerfMode, type PerfMode } from '../hooks'

const modes: { value: PerfMode; label: string; icon: typeof Zap; description: string }[] = [
  { 
    value: 'auto', 
    label: 'Auto', 
    icon: Gauge, 
    description: 'Detect device capability' 
  },
  { 
    value: 'high', 
    label: 'High', 
    icon: Zap, 
    description: 'Full 3D experience' 
  },
  { 
    value: 'low', 
    label: 'Low', 
    icon: Leaf, 
    description: 'Reduced effects' 
  },
]

interface PerfModeToggleProps {
  className?: string
  variant?: 'compact' | 'full'
}

export function PerfModeToggle({ className, variant = 'compact' }: PerfModeToggleProps) {
  const { mode, effectiveTier, setMode, isAutoDetected } = usePerfMode()

  if (variant === 'compact') {
    return (
      <div className={clsx('flex items-center gap-1 glass rounded-full p-1', className)}>
        {modes.map((m) => {
          const Icon = m.icon
          const isActive = mode === m.value
          
          return (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={clsx(
                'relative p-2 rounded-full transition-colors',
                isActive 
                  ? 'text-roofus-accent' 
                  : 'text-roofus-muted hover:text-white'
              )}
              title={`${m.label}: ${m.description}`}
              aria-label={`Performance mode: ${m.label}`}
            >
              {isActive && (
                <motion.div
                  layoutId="perf-indicator"
                  className="absolute inset-0 bg-roofus-accent/20 rounded-full"
                  transition={{ type: 'spring', duration: 0.3 }}
                />
              )}
              <Icon size={16} className="relative z-10" />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={clsx('glass rounded-2xl p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-white">Performance Mode</span>
        <span className="text-xs text-roofus-muted">
          {isAutoDetected ? `Detected: ${effectiveTier}` : `Forced: ${effectiveTier}`}
        </span>
      </div>
      
      <div className="flex gap-2">
        {modes.map((m) => {
          const Icon = m.icon
          const isActive = mode === m.value
          
          return (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={clsx(
                'flex-1 flex flex-col items-center gap-1 p-3 rounded-xl transition-all',
                isActive 
                  ? 'bg-roofus-accent/20 border border-roofus-accent/50 text-roofus-accent' 
                  : 'bg-roofus-dark/50 border border-transparent text-roofus-muted hover:text-white hover:border-roofus-border'
              )}
              aria-label={`Performance mode: ${m.label}`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{m.label}</span>
            </button>
          )
        })}
      </div>
      
      <p className="mt-3 text-xs text-roofus-muted text-center">
        {mode === 'auto' && 'Automatically adjusts based on your device'}
        {mode === 'high' && 'Full 3D rendering with all effects'}
        {mode === 'low' && 'Static images, reduced animations'}
      </p>
    </div>
  )
}



