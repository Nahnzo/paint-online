import { useActionCreators } from 'shared/hooks/hooks'
import { DEFAULT_BACKGROUND_CANVAS_VALUE } from 'shared/consts/consts'
import { canvasActions, CanvasProps } from 'entities/Canvas'
import { sceneActions } from 'entities/Scene'
import styles from './resetCanvas.module.css'

const ResetCanvas = ({ baseRef, overlayRef }: CanvasProps) => {
  const canvasColorActions = useActionCreators(canvasActions)
  const { clearNodes } = useActionCreators(sceneActions)

  const resetCanvas = () => {
    ;[baseRef?.current, overlayRef?.current].forEach((canvas) => {
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
      clearNodes()
    })
    canvasColorActions.setBackgroundColor(DEFAULT_BACKGROUND_CANVAS_VALUE)
  }

  return (
    <button onClick={resetCanvas} className={styles.resetBtn}>
      Reset
    </button>
  )
}

export default ResetCanvas
