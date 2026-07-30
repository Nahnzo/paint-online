import { useState } from 'react'
import { Pallette } from 'widgets/Pallette'
import { Dropdown } from 'shared/ui/Dropdown'
import { useDropdown } from 'shared/hooks/useDropdown'
import { ToolbarSeparator } from 'widgets/Toolbar'
import { useActionCreators, useAppSelector } from 'shared/hooks/hooks'
import { getSelectedIdsSelector, sceneActions } from 'entities/Scene'
import styles from './colorPicker.module.scss'

interface ColorPickerProps {
  action: (color: string) => void
  defaultValue: string
  colors: string[]
}

const ColorPicker = ({ defaultValue, action, colors }: ColorPickerProps) => {
  const [activeColor, setActiveColor] = useState(defaultValue)
  const { setColor } = useActionCreators(sceneActions)
  const selectedNode = useAppSelector(getSelectedIdsSelector)

  const [isOpen, toggle] = useDropdown()

  const handleColor = (color: string) => {
    action(color)
    setActiveColor(color)
    // setColor({ id: selectedNode[0], color: activeColor })
  }

  return (
    <div className={styles.colorPickerContainer}>
      {colors.map((color) => (
        <div
          key={color}
          style={color === 'transparent' ? undefined : { backgroundColor: color }}
          data-transparent={color === 'transparent'}
          className={styles.transparentBlock}
          onClick={() => {
            handleColor(color)
            setColor({ id: selectedNode[0], color: color })
          }}
        />
      ))}
      <ToolbarSeparator />
      <div
        className={styles.transparentBlock}
        style={activeColor === 'transparent' ? undefined : { backgroundColor: activeColor }}
        data-transparent={activeColor === 'transparent'}
        onClick={toggle}
      />
      <div className={styles.wrapper}>
        <Dropdown isOpen={isOpen}>
          <Pallette handleColor={handleColor} />
        </Dropdown>
      </div>
    </div>
  )
}

export default ColorPicker
