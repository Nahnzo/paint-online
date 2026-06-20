import { useActionCreators } from 'shared/hooks/hooks'
import { brushActions } from 'entities/Brush'
import { PentagonIcon } from 'lucide-react'
import { canvasActions } from 'entities/Canvas'

const Node = () => {
  const toolActions = useActionCreators(brushActions)
  const canvasAction = useActionCreators(canvasActions)

  const handleCanvasMode = () => {
    toolActions.setToolType('rectangle')
    canvasAction.setCanvasMode('draw')
  }

  return (
    <>
      <PentagonIcon onClick={handleCanvasMode} cursor="pointer" />
    </>
  )
}

export default Node
