import { brushActions } from 'entities/Brush'
import { useState } from 'react'
import { DEFAULT_COLOR_BRUSH_VALUE } from 'shared/consts/consts'
import { useActionCreators } from 'shared/hooks/hooks'
import { ColorPicker } from 'shared/ui/ColorPicker'
import { RangePicker } from 'shared/ui/RangePicker'

const ShapeSettings = () => {
  const colorBrushActions = useActionCreators(brushActions)
  const [brushSize, setBrushSize] = useState(1)

  const changeBrushSize = (size: number) => {
    setBrushSize(size)
    colorBrushActions.setSize(size)
  }
  return (
    <div>
      <p>Stroke</p>
      <ColorPicker action={colorBrushActions.setColor} defaultValue={DEFAULT_COLOR_BRUSH_VALUE} />
      <RangePicker value={brushSize} handler={(e) => changeBrushSize(Number(e))} max={20} min={1} />
    </div>
  )
}

export default ShapeSettings
