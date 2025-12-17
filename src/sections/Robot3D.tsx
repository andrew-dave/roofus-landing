import React, { Suspense, lazy, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Info } from 'lucide-react'
import { Hotspot, PerfModeToggle } from '../components'
import { useInView, useReducedMotion, usePerfMode } from '../hooks'

// Lazy load the 3D canvas to reduce initial bundle size
const Robot3DCanvas = lazy(() => import('./Robot3DCanvas'))

const hotspots = [
  { label: 'GPR', description: 'ground‑penetrating radar payload', position: { x: '60%', y: '35%' } },
  { label: 'Thermal', description: 'thermal imaging for hotspot detection', position: { x: '25%', y: '70%' } },
  { label: 'LiDAR', description: '3D geometry + obstacle context', position: { x: '75%', y: '60%' } },
  { label: 'RGB', description: 'visual documentation + annotations', position: { x: '50%', y: '25%' } },
  { label: 'Failsafe', description: 'stop on communication loss', position: { x: '35%', y: '45%' } },
]

const specs = [
  { label: 'max_speed', value: '0.5 m/s' },
  { label: 'max_slope', value: '20°' },
  { label: 'mass', value: '12 kg' },
  { label: 'runtime', value: '8 h' },
]

// Error boundary to keep page from blanking if 3D fails
 type RobotErrorBoundaryProps = {
  fallback: React.ReactNode
  onError?: () => void
  children?: React.ReactNode
}

class RobotErrorBoundary extends React.Component<RobotErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: RobotErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    if (this.props.onError) this.props.onError()
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

// Fallback component when 3D is not available
function RobotFallback({ onRequestEnable }: { onRequestEnable?: () => void }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div className="relative w-full h-full">
      {/* Try to load poster image first */}
      {!imageError ? (
        <>
          <img
            src="/assets/robot.png"
            alt="Roofus robot"
            className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-roofus-dark/50 animate-pulse" />
          )}
        </>
      ) : (
        // Fallback to simple placeholder if poster is missing
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-roofus-dark to-roofus-darker">
          <div className="text-center">
            <div className="text-8xl mb-4">🤖</div>
            <p className="text-roofus-muted">
              Add <code className="text-roofus-accent">robot.png</code> (poster) to <code className="text-roofus-accent">/public/assets</code> and{' '}
              <code className="text-roofus-accent">robot.splat</code> (3D) to <code className="text-roofus-accent">/public</code>
            </p>
          </div>
        </div>
      )}

      {/* Overlay with enable 3D button */}
      {onRequestEnable && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-roofus-dark/80 via-transparent to-transparent">
          <button
            onClick={onRequestEnable}
            className="glass px-6 py-3 rounded-full flex items-center gap-2 hover:bg-roofus-accent/20 transition-colors group"
          >
            <Play size={20} className="text-roofus-accent" />
            <span className="text-white font-mono font-semibold">enable_3d</span>
          </button>
        </div>
      )}

      {/* Low perf mode indicator */}
      <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full flex items-center gap-2">
        <Info size={14} className="text-roofus-accent" />
        <span className="text-xs font-mono text-roofus-muted">static_preview</span>
      </div>
    </div>
  )
}

// 3D canvas loading fallback
function CanvasLoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-roofus-dark/50">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full border-4 border-roofus-accent/30 border-t-roofus-accent animate-spin mb-4" />
        <p className="text-roofus-muted font-mono text-sm">loading_3d_model…</p>
      </div>
    </div>
  )
}

export function Robot3D() {
  const [containerRef, isInView] = useInView<HTMLElement>({ threshold: 0.1 })
  const reducedMotion = useReducedMotion()
  const { effectiveTier, setMode } = usePerfMode()
  const [forceEnable3D, setForceEnable3D] = useState(false)
  const [hasEverBeenInView, setHasEverBeenInView] = useState(false)

  // Keep the heavy 3D scene mounted once the user has reached the section at least once.
  // This avoids re-downloading / re-initializing the splat if they scroll away and back.
  useEffect(() => {
    if (isInView) setHasEverBeenInView(true)
  }, [isInView])

  // Determine if we should show 3D
  const shouldShow3D = (effectiveTier === 'high' || effectiveTier === 'medium' || forceEnable3D) 
    && !reducedMotion
  const shouldMount3D = shouldShow3D && (isInView || hasEverBeenInView)

  const handleRequestEnable = () => {
    setForceEnable3D(true)
    setMode('high')
  }

  return (
    <section
      ref={containerRef}
      id="robot"
      className="section-padding relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono text-roofus-muted">robot</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-mono font-semibold text-white">
              Robot model + envelope
            </h2>
            <p className="text-roofus-muted mt-2 max-w-2xl">
              Interactive viewer (optional). Loads the gaussian splat at <code className="font-mono text-white">/robot.splat</code> and
              falls back to a poster when 3D is disabled or unavailable.
            </p>
          </div>
          
          {/* Performance mode toggle */}
          <PerfModeToggle className="self-start md:self-auto" />
        </motion.div>

        {/* 3D Viewer */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/3] md:aspect-[16/9] glass rounded-3xl overflow-hidden mb-12"
        >
          {/* Hotspots overlay - only show when 3D is active */}
          {shouldShow3D && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="relative w-full h-full pointer-events-none">
                {hotspots.map((hotspot) => (
                  <Hotspot key={hotspot.label} {...hotspot} />
                ))}
              </div>
            </div>
          )}

          {/* Conditional rendering: 3D Canvas or Fallback */}
          {shouldMount3D ? (
            <RobotErrorBoundary fallback={<RobotFallback />}>
              <Suspense fallback={<CanvasLoadingFallback />}>
                <Robot3DCanvas className="w-full h-full" />
              </Suspense>
            </RobotErrorBoundary>
          ) : (
            <RobotFallback 
              onRequestEnable={!shouldShow3D ? handleRequestEnable : undefined} 
            />
          )}
        </motion.div>

        {/* Specs strip */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {specs.map((spec, index) => (
            <motion.div
              key={spec.label}
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-2xl p-5 text-center"
            >
              <div className="text-2xl md:text-3xl font-mono font-semibold text-roofus-accent mb-1">
                {spec.value}
              </div>
              <div className="text-sm font-mono text-roofus-muted uppercase tracking-wider">
                {spec.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
