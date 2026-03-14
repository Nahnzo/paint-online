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
      <Redo2Icon cursor="pointer" onClick={handleUndo} />
    </>
  )
}

export default Redo
