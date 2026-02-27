import { useActionCreators } from 'shared/hooks/hooks'
import { BrushIcon, SprayCan, EraserIcon } from 'lucide-react'
import { brushActions } from 'entities/Brush'
import { ToolType } from 'entities/Tool'
import { canvasActions } from 'entities/Canvas'
import styles from './brushChangeType.module.css'

const BrushChangeType = () => {
  const brushTypeActions = useActionCreators(brushActions)
  const canvasAction = useActionCreators(canvasActions)

  const handleChange = (type: ToolType) => {
    brushTypeActions.setToolType(type)
    canvasAction.setCanvasMode('draw')
  }

  return (
    <div className={styles.typeVariantsContainer}>
      <div className={styles.brushIcon} onClick={() => handleChange('brush')}>
        <BrushIcon />
      </div>
      <div className={styles.brushIcon} onClick={() => handleChange('spray')}>
        <SprayCan />
      </div>
      <div className={styles.brushIcon} onClick={() => handleChange('eraser')}>
        <EraserIcon />
      </div>
    </div>
  )
}

export default BrushChangeType
