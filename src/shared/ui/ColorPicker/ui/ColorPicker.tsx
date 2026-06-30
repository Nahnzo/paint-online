import { useState } from 'react'
import { Pallette } from 'widgets/Pallette'
import { Dropdown } from 'shared/ui/Dropdown'
import { useDropdown } from 'shared/hooks/useDropdown'
import { defaultColors } from '../model/consts'
import { ToolbarSeparator } from 'widgets/Toolbar'
import styles from './colorPicker.module.css'

interface ColorPickerProps {
  action: (color: string) => void
  defaultValue: string
}

const ColorPicker = ({ defaultValue, action }: ColorPickerProps) => {
  const [activeColor, setActiveColor] = useState(defaultValue)

  const [isOpen, toggle] = useDropdown()

  const handleColor = (color: string) => {
    action(color)
    setActiveColor(color)
  }

  return (
    <div className={styles.colorPickerContainer}>
      <div className={styles.colorsContainer}>
        {defaultColors.map((color) => (
          <div
            key={color}
            style={{ backgroundColor: color }}
            className={styles.colorBlock}
            onClick={() => handleColor(color)}
          />
        ))}
      </div>
      <ToolbarSeparator />
      <div
        className={styles.activeColor}
        style={{ backgroundColor: activeColor }}
        onClick={toggle}
      ></div>
      <div className={styles.wrapper}>
        <Dropdown isOpen={isOpen}>
          <Pallette handleColor={handleColor} />
        </Dropdown>
      </div>
    </div>
  )
}

export default ColorPicker
