/**
 * Robot3DCanvas - The actual Three.js canvas component
 * This is lazy-loaded by Robot3D.tsx to reduce initial bundle size
 */

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber'
import { 
  OrbitControls, 
  Html, 
  AdaptiveDpr,
  AdaptiveEvents,
  useProgress,
} from '@react-three/drei'
import * as THREE from 'three'
import { useInView } from '../hooks'
import { RobotSplat } from '../components'

// Loading component
function LoadingSpinner({ label }: { label: string }) {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-roofus-accent/30 border-t-roofus-accent animate-spin" />
        <span className="text-roofus-muted text-sm font-mono">{label}</span>
      </div>
    </Html>
  )
}

// Performance monitor that adjusts quality
function PerformanceMonitor() {
  const { gl } = useThree()
  
  useEffect(() => {
    // Optimize renderer settings
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1
  }, [gl])
  
  return null
}

function RobotSplatScene({ isVisible }: { isVisible: boolean }) {
  const controlsRef = useRef<any>(null)
  const { active } = useProgress()
  const [autoRotate, setAutoRotate] = useState(true)
  const resetTimerRef = useRef<number | null>(null)
  const basePositionRef = useRef<THREE.Vector3 | null>(null)
  const baseTargetRef = useRef<THREE.Vector3 | null>(null)
  const resetAnimRef = useRef<{
    start: number
    duration: number
    fromPos: THREE.Vector3
    fromTarget: THREE.Vector3
  } | null>(null)

  const clearResetTimer = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current)
      resetTimerRef.current = null
    }
  }

  const cancelResetAnimation = () => {
    resetAnimRef.current = null
  }

  const scheduleResetToBase = () => {
    clearResetTimer()
    resetTimerRef.current = window.setTimeout(() => {
      const controls = controlsRef.current
      const basePos = basePositionRef.current
      const baseTarget = baseTargetRef.current
      if (!controls || !basePos || !baseTarget) return

      // Start a smooth camera/target interpolation back to the base pose
      resetAnimRef.current = {
        start: performance.now(),
        duration: 900,
        fromPos: controls.object.position.clone(),
        fromTarget: controls.target.clone(),
      }

      // Kick the demand-render loop for the animation
      invalidate()
    }, 5000)
  }

  // Pause auto-rotate while the user is interacting; after idle, reset back to base and resume.
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    // Capture the "home" pose the first time controls are available
    if (!basePositionRef.current || !baseTargetRef.current) {
      basePositionRef.current = controls.object.position.clone()
      baseTargetRef.current = controls.target.clone()
      if (typeof controls.saveState === 'function') {
        controls.saveState()
      }
    }

    const handleStart = () => {
      clearResetTimer()
      cancelResetAnimation()
      setAutoRotate(false)
    }

    const handleEnd = () => {
      // After 5s of no interaction, snap back to base + resume auto-rotate.
      scheduleResetToBase()
    }

    const handleWheel = () => {
      // Treat wheel zoom as interaction (OrbitControls doesn't always emit start/end for wheel)
      clearResetTimer()
      cancelResetAnimation()
      setAutoRotate(false)
      scheduleResetToBase()
    }

    controls.addEventListener('start', handleStart)
    controls.addEventListener('end', handleEnd)
    controls.domElement?.addEventListener?.('wheel', handleWheel, { passive: true })

    return () => {
      controls.removeEventListener('start', handleStart)
      controls.removeEventListener('end', handleEnd)
      controls.domElement?.removeEventListener?.('wheel', handleWheel as any)
      clearResetTimer()
      cancelResetAnimation()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // While assets are loading, keep rendering so the splat loader can upload textures and stream data.
  useFrame(() => {
    if (!isVisible) return

    const controls = controlsRef.current
    const basePos = basePositionRef.current
    const baseTarget = baseTargetRef.current
    const anim = resetAnimRef.current

    // Smooth reset back to the base pose
    if (controls && basePos && baseTarget && anim) {
      const t = Math.min(1, (performance.now() - anim.start) / anim.duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic

      controls.object.position.lerpVectors(anim.fromPos, basePos, eased)
      controls.target.lerpVectors(anim.fromTarget, baseTarget, eased)
      controls.update()

      if (t >= 1) {
        resetAnimRef.current = null
        setAutoRotate(true)
      }

      invalidate()
      return
    }

    if (active || autoRotate) invalidate()
  })

  return (
    <>
      {/* Loading overlay while the splat file is downloading/initializing */}
      {active && <LoadingSpinner label="loading_splat…" />}

      <RobotSplat url="/robot.splat" />

      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={true}
        // Full control (rotate/pan/zoom) with a pleasant default camera constraint
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        minDistance={0.5}
        maxDistance={12}
        // Default motion: auto-rotate until the user interacts
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        enableDamping
        dampingFactor={0.05}
        onChange={() => invalidate()}
      />
    </>
  )
}

interface Robot3DCanvasProps {
  className?: string
}

export function Robot3DCanvas({ className }: Robot3DCanvasProps) {
  const [containerRef, isInView] = useInView<HTMLDivElement>({ 
    threshold: 0.1,
    rootMargin: '100px',
  })
  const [isReady, setIsReady] = useState(false)

  // Delay canvas creation slightly for smoother scroll
  useEffect(() => {
    if (isInView && !isReady) {
      const timer = setTimeout(() => setIsReady(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isInView, isReady])

  return (
    <div ref={containerRef} className={className}>
      {isReady ? (
        <Canvas
          camera={{ position: [2, -2, 1.2], fov: 45 }}
          dpr={[1, 2]}
          frameloop="demand" // Only render when invalidate() is called
          gl={{ 
            // Splats are already anti-aliased; MSAA is expensive for high instance counts
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
          onCreated={({ gl, camera }) => {
            gl.setClearColor(0x000000, 0)
            // Use Y-up so OrbitControls auto-rotate spins around the Y axis.
            camera.up.set(0, 1, 0)
            camera.lookAt(0, 0, 0)
            camera.updateProjectionMatrix()
          }}
        >
          {/* Performance optimizations */}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <PerformanceMonitor />
          
          <Suspense fallback={<LoadingSpinner label="loading_splat…" />}>
            <RobotSplatScene isVisible={isInView} />
          </Suspense>
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-roofus-dark/50">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-roofus-accent/30 border-t-roofus-accent animate-spin mb-4" />
            <p className="text-roofus-muted text-sm font-mono">initializing_viewer…</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Robot3DCanvas
