import { RangePickerProps } from '../model/types'
import styles from './rangePicker.module.css'

const RangePicker = ({ handler, max = 100, min = 1, value }: RangePickerProps) => {
  return (
    <div className={styles.rangePickerContainer}>
      <input
        step={1}
        type="range"
        max={max}
        min={min}
        value={value}
        onChange={(e) => handler(Number(e.target.value))}
      />
      <div className={styles.activeValue}>{value}</div>
    </div>
  )
}

export default RangePicker
