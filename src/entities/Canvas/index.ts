import Canvas from './ui/Canvas'

import { CanvasMode } from './model/types'

import { canvasReducer, canvasActions } from './model/slice'
import { getCanvasMode } from './model/selectors'

export type { CanvasMode }

export { Canvas, canvasReducer, canvasActions, getCanvasMode }
