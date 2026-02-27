import { SquareIcon, CircleIcon, TriangleIcon } from 'lucide-react'
import { useActionCreators } from 'shared/hooks/hooks'
import { brushActions } from 'entities/Brush'
import styles from './shapeChangeType.module.css'
import { canvasActions } from 'entities/Canvas'
import { ToolType } from 'entities/Tool'

const ShapeChangeType = () => {
  const brushTypeActions = useActionCreators(brushActions)
  const canvasAction = useActionCreators(canvasActions)

  const handleChange = (type: ToolType) => {
    brushTypeActions.setToolType(type)
    canvasAction.setCanvasMode('draw')
  }

  return (
    <div className={styles.typeVariantsContainer}>
      <div className={styles.brushIcon} onClick={() => handleChange('square')}>
        <SquareIcon />
      </div>
      <div className={styles.brushIcon} onClick={() => handleChange('circle')}>
        <CircleIcon />
      </div>
      <div className={styles.brushIcon} onClick={() => handleChange('triangle')}>
        <TriangleIcon />
      </div>
    </div>
  )
}

export default ShapeChangeType
