import Canvas from './ui/Canvas'

import { CanvasMode, CanvasProps } from './model/types'

import { canvasReducer, canvasActions } from './model/slice'
import { getCanvasMode } from './model/selectors'

export type { CanvasMode, CanvasProps }

export { Canvas, canvasReducer, canvasActions, getCanvasMode }
