import { useEffect, useState } from 'react'

export const useZoom = (baseRef: React.RefObject<HTMLCanvasElement>) => {
  const [zoomState, setZoomState] = useState({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  })

  useEffect(() => {
    const baseCanvas = baseRef.current
    if (!baseCanvas) return

    const baseCtx = baseCanvas.getContext('2d')
    if (!baseCtx) return

    let scale = zoomState.scale
    let offsetX = zoomState.offsetX
    let offsetY = zoomState.offsetY
    const zoomIntensity = 0.1

    const onZoom = (e: WheelEvent) => {
      const rect = baseCanvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const zoom = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity
      const newScale = Math.max(0.1, Math.min(scale * zoom, 10))

      offsetX = mouseX - (mouseX - offsetX) * (newScale / scale)
      offsetY = mouseY - (mouseY - offsetY) * (newScale / scale)
      scale = newScale

      setZoomState({ scale, offsetX, offsetY })
    }

    document.addEventListener('wheel', onZoom)

    return () => {
      document.removeEventListener('wheel', onZoom)
    }
  }, [baseRef, zoomState.offsetX, zoomState.offsetY, zoomState.scale])

  return zoomState
}
