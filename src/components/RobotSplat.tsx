import type { ReactNode } from 'react'
import { Splat } from '@react-three/drei'

export type Vec3 = [number, number, number]

interface RobotSplatProps {
  /** Path to a standard *.splat file (32-byte row format) */
  url?: string
  scale?: number | Vec3
  position?: Vec3
  rotation?: Vec3
  /** Alpha test (can help reduce halo edges). Default keeps original look. */
  alphaTest?: number
  /** Use alpha hashing (more correct, slower). */
  alphaHash?: boolean
  /** Chunk size for stream loading (Drei default: 25000). */
  chunkSize?: number
  /** Optional fallback when splat fails */
  fallback?: ReactNode
}

export function RobotSplat({
  url = '/robot.splat',
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  alphaTest = 0,
  alphaHash = false,
  chunkSize = 25000,
  fallback = null,
}: RobotSplatProps) {
  try {
    return (
      <Splat
        src={url}
        scale={scale as any}
        position={position as any}
        rotation={rotation as any}
        alphaTest={alphaTest}
        alphaHash={alphaHash}
        chunkSize={chunkSize}
      />
    )
    } catch (err) {
    console.error('Failed to render splat', err)
    return fallback ? <>{fallback}</> : null
  }
}

export default RobotSplat
