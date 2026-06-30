import { sceneActions } from 'entities/Scene'
import { Undo2Icon } from 'lucide-react'
import { useActionCreators } from 'shared/hooks/hooks'

const Undo = () => {
  const sceneAction = useActionCreators(sceneActions)
  const handleUndo = () => {
    sceneAction.undo()
  }
  return (
    <>
      <Undo2Icon
        cursor="pointer"
        onClick={handleUndo}
        color="#ffffff"
        strokeWidth={1.5}
        size={20}
      />
    </>
  )
}

export default Undo
