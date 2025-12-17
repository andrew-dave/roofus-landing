import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion, useScrollProgress } from '../hooks'

// Predefined blob shapes
const blobPaths = [
  'M440,320Q420,390,350,410Q280,430,210,400Q140,370,110,300Q80,230,130,160Q180,90,260,80Q340,70,400,130Q460,190,460,260Q460,330,440,320Z',
  'M420,310Q380,370,310,400Q240,430,170,390Q100,350,90,280Q80,210,130,150Q180,90,260,90Q340,90,390,150Q440,210,450,260Q460,310,420,310Z',
  'M430,300Q390,350,330,380Q270,410,200,380Q130,350,100,280Q70,210,120,150Q170,90,250,80Q330,70,390,130Q450,190,460,250Q470,310,430,300Z',
  'M450,330Q430,410,350,430Q270,450,190,410Q110,370,90,290Q70,210,120,140Q170,70,260,70Q350,70,410,130Q470,190,470,260Q470,330,450,330Z',
]

export function MorphingBlob() {
  const reducedMotion = useReducedMotion()
  const scrollProgress = useScrollProgress()
  const [currentPath, setCurrentPath] = useState(0)

  // Change blob shape based on scroll
  useEffect(() => {
    const pathIndex = Math.min(
      Math.floor(scrollProgress * blobPaths.length),
      blobPaths.length - 1
    )
    setCurrentPath(pathIndex)
  }, [scrollProgress])

  if (reducedMotion) {
    // Fallback: simple animated blob with CSS
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blob-fallback" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 540 540"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px]"
      >
        <defs>
          <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(31, 137, 71, 0.16)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.06)" />
            <stop offset="100%" stopColor="rgba(31, 137, 71, 0.06)" />
          </linearGradient>
          <filter id="blobBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
          </filter>
        </defs>
        <motion.path
          d={blobPaths[currentPath]}
          fill="url(#blobGradient)"
          filter="url(#blobBlur)"
          animate={{ d: blobPaths[currentPath] }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  )
}



