import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { useDevicePerfTier, PerfTier } from './useDevicePerfTier'

export type PerfMode = 'auto' | 'high' | 'low'

interface PerfModeContextType {
  mode: PerfMode
  effectiveTier: PerfTier
  setMode: (mode: PerfMode) => void
  isAutoDetected: boolean
}

const PerfModeContext = createContext<PerfModeContextType | null>(null)

const STORAGE_KEY = 'roofus-perf-mode'

export function usePerfMode(): PerfModeContextType {
  const context = useContext(PerfModeContext)
  if (!context) {
    throw new Error('usePerfMode must be used within a PerfModeProvider')
  }
  return context
}

interface PerfModeProviderProps {
  children: ReactNode
}

export function PerfModeProvider({ children }: PerfModeProviderProps) {
  const deviceCaps = useDevicePerfTier()
  const [mode, setModeState] = useState<PerfMode>('auto')

  // Load saved preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'high' || saved === 'low' || saved === 'auto') {
        setModeState(saved)
      }
    } catch {
      // localStorage not available
    }
  }, [])

  const setMode = useCallback((newMode: PerfMode) => {
    setModeState(newMode)
    try {
      localStorage.setItem(STORAGE_KEY, newMode)
    } catch {
      // localStorage not available
    }
  }, [])

  // Calculate effective tier based on mode
  const effectiveTier: PerfTier = mode === 'auto' 
    ? deviceCaps.tier 
    : mode

  const value: PerfModeContextType = {
    mode,
    effectiveTier,
    setMode,
    isAutoDetected: mode === 'auto',
  }

  // Use createElement instead of JSX to avoid import issues
  return (
    <PerfModeContext.Provider value={value}>
      {children}
    </PerfModeContext.Provider>
  )
}

/**
 * Hook to check if we should render 3D content
 */
export function useShouldRender3D(): boolean {
  const { effectiveTier } = usePerfMode()
  return effectiveTier !== 'low'
}

/**
 * Hook to check if we should use reduced animations
 */
export function useShouldReduceAnimations(): boolean {
  const { effectiveTier } = usePerfMode()
  return effectiveTier === 'low'
}



