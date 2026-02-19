// import { ToolChangeSize } from 'features/BrushFeatures'

import { brushActions } from 'entities/Brush'
import { useState } from 'react'
import { useActionCreators } from 'shared/hooks/hooks'
import { RangePicker } from 'shared/ui/RangePicker'

const EraserSetting = () => {
  const [brushSize, setBrushSize] = useState(1)
  const brushAction = useActionCreators(brushActions)

  const handleSize = (e: number) => {
    setBrushSize(e)
    brushAction.setSize(e)
  }
  return (
    <div>
      <p>Stroke width</p>
      <RangePicker min={1} max={100} handler={handleSize} value={brushSize} />
    </div>
  )
}

export default EraserSetting
