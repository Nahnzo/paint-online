import { useActionCreators } from 'shared/hooks/hooks'
import { BrushIcon, SprayCan, EraserIcon } from 'lucide-react'
import { brushActions } from 'entities/Brush'
import styles from './brushChangeType.module.css'

const BrushChangeType = () => {
  const brushTypeActions = useActionCreators(brushActions)

  return (
    <div className={styles.typeVariantsContainer}>
      <div className={styles.brushIcon} onClick={() => brushTypeActions.setToolType('brush')}>
        <BrushIcon />
      </div>
      <div className={styles.brushIcon} onClick={() => brushTypeActions.setToolType('spray')}>
        <SprayCan />
      </div>
      <div className={styles.brushIcon} onClick={() => brushTypeActions.setToolType('eraser')}>
        <EraserIcon />
      </div>
    </div>
  )
}

export default BrushChangeType
