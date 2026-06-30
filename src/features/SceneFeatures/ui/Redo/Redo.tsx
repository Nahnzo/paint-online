import { sceneActions } from 'entities/Scene'
import { Redo2Icon } from 'lucide-react'
import { useActionCreators } from 'shared/hooks/hooks'

const Redo = () => {
  const sceneAction = useActionCreators(sceneActions)
  const handleUndo = () => {
    sceneAction.redo()
  }
  return (
    <>
      <Redo2Icon
        cursor="pointer"
        onClick={handleUndo}
        color="#ffffff"
        strokeWidth={1.5}
        size={20}
      />
    </>
  )
}

export default Redo
