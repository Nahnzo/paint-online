import { useAppSelector } from 'shared/hooks/hooks'
import { getCanvasToolType } from '../model/selectors'
import { TOOL_UI } from '../model/metadata'
import styles from './activeToolCanvas.module.css'

const ActiveToolCanvas = () => {
  const activeToolType = useAppSelector(getCanvasToolType)

  const toolUI = TOOL_UI[activeToolType]

  return (
    <div className={styles.activeToolContainer}>
      {toolUI.changeTypeComponent && (
        <>
          <p>Type</p>
          {toolUI.changeTypeComponent}
        </>
      )}
      {toolUI.settingsComponent}
    </div>
  )
}

export default ActiveToolCanvas
