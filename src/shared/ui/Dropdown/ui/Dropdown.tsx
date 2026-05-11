import { DropdownProps } from '../model/types'
import styles from './dropdown.module.css'

export const Dropdown = ({ isOpen, children }: DropdownProps) => {
  if (!isOpen) return null

  return <div className={styles.dropdown}>{children}</div>
}
