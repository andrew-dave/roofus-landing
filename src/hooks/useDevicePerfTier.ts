import { useEffect, useState } from 'react'
import { useWebGLSupport } from './useWebGLSupport'
import { useReducedMotion } from './useReducedMotion'

export type PerfTier = 'high' | 'medium' | 'low'

interface DeviceCapabilities {
  tier: PerfTier
  deviceMemory: number | null
  hardwareConcurrency: number | null
  isMobile: boolean
  isLowPowerMode: boolean
  supportsWebGL: boolean
  gpuTier: 'high' | 'medium' | 'low' | 'unknown'
}

// Known low-end GPU patterns
const LOW_END_GPU_PATTERNS = [
  /intel.*hd.*graphics.*[234]/i,
  /intel.*uhd/i,
  /mali-[t4]/i,
  /adreno.*[234]\d{2}/i,
  /powervr/i,
  /apple.*a[789]/i, // Older Apple chips
  /swiftshader/i,
  /llvmpipe/i,
  /software/i,
]

// Known high-end GPU patterns  
const HIGH_END_GPU_PATTERNS = [
  /nvidia.*rtx/i,
  /nvidia.*gtx.*10[6789]0/i,
  /nvidia.*gtx.*[23]0[6789]0/i,
  /radeon.*rx.*[567]\d{3}/i,
  /radeon.*rx.*6[789]\d{2}/i,
  /apple.*m[123]/i,
  /apple.*a1[4567]/i,
]

function detectGpuTier(renderer: string | null): 'high' | 'medium' | 'low' | 'unknown' {
  if (!renderer) return 'unknown'
  
  const lowerRenderer = renderer.toLowerCase()
  
  if (HIGH_END_GPU_PATTERNS.some(p => p.test(lowerRenderer))) {
    return 'high'
  }
  
  if (LOW_END_GPU_PATTERNS.some(p => p.test(lowerRenderer))) {
    return 'low'
  }
  
  return 'medium'
}

function detectMobile(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = navigator.userAgent.toLowerCase()
  const mobilePatterns = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i
  
  // Also check for touch capability as a secondary signal
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isSmallScreen = window.innerWidth < 768
  
  return mobilePatterns.test(userAgent) || (hasTouch && isSmallScreen)
}

function detectLowPowerMode(): boolean {
  if (typeof navigator === 'undefined') return false
  
  // If device memory is very low, treat as low power
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (memory && memory <= 2) return true
  
  // Check for data saver mode
  const connection = (navigator as Navigator & { 
    connection?: { saveData?: boolean; effectiveType?: string }
  }).connection
  
  if (connection?.saveData) return true
  if (connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') {
    return true
  }
  
  return false
}

function calculateTier(caps: Omit<DeviceCapabilities, 'tier'>): PerfTier {
  // No WebGL = definitely low
  if (!caps.supportsWebGL) return 'low'
  
  // Low power mode = low tier
  if (caps.isLowPowerMode) return 'low'
  
  // Check GPU tier
  if (caps.gpuTier === 'low') return 'low'
  if (caps.gpuTier === 'high' && !caps.isMobile) return 'high'
  
  // Check device memory (if available)
  if (caps.deviceMemory !== null) {
    if (caps.deviceMemory <= 2) return 'low'
    if (caps.deviceMemory >= 8) return 'high'
  }
  
  // Check CPU cores
  if (caps.hardwareConcurrency !== null) {
    if (caps.hardwareConcurrency <= 2) return 'low'
    if (caps.hardwareConcurrency >= 8 && !caps.isMobile) return 'high'
  }
  
  // Mobile devices default to medium (unless other signals say otherwise)
  if (caps.isMobile) return 'medium'
  
  // Default to medium
  return 'medium'
}

export function useDevicePerfTier(): DeviceCapabilities {
  const webgl = useWebGLSupport()
  const prefersReducedMotion = useReducedMotion()
  
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    tier: 'medium',
    deviceMemory: null,
    hardwareConcurrency: null,
    isMobile: false,
    isLowPowerMode: false,
    supportsWebGL: true,
    gpuTier: 'unknown',
  })

  useEffect(() => {
    const navMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    const deviceMemory = navMemory ?? null
    const hardwareConcurrency = navigator.hardwareConcurrency ?? null
    const isMobile = detectMobile()
    const isLowPowerMode = detectLowPowerMode() || prefersReducedMotion
    const supportsWebGL = webgl.supported
    const gpuTier = detectGpuTier(webgl.renderer)
    
    const caps = {
      deviceMemory,
      hardwareConcurrency,
      isMobile,
      isLowPowerMode,
      supportsWebGL,
      gpuTier,
    }
    
    setCapabilities({
      ...caps,
      tier: calculateTier(caps),
    })
  }, [webgl.supported, webgl.renderer, prefersReducedMotion])

  return capabilities
}

/**
 * Simple hook that just returns the performance tier
 */
export function usePerfTier(): PerfTier {
  const { tier } = useDevicePerfTier()
  return tier
}
