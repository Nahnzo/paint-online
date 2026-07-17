import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'
import { brushActions, getBrushType } from 'entities/Brush'
import { canvasActions } from 'entities/Canvas'
import { ToolType } from 'entities/Tool'
import { ToolTypeOption } from '../model/types'
import ButtonIcon from 'shared/ui/ButtonIcon/ui/ButtonIcon'
import styles from './changeToolType.module.scss'

type ChangeToolTypeProps = {
  options: ToolTypeOption[]
}

export const ChangeToolType = ({ options }: ChangeToolTypeProps) => {
  const brushTypeActions = useActionCreators(brushActions)
  const canvasAction = useActionCreators(canvasActions)
  const toolType = useAppSelector(getBrushType)

  const handleChange = (type: ToolType) => {
    brushTypeActions.setToolType(type)
    canvasAction.setCanvasMode('draw')
  }

  return (
    <div className={styles.typeVariantsContainer}>
      {options.map((option) => (
        <ButtonIcon
          key={option.type}
          icon={option.icon}
          isActive={toolType === option.type}
          ariaLabel={option.ariaLabel}
          onClick={() => handleChange(option.type)}
        />
      ))}
    </div>
  )
}
