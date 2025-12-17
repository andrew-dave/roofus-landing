import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import clsx from 'clsx'
import { useInView, useReducedMotion, useShouldReduceAnimations } from '../hooks'

interface VideoSource {
  src: string
  type: string
}

interface VideoFrameProps {
  /** Primary video source (MP4) */
  src: string
  /** Optional WebM source for better compression */
  webmSrc?: string
  /** Fallback image if video fails to load */
  fallbackImage: string
  /** Poster image shown before video plays */
  poster?: string
  /** Additional CSS classes */
  className?: string
  /** Whether to show controls */
  showControls?: boolean
}

export function VideoFrame({ 
  src, 
  webmSrc,
  fallbackImage, 
  poster,
  className,
  showControls = true,
}: VideoFrameProps) {
  const [hasError, setHasError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [containerRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.3 })
  const reducedMotion = useReducedMotion()
  const shouldReduce = useShouldReduceAnimations()

  // Build video sources array
  const sources: VideoSource[] = []
  if (webmSrc) {
    sources.push({ src: webmSrc, type: 'video/webm' })
  }
  if (src) {
    sources.push({ src, type: 'video/mp4' })
  }

  // Pause video when out of view or reduced motion
  useEffect(() => {
    if (!videoRef.current || hasError) return
    
    if (isInView && isPlaying && !reducedMotion && !shouldReduce) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented, user interaction required
        setIsPlaying(false)
      })
    } else {
      videoRef.current.pause()
    }
  }, [isInView, isPlaying, hasError, reducedMotion, shouldReduce])

  // Handle reduced motion: show poster instead
  useEffect(() => {
    if ((reducedMotion || shouldReduce) && videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [reducedMotion, shouldReduce])

  const togglePlay = () => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVideoError = () => {
    setHasError(true)
  }

  const handleLoadedData = () => {
    setIsLoaded(true)
  }

  // Animation variants
  const containerVariants = {
    hidden: { scale: 0.9, borderRadius: 48, opacity: 0 },
    visible: { scale: 1, borderRadius: 24, opacity: 1 },
  }

  return (
    <motion.div
      ref={containerRef}
      initial={reducedMotion ? { opacity: 0 } : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={reducedMotion ? undefined : containerVariants}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={clsx('video-frame relative overflow-hidden', className)}
    >
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-roofus-card animate-pulse flex items-center justify-center z-10">
          <div className="w-16 h-16 rounded-full border-4 border-roofus-accent/30 border-t-roofus-accent animate-spin" />
        </div>
      )}

      {hasError ? (
        // Fallback image when video fails
        <div className="relative aspect-video">
          <img
            src={fallbackImage}
            alt="Mission planning interface"
            className="w-full h-full object-cover"
            onError={() => {
              // If fallback also fails, show placeholder
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-roofus-dark/80">
            <div className="text-center p-8">
              <p className="text-roofus-muted mb-2">
                Drop <code className="text-roofus-accent px-2 py-1 glass rounded">planner-demo.mp4</code> into
              </p>
              <code className="text-roofus-accent">/public/assets</code>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            poster={poster}
            onLoadedData={handleLoadedData}
            onError={handleVideoError}
            className="w-full h-auto"
          >
            {sources.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
            {/* Fallback for browsers without video support */}
            <img src={fallbackImage} alt="Video fallback" />
          </video>
          
          {/* Controls overlay */}
          {showControls && isLoaded && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-roofus-accent/20 transition-colors group"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? (
                  <VolumeX size={18} className="text-white/70 group-hover:text-white" />
                ) : (
                  <Volume2 size={18} className="text-white/70 group-hover:text-white" />
                )}
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-roofus-accent/20 transition-colors group"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause size={18} className="text-white" />
                ) : (
                  <Play size={18} className="text-white ml-0.5" />
                )}
              </button>
            </div>
          )}

          {/* Poster overlay for reduced motion */}
          {(reducedMotion || shouldReduce) && poster && !isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-16 h-16 glass rounded-full flex items-center justify-center hover:bg-roofus-accent/30 transition-colors group"
                aria-label="Play video"
              >
                <Play size={28} className="text-white ml-1" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-roofus-accent/15 via-transparent to-roofus-secondary/15 rounded-3xl -z-10 blur-lg opacity-25" />
    </motion.div>
  )
}
