import { Brush as PenBrush } from './brushes/Brush'
import { SprayBrush } from './brushes/SprayBrush'
import { brushReducer, brushActions } from './model/slice'
import { getBrushColor, getBrushSize, getBrushType, getToolSettings } from './model/selectors'

export {
  brushReducer,
  brushActions,
  getBrushColor,
  getBrushSize,
  getBrushType,
  getToolSettings,
  PenBrush,
  SprayBrush,
}
