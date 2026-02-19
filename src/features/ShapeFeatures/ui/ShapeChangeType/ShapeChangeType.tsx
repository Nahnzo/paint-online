import { SquareIcon, CircleIcon, TriangleIcon } from 'lucide-react'
import { useActionCreators } from 'shared/hooks/hooks'
import { brushActions } from 'entities/Brush'
import styles from './shapeChangeType.module.css'

const ShapeChangeType = () => {
  const brushTypeActions = useActionCreators(brushActions)
  return (
    <div>
      <div className={styles.typeVariantsContainer}>
        <div className={styles.brushIcon} onClick={() => brushTypeActions.setToolType('square')}>
          <SquareIcon />
        </div>
        <div className={styles.brushIcon} onClick={() => brushTypeActions.setToolType('circle')}>
          <CircleIcon />
        </div>
        <div className={styles.brushIcon} onClick={() => brushTypeActions.setToolType('triangle')}>
          <TriangleIcon />
        </div>
      </div>
    </div>
  )
}

export default ShapeChangeType
