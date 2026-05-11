import { useState } from 'react'
import { palletteColorsAndShades } from '../model/consts'
import styles from './pallette.module.css'

interface PalletteProps {
  handleColor: (color: string) => void
}

const Pallette = ({ handleColor }: PalletteProps) => {
  const [chosenColor, setChosenColor] = useState('')
  const selectedColor = palletteColorsAndShades.find((item) => item.color === chosenColor)

  return (
    <div className={styles.colorsContainer}>
      <div className={styles.colorsGrid}>
        {palletteColorsAndShades.map((item) => (
          <div
            key={item.color}
            className={styles.color}
            style={{ backgroundColor: item.color }}
            onClick={() => {
              setChosenColor(item.color)
              handleColor(item.color)
            }}
          />
        ))}
      </div>

      <div className={styles.shadesContainer}>
        {selectedColor?.shades.map((shade) => (
          <div
            key={shade}
            className={styles.color}
            style={{ backgroundColor: shade }}
            onClick={() => handleColor(shade)}
          />
        ))}
      </div>

      <div className={styles.inputColorContainer}>
        <input
          className={styles.colorInput}
          placeholder="#ffffff"
          onChange={(e) => {
            const value = e.target.value
            setChosenColor(value)

            if (value.trim().length === 7) {
              handleColor(value)
            } else {
              handleColor('')
            }
          }}
        />
      </div>
    </div>
  )
}

export default Pallette
