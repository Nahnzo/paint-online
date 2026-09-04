import { useState } from 'react'
import { Pallette } from 'widgets/Pallette'
import { Dropdown } from 'shared/ui/Dropdown'
import { useDropdown } from 'shared/hooks/useDropdown'
import { ToolbarSeparator } from 'widgets/Toolbar'
import styles from './colorPicker.module.scss'

interface ColorPickerProps {
  action: (value: string) => void
  defaultValue: string
  colors: string[]
}

const ColorPicker = ({ defaultValue, action, colors }: ColorPickerProps) => {
  const [activeColor, setActiveColor] = useState(defaultValue)
  const [isOpen, toggle] = useDropdown()

  return (
    <div className={styles.colorPickerContainer}>
      {colors.map((color) => (
        <div
          key={color}
          style={color === 'transparent' ? undefined : { backgroundColor: color }}
          data-transparent={color === 'transparent'}
          className={styles.transparentBlock}
          onClick={() => {
            setActiveColor(color)
            action(color)
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
          <Pallette handleColor={setActiveColor} />
        </Dropdown>
      </div>
    </div>
  )
}

export default ColorPicker
