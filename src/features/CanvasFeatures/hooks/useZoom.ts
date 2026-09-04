import { canvasActions } from 'entities/Canvas'
import { getCanvasViewport } from 'entities/Canvas/model/selectors'
import { useEffect, useRef } from 'react'
import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'

export const useZoom = (baseRef: React.RefObject<HTMLCanvasElement>) => {
  const viewport = useAppSelector(getCanvasViewport)
  const { setViewport } = useActionCreators(canvasActions)

  const viewportRef = useRef(viewport)

  useEffect(() => {
    viewportRef.current = viewport
  }, [viewport])
  useEffect(() => {
    const baseCanvas = baseRef.current
    if (!baseCanvas) return

    const zoomIntensity = 0.1

    const onZoom = (e: WheelEvent) => {
      if (!baseCanvas.contains(e.target as Node)) return

      const rect = baseCanvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      if (mouseX < 0 || mouseX > rect.width || mouseY < 0 || mouseY > rect.height) return

      e.preventDefault()

      const { percent, offsetX, offsetY } = viewportRef.current
      const scale = percent / 100
      const zoom = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity
      const newScale = Math.max(0.1, Math.min(scale * zoom, 2))

      const newOffsetX = mouseX - (mouseX - offsetX) * (newScale / scale)
      const newOffsetY = mouseY - (mouseY - offsetY) * (newScale / scale)

      setViewport({
        percent: Math.round(newScale * 100),
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      })
    }

    document.addEventListener('wheel', onZoom, { passive: false })

    return () => {
      document.removeEventListener('wheel', onZoom)
    }
  }, [baseRef, setViewport])

  return {
    scale: viewport.percent / 100,
    offsetX: viewport.offsetX,
    offsetY: viewport.offsetY,
  }
}
