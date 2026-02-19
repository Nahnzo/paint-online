import { useState } from 'react'
import styles from './colorPicker.module.css'

interface ColorPickerProps {
  action: (color: string) => void
  defaultValue: string
}

const defaultColors = ['#ffffff', '#585858', '#f57575', '#54e710', '#0e82af']

const ColorPicker = ({ defaultValue, action }: ColorPickerProps) => {
  const [activeColor, setActiveColor] = useState(defaultValue)

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
      <div className={styles.separator} />
      <div className={styles.activeColor} style={{ backgroundColor: activeColor }} />
    </div>
  )
}

export default ColorPicker
