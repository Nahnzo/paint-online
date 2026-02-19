import { brushActions } from 'entities/Brush'
import { DEFAULT_COLOR_BRUSH_VALUE } from 'shared/consts/consts'
import { useActionCreators } from 'shared/hooks/hooks'
import { ColorPicker } from 'shared/ui/ColorPicker'

const FillBucketSettings = () => {
  const colorBrushActions = useActionCreators(brushActions)
  return (
    <div>
      <ColorPicker action={colorBrushActions.setColor} defaultValue={DEFAULT_COLOR_BRUSH_VALUE} />
    </div>
  )
}

export default FillBucketSettings
