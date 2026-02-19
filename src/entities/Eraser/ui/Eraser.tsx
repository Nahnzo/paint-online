import { brushActions } from 'entities/Brush'
import { EraserIcon } from 'lucide-react'
import { useActionCreators } from 'shared/hooks/hooks'

const Eraser = () => {
  const brushAction = useActionCreators(brushActions)

  return (
    <div>
      <EraserIcon onClick={() => brushAction.setToolType('eraser')} />
    </div>
  )
}

export default Eraser
