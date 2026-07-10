import { useAppSelector } from 'shared/hooks/hooks'
import { TOOL_UI } from '../model/metadata'
import { getBrushType } from 'entities/Brush'
import styles from './activeToolCanvas.module.scss'

const ActiveToolCanvas = () => {
  const activeToolType = useAppSelector(getBrushType)
  const toolUI = TOOL_UI[activeToolType]

  return (
    <div className={styles.activeToolContainer}>
      {toolUI.changeTypeComponent && (
        <>
          <p>Type</p>
          <div className={styles.toolsContainer}>{toolUI.changeTypeComponent}</div>
        </>
      )}
      <div key={activeToolType}>{toolUI.settingsComponent}</div>
    </div>
  )
}

export default ActiveToolCanvas
