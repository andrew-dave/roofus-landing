import { useEffect, useState } from 'react'

interface WebGLInfo {
  supported: boolean
  version: number | null
  renderer: string | null
  vendor: string | null
}

type GLContext = WebGL2RenderingContext | WebGLRenderingContext | null

export function useWebGLSupport(): WebGLInfo {
  const [info, setInfo] = useState<WebGLInfo>({
    supported: true, // Assume supported until we check (SSR-safe)
    version: null,
    renderer: null,
    vendor: null,
  })

  useEffect(() => {
    const checkWebGL = (): WebGLInfo => {
      try {
        const canvas = document.createElement('canvas')

        // Try WebGL2 first
        let gl: GLContext = canvas.getContext('webgl2')
        let version = 2

        // Fall back to WebGL1
        if (!gl) {
          gl = canvas.getContext('webgl')
          version = 1
        }

        if (!gl) {
          return {
            supported: false,
            version: null,
            renderer: null,
            vendor: null,
          }
        }

        // Get renderer info
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        const renderer = debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          : gl.getParameter(gl.RENDERER)
        const vendor = debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
          : gl.getParameter(gl.VENDOR)

        // Clean up
        const loseContext = gl.getExtension('WEBGL_lose_context')
        if (loseContext) loseContext.loseContext()

        return {
          supported: true,
          version,
          renderer,
          vendor,
        }
      } catch {
        return {
          supported: false,
          version: null,
          renderer: null,
          vendor: null,
        }
      }
    }

    setInfo(checkWebGL())
  }, [])

  return info
}

/**
 * Simple boolean check for WebGL support
 */
export function useHasWebGL(): boolean {
  const { supported } = useWebGLSupport()
  return supported
}
