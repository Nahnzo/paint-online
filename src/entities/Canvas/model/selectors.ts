import { RootState } from 'app/providers/StoreProvider/store'
import { DEFAULT_BACKGROUND_CANVAS_VALUE } from 'shared/consts/consts'

export const getCanvasBackgroundColor = (state: RootState) =>
  state.canvas.backgroundColor ?? DEFAULT_BACKGROUND_CANVAS_VALUE

export const getCanvasMode = (state: RootState) => state.canvas.canvasMode ?? 'draw'
