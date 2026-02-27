import { BrushIcon } from 'lucide-react'
import { useActionCreators } from 'shared/hooks/hooks'
import { brushActions } from '../model/slice'
import { canvasActions } from 'entities/Canvas'

const Brush = () => {
  const brushAction = useActionCreators(brushActions)
  const canvasAction = useActionCreators(canvasActions)

  const handleCanvasMode = () => {
    brushAction.setToolType('brush')
    canvasAction.setCanvasMode('draw')
  }

  return (
    <>
      <BrushIcon onClick={handleCanvasMode} cursor="pointer" />
    </>
  )
}

export default Brush
