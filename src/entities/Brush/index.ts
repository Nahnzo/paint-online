import Brush from './ui/Brush'
import { Brush as PenBrush } from './brushes/Brush'
import { SprayBrush } from './brushes/SprayBrush'
import { brushReducer, brushActions } from './model/slice'
import { getBrushColor, getBrushSize, getBrushType, getToolSettings } from './model/selectors'

export {
  Brush,
  brushReducer,
  brushActions,
  getBrushColor,
  getBrushSize,
  getBrushType,
  getToolSettings,
  PenBrush,
  SprayBrush,
}
