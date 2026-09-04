import { RootState } from 'app/providers/StoreProvider/store'
import { DEFAULT_BACKGROUND_CANVAS_VALUE } from 'shared/consts/consts'

export const getCanvasBackgroundColor = (state: RootState) =>
  state.canvas.backgroundColor ?? DEFAULT_BACKGROUND_CANVAS_VALUE

export const getCanvasMode = (state: RootState) => state.canvas.canvasMode ?? 'draw'

export const getCanvasZoomPercent = (state: RootState) => state.canvas.zoom.percent ?? 100
export const getCanvasOffset = (state: RootState) => ({
  x: state.canvas.zoom.offsetX ?? 0,
  y: state.canvas.zoom.offsetY ?? 0,
})
export const getCanvasViewport = (state: RootState) => state.canvas.zoom
