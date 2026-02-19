import { brushActions } from 'entities/Brush'
import { useState } from 'react'
import { DEFAULT_COLOR_BRUSH_VALUE } from 'shared/consts/consts'
import { useActionCreators } from 'shared/hooks/hooks'
import { ColorPicker } from 'shared/ui/ColorPicker'
import { RangePicker } from 'shared/ui/RangePicker'

const SpraySetting = () => {
  const [brushDestiny, setBrushDestiny] = useState(1)
  const [brushSize, setBrushSize] = useState(1)
  const brushAction = useActionCreators(brushActions)

  const handleDensity = (e: number) => {
    setBrushDestiny(e)
    brushAction.setSprayDensity(e)
  }

  const handleSize = (e: number) => {
    setBrushSize(e)
    brushAction.setSize(e)
  }

  return (
    <>
      <p>Stroke</p>
      <ColorPicker action={brushAction.setColor} defaultValue={DEFAULT_COLOR_BRUSH_VALUE} />
      <p>Stroke width</p>
      <RangePicker min={1} max={100} handler={handleSize} value={brushSize} />
      <p>Density</p>
      <RangePicker min={1} max={100} handler={handleDensity} value={brushDestiny} />
    </>
  )
}

export default SpraySetting
